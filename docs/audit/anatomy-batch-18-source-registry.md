# Anatomy Batch 18 Source Registry

## Evidence standard

The original screenshots determine literal question wording, option order, and displayed keys. A record is restored only where the displayed key is corroborated at the required specificity by an authoritative external source. Any conflicting or insufficiently exact formulation remains excluded from answer learning.

| Record | Source-page key | External corroboration | Decision |
|---|---:|---|---|
| `p0593-q0178` | 1, Obturator nerve | NCBI identifies obturator sensory supply to the medial upper thigh and reports medial-thigh pain with pelvic obturator compression or entrapment. [NCBI Obturator Nerve](https://www.ncbi.nlm.nih.gov/books/NBK551640/) | Restore |
| `p0596-q0179` | 2, Peripheral zone | NCBI states that most prostatic carcinomas develop in the peripheral zone. [NCBI Prostate](https://www.ncbi.nlm.nih.gov/books/NBK540987/) | Restore |
| `p0600-q0180` | 4, Striated lower oesophageal sphincter muscle | NCBI describes the intrinsic lower oesophageal sphincter as smooth muscle. [NCBI Lower Esophageal Sphincter](https://www.ncbi.nlm.nih.gov/books/NBK557452/) | Restore |
| `p0601-q0001` | 1, Pudendal nerve | NCBI states that the pudendal nerve, S2–S4, innervates the external urethral sphincter. [NCBI Sphincter Urethrae](https://www.ncbi.nlm.nih.gov/books/NBK482438/) | Restore |
| `p0603-q0003` | 0, L1 | A systematic review identifies L1 as the usual origin of the iliohypogastric nerve, with occasional T12 contribution. [Manolakos et al.](https://pmc.ncbi.nlm.nih.gov/articles/PMC9186473/) | Restore |
| `p0604-q0004` | 3, Right hypochondrium, epigastrium and left hypochondrium | A peer-reviewed anatomical study directly reports this three-region hepatic distribution. [Chaudhari et al.](https://pmc.ncbi.nlm.nih.gov/articles/PMC5535334/) | Restore |
| `p0605-q0005` | 0, Pelvic splanchnic nerves | A peer-reviewed review identifies both lumbar splanchnic and sacral pelvic afferent pathways for the colorectum, with differing contributions by site and stimulus. The generic source stem cannot select a unique pathway. [Brierley et al.](https://doi.org/10.3389/fncel.2018.00467) | Restrict |
| `p0606-q0006` | 2, Spleen | A peer-reviewed handlebar-trauma source identifies several likely target organs, including pancreas, bowel, mesentery, liver and spleen, without proving spleen uniquely most common for this mechanism. [Cacciatore et al.](https://pmc.ncbi.nlm.nih.gov/articles/PMC10460239/) | Restrict |
| `p0610-q0007` | 3, Head of the pancreas | NCBI describes the pancreatic head in the descending duodenum’s C-shaped concavity. [NCBI Duodenum](https://www.ncbi.nlm.nih.gov/books/NBK482390/) | Restore |
| `p0611-q0008` | 2, Left gastric vein | A peer-reviewed portal-hypertension review states that the left gastric vein anastomoses with oesophageal veins draining to the azygos vein. [Sharma and Rameshbabu](https://europepmc.org/articles/PMC3940321) | Restore |

## Disposition summary

| Outcome | Count | Consequence |
|---|---:|---|
| Source-confirmed and externally corroborated restoration | 8 | Remain `ocr_draft`, remain unapproved and mock-ineligible, receive source-linked aids. |
| Source-inspected restriction | 2 | Become `needs_review`, `askable: false`, keyless, aidless, and excluded from answer learning and mocks. |
