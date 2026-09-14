# Anatomy Batch 04 Correction Plan

## Decision standard

The original PDF screenshot sets the question wording, option order, and marked answer. A restoration remains an unapproved `ocr_draft`, and gains learning aids only where the answer is corroborated by an external anatomy reference. The runner must fail closed on any drift from `anatomy-all-pdf-batch-04-ocr-records.json`. It must not create approved or mock-eligible questions.

| Page | Record | Source-marked answer | Decision | Evidence basis |
|---:|---|---|---|---|
| 137 | `p0137-q0034` | External oblique, internal oblique and transversus abdominis | Restore | The three muscles are the anterolateral muscle layers. [1] |
| 140 | `p0140-q0035` | Phrenic nerve | Restore | Diaphragmatic peritoneal irritation refers shoulder pain through the right phrenic nerve. [2] |
| 143 | `p0143-q0036` | Kidneys | Restore | Kidneys drain to para-aortic/lumbar nodes; the other options are within pre-aortic drainage territory. [3] |
| 146 | `p0146-q0037` | Porta hepatis | Restore | The caudate lobe is posterior and quadrate lobe anterior to the porta hepatis. [4] |
| 153 | `p0153-q0038` | Just superior to the pubic tubercle | Restore | The superficial inguinal ring lies just superior to the pubic tubercle. [5] |
| 157 | `p0157-q0039` | Third and fourth parts | Restrict | The direct source says the third part is anterior to the aorta while the fourth ascends to its left, so it does not establish the source's combined statement. [6] |
| 161 | `p0161-q0040` | Anterior rami T7–T12 and L1 | Restore | T7–T12 provide primary sensory and motor supply; L1 contributes with T12 to the ilioinguinal/iliohypogastric trunk. [7] |
| 164 | `p0164-q0041` | Psoas sign may be positive in retrocaecal appendicitis | Restore | A retrocaecal appendix can irritate psoas and produce the psoas sign. [8] |
| 167 | `p0167-q0042` | Superior and inferior mesenteric arteries | Restore | The large intestine receives arterial supply from the SMA and IMA. [9] |
| 172 | `p0172-q0043` | Second part of duodenum | Restore | The duodenum beyond the first part is retroperitoneal, so the marked second-part option is correct. [6] |

## Guarded changes

The runner will replace only source-corrupted stems, options, answer indices, explanations, and learning aids. It will retain the existing record identifiers, source provenance, `ocr_draft` status, and mock exclusion. Each restored record will receive the exact warning: `Source page and external anatomy reference reviewed; remains an unapproved OCR draft.`

Page 157 will remain `needs_review` and `askable: false`. Its warning begins with `Source page reviewed,` so the deterministic source-page queue recognises the completed inspection. The runner will remove any learning aids from this restricted record defensively.

## Learning-aid constraints

Every restored record will contain a concise externally supported explanation, high-yield note, mnemonic, and structured `memoryAid` with one to three text emoji cues and an HTTPS NCBI source URL. Page 172 will state the accurate qualification that the duodenum after the proximal first part is retroperitoneal; it will not imply that only the second and third parts are retroperitoneal.

## References

[1]: https://www.ncbi.nlm.nih.gov/books/NBK551649/ "NCBI Bookshelf: Anatomy, Abdomen and Pelvis: Abdominal Wall"
[2]: https://www.ncbi.nlm.nih.gov/books/NBK459288/ "NCBI Bookshelf: Anatomy, Abdomen and Pelvis: Gallbladder"
[3]: https://www.ncbi.nlm.nih.gov/books/NBK557720/ "NCBI Bookshelf: Anatomy, Lymphatic Drainage"
[4]: https://www.ncbi.nlm.nih.gov/books/NBK500014/ "NCBI Bookshelf: Anatomy, Abdomen and Pelvis: Liver"
[5]: https://www.ncbi.nlm.nih.gov/books/NBK470204/ "NCBI Bookshelf: Anatomy, Abdomen and Pelvis: Inguinal Region"
[6]: https://www.ncbi.nlm.nih.gov/books/NBK482390/ "NCBI Bookshelf: Anatomy, Abdomen and Pelvis: Duodenum"
[7]: https://www.ncbi.nlm.nih.gov/books/NBK525975/ "NCBI Bookshelf: Anatomy, Abdomen and Pelvis: Anterolateral Abdominal Wall"
[8]: https://www.ncbi.nlm.nih.gov/books/NBK459205/ "NCBI Bookshelf: Anatomy, Abdomen and Pelvis: Appendix"
[9]: https://www.ncbi.nlm.nih.gov/books/NBK470577/ "NCBI Bookshelf: Anatomy, Abdomen and Pelvis: Large Intestine"
