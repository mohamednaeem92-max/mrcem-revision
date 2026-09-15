# Meridian Revision

Meridian Revision is a private, offline-first MRCEM Primary study workspace. It opens your bundled source catalogue for revision, marks keyed single-best-answer items, keeps ungraded records out of the missed queue, and reserves timed mocks for complete blueprint-tagged questions.

## Included now

| Area | Current status |
|---|---|
| Question interface | Subject and topic paths, search, Quick 20, keyboard shortcuts, and immediate explanations |
| Progress tracking | Local attempts, accuracy, bookmarks, review queue, and study-day count |
| Data portability | JSON backup and restore for study progress |
| Question bank | Full local OCR catalogue (~5,200 records). Keyed items are scored; missing keys stay ungraded |
| Mock exams | Strict Primary mocks using only verified, blueprint-tagged, non-OCR questions |
| Source import | Local OCR extractor and browser import for *reviewed* question JSON |
| Design | Original Meridian Revision clinical-workbench interface |

## Open the application

### Daily study (offline after first load)

```bash
pnpm build
pnpm preview
```

Open the preview URL, wait for the bank to load, then install the app or keep the tab. After that, Meridian works without internet: the question bank, interface, and your progress stay on this device.

- **Phone or tablet:** browser menu → Add to Home Screen / Install app
- **iPhone:** Share → Add to Home Screen
- **Computer:** Install app from the header, or Local data

`pnpm dev` is for development only and does not register the offline cache.

### Copyable standalone folder

`pnpm build` writes a complete app in `dist/`. Copy that folder to another computer and serve it with any static server (`pnpm preview`, `python3 -m http.server`, etc.). Do not open `index.html` as a `file://` page; browsers block the local question bank that way.

`pnpm build:standalone` bakes the question bank into the JavaScript bundle so the first load does not fetch `ocr-questions.json`. Use that when you want a single self-contained `dist/` folder.

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
