# Meridian Revision

Meridian Revision is a private, offline-first MRCEM Intermediate study workspace. It contains a validated Evidence-based Medicine pilot bank, immediate post-answer explanations, a review queue, local progress tracking, and a source-aware import path for your own reviewed PDF-derived questions.

## Included now

| Area | Current status |
|---|---|
| Question interface | Complete single-best-answer workflow with immediate answer feedback and explanations |
| Progress tracking | Local attempts, accuracy, bookmarks, review queue, and study-day count |
| Data portability | JSON backup and restore for study progress |
| Question bank | Four manually validated EBM pilot questions from the supplied PDF |
| Source import | Local OCR extractor and browser import for *reviewed* question JSON |
| Design | Original Meridian Revision clinical-workbench interface, informed by the supplied revision-site flow without using its branding or assets |

## Open the application

Run the project from the project directory:

```bash
pnpm dev
```

The workspace runs in a local browser. Progress remains in that browser unless you export it from **Local data**.

## Extract and review a scanned source PDF

The shared PDFs are principally page screenshots, rather than selectable text. The enhanced extractor renders question-page images, applies local OCR, drafts the review fields, creates a quality report, and writes a local editable review sheet.

```bash
python3 tools/extract_mrcem_pdf.py extract \
  /path/to/EBM-All.pdf \
  --subject "Evidence-based medicine" \
  --topic "Statistics" \
  --start-page 1 \
  --end-page 20 \
  --output-dir /path/to/ebm-review-bundle
```

Open `/path/to/ebm-review-bundle/review.html` locally. The page shows each source screenshot next to editable fields, OCR warnings, review status, and a button that downloads `records.reviewed.json`.

## Review before importing

Raw OCR is **not suitable for direct study use**. Correct page layout errors, missing options, numerical values, symbols, image-dependent questions, and the correct-answer index before approval. Select `needs-image` when a question needs a separate image, ECG, radiograph, table, or diagram workflow.

An import file may be a JSON array or an object with a `questions` array. Each record must contain the following reviewed fields.

```json
{
  "id": "ebm-statistics-005",
  "source": "EBM-All.pdf",
  "sourcePage": 7,
  "subject": "Evidence-based medicine",
  "topic": "Statistics",
  "stem": "Question text",
  "options": ["Option A", "Option B", "Option C", "Option D", "Option E"],
  "correctOption": 2,
  "explanation": "Explanation text",
  "learningNote": "Key learning point",
  "tags": ["statistics"],
  "needsReview": false
}
```

`correctOption` is zero-based: `0` represents option A, `1` option B, and so forth. Set the review status to `approved` only after completing every required field.

Prepare browser-importable JSON only after review:

```bash
python3 tools/extract_mrcem_pdf.py prepare-import \
  /path/to/records.reviewed.json \
  --output-dir /path/to/ebm-import
```

The command writes `approved-questions.json` and an `import-report.json` listing rejected records and missing fields. Import `approved-questions.json` through **Source library → Import reviewed JSON**. Imported questions are stored locally in the browser’s IndexedDB. Progress data remains separate in local storage and can be backed up from **Local data**.

## Important study safeguards

| Safeguard | Practical action |
|---|---|
| OCR reliability | Review every imported question against its source page before relying on it for examination preparation. |
| Visual questions | Preserve image, ECG, radiograph, table, and diagram references during manual review; raw OCR cannot verify their diagnostic content. |
| Backup | Export progress before clearing browser data, using private browsing, or changing device. |
| Copyright and access | Use the PDFs and any imported questions only where you have the necessary right or permission to do so. |

## Current source assessment

The shared folder contains six merged subject PDFs and Anatomy/Physiology subfolders. The merged files are approximately 1.7 GB in total. The EBM pilot PDF is 197 pages and follows a recurring question page plus topic-note page pattern. This supports a subject-by-subject import and review process rather than an unverified bulk import.
