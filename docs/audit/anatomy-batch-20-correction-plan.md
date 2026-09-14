# Anatomy Batch 20 Correction Plan

## Scope

This plan is limited to the ten records in `anatomy-all-pdf-batch-20-ocr-records.json`. The runner must reject drift in record ID, source page, pre-correction stem, or pre-correction option array.

## Decisions

| Record | Source-clean result | State after application | Evidence or reason |
|---|---|---|---|
| `p0624-q0019` | Five options; key 1, uterine artery from internal iliac | `ocr_draft`, askable | Main uterine vessels arise from internal iliac. |
| `p0625-q0020` | Five options; key 3, left hypochondrium and epigastrium | `ocr_draft`, askable | Pancreas is listed in both regions. |
| `p0626-q0021` | Five options; key 0, T10–L1 | `ocr_draft`, askable | Source-key range is reported, with T10–L2 variation retained in explanation. |
| `p0627-q0022` | Five options; key 4, tail | `ocr_draft`, askable | Tail is the intraperitoneal pancreatic part. |
| `p0628-q0023` | Five options; source key withheld | `needs_review`, non-askable | Third part is corroborated; combined third-and-fourth relation is not. |
| `p0629-q0024` | Five options; source key withheld | `needs_review`, non-askable | Exact pubic-tubercle landmark lacks external corroboration. |
| `p0630-q0025` | Five options; key 2, three muscle aponeuroses | `ocr_draft`, askable | Rectus sheath comprises external-oblique, internal-oblique, and transversus-abdominis coverings. |
| `p0631-q0026` | Five options; source key withheld | `needs_review`, non-askable | Aortic origin is supported but exact generic pancreatic relation is not. |
| `p0632-q0027` | Five options; key 2, posterior to stomach and liver | `ocr_draft`, askable | Lesser sac relation corroborated. |
| `p0633-q0028` | Five options; key 0, pancreatic-head groove | `ocr_draft`, askable | Distal common bile duct runs in a posterior pancreatic-head groove. |

## Non-negotiable safeguards

1. Restored records retain `status: 'ocr_draft'`, the exact standard source-review warning, `automaticApproval: false` in the audit artifact, and mock exclusion.
2. Restored aids require nonempty high-yield notes and mnemonics, HTTPS evidence URLs, complete structured memory aids, and one to three nonempty emoji cues.
3. Restricted records require `status: 'needs_review'`, `askable: false`, `correctOption: null`, no learning aids, and a warning beginning exactly `Source page reviewed,`.
4. The application artifact must include before and after snapshots, evidence, explicit `automaticApproval:false`, and explicit mock exclusion.
