# Anatomy Batch 13 Correction Plan

## Evidence Gate

All ten records were transcribed from their original source screenshots for literal option order and marked key. Each candidate then required authoritative external corroboration. Eight records pass both gates. Two records remain excluded because the source formulation is not precisely supported or is contradicted by the reviewed external pathway description.

| Outcome | Records | Control |
|---|---:|---|
| Restore as reviewed `ocr_draft` | 8 | Clean source-confirmed wording, source-marked key, complete source-linked aids, fixed unapproved warning. |
| Retain as `needs_review` | 2 | Source-clean text only, `askable: false`, `correctOption: null`, no learning aids, and warning beginning exactly `Source page reviewed,`. |
| Approve or admit to mocks | 0 | Prohibited. Every record remains unapproved OCR material and mock-ineligible. |

## Record Decisions

| Record | Decision | Basis |
|---|---|---|
| `p0484-q0126` | Restore | Sigmoid becomes rectum at S3. |
| `p0489-q0127` | Restore | Mesentery anchors jejunum and ileum. |
| `p0493-q0128` | Restore | Third duodenal level at L3 is corroborated. |
| `p0497-q0129` | Restore | Lumbar plexus forms in psoas major. |
| `p0498-q0130` | Restore | Ejaculatory ducts empty into prostatic urethra. |
| `p0500-q0131` | Restrict | The exact three-region stomach formulation lacks precise external corroboration. |
| `p0505-q0132` | Restore | Pancreas occupies epigastric and left-hypochondriac regions. |
| `p0506-q0133` | Restrict | External pathway description conflicts with source-marked L1-L2 lumbar-splanchnic formulation. |
| `p0511-q0134` | Restore | Second duodenum extends L1 to L3. |
| `p0512-q0135` | Restore | Testicular autonomic level T10-L1 is corroborated. |

## Guarded Application Requirements

The runner must fail closed if `sourcePage`, pre-correction stem, or pre-correction options differ from the immutable Batch 13 export. Restored records must remain `ocr_draft`, `askable: true`, and unapproved; use the exact standard source-review warning, valid key, complete HTTPS-linked memory aid, and one to three emoji cues. Restricted records must be `needs_review`, `askable: false`, keyless, free of high-yield notes, mnemonics, and memory aids, and have a warning beginning `Source page reviewed,`.

The optional non-mutating triage did not complete within 90 seconds. It neither altered the bank nor informed the decisions above.
