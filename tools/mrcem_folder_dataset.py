#!/usr/bin/env python3
"""Create review-first Markdown datasets from scanned MRCEM PDFs in Drive.

The tool inventories nested Drive folders with the configured gws CLI and then
processes PDFs one source at a time. It saves an image of every detected question
page, raw OCR evidence, a Markdown record, review JSON, and source reports.
"""

from __future__ import annotations

import argparse
import hashlib
import json
import os
import re
import shutil
import subprocess
import sys
import tempfile
from collections import Counter, defaultdict
from concurrent.futures import ProcessPoolExecutor, as_completed
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

SCRIPT_DIR = Path(__file__).resolve().parent
sys.path.insert(0, str(SCRIPT_DIR))
from extract_mrcem_pdf import extract_draft, quality_report, review_record, slugify, split_question_and_explanation, write_json  # noqa: E402

FOLDER_MIME = "application/vnd.google-apps.folder"
PDF_MIME = "application/pdf"
QUESTION_RE = re.compile(r"QUESTION\s*(\d+)", re.IGNORECASE)
VISUAL_TERMS = re.compile(r"\b(?:ecg|electrocardi|radiograph|x-ray|ct\s+scan|mri|ultrasound|image|figure|diagram|table|photograph)\b", re.IGNORECASE)


class InvalidPdfError(RuntimeError):
    """Raised when Drive metadata labels a downloaded file as PDF but pdfinfo cannot read it."""


def utc_now() -> str:
    return datetime.now(timezone.utc).isoformat()


def run_json(command: list[str]) -> dict[str, Any]:
    completed = subprocess.run(command, check=True, text=True, capture_output=True)
    return json.loads(completed.stdout)


def drive_list_children(parent_id: str) -> list[dict[str, Any]]:
    params = {
        "q": f"'{parent_id}' in parents and trashed = false",
        "pageSize": 1000,
        "fields": "files(id,name,mimeType,size,modifiedTime,parents,md5Checksum),nextPageToken",
    }
    response = run_json(["gws", "drive", "files", "list", "--params", json.dumps(params), "--format", "json"])
    return response.get("files", [])


def recursive_inventory(root_id: str, root_name: str) -> dict[str, Any]:
    folders: list[dict[str, Any]] = [{"id": root_id, "name": root_name, "path": root_name}]
    files: list[dict[str, Any]] = []
    cursor = 0
    while cursor < len(folders):
        current = folders[cursor]
        cursor += 1
        for item in drive_list_children(current["id"]):
            item["relativePath"] = f"{current['path']}/{item['name']}"
            if item.get("mimeType") == FOLDER_MIME:
                folders.append({"id": item["id"], "name": item["name"], "path": item["relativePath"]})
            else:
                files.append(item)
    pdfs = [item for item in files if item.get("mimeType") == PDF_MIME]
    checksum_groups: dict[str, list[dict[str, Any]]] = defaultdict(list)
    for item in pdfs:
        if item.get("md5Checksum"):
            checksum_groups[item["md5Checksum"]].append(item)
    duplicate_groups = [group for group in checksum_groups.values() if len(group) > 1]
    return {
        "generatedAt": utc_now(),
        "root": {"id": root_id, "name": root_name},
        "folders": folders,
        "files": files,
        "pdfFiles": pdfs,
        "duplicateChecksumGroups": duplicate_groups,
        "summary": {
            "folderCount": len(folders),
            "fileCount": len(files),
            "pdfCount": len(pdfs),
            "totalPdfBytes": sum(int(item.get("size", 0)) for item in pdfs),
        },
    }


def render_page(pdf: Path, page: int, dpi: int, image_path: Path) -> None:
    image_path.parent.mkdir(parents=True, exist_ok=True)
    subprocess.run(
        ["pdftoppm", "-f", str(page), "-l", str(page), "-r", str(dpi), "-png", "-singlefile", str(pdf), str(image_path.with_suffix(""))],
        check=True,
        capture_output=True,
    )


def ocr_image(image_path: Path, psm: int) -> str:
    completed = subprocess.run(
        ["tesseract", str(image_path), "stdout", "--psm", str(psm)],
        check=True,
        text=True,
        capture_output=True,
        env={**os.environ, "OMP_THREAD_LIMIT": "1"},
    )
    return "\n".join(line.rstrip() for line in completed.stdout.splitlines() if line.strip())


