# Anatomy Batch 27 Correction Plan

## Guardrails

The guarded runner confirms the immutable ID, page, stem, and option snapshots before mutation. It writes before-and-after records with external evidence to `applied-anatomy-batch-27.json`, sets `automaticApproval` to `false`, and records that no restored OCR draft is mock eligible.

| Record | Action | Source-clean outcome |
|---|---|---|
| `p0787-q0024` | Restore | Five source options; key index 4, L4. |
| `p0791-q0025` | Restore | Five source options; key index 2, ureter. |
| `p0795-q0026` | Restore | Five source options; key index 1, pudendal nerve. |
| `p0802-q0029` | Restore | Five source options; key index 2, three aponeuroses. |
| `p0805-q0030` | Restrict | Full source options retained; no key inferred because evidence uses zones rather than the exact posterior-lobe formulation. |
| `p0809-q0031` | Restore | Five source options; key index 2, spleen. |
| `p0813-q0032` | Restrict | Full source options retained; no key inferred because the keyed mid-inguinal point conflicts with the inguinal-ligament midpoint. |
| `p0817-q0033` | Restore | Five source options; key index 1, right hypochondrium. |
| `p0820-q0034` | Restore | Five source options; key index 3, three flat muscles. |
| `p0823-q0035` | Restore | Five source options; key index 1, phrenic nerve. |

Restored records have the exact standard warning, `status: 'ocr_draft'`, `askable: true`, `needsImage: false`, no approval, structured HTTPS-linked memory aids, and one to three emoji cues. Restricted records have `status: 'needs_review'`, `askable: false`, `correctOption: null`, no learning aids, and exactly one warning beginning `Source page reviewed,`.
