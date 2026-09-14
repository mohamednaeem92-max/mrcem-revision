# Anatomy Batch 21 Correction Plan

## Scope and drift safeguards

The guarded runner may modify only the ten exported Batch 21 records. It must compare each record ID, source page, pre-export stem, and option array before mutation.

| Record | Source-clean outcome | State after application | Evidence gate |
|---|---|---|---|
| `p0634-q0029` | Five source-clean options, no key | `needs_review`, non-askable | Exact posterior-relation exclusion not corroborated. |
| `p0638-q0030` | Key 2, common iliacs | `ocr_draft`, askable | Aortic bifurcation corroborated. |
| `p0639-q0031` | Key 2, jejunum and ileum | `ocr_draft`, askable | SMA branches corroborated. |
| `p0640-q0032` | Key 2, ribs 9–11 | `ocr_draft`, askable | Rib span corroborated. |
| `p0641-q0033` | Key 3, epididymis | `ocr_draft`, askable | Ductus-deferens continuity corroborated. |
| `p0643-q0034` | Key 3, transversus and internal oblique | `ocr_draft`, askable | Ilioinguinal motor supply corroborated. |
| `p0644-q0035` | Five source-clean options, no key | `needs_review`, non-askable | Exact root set not corroborated. |
| `p0647-q0036` | Key 3, T12–L3 | `ocr_draft`, askable | Kidney levels corroborated. |
| `p0648-q0037` | Five source-clean options, no key | `needs_review`, non-askable | External evidence conflicts with isolated L1 source key. |
| `p0649-q0038` | Key 0, peritoneal opening lateral to ovaries | `ocr_draft`, askable | Infundibular abdominal ostium corroborated. |

## Mandatory safety states

1. Restorations remain `ocr_draft`, use the exact standard source-review warning, are explicitly unapproved, and stay mock-ineligible.
2. Restorations receive source-linked notes, mnemonics, complete structured aids with HTTPS source URLs, and one to three nonempty emoji cues.
3. Restrictions remain `needs_review`, `askable: false`, `correctOption: null`, with no aids and a warning beginning `Source page reviewed,`.
4. The audit artifact must record before/after snapshots, evidence, `automaticApproval:false`, and explicit mock exclusion.
