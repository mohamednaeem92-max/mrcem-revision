# Anatomy Batch 18 Correction Plan

## Scope

This plan applies only to the ten records in `anatomy-all-pdf-batch-18-ocr-records.json`. The implementation must reject any drift in record ID, source page, pre-correction stem, or pre-correction option array.

## Decisions

| Record | Source-clean result | State after application | Learning-aid basis |
|---|---|---|---|
| `p0593-q0178` | Five source options; key 1, Obturator nerve | `ocr_draft`, askable | Obturator medial-thigh sensory territory, [NCBI Obturator Nerve](https://www.ncbi.nlm.nih.gov/books/NBK551640/) |
| `p0596-q0179` | Five source options; key 2, Peripheral zone | `ocr_draft`, askable | Prostatic carcinoma location, [NCBI Prostate](https://www.ncbi.nlm.nih.gov/books/NBK540987/) |
| `p0600-q0180` | Five source options; key 4, striated lower oesophageal sphincter muscle | `ocr_draft`, askable | Lower oesophageal sphincter is smooth muscle, [NCBI Lower Esophageal Sphincter](https://www.ncbi.nlm.nih.gov/books/NBK557452/) |
| `p0601-q0001` | Five source options; key 1, Pudendal nerve | `ocr_draft`, askable | Pudendal supply of external urethral sphincter, [NCBI Sphincter Urethrae](https://www.ncbi.nlm.nih.gov/books/NBK482438/) |
| `p0603-q0003` | Five source options; key 0, L1 | `ocr_draft`, askable | L1 is the usual origin, with rare variation, [Manolakos et al.](https://pmc.ncbi.nlm.nih.gov/articles/PMC9186473/) |
| `p0604-q0004` | Five source options; key 3, right hypochondrium, epigastrium and left hypochondrium | `ocr_draft`, askable | Normal hepatic distribution, [Chaudhari et al.](https://pmc.ncbi.nlm.nih.gov/articles/PMC5535334/) |
| `p0605-q0005` | Five source options; key withheld because generic rectal pain has non-unique afferent pathways | `needs_review`, not askable | No aid: source key is not sufficiently exact |
| `p0606-q0006` | Five source options; key withheld because the handlebar mechanism does not establish a unique most-common organ | `needs_review`, not askable | No aid: source key is not sufficiently exact |
| `p0610-q0007` | Five source options; key 3, Head of the pancreas | `ocr_draft`, askable | Pancreatic head and descending duodenum relation, [NCBI Duodenum](https://www.ncbi.nlm.nih.gov/books/NBK482390/) |
| `p0611-q0008` | Five source options; key 2, Left gastric vein | `ocr_draft`, askable | Left-gastric-to-azygos collateral, [Sharma and Rameshbabu](https://europepmc.org/articles/PMC3940321) |

## Non-negotiable safeguards

1. Every restored record retains `status: 'ocr_draft'`, the exact standard source-review warning, `automaticApproval: false` in the audit artifact, and mock exclusion.
2. Restored aids must have a nonempty high-yield note, mnemonic, HTTPS source URL, complete structured memory aid, and one to three nonempty emoji cues.
3. Both restricted records must have `status: 'needs_review'`, `askable: false`, `correctOption: null`, no learning note, no mnemonic, no memory aid, and a warning beginning exactly `Source page reviewed,`.
4. The runner must write before and after snapshots, source-page evidence, external evidence, and an explicit mock-ineligibility note to `docs/audit/applied-anatomy-batch-18.json`.
