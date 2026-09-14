# Anatomy Batch 34 Correction Plan

The guarded Batch 34 runner must compare every ID, source page, pre-export stem, and pre-export option list against `anatomy-all-pdf-batch-34-ocr-records.json` before any mutation. It will use literal source-page wording and displayed keys only for externally corroborated records. It will retain the generic rectal visceral-afferent formulation as an excluded `needs_review` draft.

| Action | Count | Required state |
|---|---:|---|
| Source-confirmed restorations | 9 | `ocr_draft`, `askable: true`, exact review warning, source-linked learning aid, mock-ineligible |
| Restrictions | 1 | `needs_review`, `askable: false`, `correctOption: null`, no learning aid, single `Source page reviewed,` warning |
| Automatic approvals | 0 | Explicitly prohibited |

The runner will write `applied-anatomy-batch-34.json` containing before/after data, external evidence, `automaticApproval: false`, and `mockEligibility: 'No restored OCR draft is mock eligible.'`.
