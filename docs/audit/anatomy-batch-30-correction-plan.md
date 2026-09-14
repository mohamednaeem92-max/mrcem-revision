# Anatomy Batch 30 Correction Plan

## Guardrails

The guarded runner confirms the immutable ID, page, stem, and option snapshots before mutation. It writes before-and-after records with external evidence to `applied-anatomy-batch-30.json`, sets `automaticApproval` to `false`, and records that no restored OCR draft is mock eligible.

| Record | Action | Source-clean outcome |
|---|---|---|
| `p0909-q0056` | Restore | Five source options; key index 3, right subhepatic space. |
| `p0913-q0057` | Restrict | Five source options retained; no key inferred because the fixed 2.5-cm landmark is not sufficiently corroborated. |
| `p0916-q0058` | Restore | Five source options; key index 4, rib 12. |
| `p0922-q0059` | Restrict | Five source options retained; no key inferred because external evidence does not support the exact medial-aspect wording. |
| `p0925-q0060` | Restore | Five source options; key index 4, ureter. |
| `p0931-q0061` | Restrict | Five source options retained; no key inferred because bladder afferent cell bodies are described at both sacral and thoracolumbar dorsal-root levels. |
| `p0936-q0062` | Restore | Five source options; key index 1, coeliac trunk. |
| `p0942-q0063` | Restore | Five source options; key index 0, ascending colon. |
| `p0945-q0064` | Restore | Five source options; key index 2, spleen. |
| `p0949-q0065` | Restrict | Five source options retained; no key inferred because the exact insertion formulation is not externally corroborated. |

Restored records have the exact standard warning, `status: 'ocr_draft'`, `askable: true`, `needsImage: false`, no approval, structured HTTPS-linked memory aids, and one to three emoji cues. Restricted records have `status: 'needs_review'`, `askable: false`, `correctOption: null`, no learning aids, and exactly one warning beginning `Source page reviewed,`.
