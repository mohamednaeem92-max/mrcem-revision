# Anatomy Batch 39 Correction Plan

The Batch 39 application runner must compare each ID, source page, pre-export stem, and pre-export options against `anatomy-all-pdf-batch-39-ocr-records.json` before any mutation. It will restore only the eight records with an inspected source key and adequate external corroboration. It will retain the exact ureteric dermatomal range and pubic-tubercle landmark records as excluded `needs_review` drafts.

| Action | Count | Required state |
|---|---:|---|
| Source-confirmed restorations | 8 | `ocr_draft`, `askable: true`, exact review warning, source-linked learning aid, mock-ineligible |
| Restrictions | 2 | `needs_review`, `askable: false`, `correctOption: null`, no learning aid, single `Source page reviewed,` warning |
| Automatic approvals | 0 | Explicitly prohibited |

The runner will write `applied-anatomy-batch-39.json` with before/after records, external evidence, `automaticApproval: false`, and `mockEligibility: 'No restored OCR draft is mock eligible.'`.
