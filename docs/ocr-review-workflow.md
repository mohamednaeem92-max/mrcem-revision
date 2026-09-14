# OCR Review Bundle Workflow

## Purpose

The source PDFs are scanned page captures. The enhanced utility therefore creates a **review bundle** instead of implying that raw OCR is examination-ready.

## Bundle contents

| File | Purpose |
|---|---|
| `records.review.json` | Draft records with OCR text, suggested stem/options, source-page metadata, image path, and review state. |
| `images/` | Rendered source images for every detected question page. |
| `review.html` | A local, filterable review sheet showing each draft alongside its source image. |
| `report.json` | Counts, extraction settings, and records needing correction. |
| `approved-questions.json` | Generated only from valid, approved records; accepted by Meridian Revision import. |

## Review states

| State | Meaning | Import eligible |
|---|---|---|
| `pending` | OCR draft has not been reviewed. | No |
| `needs-image` | Question relies on an image, table, ECG, or diagram not represented in the draft. | No |
| `approved` | Reviewer confirmed all required fields against the source page. | Yes |

## Reviewer process

1. Run the extractor for one small source range and open `review.html` locally.
2. Correct `records.review.json` while using the linked source image. Confirm the stem, five options, correct answer index, explanation, and topic.
3. Set `reviewStatus` to `approved` only after checking the source page. Use `needs-image` when a visual question needs separate asset handling.
4. Run validation with the `prepare-import` command. It reports rejected records and writes `approved-questions.json` only for valid approved records.
5. Import `approved-questions.json` from **Source library** in Meridian Revision.

## Validation rules

The prepared import requires a non-empty source, positive source page, subject, topic, stem, at least two answer options, a valid zero-based `correctOption`, explanation, learning note, and tag list. Any unapproved record is excluded.
