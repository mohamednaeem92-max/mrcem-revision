# Anatomy Batch 19 Correction Plan

## Scope

This plan applies only to the ten records in `anatomy-all-pdf-batch-19-ocr-records.json`. The implementation must reject any drift in record ID, source page, pre-correction stem, or pre-correction option array.

## Decisions

| Record | Source-clean result | State after application | Learning-aid basis |
|---|---|---|---|
| `p0614-q0009` | Five source options; key 3, Transversus abdominis muscle | `ocr_draft`, askable | Quadratus lumborum’s lateral relation, [NCBI Posterior Abdominal Wall](https://www.ncbi.nlm.nih.gov/books/NBK557605/) |
| `p0615-q0010` | Five source options; key 4, Vagus nerves | `ocr_draft`, askable | Vagal parasympathetic gastric supply, [NCBI Stomach](https://www.ncbi.nlm.nih.gov/books/NBK482334/) |
| `p0616-q0011` | Five source options; key 0, Left upper quadrant | `ocr_draft`, askable | Jejunal location, [NCBI Small Bowel](https://www.ncbi.nlm.nih.gov/books/NBK532263/) |
| `p0617-q0012` | Five source options; key 1, Azygos system of veins | `ocr_draft`, askable | Left-gastric-to-azygos collateral, [Sharma and Rameshbabu](https://europepmc.org/articles/PMC3940321) |
| `p0618-q0013` | Five source options; key 0, External oblique aponeurosis | `ocr_draft`, askable | Superficial inguinal ring, [NCBI Inguinal Region](https://www.ncbi.nlm.nih.gov/books/NBK470204/) |
| `p0619-q0014` | Five source options; key 3, anterior to portal vein | `ocr_draft`, askable | Hepatoduodenal ligament relation, [NCBI Portal Venous System](https://www.ncbi.nlm.nih.gov/books/NBK554589/) |
| `p0620-q0015` | Five source options; key 3, L4 | `ocr_draft`, askable | Aortic bifurcation, [NCBI Aorta](https://www.ncbi.nlm.nih.gov/books/NBK537319/) |
| `p0621-q0016` | Five source options; key 3, rectus aponeurosis forms inguinal ligament | `ocr_draft`, askable | Inguinal ligament arises from external oblique, [NCBI Inguinal Region](https://www.ncbi.nlm.nih.gov/books/NBK470204/) |
| `p0622-q0017` | Five source options; key 0, Ligamentum teres and gallbladder | `ocr_draft`, askable | Quadrate lobe relation, [NCBI Liver](https://www.ncbi.nlm.nih.gov/books/NBK500014/) |
| `p0623-q0018` | Five source options; key 0, L2–L4 | `ocr_draft`, askable | Obturator nerve origin, [NCBI Thigh Nerves](https://www.ncbi.nlm.nih.gov/sites/books/NBK482225/) |

## Non-negotiable safeguards

1. Every restored record retains `status: 'ocr_draft'`, the exact standard source-review warning, `automaticApproval: false` in the audit artifact, and mock exclusion.
2. Restored aids must have a nonempty high-yield note, mnemonic, HTTPS source URL, complete structured memory aid, and one to three nonempty emoji cues.
3. The runner must write before and after snapshots, source-page evidence, external evidence, and an explicit mock-ineligibility note to `docs/audit/applied-anatomy-batch-19.json`.
