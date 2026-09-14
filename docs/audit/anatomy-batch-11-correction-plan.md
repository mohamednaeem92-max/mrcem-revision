# Anatomy Batch 11 Correction Plan

## Evidence Gate

Each record received direct original-page inspection for its literal option order and source-marked key. Medical content then required independent authoritative corroboration. Eight records satisfy both gates. Two records remain excluded because the source formulation is less precise than the external anatomy evidence.

| Outcome | Records | Control |
|---|---:|---|
| Restore as reviewed `ocr_draft` | 8 | Clean source-confirmed wording, five ordered options, source-marked key, complete source-linked aids, and the fixed unapproved warning. |
| Retain as `needs_review` | 2 | Clean source text only, `askable: false`, `correctOption: null`, no explanation-derived learning aids, and a warning beginning exactly `Source page reviewed,`. |
| Approve or admit to mocks | 0 | Prohibited. All records remain unapproved OCR material and mock-ineligible. |

## Record Decisions

| Record | Decision | Basis |
|---|---|---|
| `p0412-q0105` | Restore | Source-marked posterolateral gluteal option is corroborated by the iliohypogastric lateral-gluteal sensory territory. |
| `p0417-q0106` | Restore | Vagal parasympathetic innervation of the foregut supports the marked stomach answer. |
| `p0422-q0107` | Restore | Scrotal skin drains to superficial inguinal nodes, distinct from testicular para-aortic drainage. |
| `p0425-q0108` | Restore | Arching internal-oblique and transversus-abdominis fibers form the canal roof. |
| `p0426-q0109` | Restore | The aortic hiatus is at T12. |
| `p0429-q0110` | Restrict | The stem's categorical exclusion of transversus abdominis conflicts with a documented superior sheath relationship. |
| `p0432-q0111` | Restrict | The source's isolated L1 origin is not precise enough against the documented T12-L1 contribution. |
| `p0433-q0112` | Restore | The inferior epigastric artery is not a canal content. |
| `p0437-q0113` | Restore | The superficial ring is an external-oblique-aponeurosis opening. |
| `p0438-q0114` | Restore | Sacrum and ilium articulate at the sacroiliac joint. |

## Guarded Application Requirements

The runner must fail closed if a record's `sourcePage`, pre-correction stem, or pre-correction options differ from the immutable Batch 11 export. Restored records must retain `status: "ocr_draft"`, `askable: true`, the exact standard source-review warning, a valid key, and complete HTTPS-linked memory aids. Restricted records must have `status: "needs_review"`, `askable: false`, `correctOption: null`, no high-yield note, mnemonic, or memory aid, and a warning beginning `Source page reviewed,`.

The optional non-mutating triage did not complete within 90 seconds. It neither altered the bank nor informed the decisions above.
