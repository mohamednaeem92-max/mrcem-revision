#!/usr/bin/env python3
"""Convert page-oriented OCR Markdown files into review-first MRCEM question sections."""

from __future__ import annotations

import argparse
import json
import re
from collections import Counter, defaultdict
from datetime import datetime, timezone
from pathlib import Path
from typing import Any


CANONICAL_SOURCES = [
    ("folder__Anatomy-All.md", "Anatomy"),
    ("folder__EBM-All.md", "Evidence-based medicine"),
    ("folder__Microbiology-All.md", "Microbiology"),
    ("folder__Pathology-All.md", "Pathology"),
    ("folder__Pharmacology-All.md", "Pharmacology"),
    ("folder__Physiology-All.md", "Physiology"),
]
QUESTION_RE = re.compile(r"\bQUESTION\s*(\d+)\b", re.IGNORECASE)
PAGE_RE = re.compile(r"^## Page\s+(\d+)\s*$", re.MULTILINE)
TOPIC_RE = re.compile(r"^[A-Z][A-Z\s/&_-]{6,}$")
VISUAL_RE = re.compile(r"\b(?:image|figure|diagram|table|radiograph|x-ray|ct\s+scan|mri|ultrasound|ecg|electrocardi|photograph|illustration)\b", re.IGNORECASE)
UI_NOISE = ("score", "reference ranges", "something wrong", "end session", "save", "bookmark")


def now() -> str:
    return datetime.now(timezone.utc).isoformat()


def slugify(value: str) -> str:
    return re.sub(r"[^a-z0-9]+", "-", value.lower()).strip("-")


def clean_text(value: str) -> str:
    value = re.sub(r"\s+", " ", value)
    return value.strip(" |\t-_=")


def comparable_label(value: str) -> str:
    return re.sub(r"[^a-z]", "", value.lower())


def parse_source_header(markdown: str, fallback: str) -> tuple[str, str | None, str | None]:
    source_name = fallback
    drive_id = None
    source_link = None
    filename = re.search(r"\| Original filename \| `([^`]+)` \|", markdown)
    if filename:
        source_name = filename.group(1)
    identifier = re.search(r"\| Google Drive file ID \| `([^`]+)` \|", markdown)
    if identifier:
        drive_id = identifier.group(1)
    link = re.search(r"\| Source link \| \[[^\]]+\]\(([^)]+)\)", markdown)
    if link:
        source_link = link.group(1)
    return source_name, drive_id, source_link


def page_blocks(markdown: str) -> list[tuple[int, str]]:
    matches = list(PAGE_RE.finditer(markdown))
    blocks: list[tuple[int, str]] = []
    for index, match in enumerate(matches):
        next_start = matches[index + 1].start() if index + 1 < len(matches) else len(markdown)
        blocks.append((int(match.group(1)), markdown[match.end() : next_start]))
    return blocks


def topic_from_page(page: str, subject: str, current_topic: str) -> str:
    for line in page.splitlines()[:80]:
        candidate = clean_text(line)
        if TOPIC_RE.match(candidate) and "/" in candidate and len(candidate) < 120:
            parts = [clean_text(part).title() for part in candidate.split("/") if clean_text(part)]
            if parts and comparable_label(parts[0]) == comparable_label(subject):
                parts = parts[1:]
            if not parts or len(parts[0]) < 4 or comparable_label(parts[0]) in {"stef", "reference", "ranges"}:
                return current_topic
            return f"{subject} · {parts[0]}"
    return current_topic


def option_from_line(line: str) -> tuple[str | None, bool]:
    raw = line.strip()
    if not raw:
        return None, False
    correct = bool(re.match(r"^\(\s*(?:v|✓|✔)\s*\)", raw, re.IGNORECASE))
    is_option = correct or raw.startswith("|") or bool(re.match(r"^[A-E][.)]\s+", raw, re.IGNORECASE))
    if not is_option:
        return None, False
    raw = re.sub(r"^\(\s*(?:v|✓|✔|x)\s*\)\s*", "", raw, flags=re.IGNORECASE)
    raw = re.sub(r"^\|\s*", "", raw)
    raw = re.sub(r"^[A-E][.)]\s+", "", raw, flags=re.IGNORECASE)
    raw = re.sub(r"\s+\d{1,3}%\s*$", "", raw)
    raw = clean_text(raw)
    return (raw or None), correct


