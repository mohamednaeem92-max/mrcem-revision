#!/usr/bin/env python3
"""Restart-safe batch OCR for the Anatomy source after a sandbox reset.

The utility scans a large PDF for question pages, then creates review bundles.
Every low-resolution candidate is kept as a review record, even if high-resolution
OCR does not recover a QUESTION marker.
"""

from __future__ import annotations

import argparse
import html
import json
import os
import re
import subprocess
import tempfile
from collections import Counter
from multiprocessing import Pool
from pathlib import Path
from typing import Any

from extract_mrcem_pdf import (
    SCHEMA_VERSION,
    build_review_html,
    extract_draft,
    get_page_count,
    quality_report,
    review_record,
    slugify,
    split_question_and_explanation,
    write_json,
)


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


def scan_page(payload: tuple[str, int, int, int]) -> dict[str, Any]:
    pdf_string, page, dpi, psm = payload
    with tempfile.TemporaryDirectory(prefix="anatomy-scan-") as temp_dir:
        image_path = Path(temp_dir) / "page.png"
        render_page(Path(pdf_string), page, dpi, image_path)
        raw_ocr = ocr_image(image_path, psm)
    marker = re.search(r"QUESTION\s*(\d+)", raw_ocr, re.IGNORECASE)
    return {"page": page, "sourceQuestionNumber": int(marker.group(1)) if marker else None, "isQuestionPage": bool(marker)}


