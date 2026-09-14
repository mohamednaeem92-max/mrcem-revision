# Anatomy Batch 24 Correction Plan

## Scope and drift safeguards

The guarded runner may modify only the ten immutable Batch 24 exports. It compares each record ID, source page, pre-export stem, and pre-export option array before mutation. Any drift stops the run before a bank write.

| Record | Source-clean outcome | State after application | Evidence gate |
|---|---|---|---|
| `p0676-q0059` | Key 2, inferior epigastric vessels | `ocr_draft`, askable | Direct and indirect inguinal-hernias relation corroborated. |
| `p0677-q0060` | Source-clean wording; no usable key | `needs_review`, excluded | Second and third duodenal parts both lie anterior to IVC in the external source. |
| `p0678-q0061` | Key 2, coeliac lymph nodes | `ocr_draft`, askable | Hepatic lymphatic pathway to celiac nodes corroborated. |
| `p0679-q0062` | Source-clean wording; no usable key | `needs_review`, excluded | A reported transversus-abdominis variation prevents an unqualified “except” restoration. |
| `p0680-q0063` | Key 1, upper medial thigh | `ocr_draft`, askable | Ilioinguinal cutaneous distribution corroborated. |
| `p0681-q0064` | Key 2, transverse mesocolon | `ocr_draft`, askable | Supramesocolic and inframesocolic division corroborated. |
| `p0682-q0065` | Key 1, transitional zone | `ocr_draft`, askable | BPH transition-zone origin corroborated. |
| `p0683-q0066` | Key 1, internal oblique and transversus abdominis | `ocr_draft`, askable | Ilioinguinal motor supply corroborated. |
| `p0684-q0001` | Key 0, L2–L4 | `ocr_draft`, askable | Femoral-nerve roots corroborated. |
| `p0689-q0002` | Source-clean wording; no usable key | `needs_review`, excluded | No answer mark is displayed on the original page. |

## Mandatory safety states

1. Restorations remain `ocr_draft`, use the exact standard source-review warning, are unapproved, and stay mock-ineligible.
2. Restorations receive source-linked notes, mnemonics, complete structured aids with HTTPS source URLs, and one to three nonempty emoji cues.
3. Restricted records retain `needs_review`, `askable:false`, `correctOption:null`, no learning aids, and one warning beginning `Source page reviewed,`.
4. The audit artifact records before/after snapshots, evidence, `automaticApproval:false`, and explicit mock exclusion.
