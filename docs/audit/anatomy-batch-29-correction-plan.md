# Anatomy Batch 29 Correction Plan

## Guardrails

The guarded runner confirms the immutable ID, page, stem, and option snapshots before mutation. It writes before-and-after records with external evidence to `applied-anatomy-batch-29.json`, sets `automaticApproval` to `false`, and records that no restored OCR draft is mock eligible.

| Record | Action | Source-clean outcome |
|---|---|---|
| `p0866-q0046` | Restore | Five source options; key index 0, right lobe. |
| `p0869-q0047` | Restore | Five source options; key index 4, sphincter of Oddi. |
| `p0872-q0048` | Restrict | Five source options retained; no key inferred because evidence does not corroborate the exact whole-pancreas “primarily splenic artery” formulation. |
| `p0877-q0049` | Restore | Five source options; key index 2, mesentery. |
| `p0881-q0050` | Restore | Five source options; key index 2, coeliac trunk. |
| `p0886-q0051` | Restore | Five source options; key index 2, T10–T11. |
| `p0891-q0052` | Restore | Five source options; key index 3, L2–L3. |
| `p0895-q0053` | Restore | Five source options; key index 4, sigmoid colon—retroperitoneal. |
| `p0900-q0054` | Restore | Five source options; key index 1, upper medial thigh. |
| `p0904-q0055` | Restore | Five source options; key index 4, tail. |

Restored records have the exact standard warning, `status: 'ocr_draft'`, `askable: true`, `needsImage: false`, no approval, structured HTTPS-linked memory aids, and one to three emoji cues. The restricted record has `status: 'needs_review'`, `askable: false`, `correctOption: null`, no learning aids, and exactly one warning beginning `Source page reviewed,`.
