# Anatomy Batch 26 Correction Plan

## Guardrails

The guarded runner must confirm immutable ID, page, stem, and option snapshots before mutation. It writes before-and-after records with external evidence to `applied-anatomy-batch-26.json`, sets `automaticApproval` to `false`, and records that no restored OCR draft is mock eligible.

| Record | Action | Source-clean outcome |
|---|---|---|
| `p0741-q0014` | Restore | Five original options; key index 3, descending and sigmoid colon. |
| `p0746-q0015` | Restore | Five original options; key index 2, lesser trochanter of femur. |
| `p0750-q0016` | Restrict | Full source options retained; no key inferred because the strict portal-triad definition makes the stem non-unique. |
| `p0756-q0017` | Restore | Clarify the continuity wording; key index 3, epididymis. |
| `p0758-q0018` | Restore | Five original options; key index 0, lateral/middle-third McBurney-point landmark. |
| `p0761-q0019` | Restrict | Full source options retained; no key because the exact L3–L4 landmark is not sufficiently externally corroborated. |
| `p0768-q0020` | Restore | Five original options; key index 1, male cremaster muscle. |
| `p0772-q0021` | Restrict | Full source options retained; no key because the exact “medial one-half” formulation is not sufficiently corroborated. |
| `p0776-q0022` | Restore | Five original options; key index 1, lobule. |
| `p0782-q0023` | Restore | Five original options; key index 1, pudendal nerve. |

Restored records have the exact standard warning, `status: 'ocr_draft'`, `askable: true`, `needsImage: false`, no approval, structured HTTPS-linked memory aids, and one to three emoji cues. Restricted records have `status: 'needs_review'`, `askable: false`, `correctOption: null`, no learning aids, and exactly one warning beginning `Source page reviewed,`.