def scan_page_worker(payload: tuple[str, int, int, int]) -> tuple[int, int | None]:
    pdf_string, page, dpi, psm = payload
    with tempfile.TemporaryDirectory(prefix="mrcem-folder-scan-") as temp_dir:
        image = Path(temp_dir) / "page.png"
        render_page(Path(pdf_string), page, dpi, image)
        text = ocr_image(image, psm)
    marker = QUESTION_RE.search(text)
    return page, int(marker.group(1)) if marker else None


def process_page_worker(payload: tuple[str, int, int | None, str, str, str, str, int]) -> dict[str, Any]:
    pdf_string, page, scan_question_number, subject, source_file, source_id, output_dir_string, psm = payload
    output_dir = Path(output_dir_string)
    image = output_dir / "assets" / "source-pages" / f"page-{page:04d}.png"
    render_page(Path(pdf_string), page, 220, image)
    raw_ocr = ocr_image(image, psm)
    record = review_record(subject, subject, Path(pdf_string), page, image.relative_to(output_dir), raw_ocr)
    if not record:
        question_ocr, explanation_ocr, has_answer = split_question_and_explanation(raw_ocr)
        stem, options, explanation, warnings = extract_draft(question_ocr, explanation_ocr)
        warnings.insert(0, "Recovered candidate: low-resolution scan detected a question marker, but high-resolution OCR did not. Confirm source page before approval.")
        if not has_answer:
            warnings.append("No ANSWER marker detected. Confirm whether this is a question or visual-dependent page.")
        record = {
            "id": f"{slugify(subject)}-{slugify(source_file)}-p{page:04d}-recovered",
            "reviewStatus": "pending",
            "reviewNotes": "",
            "source": source_file,
            "sourceDriveId": source_id,
            "sourcePage": page,
            "sourceQuestionNumber": scan_question_number or 0,
            "sourceImage": image.relative_to(output_dir).as_posix(),
            "subject": subject,
            "topic": subject,
            "stem": stem,
            "options": options,
            "correctOption": None,
            "explanation": explanation,
            "learningNote": "",
            "tags": [],
            "needsReview": True,
            "draftWarnings": warnings,
            "rawOcr": raw_ocr,
            "questionOcr": question_ocr,
            "explanationOcr": explanation_ocr,
            "hasAnswerMarker": has_answer,
        }
    else:
        record["id"] = f"{slugify(subject)}-{slugify(source_file)}-p{page:04d}-q{record['sourceQuestionNumber']:04d}"
        record["source"] = source_file
        record["sourceDriveId"] = source_id
    record["needsImage"] = bool(VISUAL_TERMS.search("\n".join([record.get("stem", ""), record.get("rawOcr", "")])))
    return record


def yaml_escape(value: str) -> str:
    return json.dumps(value, ensure_ascii=False)


def markdown_for_record(record: dict[str, Any], source_rel_path: str) -> str:
    options = record.get("options", [])
    options_markdown = "\n".join(f"{chr(65 + index)}. {option}" for index, option in enumerate(options)) or "_No answer options were reliably extracted._"
    warnings = "\n".join(f"- {warning}" for warning in record.get("draftWarnings", [])) or "- None"
    stem = record.get("stem") or "_OCR did not recover a usable question stem. Check the source image._"
    explanation = record.get("explanation") or "_No explanation was reliably extracted. Check the source image._"
    image_link = f"../{record['sourceImage']}"
    return f"""---
id: {yaml_escape(record['id'])}
source_file: {yaml_escape(record['source'])}
source_drive_id: {yaml_escape(record['sourceDriveId'])}
source_relative_path: {yaml_escape(source_rel_path)}
source_page: {record['sourcePage']}
source_question_number: {record.get('sourceQuestionNumber', 0)}
subject: {yaml_escape(record['subject'])}
topic: {yaml_escape(record.get('topic', record['subject']))}
review_status: pending
needs_image: {str(record.get('needsImage', False)).lower()}
source_page_image: {yaml_escape(record['sourceImage'])}
---

# Question {record.get('sourceQuestionNumber') or record['sourcePage']}

![Source page]({image_link})

## Stem

{stem}

## Options

{options_markdown}

## Explanation

{explanation}

## Learning note

_Add after review._

## OCR review flags

{warnings}

## Source trace

This record was extracted from `{record['source']}`, page {record['sourcePage']}. It remains **pending review** and must be checked against the source image before it is imported into a question bank.
"""


