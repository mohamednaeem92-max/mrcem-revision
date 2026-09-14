# Anatomy Batch 23 External-Evidence Notes

## Rule applied

The original source screenshots establish literal wording, option order, and the displayed key. This note records only external corroboration. A source-confirmed record is restored only where an external anatomy source supports the marked answer and the question’s material formulation. Any precise landmark not adequately supported remains excluded.

| Record | Displayed source key | External evidence | Decision |
|---|---|---|---|
| `p0666-q0049` | Portal vein | A peer-reviewed imaging review describes the portal vein as forming posterior to the neck of the pancreas. A tumour at the pancreatic neck therefore directly threatens the portal-vein plane. [PMC portal-vein review](https://pmc.ncbi.nlm.nih.gov/articles/PMC6428891/) | Restore |
| `p0667-q0050` | About 2.5 cm below the umbilicus | NCBI corroborates aortic bifurcation at L4, but does not support this exact surface measurement. CT-based studies report substantial variation relative to the umbilicus, including a mean close to the umbilicus rather than a fixed 2.5-cm point. [NCBI posterior abdominal wall arteries](https://www.ncbi.nlm.nih.gov/books/NBK532972/) [PMC CT study](https://pmc.ncbi.nlm.nih.gov/articles/PMC3924739/) [PubMed surface-landmark study](https://pubmed.ncbi.nlm.nih.gov/26044782/) | Restrict |
| `p0668-q0051` | Femoral nerve | NCBI states that the femoral nerve supplies iliacus. [NCBI femoral nerve](https://www.ncbi.nlm.nih.gov/books/NBK556065/) | Restore |
| `p0669-q0052` | L5 | NCBI states that the right and left common iliac veins form the IVC, usually at L5. [NCBI inferior vena cava](https://www.ncbi.nlm.nih.gov/books/NBK482353/) | Restore |
| `p0670-q0053` | Inferior epigastric artery | NCBI lists the spermatic cord or round ligament and the ilioinguinal and genital branches among canal contents, while locating the deep ring lateral to epigastric vessels. This supports the artery as the non-transmitted option. [NCBI inguinal canal](https://www.ncbi.nlm.nih.gov/books/NBK470204/) | Restore |
| `p0671-q0054` | Left hypochondrium | NCBI locates the spleen in the left hypochondriac region. [NCBI spleen](https://www.ncbi.nlm.nih.gov/books/NBK482235/) | Restore |
| `p0672-q0055` | Ductus deferens and duct from the seminal vesicle | NCBI describes the seminal-vesicle duct converging with the ampulla of the vas deferens to form the ejaculatory duct. [NCBI seminal vesicle](https://www.ncbi.nlm.nih.gov/books/NBK499854/) | Restore |
| `p0673-q0056` | The urethra opens in the vestibule between the labia minora | NCBI identifies the vestibule between the labia minora and states that the female urethra opens within it. [NCBI female external genitalia](https://www.ncbi.nlm.nih.gov/books/NBK547703/) | Restore |
| `p0674-q0057` | Gastroduodenal and superior mesenteric artery | NCBI assigns proximal duodenal inflow to the gastroduodenal artery and distal inflow to SMA branches. [NCBI duodenum](https://www.ncbi.nlm.nih.gov/books/NBK482390/) | Restore |
| `p0675-q0058` | Ampulla of Vater | NCBI defines the hepatopancreatic ampulla, or ampulla of Vater, as the common-bile-duct and pancreatic-duct confluence. [NCBI biliary ducts](https://www.ncbi.nlm.nih.gov/books/NBK459246/) | Restore |

| Outcome | Count | Required state |
|---|---:|---|
| Restore | 9 | `ocr_draft`, `askable:true`, source-linked aids, no approval, and mock-excluded. |
| Restrict | 1 | `needs_review`, `askable:false`, `correctOption:null`, no learning aids, and one source-page warning. |