def extract_question(page: str, subject: str, topic: str, source: dict[str, Any], page_number: int) -> dict[str, Any] | None:
    marker = QUESTION_RE.search(page)
    if not marker:
        return None
    question_number = int(marker.group(1))
    content = page[marker.end() :]
    answer_match = re.search(r"\bANSWER\b", content, re.IGNORECASE)
    question_part = content[: answer_match.start()] if answer_match else content
    explanation_part = content[answer_match.end() :] if answer_match else ""
    explanation_part = re.split(r"\bSCORE\b", explanation_part, maxsplit=1, flags=re.IGNORECASE)[0]

    stem_lines: list[str] = []
    options: list[str] = []
    correct_option: int | None = None
    started_options = False
    for line in question_part.splitlines():
        item, marked_correct = option_from_line(line)
        if item:
            started_options = True
            options.append(item)
            if marked_correct:
                correct_option = len(options) - 1
        elif started_options:
            continuation = clean_text(line)
            if continuation and len(continuation) > 1 and not any(noise in continuation.lower() for noise in UI_NOISE):
                options[-1] = f"{options[-1]} {continuation}".strip()
        else:
            candidate = clean_text(line)
            if candidate and not candidate.startswith("<!--") and not any(noise in candidate.lower() for noise in UI_NOISE):
                stem_lines.append(candidate)

    explanation_lines = []
    for line in explanation_part.splitlines():
        candidate = clean_text(line)
        if candidate and not any(noise in candidate.lower() for noise in UI_NOISE):
            explanation_lines.append(candidate)
    stem = clean_text(" ".join(stem_lines))
    explanation = clean_text(" ".join(explanation_lines))

    warnings: list[str] = []
    if len(stem) < 12:
        warnings.append("Question stem is missing or too short after OCR parsing.")
    if len(options) < 2:
        warnings.append("Fewer than two answer options were detected.")
    if len(options) > 5:
        warnings.append("More than five options were detected; review wrapped lines and OCR noise.")
    if correct_option is None:
        warnings.append("No marked correct option was detected.")
    if len(explanation) < 12:
        warnings.append("Explanation is missing or too short after OCR parsing.")

    visual = bool(VISUAL_RE.search(page))
    status = "ocr_draft"
    if visual:
        status = "needs_image"
        warnings.append("Possible image-, figure-, table-, or ECG-dependent item.")
    elif warnings:
        status = "needs_review"
    askable = bool(stem and len(options) >= 2 and correct_option is not None and correct_option < len(options))
    return {
        "id": f"{slugify(subject)}-{slugify(source['sourceFile'])}-p{page_number:04d}-q{question_number:04d}",
        "subject": subject,
        "topic": topic,
        "stem": stem,
        "options": options,
        "correctOption": correct_option,
        "explanation": explanation,
        "learningNote": "",
        "tags": [subject, topic.split(" · ")[-1]] if " · " in topic else [subject],
        "status": status,
        "askable": askable,
        "needsImage": visual,
        "warnings": warnings,
        "source": source,
        "sourcePage": page_number,
        "sourceQuestionNumber": question_number,
        "rawPageOcr": page.strip(),
    }


def write_json(path: Path, value: Any) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(value, ensure_ascii=False, indent=2), encoding="utf-8")


def convert(input_root: Path, output_root: Path) -> dict[str, Any]:
    markdown_root = input_root / "markdown"
    all_questions: list[dict[str, Any]] = []
    source_reports: list[dict[str, Any]] = []
    for filename, subject in CANONICAL_SOURCES:
        path = markdown_root / filename
        markdown = path.read_text(encoding="utf-8")
        source_file, drive_id, source_link = parse_source_header(markdown, filename)
        source = {"markdownFile": filename, "sourceFile": source_file, "driveId": drive_id, "sourceLink": source_link}
        current_topic = f"{subject} · General"
        questions: list[dict[str, Any]] = []
        for page_number, page in page_blocks(markdown):
            current_topic = topic_from_page(page, subject, current_topic)
            question = extract_question(page, subject, current_topic, source, page_number)
            if question:
                questions.append(question)
                all_questions.append(question)
        source_reports.append({"subject": subject, "canonicalMarkdown": filename, "questionCount": len(questions)})

    by_section: defaultdict[tuple[str, str], list[dict[str, Any]]] = defaultdict(list)
    for question in all_questions:
        by_section[(question["subject"], question["topic"])].append(question)

    sections: list[dict[str, Any]] = []
    for (subject, topic), questions in sorted(by_section.items()):
        relative_path = Path("sections") / slugify(subject) / f"{slugify(topic)}.json"
        section = {
            "schemaVersion": 1,
            "subject": subject,
            "topic": topic,
            "questionCount": len(questions),
            "askableCount": sum(question["askable"] for question in questions),
            "needsReviewCount": sum(question["status"] == "needs_review" for question in questions),
            "needsImageCount": sum(question["needsImage"] for question in questions),
            "questions": questions,
        }
        write_json(output_root / relative_path, section)
        sections.append({**{key: section[key] for key in ("subject", "topic", "questionCount", "askableCount", "needsReviewCount", "needsImageCount")}, "path": relative_path.as_posix()})

    status_counts = Counter(question["status"] for question in all_questions)
    report = {
        "generatedAt": now(),
        "canonicalSourceReports": source_reports,
        "questionCount": len(all_questions),
        "askableCount": sum(question["askable"] for question in all_questions),
        "statusCounts": dict(status_counts),
        "sectionCount": len(sections),
        "needsImageCount": sum(question["needsImage"] for question in all_questions),
    }
    manifest = {"schemaVersion": 1, "generatedAt": now(), "report": report, "sections": sections}
    write_json(output_root / "draft-bank.json", {"schemaVersion": 1, "generatedAt": now(), "questions": all_questions})
    write_json(output_root / "manifest.json", manifest)
    write_json(output_root / "conversion-report.json", report)
    return report


def main() -> None:
    parser = argparse.ArgumentParser(description="Convert MRCEM page OCR Markdown to organised question sections.")
    parser.add_argument("input_root", type=Path)
    parser.add_argument("output_root", type=Path)
    args = parser.parse_args()
    report = convert(args.input_root.resolve(), args.output_root.resolve())
    print(json.dumps(report, indent=2))


if __name__ == "__main__":
    main()