def page_count(pdf: Path) -> int:
    try:
        completed = subprocess.run(["pdfinfo", str(pdf)], check=True, text=True, capture_output=True)
    except subprocess.CalledProcessError as error:
        message = error.stderr.strip() or error.stdout.strip() or "pdfinfo could not read the downloaded file."
        raise InvalidPdfError(message) from error
    match = re.search(r"^Pages:\s+(\d+)$", completed.stdout, re.MULTILINE)
    if not match:
        raise RuntimeError(f"Could not obtain page count for {pdf}.")
    return int(match.group(1))


def download_source(source: dict[str, Any], cache_dir: Path) -> Path:
    cache_dir.mkdir(parents=True, exist_ok=True)
    local = cache_dir / f"{source['id']}.pdf"
    if local.exists() and local.stat().st_size == int(source.get("size", 0)):
        return local
    subprocess.run(
        ["gws", "drive", "files", "get", "--params", json.dumps({"fileId": source["id"], "alt": "media"}), "--output", local.name],
        check=True,
        cwd=cache_dir,
    )
    return local


def output_slug(source: dict[str, Any]) -> str:
    return f"{slugify(source['relativePath'])}-{source['id'][:8]}"


def subject_for_source(source: dict[str, Any]) -> str:
    path_parts = source["relativePath"].split("/")
    if len(path_parts) >= 3:
        return path_parts[-2]
    base = re.sub(r"-All\.pdf$", "", source["name"], flags=re.IGNORECASE)
    return {"EBM": "Evidence-based medicine"}.get(base, base)


def process_source(source: dict[str, Any], root: Path, cache_dir: Path, workers: int, resume: bool) -> dict[str, Any]:
    source_dir = root / "sources" / output_slug(source)
    summary_path = source_dir / "reports" / "summary.json"
    if resume and summary_path.exists():
        return json.loads(summary_path.read_text(encoding="utf-8"))
    local_pdf = download_source(source, cache_dir)
    try:
        total_pages = page_count(local_pdf)
    except InvalidPdfError as error:
        report = {
            "schemaVersion": 1,
            "sourcePdf": source["name"],
            "settings": {"sourceDriveId": source["id"], "sourceRelativePath": source["relativePath"]},
            "recordCount": 0,
            "markdownFiles": 0,
            "recordsWithWarnings": 0,
            "processingStatus": "skipped-invalid-pdf",
            "error": str(error),
            "generatedAt": utc_now(),
        }
        write_json(summary_path, report)
        (source_dir / "README.md").write_text(f"# {source['name']}\n\nThis file was skipped because `pdfinfo` could not read the downloaded content. See `reports/summary.json`.\n", encoding="utf-8")
        print(f"{source['name']}: skipped unreadable PDF ({error}).", flush=True)
        return report
    max_workers = max(1, min(workers, os.cpu_count() or 1))
    candidates: list[tuple[int, int | None]] = []
    payloads = ((str(local_pdf), page, 110, 6) for page in range(1, total_pages + 1))
    with ProcessPoolExecutor(max_workers=max_workers) as executor:
        futures = [executor.submit(scan_page_worker, payload) for payload in payloads]
        for done, future in enumerate(as_completed(futures), start=1):
            page, question_number = future.result()
            if question_number is not None:
                candidates.append((page, question_number))
            if done % 250 == 0 or done == total_pages:
                print(f"{source['name']}: scanned {done}/{total_pages}, candidates={len(candidates)}", flush=True)
    candidates.sort()
    records: list[dict[str, Any]] = []
    subject = subject_for_source(source)
    page_payloads = ((str(local_pdf), page, question_number, subject, source['name'], source['id'], str(source_dir), 6) for page, question_number in candidates)
    with ProcessPoolExecutor(max_workers=max_workers) as executor:
        futures = [executor.submit(process_page_worker, payload) for payload in page_payloads]
        for done, future in enumerate(as_completed(futures), start=1):
            records.append(future.result())
            if done % 100 == 0 or done == len(candidates):
                print(f"{source['name']}: rendered {done}/{len(candidates)} candidate pages", flush=True)
    records.sort(key=lambda record: record["sourcePage"])
    questions_dir = source_dir / "questions"
    questions_dir.mkdir(parents=True, exist_ok=True)
    for record in records:
        filename = f"p{record['sourcePage']:04d}-q{record.get('sourceQuestionNumber', 0):04d}.md"
        (questions_dir / filename).write_text(markdown_for_record(record, source["relativePath"]), encoding="utf-8")
    write_json(source_dir / "review" / "records.review.json", records)
    report = quality_report(records, source["name"], {"sourceDriveId": source["id"], "sourceRelativePath": source["relativePath"], "pageCount": total_pages})
    report.update({"generatedAt": utc_now(), "candidatePages": len(candidates), "markdownFiles": len(records), "visualFlagCount": sum(record.get("needsImage", False) for record in records)})
    write_json(summary_path, report)
    (source_dir / "README.md").write_text(f"# {source['name']}\n\nThis source contains {len(records)} pending-review Markdown records. Start with `questions/` and use `assets/source-pages/` for source evidence.\n", encoding="utf-8")
    return report


