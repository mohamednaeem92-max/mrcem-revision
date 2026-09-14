#!/usr/bin/env python3
"""Build a compact TypeScript OCR-draft index for the static offline app."""

from __future__ import annotations

import json
from pathlib import Path


def main() -> None:
    source = Path("/home/ubuntu/mrcem-question-sections/draft-bank.json")
    manifest = Path("/home/ubuntu/mrcem-question-sections/manifest.json")
    destination = Path("/home/ubuntu/mrcem-offline-revision/client/src/lib/ocrDraftSections.ts")
    bank = json.loads(source.read_text(encoding="utf-8"))
    index = json.loads(manifest.read_text(encoding="utf-8"))
    fields = ("id", "subject", "topic", "stem", "options", "correctOption", "explanation", "learningNote", "tags", "status", "askable", "needsImage", "warnings", "source", "sourcePage", "sourceQuestionNumber")
    questions = [{field: record.get(field) for field in fields} for record in bank["questions"]]
    content = """/**
 * Clinical Field Notes style: source-aware OCR draft bank.
 * Generated from the user's uploaded Markdown transcriptions. Raw page OCR is
 * deliberately excluded from the client bundle; each item retains a Markdown
 * source reference and stays visibly unreviewed.
 */
export type OcrDraftStatus = \"ocr_draft\" | \"needs_review\" | \"needs_image\";

export type OcrDraftQuestion = {
  id: string;
  subject: string;
  topic: string;
  stem: string;
  options: string[];
  correctOption: number | null;
  explanation: string;
  learningNote: string;
  tags: string[];
  status: OcrDraftStatus;
  askable: boolean;
  needsImage: boolean;
  warnings: string[];
  source: { markdownFile: string; sourceFile: string; driveId: string | null; sourceLink: string | null };
  sourcePage: number;
  sourceQuestionNumber: number;
};

export type OcrSection = {
  subject: string;
  topic: string;
  questionCount: number;
  askableCount: number;
  needsReviewCount: number;
  needsImageCount: number;
  path: string;
};

export const ocrDraftReport = """ + json.dumps(index["report"], ensure_ascii=False) + " as const;\n\n" + "export const ocrSectionManifest: OcrSection[] = " + json.dumps(index["sections"], ensure_ascii=False) + ";\n\n" + "export const ocrDraftQuestions: OcrDraftQuestion[] = " + json.dumps(questions, ensure_ascii=False) + ";\n"
    destination.write_text(content, encoding="utf-8")
    print(f"Wrote {len(questions)} compact OCR draft records to {destination}.")


if __name__ == "__main__":
    main()
