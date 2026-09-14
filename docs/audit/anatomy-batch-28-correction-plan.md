# Anatomy Batch 28 Correction Plan

## Guardrails

The guarded runner confirms the immutable ID, page, stem, and option snapshots before mutation. It writes before-and-after records with external evidence to `applied-anatomy-batch-28.json`, sets `automaticApproval` to `false`, and records that no restored OCR draft is mock eligible.

| Record | Action | Source-clean outcome |
|---|---|---|
| `p0826-q0036` | Restore | Five source options; key index 0, kidneys. |
| `p0829-q0037` | Restore | Five source options; key index 4, porta hepatis. |
| `p0836-q0038` | Restore | Five source options; key index 3, just superior to pubic tubercle. |
| `p0840-q0039` | Restrict | Full source options retained; no key inferred because evidence does not corroborate the exact combined third-and-fourth formulation. |
| `p0844-q0040` | Restore | Five source options; key index 1, anterior rami T7–T12 and L1. |
| `p0847-q0041` | Restore | Five source options; key index 0, psoas sign. |
| `p0850-q0042` | Restore | Five source options; key index 2, superior and inferior mesenteric arteries. |
| `p0855-q0043` | Restore | Five source options; key index 1, second part of duodenum. |
| `p0858-q0044` | Restore | Five source options; key index 1, third part of duodenum. |
| `p0862-q0045` | Restrict | Full source options retained; no key inferred because external evidence also records external-oblique motor contribution. |

Restored records have the exact standard warning, `status: 'ocr_draft'`, `askable: true`, `needsImage: false`, no approval, structured HTTPS-linked memory aids, and one to three emoji cues. Restricted records have `status: 'needs_review'`, `askable: false`, `correctOption: null`, no learning aids, and exactly one warning beginning `Source page reviewed,`.
