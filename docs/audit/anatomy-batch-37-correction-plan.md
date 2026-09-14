# Anatomy Batch 37 Correction Plan

The guarded Batch 37 runner must compare every ID, source page, pre-export stem, and pre-export option list against `anatomy-all-pdf-batch-37-ocr-records.json` before any mutation. It will use literal source-page wording and displayed keys only for the seven externally corroborated records. It will retain the exact stomach-region, lower-colon visceral-afferent, and rectovesical-fascia formulations as excluded `needs_review` drafts.

| Action | Count | Required state |
|---|---:|---|
| Source-confirmed restorations | 7 | `ocr_draft`, `askable: true`, exact review warning, source-linked learning aid, mock-ineligible |
| Restrictions | 3 | `needs_review`, `askable: false`, `correctOption: null`, no learning aid, single `Source page reviewed,` warning |
| Automatic approvals | 0 | Explicitly prohibited |

The runner will write `applied-anatomy-batch-37.json` containing before/after data, external evidence, `automaticApproval: false`, and `mockEligibility: 'No restored OCR draft is mock eligible.'`.
