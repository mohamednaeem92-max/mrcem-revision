# Anatomy Batch 25 Correction Plan

## Scope and drift safeguards

The guarded runner may modify only the ten immutable Batch 25 exports. It compares each record ID, source page, pre-export stem, and pre-export option array before mutation. Any drift stops the run before a bank write.

| Record | Source-clean outcome | State after application | Evidence gate |
|---|---|---|---|
| `p0692-q0003` | Source-clean wording; no usable key | `needs_review`, excluded | No displayed answer mark. |
| `p0696-q0004` | Key 2, prostate anterior to rectum | `ocr_draft`, askable | Prostate–rectum relation corroborated. |
| `p0700-q0005` | Key 1, pelvic splanchnic nerves | `ocr_draft`, askable | Rectal parasympathetic supply corroborated. |
| `p0705-q0006` | Source-clean wording; no usable key | `needs_review`, excluded | “Superior base” is not externally corroborated as an exact anatomical answer label. |
| `p0710-q0007` | Key 2, rectum as most posterior pelvic viscus | `ocr_draft`, askable | Rectal pelvic position corroborated. |
| `p0715-q0008` | Key 0, T10–L1 | `ocr_draft`, askable | Uterine visceral-afferent level corroborated. |
| `p0719-q0009` | Key 2, transversalis fascia | `ocr_draft`, askable | Inguinal posterior wall corroborated. |
| `p0723-q0010` | Source-clean wording; no usable key | `needs_review`, excluded | A three-source arterial supply prevents restoration of an isolated main-source claim. |
| `p0731-q0012` | Source-clean wording; no usable key | `needs_review`, excluded | Exact all-except relation not sufficiently corroborated. |
| `p0737-q0013` | Source-clean wording; no usable key | `needs_review`, excluded | No displayed answer mark. |

## Mandatory safety states

1. Restorations remain `ocr_draft`, use the exact standard source-review warning, are unapproved, and stay mock-ineligible.
2. Restorations receive source-linked notes, mnemonics, complete structured aids with HTTPS source URLs, and one to three nonempty emoji cues.
3. Restricted records retain `needs_review`, `askable:false`, `correctOption:null`, no learning aids, and one warning beginning `Source page reviewed,`.
4. The audit artifact records before/after snapshots, evidence, `automaticApproval:false`, and explicit mock exclusion.
