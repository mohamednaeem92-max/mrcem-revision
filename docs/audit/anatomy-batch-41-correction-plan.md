# Anatomy Batch 41 Correction Plan

## Scope

This batch covers ten Anatomy OCR records from `Anatomy-All.pdf`, source pages 1262–1279. The immutable pre-correction snapshot is `docs/audit/anatomy-all-pdf-batch-41-ocr-records.json`. Direct source inspection controls literal stems, option order, and displayed answer marks. External references corroborate medical content only.

## Decisions

| Decision | Count | Records |
|---|---:|---|
| Restore as unapproved `ocr_draft` | 8 | p1262-q0169, p1263-q0170, p1264-q0171, p1265-q0172, p1266-q0173, p1267-q0174, p1269-q0176, p1279-q0179 |
| Restrict as `needs_review` | 2 | p1268-q0175, p1276-q0178 |
| Automatic approvals | 0 | None |

## Guarded mutation rules

The Batch 41 runner must stop before writing if any target ID, source page, live pre-export stem/options, or immutable snapshot stem/options differs from the expected snapshot. The runner must write an auditable before/after artifact containing external evidence, `automaticApproval:false`, and `mockEligibility:'No restored OCR draft is mock eligible.'`.

Restored records must remain `status:'ocr_draft'`, `askable:true`, `needsImage:false`, carry the exact unapproved-draft warning, and include source-linked explanation, high-yield note, mnemonic, structured memory aid, and 1–3 emoji cues. Restricted records must have `status:'needs_review'`, `askable:false`, `correctOption:null`, no learning aids, and exactly one warning beginning `Source page reviewed,`.

## Recovery note

Batch 41 artifacts were reconstructed after an unintended capability-operation attempt was removed and the workspace returned to the stable Batch 40 checkpoint. The recreated immutable snapshot was exported before this correction plan. No Batch 41 question-bank mutation is permitted until the guarded runner passes its snapshot and live drift checks.

## Evidence files

- `docs/audit/anatomy-batch-41-source-checks.md`
- `docs/audit/anatomy-batch-41-research-notes.md`
- `docs/audit/anatomy-all-pdf-batch-41-ocr-records.json`
- `docs/audit/applied-anatomy-batch-41.json`
