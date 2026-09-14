# Anatomy Batch 15 Correction Plan

## Scope and decision

This batch contains ten OCR-draft Anatomy records from original PDF pages 537, 541, 546, 547, 550, 551, 552, 553, 554, and 555. Direct screenshot inspection recovered every stem, five-option set, and marked key. Each source key was corroborated with an external anatomy reference. The application runner will restore all ten records with literal source-clean text and source-linked learning aids.

| Record | Source-page action | External evidence action | Final state |
|---|---|---|---|
| `p0537-q0146` | Restore five options and key `4`. | Confirm flaccid S/double curvature and urethral segment relations. | `ocr_draft`, askable |
| `p0541-q0147` | Restore omitted distractor and key `3`. | Confirm L1-associated ilioinguinal motor distribution. | `ocr_draft`, askable |
| `p0546-q0148` | Restore five options and key `2`. | Confirm typical L1/L2 renal-artery origin. | `ocr_draft`, askable |
| `p0547-q0149` | Restore source-clean dermatomal labels and key `1`. | Confirm T11-L2 visceral pain pathway. | `ocr_draft`, askable |
| `p0550-q0150` | Restore five vertebral-level options and key `2`. | Confirm fourth-part termination at L2. | `ocr_draft`, askable |
| `p0551-q0151` | Restore source-clean option set and key `0`. | Confirm linea alba from three flat-muscle aponeuroses. | `ocr_draft`, askable |
| `p0552-q0152` | Restore source-clean vertebral options and key `3`. | Confirm usual T12-L3 renal position. | `ocr_draft`, askable |
| `p0553-q0153` | Restore omitted distractor and key `2`. | Confirm external-oblique attachments and superficial position. | `ocr_draft`, askable |
| `p0554-q0154` | Restore all five options and key `2`. | Confirm transverse-mesocolon supracolic/infracolic division. | `ocr_draft`, askable |
| `p0555-q0155` | Restore omitted left-lower-quadrant distractor and key `0`. | Confirm usual LUQ jejunal location. | `ocr_draft`, askable |

## Required safety controls

The guarded runner must verify the exact pre-correction stem, option array, and source page from `anatomy-all-pdf-batch-15-ocr-records.json` before changing each record. Restored records must use the exact warning:

> Source page and external anatomy reference reviewed; remains an unapproved OCR draft.

The runner must set `status: 'ocr_draft'`, `askable: true`, and leave approval absent. It must add a nonempty high-yield note, mnemonic, structured memory aid with a HTTPS source URL, and one to three emoji cues. It must write before/after snapshots to `docs/audit/applied-anatomy-batch-15.json`, explicitly recording `automaticApproval: false` and mock exclusion.

The verifier must reject any automatic approval, mock eligibility, incomplete aid, non-HTTPS source URL, drifted source page, missing warning, invalid key, or non-source-clean option set.

## Optional triage

The non-mutating triage was attempted with a 120-second time bound but did not complete. It did not alter the bank and did not affect the source-page or external-evidence decisions.

