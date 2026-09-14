# Anatomy Batch 05 Correction Plan

## Decision standard

The original PDF screenshot determines question wording, option order, and the marked answer. A restoration remains an unapproved `ocr_draft` and receives learning aids only when the source-marked claim is corroborated by an external anatomy reference. The runner must fail closed on any drift from `anatomy-all-pdf-batch-05-ocr-records.json`. It must not create approved or mock-eligible questions.

| Page | Record | Source-marked answer | Decision | Evidence basis |
|---:|---|---|---|---|
| 175 | `p0175-q0044` | Third part of the duodenum | Restore | The third duodenal part passes anterior to the inferior vena cava. [1] |
| 179 | `p0179-q0045` | Internal oblique and transversus abdominis | Restore | The ilioinguinal nerve supplies both muscles. [2] |
| 183 | `p0183-q0046` | Right lobe | Restore with qualified explanation | The gallbladder attaches on the visceral liver surface in a fossa between segments IV and V; the explanation will use this precise relation. [3] |
| 186 | `p0186-q0047` | Sphincter of Oddi | Restore | The sphincter regulates bile and pancreatic-secretory flow into the duodenum and prevents reflux. [3] |
| 189 | `p0189-q0048` | Splenic artery | Restrict | Pancreatic arterial supply has contributions from splenic, superior mesenteric, and common-hepatic branches. The external source does not support a single primary artery for the whole pancreas. [4] |
| 194 | `p0194-q0049` | Mesentery | Restore | The root of the small-bowel mesentery divides the infracolic compartment into right and left spaces. [5] |
| 198 | `p0198-q0050` | Coeliac trunk | Restore | Coeliac branches provide the stomach's arterial supply. [6] |
| 203 | `p0203-q0051` | T10-T11 | Restore with a narrow scope | Lesser splanchnic nerves arise from T10-T11 and reach midgut perivascular plexuses. [7] |
| 208 | `p0208-q0052` | L2-L3 | Restore | The lateral femoral cutaneous nerve typically arises from L2 and L3 ventral rami. [8] |
| 212 | `p0212-q0053` | Sigmoid colon - Retroperitoneal | Restore | The sigmoid colon is intraperitoneal, making the source-marked statement the incorrect one. [9] |

## Guarded changes

The runner will replace only source-corrupted stems, options, answer indices, explanations, and learning aids. It will retain record identifiers and source provenance; restored records will be set to `ocr_draft`, remain excluded from mocks, and receive the exact warning: `Source page and external anatomy reference reviewed; remains an unapproved OCR draft.`

Page 189 will remain `needs_review` and `askable: false`. Its new warning begins exactly with `Source page reviewed,` so the deterministic queue records that its source page was inspected. The runner will remove learning aids from this restricted record defensively.

## Learning-aid constraints

Each restoration will contain a concise explanation, learning note, high-yield note, mnemonic, and structured `memoryAid`. The aid must contain one to three textual emoji cues and an HTTPS source URL. Wording will preserve material scope: page 183 will state the segments-IV/V fossa relation, and page 203 will identify the lesser-splanchnic T10-T11 association for the midgut pathway without claiming an unqualified universal sensory map.

## References

[1]: https://www.ncbi.nlm.nih.gov/books/NBK482390/ "NCBI Bookshelf: Anatomy, Abdomen and Pelvis: Duodenum"
[2]: https://www.ncbi.nlm.nih.gov/books/NBK538256/ "NCBI Bookshelf: Ilioinguinal Neuralgia"
[3]: https://www.ncbi.nlm.nih.gov/books/NBK459288/ "NCBI Bookshelf: Anatomy, Abdomen and Pelvis: Gallbladder"
[4]: https://www.ncbi.nlm.nih.gov/books/NBK532912/ "NCBI Bookshelf: Anatomy, Abdomen and Pelvis, Pancreas"
[5]: https://europepmc.org/articles/PMC6590000 "Sharma et al. Imaging of infracolic and pelvic compartment by linear EUS"
[6]: https://www.ncbi.nlm.nih.gov/books/NBK459241/ "NCBI Bookshelf: Anatomy, Abdomen and Pelvis: Celiac Trunk"
[7]: https://www.ncbi.nlm.nih.gov/books/NBK560504/ "NCBI Bookshelf: Anatomy, Abdomen and Pelvis, Splanchnic Nerves"
[8]: https://www.ncbi.nlm.nih.gov/books/NBK532301/ "NCBI Bookshelf: Anatomy, Bony Pelvis and Lower Limb: Lateral Femoral Cutaneous Nerve"
[9]: https://www.ncbi.nlm.nih.gov/books/NBK470577/ "NCBI Bookshelf: Anatomy, Abdomen and Pelvis: Large Intestine"