def recovered_record(subject: str, topic: str, source: str, page: int, source_question_number: int | None, image_relative: Path, raw_ocr: str) -> dict[str, Any]:
    question_ocr, explanation_ocr, has_answer = split_question_and_explanation(raw_ocr)
    stem, options, explanation, warnings = extract_draft(question_ocr, explanation_ocr)
    warnings.insert(0, "Recovered candidate: high-resolution OCR did not recover a QUESTION marker. Confirm page identity against the source image.")
    if not has_answer:
        warnings.append("No ANSWER marker was detected. Confirm whether this page is a question, reference, or image-dependent item.")
    return {
        "schemaVersion": SCHEMA_VERSION,
        "id": f"{slugify(subject)}-p{page:04d}-recovered",
        "reviewStatus": "pending",
        "reviewNotes": "",
        "source": source,
        "sourcePage": page,
        "sourceQuestionNumber": source_question_number or 0,
        "sourceImage": image_relative.as_posix(),
        "subject": subject,
        "topic": topic,
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


def build_record(payload: tuple[str, str, str, int, int | None, int, int, str, str]) -> dict[str, Any]:
    pdf_string, subject, topic, page, scan_question_number, dpi, psm, image_string, bundle_string = payload
    pdf = Path(pdf_string)
    image_path = Path(image_string)
    bundle_path = Path(bundle_string)
    render_page(pdf, page, dpi, image_path)
    raw_ocr = ocr_image(image_path, psm)
    record = review_record(subject, topic, pdf, page, image_path.relative_to(bundle_path), raw_ocr)
    if record:
        return record
    return recovered_record(subject, topic, pdf.name, page, scan_question_number, image_path.relative_to(bundle_path), raw_ocr)


def build_index(index: dict[str, Any]) -> str:
    rows = "".join(
        f"<tr><td>{html.escape(bundle['label'])}</td><td>{bundle['recordCount']}</td><td>{bundle['warningCount']}</td><td><a href=\"{html.escape(bundle['reviewPath'])}\">Open review sheet</a></td></tr>"
        for bundle in index["bundles"]
    )
    return f"""<!doctype html><html lang=\"en\"><head><meta charset=\"utf-8\"><meta name=\"viewport\" content=\"width=device-width,initial-scale=1\"><title>Anatomy OCR Review Index</title><style>body{{margin:0;background:#f4f5f1;color:#193d38;font-family:system-ui,sans-serif}}main{{max-width:960px;margin:0 auto;padding:32px 18px}}h1{{font-family:Georgia,serif}}p{{line-height:1.6;color:#526d66}}table{{width:100%;border-collapse:collapse;background:#fff;border:1px solid #d5e0da;border-radius:12px;overflow:hidden}}th,td{{padding:13px 14px;text-align:left;border-bottom:1px solid #e3eae6;font-size:14px}}th{{background:#e9f2ed;color:#31544e;font-size:11px;letter-spacing:.12em;text-transform:uppercase}}a{{color:#087c77;font-weight:700}}</style></head><body><main><h1>Anatomy OCR review index</h1><p>All scan candidates are retained. Review each record against its source image, download the edited JSON, and run <code>prepare-import</code> only for approved records.</p><table><thead><tr><th>Batch</th><th>Review records</th><th>OCR warnings</th><th>Review</th></tr></thead><tbody>{rows}</tbody></table></main></body></html>"""


def command_scan(args: argparse.Namespace) -> None:
    pdf = args.pdf.resolve()
    pages = get_page_count(pdf)
    workers = max(1, min(args.workers, os.cpu_count() or 1))
    payloads = ((str(pdf), page, args.dpi, args.psm) for page in range(1, pages + 1))
    candidates: list[dict[str, Any]] = []
    with Pool(processes=workers) as pool:
        for done, result in enumerate(pool.imap_unordered(scan_page, payloads, chunksize=8), start=1):
            if result["isQuestionPage"]:
                candidates.append(result)
            if done % args.progress_every == 0 or done == pages:
                print(f"Scanned {done}/{pages}; candidates: {len(candidates)}.")
    candidates.sort(key=lambda record: record["page"])
    output = {"schemaVersion": SCHEMA_VERSION, "sourcePdf": str(pdf), "sourceFile": pdf.name, "pageCount": pages, "scanDpi": args.dpi, "questionPages": candidates}
    write_json(args.output.resolve(), output)
    print(f"Saved {len(candidates)} candidate pages to {args.output.resolve()}.")


def command_build(args: argparse.Namespace) -> None:
    manifest = json.loads(args.manifest.resolve().read_text(encoding="utf-8"))
    pdf = Path(manifest["sourcePdf"]).resolve()
    output_dir = args.output_dir.resolve()
    output_dir.mkdir(parents=True, exist_ok=True)
    pages = manifest["questionPages"]
    workers = max(1, min(args.workers, os.cpu_count() or 1))
    bundles: list[dict[str, Any]] = []
    for number, offset in enumerate(range(0, len(pages), args.batch_size), start=1):
        batch = pages[offset : offset + args.batch_size]
        label = f"batch-{number:03d}-p{batch[0]['page']:04d}-p{batch[-1]['page']:04d}"
        bundle_dir = output_dir / label
        image_dir = bundle_dir / "images"
        payloads = ((str(pdf), args.subject, args.topic or args.subject, item["page"], item.get("sourceQuestionNumber"), args.dpi, args.psm, str(image_dir / f"page-{item['page']:04d}.png"), str(bundle_dir)) for item in batch)
        records: list[dict[str, Any]] = []
        with Pool(processes=workers) as pool:
            for done, record in enumerate(pool.imap_unordered(build_record, payloads, chunksize=1), start=1):
                records.append(record)
                if done % args.progress_every == 0 or done == len(batch):
                    print(f"{label}: {done}/{len(batch)} records rendered.")
        records.sort(key=lambda record: record["sourcePage"])
        write_json(bundle_dir / "records.review.json", records)
        report = quality_report(records, pdf.name, {"batch": label, "dpi": args.dpi, "candidatePages": len(batch)})
        write_json(bundle_dir / "report.json", report)
        (bundle_dir / "review.html").write_text(build_review_html(records, f"Anatomy OCR Review · {label}"), encoding="utf-8")
        bundles.append({"label": label, "reviewPath": f"{label}/review.html", "recordCount": len(records), "warningCount": report["recordsWithWarnings"]})
        print(f"Completed {label}: {len(records)} records, {report['recordsWithWarnings']} with warnings.")
    index = {"schemaVersion": SCHEMA_VERSION, "sourcePdf": pdf.name, "candidateCount": len(pages), "bundles": bundles}
    write_json(output_dir / "review-index.json", index)
    (output_dir / "review-index.html").write_text(build_index(index), encoding="utf-8")
    warnings = sum(bundle["warningCount"] for bundle in bundles)
    write_json(output_dir / "run-summary.json", {"sourcePdf": pdf.name, "candidateCount": len(pages), "reviewRecords": sum(bundle["recordCount"] for bundle in bundles), "warningRecords": warnings, "bundleCount": len(bundles)})
    print(f"Created {len(bundles)} bundles with {sum(bundle['recordCount'] for bundle in bundles)} review records.")


def main() -> None:
    parser = argparse.ArgumentParser(description="Restart-safe Anatomy OCR review-bundle generator.")
    subparsers = parser.add_subparsers(dest="command", required=True)
    scan = subparsers.add_parser("scan", help="Scan a source PDF for likely question pages.")
    scan.add_argument("pdf", type=Path)
    scan.add_argument("--output", type=Path, required=True)
    scan.add_argument("--dpi", type=int, default=110)
    scan.add_argument("--psm", type=int, default=6)
    scan.add_argument("--workers", type=int, default=6)
    scan.add_argument("--progress-every", type=int, default=250)
    scan.set_defaults(handler=command_scan)
    build = subparsers.add_parser("build", help="Build source-linked review bundles from a scan manifest.")
    build.add_argument("manifest", type=Path)
    build.add_argument("--subject", required=True)
    build.add_argument("--topic")
    build.add_argument("--output-dir", type=Path, required=True)
    build.add_argument("--batch-size", type=int, default=150)
    build.add_argument("--dpi", type=int, default=220)
    build.add_argument("--psm", type=int, default=6)
    build.add_argument("--workers", type=int, default=6)
    build.add_argument("--progress-every", type=int, default=25)
    build.set_defaults(handler=command_build)
    args = parser.parse_args()
    args.handler(args)


if __name__ == "__main__":
    main()
