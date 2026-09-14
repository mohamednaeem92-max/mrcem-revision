# Anatomy Batch 40 Correction Plan

The Batch 40 application runner compares each ID, source page, pre-export stem, and pre-export options against `anatomy-all-pdf-batch-40-ocr-records.json` before any mutation. It restores only the eight records with inspected source keys and adequate external corroboration. It retains the exact quadratus-lumborum innervation and pancreatic visceral-afferent range records as excluded `needs_review` drafts.

| Action | Count | Required state |
|---|---:|---|
| Source-confirmed restorations | 8 | `ocr_draft`, `askable: true`, exact review warning, source-linked learning aid, mock-ineligible |
| Restrictions | 2 | `needs_review`, `askable: false`, `correctOption: null`, no learning aid, single `Source page reviewed,` warning |
| Automatic approvals | 0 | Explicitly prohibited |

The runner writes `applied-anatomy-batch-40.json` with before/after records, external evidence, `automaticApproval: false`, and `mockEligibility: 'No restored OCR draft is mock eligible.'`.
