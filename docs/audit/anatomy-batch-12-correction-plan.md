# Anatomy Batch 12 Correction Plan

## Evidence Gate

All ten records were transcribed from their original source screenshots for literal option order and marked key. Each candidate then required authoritative external corroboration. Nine records pass both gates. The pancreatic-body vertebral-level record remains excluded because the current source's body-at-L2 statement conflicts with the source-marked isolated L1 option.

| Outcome | Records | Control |
|---|---:|---|
| Restore as reviewed `ocr_draft` | 9 | Clean source-confirmed wording, source-marked key, complete source-linked aids, and the fixed unapproved warning. |
| Retain as `needs_review` | 1 | Clean source text only, `askable: false`, `correctOption: null`, no explanation-derived learning aids, and a warning beginning exactly `Source page reviewed,`. |
| Approve or admit to mocks | 0 | Prohibited. All records remain unapproved OCR material and mock-ineligible. |

## Record Decisions

| Record | Decision | Basis |
|---|---|---|
| `p0442-q0115` | Restore | Prostate is inferior to bladder. |
| `p0446-q0116` | Restrict | Source-marked isolated L1 level conflicts with the reviewed body-over-L2 reference. |
| `p0451-q0117` | Restore | Bile-duct groove on posterior pancreatic head is supported. |
| `p0454-q0118` | Restore | Inguinal ligament connects ASIS and pubic tubercle. |
| `p0461-q0120` | Restore | Pudendal inferior-rectal branch carries external-haemorrhoid pain. |
| `p0465-q0121` | Restore | Rectum begins at S3. |
| `p0470-q0122` | Restore | Sacrotuberous ligament attaches from sacrum/PSIS to ischial tuberosity. |
| `p0473-q0123` | Restore | Bladder base is posteroinferior. |
| `p0478-q0124` | Restore | Aorta reaches abdominal cavity through T12 aortic hiatus. |
| `p0481-q0125` | Restore | Pancreatic head is the listed retroperitoneal structure. |

## Guarded Application Requirements

The runner must fail closed if `sourcePage`, pre-correction stem, or pre-correction options differ from the immutable Batch 12 export. Restored records must retain `status: "ocr_draft"`, `askable: true`, the exact standard source-review warning, a valid key, and complete HTTPS-linked memory aids. The restricted record must have `status: "needs_review"`, `askable: false`, `correctOption: null`, no high-yield note, mnemonic, or memory aid, and a warning beginning `Source page reviewed,`.

The optional non-mutating triage did not complete within 90 seconds. It neither altered the bank nor informed the decisions above.
