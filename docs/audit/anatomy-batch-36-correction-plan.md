# Anatomy Batch 36 Correction Plan

The guarded Batch 36 runner must compare every ID, source page, pre-export stem, and pre-export option list against `anatomy-all-pdf-batch-36-ocr-records.json` before any mutation. It will use literal source-page wording and displayed keys only for the ten externally corroborated records. No approval path or restriction path is permitted in this batch.

| Action | Count | Required state |
|---|---:|---|
| Source-confirmed restorations | 10 | `ocr_draft`, `askable: true`, exact review warning, source-linked learning aid, mock-ineligible |
| Restrictions | 0 | None required after source and evidence review |
| Automatic approvals | 0 | Explicitly prohibited |

The runner will write `applied-anatomy-batch-36.json` containing before/after data, external evidence, `automaticApproval: false`, and `mockEligibility: 'No restored OCR draft is mock eligible.'`.