def inventory_command(args: argparse.Namespace) -> None:
    inventory = recursive_inventory(args.root_id, args.root_name)
    output = args.output.resolve()
    write_json(output, inventory)
    print(json.dumps(inventory["summary"], indent=2))


def process_command(args: argparse.Namespace) -> None:
    root = args.dataset_root.resolve()
    inventory = json.loads(args.inventory.resolve().read_text(encoding="utf-8"))
    cache_dir = args.cache_dir.resolve()
    reports: list[dict[str, Any]] = []
    sources = inventory["pdfFiles"]
    if args.source_id:
        sources = [source for source in sources if source["id"] == args.source_id]
        if not sources:
            raise ValueError(f"Source ID {args.source_id} is not present in the inventory.")
    for source in sources:
        print(f"\nProcessing {source['relativePath']}", flush=True)
        reports.append(process_source(source, root, cache_dir, args.workers, args.resume))
        write_json(root / "processing-ledger.json", {"generatedAt": utc_now(), "sources": reports})
    total_records = sum(report.get("recordCount", 0) for report in reports)
    total_warnings = sum(report.get("recordsWithWarnings", 0) for report in reports)
    master = {"generatedAt": utc_now(), "sourceCount": len(reports), "markdownRecords": total_records, "warningRecords": total_warnings, "sources": reports}
    write_json(root / "master-report.json", master)
    (root / "README.md").write_text(f"# MRCEM Intermediate Markdown Dataset\n\nThis dataset contains **{total_records}** pending-review records across **{len(reports)}** processed PDF sources. See `master-report.json`, `processing-ledger.json`, and `sources/`.\n", encoding="utf-8")
    print(json.dumps(master, indent=2))


def main() -> None:
    parser = argparse.ArgumentParser(description="Recursive MRCEM Drive PDF to Markdown extractor.")
    subparsers = parser.add_subparsers(dest="command", required=True)
    inventory = subparsers.add_parser("inventory", help="Build a recursive Drive inventory.")
    inventory.add_argument("--root-id", required=True)
    inventory.add_argument("--root-name", default="MRCEM Intermediate Sources")
    inventory.add_argument("--output", type=Path, required=True)
    inventory.set_defaults(handler=inventory_command)
    process = subparsers.add_parser("process", help="Process every PDF in an inventory into review-first Markdown.")
    process.add_argument("--inventory", type=Path, required=True)
    process.add_argument("--dataset-root", type=Path, required=True)
    process.add_argument("--cache-dir", type=Path, required=True)
    process.add_argument("--workers", type=int, default=6)
    process.add_argument("--resume", action="store_true")
    process.add_argument("--source-id", help="Optional Drive file ID to process exactly one source for incremental packaging.")
    process.set_defaults(handler=process_command)
    args = parser.parse_args()
    args.handler(args)


if __name__ == "__main__":
    main()
