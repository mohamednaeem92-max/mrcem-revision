#!/usr/bin/env python3
"""Validate a review-first MRCEM Markdown dataset before packaging."""

from __future__ import annotations

import argparse
import json
import re
from collections import Counter, defaultdict
from datetime import datetime, timezone
from pathlib import Path
from typing import Any


def read_json(path: Path) -> Any:
    return json.loads(path.read_text(encoding="utf-8"))


def write_json(path: Path, content: Any) -> None:
    path.write_text(json.dumps(content, indent=2, ensure_ascii=False), encoding="utf-8")


def parse_front_matter(markdown: str) -> dict[str, str]:
    if not markdown.startswith("---\n"):
        return {}
    closing = markdown.find("\n---\n", 4)
    if closing == -1:
        return {}
    fields: dict[str, str] = {}
    for line in markdown[4:closing].splitlines():
        if ":" not in line:
            continue
        key, value = line.split(":", 1)
        fields[key.strip()] = value.strip().strip('"')
    return fields


def normalise_stem(markdown: str) -> str:
    match = re.search(r"## Stem\n\n(.*?)(?=\n\n## Options|\Z)", markdown, re.DOTALL)
    stem = match.group(1) if match else ""
    stem = re.sub(r"\s+", " ", stem.lower()).strip()
    return stem


def source_summary(source_dir: Path) -> dict[str, Any] | None:
    path = source_dir / "reports" / "summary.json"
    return read_json(path) if path.exists() else None


def validate(root: Path) -> dict[str, Any]:
    master = read_json(root / "master-report.json")
    source_dirs = sorted(path for path in (root / "sources").iterdir() if path.is_dir())
    issues: list[dict[str, Any]] = []
    duplicate_stems: defaultdict[str, list[str]] = defaultdict(list)
    source_rows: list[dict[str, Any]] = []
    counts = Counter()

    for source_dir in source_dirs:
        summary = source_summary(source_dir)
        if not summary:
            issues.append({"sourceDirectory": source_dir.name, "issue": "Missing reports/summary.json"})
            continue
        record_count = int(summary.get("recordCount", 0))
        markdown_files = sorted((source_dir / "questions").glob("*.md")) if (source_dir / "questions").exists() else []
        review_path = source_dir / "review" / "records.review.json"
        records = read_json(review_path) if review_path.exists() else []
        if record_count != len(markdown_files):
            issues.append({"sourceDirectory": source_dir.name, "issue": "Markdown count differs from source report", "expected": record_count, "actual": len(markdown_files)})
        if record_count != len(records):
            issues.append({"sourceDirectory": source_dir.name, "issue": "Review JSON count differs from source report", "expected": record_count, "actual": len(records)})

        image_missing = 0
        malformed_markdown = 0
        for markdown_file in markdown_files:
            content = markdown_file.read_text(encoding="utf-8")
            fields = parse_front_matter(content)
            required = {"id", "source_file", "source_drive_id", "source_page", "source_page_image", "review_status"}
            missing = sorted(field for field in required if not fields.get(field))
            if missing:
                malformed_markdown += 1
                issues.append({"sourceDirectory": source_dir.name, "file": str(markdown_file.relative_to(root)), "issue": "Missing required front matter", "fields": missing})
            image_reference = fields.get("source_page_image", "")
            if image_reference and not (source_dir / image_reference).exists():
                image_missing += 1
                issues.append({"sourceDirectory": source_dir.name, "file": str(markdown_file.relative_to(root)), "issue": "Missing source image", "image": image_reference})
            stem = normalise_stem(content)
            if len(stem) >= 20:
                duplicate_stems[stem].append(str(markdown_file.relative_to(root)))

        source_rows.append({
            "sourceDirectory": source_dir.name,
            "sourcePdf": summary.get("sourcePdf"),
            "recordCount": record_count,
            "markdownFiles": len(markdown_files),
            "reviewRecords": len(records),
            "missingImages": image_missing,
            "malformedMarkdown": malformed_markdown,
            "processingStatus": summary.get("processingStatus", "completed"),
        })
        counts[summary.get("processingStatus", "completed")] += 1
        counts["records"] += record_count
        counts["markdownFiles"] += len(markdown_files)
        counts["reviewRecords"] += len(records)

    duplicate_groups = [
        {"stem": stem, "recordCount": len(paths), "records": paths}
        for stem, paths in duplicate_stems.items()
        if len(paths) > 1
    ]
    duplicate_groups.sort(key=lambda group: (-group["recordCount"], group["stem"]))
    duplicate_summary = {"generatedAt": datetime.now(timezone.utc).isoformat(), "groupCount": len(duplicate_groups), "recordsInGroups": sum(group["recordCount"] for group in duplicate_groups), "groups": duplicate_groups}
    write_json(root / "duplicate-stem-report.json", duplicate_summary)

    report = {
        "generatedAt": datetime.now(timezone.utc).isoformat(),
        "masterSourceCount": master.get("sourceCount"),
        "sourceDirectories": len(source_dirs),
        "masterRecordCount": master.get("markdownRecords"),
        "validatedRecordCount": counts["records"],
        "validatedMarkdownFiles": counts["markdownFiles"],
        "validatedReviewRecords": counts["reviewRecords"],
        "statusCounts": {key: value for key, value in counts.items() if key not in {"records", "markdownFiles", "reviewRecords"}},
        "issueCount": len(issues),
        "duplicateStemGroupCount": len(duplicate_groups),
        "recordsInDuplicateStemGroups": duplicate_summary["recordsInGroups"],
        "issues": issues,
        "sources": source_rows,
    }
    write_json(root / "validation-report.json", report)
    return report


def main() -> None:
    parser = argparse.ArgumentParser(description="Validate MRCEM Markdown OCR dataset.")
    parser.add_argument("dataset_root", type=Path)
    args = parser.parse_args()
    report = validate(args.dataset_root.resolve())
    print(json.dumps({key: report[key] for key in ("sourceDirectories", "validatedRecordCount", "issueCount", "duplicateStemGroupCount", "statusCounts")}, indent=2))


if __name__ == "__main__":
    main()
