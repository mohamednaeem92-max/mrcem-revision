# Anatomy Batch 33 Correction Plan

The guarded Batch 33 runner must compare every ID, source page, pre-export stem, and pre-export option list against `anatomy-all-pdf-batch-33-ocr-records.json` before any mutation. It will use literal source-page wording and displayed keys only for externally corroborated records. It will retain conflicting exact-level records as excluded `needs_review` drafts.

| Action | Count | Required state |
|---|---:|---|
| Source-confirmed restorations | 8 | `ocr_draft`, `askable: true`, exact review warning, source-linked learning aid, mock-ineligible |
| Restrictions | 2 | `needs_review`, `askable: false`, `correctOption: null`, no learning aid, single `Source page reviewed,` warning |
| Automatic approvals | 0 | Explicitly prohibited |

The runner will write `applied-anatomy-batch-33.json` containing before/after data, external evidence, `automaticApproval: false`, and `mockEligibility: 'No restored OCR draft is mock eligible.'`.
