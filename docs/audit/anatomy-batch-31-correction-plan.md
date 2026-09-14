# Anatomy Batch 31 Correction Plan

## Guardrails

The guarded runner checks each immutable ID, source page, pre-export stem, and pre-export option array before mutation. It writes before-and-after records with external evidence to `applied-anatomy-batch-31.json`, sets `automaticApproval` to `false`, and records that no restored OCR draft is mock eligible.

| Record | Action | Source-clean outcome |
|---|---|---|
| `p0952-q0066` | Restore | Five source options; key index 4, para-aortic nodes. |
| `p0955-q0067` | Restrict | Five source options retained; no key inferred because authoritative sources document an additional T12 contribution. |
| `p0960-q0068` | Restore | Five source options; key index 2, posterior to the first part of the duodenum. |
| `p0963-q0069` | Restore | Five source options; key index 3, tail of pancreas. |
| `p0966-q0070` | Restrict | Five source options retained; no key inferred because the exact posterior-relation set is insufficiently corroborated. |
| `p0971-q0071` | Restore | Five source options; key index 0, preprostatic urethra. |
| `p0975-q0072` | Restrict | Five source options retained; no key inferred because the broad supine-fluid formulation has more than one supported dependent recess. |
| `p0979-q0073` | Restore | Five source options; key index 1, uterine tubes. |
| `p0982-q0074` | Restore | Five source options; key index 1, shoulder tip. |
| `p0985-q0075` | Restore | Five source options; key index 2, S2–S4. |

Restored records have the exact standard warning, `status: 'ocr_draft'`, `askable: true`, `needsImage: false`, no approval, structured HTTPS-linked memory aids, and one to three emoji cues. Restricted records have `status: 'needs_review'`, `askable: false`, `correctOption: null`, no learning aids, and exactly one warning beginning `Source page reviewed,`.
