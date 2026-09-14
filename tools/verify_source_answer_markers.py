#!/usr/bin/env python3
"""Compare stored OCR draft answer letters with markers on original PDF pages.

This tool is deliberately conservative. It writes a ledger only; it never
modifies question text, option order, answer keys, explanations, or learning
aids. A missing or ambiguous source marker is not treated as evidence.
"""
from __future__ import annotations

import argparse
import json
import re
import subprocess
import tempfile
from collections import Counter
from datetime import datetime, timezone
from pathlib import Path


ANSWER_PATTERNS = [
    re.compile(r"\bANSWER\s*(?:IS|:|-)?\s*\(?\s*([A-E])\b", re.IGNORECASE),
    re.compile(r"\bCORRECT\s+(?:ANSWER\s*)?(?:IS|:|-)?\s*\(?\s*([A-E])\b", re.IGNORECASE),
]


def utc_now() -> str:
    return datetime.now(timezone.utc).isoformat()


def load_drafts(ts_file: Path) -> list[dict]:
    source = ts_file.read_text(encoding="utf-8")
    prefix = "export const ocrDraftQuestions: OcrDraftQuestion[] = "
    start = source.find(prefix)
    if start < 0:
        raise ValueError("OCR draft export prefix not found")
    array_start = start + len(prefix)
    end = source.find("];", array_start)
    if end < 0:
        raise ValueError("OCR draft export terminator not found")
    return json.loads(source[array_start : end + 1])


def render_and_ocr(pdf: Path, page: int, dpi: int) -> str:
    with tempfile.TemporaryDirectory(prefix="mrcem-audit-page-") as directory:
        output = Path(directory) / "source"
        subprocess.run(
            ["pdftoppm", "-f", str(page), "-l", str(page), "-r", str(dpi), "-png", "-singlefile", str(pdf), str(output)],
            check=True,
            capture_output=True,
        )
        result = subprocess.run(
            ["tesseract", f"{output}.png", "stdout", "--psm", "6"],
            check=True,
            text=True,
            capture_output=True,
        )
        return result.stdout


def detected_letters(text: str) -> list[str]:
    return [match.group(1).upper() for pattern in ANSWER_PATTERNS for match in pattern.finditer(text)]


def main() -> None:
    parser = argparse.ArgumentParser(description="Read-only source page answer-marker verifier")
    parser.add_argument("--pdf", type=Path, required=True)
    parser.add_argument("--draft-bank", type=Path, required=True)
    parser.add_argument("--source-file", required=True)
    parser.add_argument("--output", type=Path, required=True)
    parser.add_argument("--dpi", type=int, default=260)
    args = parser.parse_args()

    if not args.pdf.is_file():
        raise FileNotFoundError(args.pdf)
    drafts = [draft for draft in load_drafts(args.draft_bank) if draft.get("source", {}).get("sourceFile") == args.source_file]
    results: list[dict] = []
    for index, draft in enumerate(drafts, start=1):
        page = int(draft["sourcePage"])
        stored_index = draft.get("correctOption")
        stored_letter = chr(65 + stored_index) if isinstance(stored_index, int) and 0 <= stored_index < 26 else None
        source_text = render_and_ocr(args.pdf, page, args.dpi)
        letters = detected_letters(source_text)
        unique_letters = sorted(set(letters))
        if len(unique_letters) == 1 and stored_letter:
            state = "confirmed_match" if unique_letters[0] == stored_letter else "possible_mismatch_manual_review_required"
        elif len(unique_letters) == 1:
            state = "source_marker_found_stored_key_missing"
        elif len(unique_letters) > 1:
            state = "ambiguous_source_marker_manual_review_required"
        else:
            state = "no_reliable_source_marker"
        results.append(
            {
                "id": draft["id"],
                "sourceFile": args.source_file,
                "sourcePage": page,
                "storedCorrectOption": stored_index,
                "storedCorrectLetter": stored_letter,
                "sourceMarkerLetters": letters,
                "state": state,
                "correctionApplied": False,
            }
        )
        if index % 25 == 0 or index == len(drafts):
            print(f"Verified {index}/{len(drafts)} pages", flush=True)

    summary = {
        "generatedAt": utc_now(),
        "sourceFile": args.source_file,
        "recordCount": len(results),
        "states": dict(sorted(Counter(result["state"] for result in results).items())),
        "automaticCorrections": 0,
    }
    args.output.parent.mkdir(parents=True, exist_ok=True)
    args.output.write_text(json.dumps({"summary": summary, "records": results}, indent=2) + "\n", encoding="utf-8")
    print(json.dumps(summary, indent=2))


if __name__ == "__main__":
    main()
