# Anatomy Batch 23 Correction Plan

## Scope and drift safeguards

The guarded runner may modify only the ten immutable Batch 23 exports. It compares each record ID, source page, pre-export stem, and pre-export option array before mutation. Any drift stops the run before a bank write.

| Record | Source-clean outcome | State after application | Evidence gate |
|---|---|---|---|
| `p0666-q0049` | Key 1, portal vein | `ocr_draft`, askable | Portal vein lies posterior to pancreatic neck. |
| `p0667-q0050` | Source-clean wording; no usable key | `needs_review`, excluded | Exact 2.5-cm surface landmark is not sufficiently corroborated. |
| `p0668-q0051` | Key 3, femoral nerve | `ocr_draft`, askable | Iliacus innervation corroborated. |
| `p0669-q0052` | Key 4, L5 | `ocr_draft`, askable | IVC confluence level corroborated. |
| `p0670-q0053` | Key 4, inferior epigastric artery | `ocr_draft`, askable | Inguinal-canal contents corroborated. |
| `p0671-q0054` | Key 1, left hypochondrium | `ocr_draft`, askable | Splenic region corroborated. |
| `p0672-q0055` | Key 3, ductus deferens plus seminal-vesicle duct | `ocr_draft`, askable | Ejaculatory-duct formation corroborated. |
| `p0673-q0056` | Key 2, vestibule between labia minora | `ocr_draft`, askable | Female urethral opening corroborated. |
| `p0674-q0057` | Key 4, gastroduodenal and superior mesenteric artery | `ocr_draft`, askable | Duodenal arterial supply corroborated. |
| `p0675-q0058` | Key 4, ampulla of Vater | `ocr_draft`, askable | Hepatopancreatic-ampulla formation corroborated. |

## Mandatory safety states

1. Restorations remain `ocr_draft`, use the exact standard source-review warning, are unapproved, and stay mock-ineligible.
2. Restorations receive source-linked notes, mnemonics, complete structured aids with HTTPS source URLs, and one to three nonempty emoji cues.
3. The restricted record retains `needs_review`, `askable:false`, `correctOption:null`, no learning aids, and one warning beginning `Source page reviewed,`.
4. The audit artifact records before/after snapshots, evidence, `automaticApproval:false`, and explicit mock exclusion.
