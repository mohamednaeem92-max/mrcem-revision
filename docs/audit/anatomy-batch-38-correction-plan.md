# Anatomy Batch 38 Correction Plan

The guarded Batch 38 runner must compare every ID, source page, pre-export stem, and pre-export option list against `anatomy-all-pdf-batch-38-ocr-records.json` before any mutation. It will only restore the eight source-confirmed records that also have adequate external corroboration. It will retain the BPH historic-lobe and flaccid-urethral-curvature formulations as excluded `needs_review` drafts.

| Action | Count | Required state |
|---|---:|---|
| Source-confirmed restorations | 8 | `ocr_draft`, `askable: true`, exact review warning, source-linked learning aid, mock-ineligible |
| Restrictions | 2 | `needs_review`, `askable: false`, `correctOption: null`, no learning aid, single `Source page reviewed,` warning |
| Automatic approvals | 0 | Explicitly prohibited |

The runner will write `applied-anatomy-batch-38.json` containing before/after data, external evidence, `automaticApproval: false`, and `mockEligibility: 'No restored OCR draft is mock eligible.'`.
