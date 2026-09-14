# Anatomy Batch 14 Correction Plan

## Evidence Gate

All ten records were transcribed from their original source screenshots for literal option order and marked key. Each candidate then required authoritative external corroboration. Seven records pass both gates. Three records remain excluded because the source formulation is not precisely supported by the reviewed external anatomy evidence.

| Outcome | Records | Control |
|---|---:|---|
| Restore as reviewed `ocr_draft` | 7 | Clean source-confirmed wording, source-marked key, complete source-linked aids, fixed unapproved warning. |
| Retain as `needs_review` | 3 | Source-clean text only, `askable: false`, `correctOption: null`, no learning aids, and warning beginning exactly `Source page reviewed,`. |
| Approve or admit to mocks | 0 | Prohibited. Every record remains unapproved OCR material and mock-ineligible. |

## Record Decisions

| Record | Decision | Basis |
|---|---|---|
| `p0513-q0136` | Restrict | Exact rectovesical-fascia label and source location lack precise external corroboration. |
| `p0514-q0137` | Restore | Rectouterine pouch is posterior to uterus. |
| `p0518-q0138` | Restrict | Current BPH evidence describes transition/periurethral zones, not an exclusively most-likely lobe. |
| `p0519-q0139` | Restore | Psoas is medial to quadratus lumborum. |
| `p0520-q0140` | Restore | Ejaculatory duct forms from ductus deferens plus seminal-vesicle duct. |
| `p0522-q0141` | Restore | Pudendal inferior-rectal branch innervates external anal sphincter. |
| `p0526-q0142` | Restore | Inguinal ligament is the external-oblique inferior border. |
| `p0529-q0143` | Restrict | “Immediately anterior” is not supported for male bladder–rectum relations. |
| `p0530-q0144` | Restore | Ileum is mainly in right lower quadrant. |
| `p0533-q0145` | Restore | Greater omentum continues from greater gastric curvature and first duodenum. |

## Guarded Application Requirements

The runner must fail closed if `sourcePage`, pre-correction stem, or pre-correction options differ from the immutable Batch 14 export. Restored records must remain `ocr_draft`, `askable: true`, and unapproved; use the exact standard source-review warning, valid key, complete HTTPS-linked memory aid, and one to three emoji cues. Restricted records must be `needs_review`, `askable: false`, keyless, free of high-yield notes, mnemonics, and memory aids, and have a warning beginning `Source page reviewed,`.

The optional non-mutating triage did not complete within 80 seconds. It neither altered the bank nor informed the decisions above.
