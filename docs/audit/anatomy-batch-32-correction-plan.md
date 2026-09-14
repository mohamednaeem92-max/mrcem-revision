# Anatomy Batch 32 Correction Plan

The guarded Batch 32 runner must compare every ID, source page, pre-export stem, and pre-export option list against `anatomy-all-pdf-batch-32-ocr-records.json` before any mutation. It will replace only source-corrupted text with the literal source-page wording, set the displayed key, preserve `status: 'ocr_draft'`, keep each record unapproved and mock-ineligible, and add structured HTTPS-linked learning aids sourced from the recorded evidence.

| Action | Count | Required state |
|---|---:|---|
| Source-confirmed restorations | 10 | `ocr_draft`, `askable: true`, exact review warning, source-linked learning aid, mock-ineligible |
| Restrictions | 0 | Not applicable |
| Automatic approvals | 0 | Explicitly prohibited |

The runner will write `applied-anatomy-batch-32.json` containing before/after data, evidence URLs, `automaticApproval: false`, and `mockEligibility: 'No restored OCR draft is mock eligible.'`.

