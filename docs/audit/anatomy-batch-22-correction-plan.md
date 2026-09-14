# Anatomy Batch 22 Correction Plan

## Scope and drift safeguards

The guarded runner may modify only the ten exported Batch 22 records. It must compare each record ID, source page, pre-export stem, and option array before mutation.

| Record | Source-clean outcome | State after application | Evidence gate |
|---|---|---|---|
| `p0650-q0039` | Key 2, renal capsule to renal fascia | `ocr_draft`, askable | Perinephric-space boundaries corroborated. |
| `p0651-q0040` | Key 3, right subhepatic space | `ocr_draft`, askable | Morison pouch location corroborated. |
| `p0652-q0041` | Key 0, abdominal aorta | `ocr_draft`, askable | Renal-artery origin corroborated. |
| `p0653-q0042` | Key 3, liver | `ocr_draft`, askable | Portal-flow metastatic destination corroborated. |
| `p0654-q0043` | Key 1, lateral thigh skin | `ocr_draft`, askable | LFCN territory corroborated. |
| `p0655-q0044` | Key 0, posterolateral gluteal region | `ocr_draft`, askable | Iliohypogastric lateral-gluteal territory corroborated. |
| `p0656-q0045` | Key 3, retrocaecal | `ocr_draft`, askable | Common appendix position corroborated. |
| `p0659-q0046` | Key 2, superior mesenteric artery | `ocr_draft`, askable | Uncinate-process relation corroborated. |
| `p0660-q0047` | Key 3, deep inguinal nodes | `ocr_draft`, askable | Glans lymphatic drainage corroborated. |
| `p0663-q0048` | Key 4, umbilical region | `ocr_draft`, askable | Midgut pain referral corroborated. |

## Mandatory safety states

1. Restorations remain `ocr_draft`, use the exact standard source-review warning, are explicitly unapproved, and stay mock-ineligible.
2. Restorations receive source-linked notes, mnemonics, complete structured aids with HTTPS source URLs, and one to three nonempty emoji cues.
3. The audit artifact must record before/after snapshots, evidence, `automaticApproval:false`, and explicit mock exclusion.
