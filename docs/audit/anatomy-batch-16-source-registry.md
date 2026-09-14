# Anatomy Batch 16 Source Registry

## Evidence standard

The original source screenshot determines literal question wording, option order, and key. A record is restored only where the source key is independently corroborated by a credible external anatomy reference. The single record without support for the exact source formulation remains excluded.

| Record | Source-page key | External corroboration | Decision |
|---|---:|---|---|
| `p0556-q0156` | 4, Pancreas | Right kidney relations include adrenal gland, liver, second duodenum and colonic/small-bowel structures; pancreas is not a listed right anterior relation. [NCBI Kidney Anatomy](https://www.ncbi.nlm.nih.gov/books/NBK482385/) | Restore |
| `p0557-q0157` | 1, Pubic tubercle | NCBI confirms posterolateral trigonal, oblique ureteric entry but not the exact pubic-tubercle level. [NCBI Ureter Anatomy](https://www.ncbi.nlm.nih.gov/books/NBK532980/) | Restrict |
| `p0558-q0158` | 2, T10 | NCBI identifies oesophageal hiatus at T10. [NCBI Diaphragm Anatomy](https://www.ncbi.nlm.nih.gov/books/NBK519558/) | Restore |
| `p0561-q0159` | 1, Transversalis fascia | Posterior inguinal wall includes transversalis fascia; direct hernia is posterior-wall weakness in Hesselbach triangle. [Medscape Inguinal Region Anatomy](https://emedicine.medscape.com/article/2075362-overview) | Restore |
| `p0563-q0160` | 3, Pudendal nerve | Cord contents include vessels, vas, lymphatics and genital genitofemoral branch, not pudendal nerve. [NCBI Inguinal Canal](https://www.ncbi.nlm.nih.gov/books/NBK470204/) | Restore |
| `p0566-q0161` | 2, Third part of duodenum | SMA syndrome compresses third duodenum between SMA anteriorly and aorta posteriorly. [NCBI SMA Syndrome](https://www.ncbi.nlm.nih.gov/books/NBK482209/) | Restore |
| `p0567-q0162` | 1, T8 | NCBI identifies IVC passage through caval opening at T8. [NCBI Diaphragm Anatomy](https://www.ncbi.nlm.nih.gov/books/NBK519558/) | Restore |
| `p0571-q0163` | 1, Portal vein | Portal vein forms and lies behind pancreatic neck. [Medscape Pancreas Anatomy](https://emedicine.medscape.com/article/1948885-overview) | Restore |
| `p0572-q0164` | 4, Inferior epigastric artery | Standard cord-content list excludes inferior epigastric artery. [Medscape Inguinal Region Anatomy](https://emedicine.medscape.com/article/2075362-overview) | Restore |
| `p0573-q0165` | 4, Anterior rami T12-L4 | Exact innervation stated as anterior rami T12-L4. [TeachMeAnatomy Quadratus Lumborum](https://teachmeanatomy.info/encyclopaedia/q/quadratus-lumborum/) | Restore |

## Disposition summary

| Outcome | Count | Consequence |
|---|---:|---|
| Source-confirmed and externally corroborated restoration | 9 | Remain `ocr_draft`, remain unapproved and mock-ineligible, receive source-linked aids. |
| Source-inspected restriction | 1 | Becomes `needs_review`, `askable: false`, keyless, aidless, and excluded from answer learning and mocks. |
