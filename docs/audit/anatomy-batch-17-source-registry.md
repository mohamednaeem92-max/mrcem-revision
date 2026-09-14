# Anatomy Batch 17 Source Registry

## Evidence standard

The original source screenshots determine literal question wording, option order, and displayed keys. A record is restored only where the source key is corroborated at the required specificity by an authoritative external anatomy source. Any conflicting or insufficiently exact formulation remains excluded from answer learning.

| Record | Source-page key | External corroboration | Decision |
|---|---:|---|---|
| `p0574-q0166` | 2, T6–T10 | NCBI describes pancreatic sympathetic innervation from T6–T10, but a peer-reviewed review locates pancreatic sympathetic afferents at T6–L2. The stem is explicitly afferent-specific. [NCBI Pancreas](https://www.ncbi.nlm.nih.gov/books/NBK532912/) [Frontiers review](https://doi.org/10.3389/fnana.2021.691777) | Restrict |
| `p0575-q0167` | 3, Ischial spine to sacrum and coccyx | NCBI describes a broad lower-sacral and upper-coccygeal base that narrows to the ischial spine. [NCBI Pelvic Ligaments](https://www.ncbi.nlm.nih.gov/sites/books/NBK493215/) | Restore |
| `p0579-q0169` | 2, Posterior to stomach and liver | NCBI identifies the lesser sac as the space posterior to the stomach; direct source inspection also confirms the source explanation, including the anterior pancreatic relation. [NCBI Foramen of Winslow](https://www.ncbi.nlm.nih.gov/books/NBK482186/) | Restore |
| `p0580-q0170` | 2, Right and left common iliac arteries | NCBI states that the abdominal aorta terminates by bifurcating into common iliac arteries. [NCBI Aorta](https://www.ncbi.nlm.nih.gov/books/NBK537319/) | Restore |
| `p0581-q0171` | 3, Upper anterior thigh | NCBI states that the femoral branch supplies upper anterior thigh skin, with its fuller description including upper medial anterior-thigh skin. [NCBI Genitofemoral Nerve](https://www.ncbi.nlm.nih.gov/books/NBK430733/) | Restore |
| `p0582-q0172` | 0, Internal iliac nodes | One NCBI reference states above-pectinate drainage to inferior mesenteric nodes; another states superior anal-canal drainage via internal iliac nodes. The exact source formulation is therefore not definitively corroborated. [NCBI Anal Canal](https://www.ncbi.nlm.nih.gov/books/NBK554531/) [NCBI Rectum and Anal Canal](https://www.ncbi.nlm.nih.gov/books/NBK551682/) | Restrict |
| `p0583-q0173` | 1, Internal oblique and transversus abdominis | NCBI explicitly lists these as iliohypogastric motor targets. [NCBI Posterior Abdominal Wall Nerves](https://www.ncbi.nlm.nih.gov/books/NBK557605/) | Restore |
| `p0584-q0174` | 3, Rectus aponeurosis forms inguinal ligament | NCBI identifies the inguinal ligament as a thickened inferior portion of the external-oblique aponeurosis. [NCBI Inguinal Region](https://www.ncbi.nlm.nih.gov/sites/books/NBK470204/) | Restore |
| `p0585-q0175` | 2, Anal canal | NCBI states that superficial inguinal nodes drain the anal canal below the pectinate line. [NCBI Inguinal Lymph Node](https://www.ncbi.nlm.nih.gov/books/NBK557639/) | Restore |
| `p0586-q0176` | 2, Vestibule between labia minora | NCBI identifies the vulvar vestibule as the space between the labia minora and states that the female urethra opens within it. [NCBI Female External Genitalia](https://www.ncbi.nlm.nih.gov/books/NBK547703/) | Restore |

## Disposition summary

| Outcome | Count | Consequence |
|---|---:|---|
| Source-confirmed and externally corroborated restoration | 8 | Remain `ocr_draft`, remain unapproved and mock-ineligible, receive source-linked aids. |
| Source-inspected restriction | 2 | Become `needs_review`, `askable: false`, keyless, aidless, and excluded from answer learning and mocks. |
