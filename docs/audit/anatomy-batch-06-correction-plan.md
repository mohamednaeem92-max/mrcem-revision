# Anatomy Batch 06 Correction Plan

## Decision standard

Original source screenshots define question wording, option order, and marked answer. A restoration remains an unapproved `ocr_draft` and receives learning aids only when an external anatomy reference corroborates the source-marked claim. The runner must fail closed on any drift from `anatomy-all-pdf-batch-06-ocr-records.json`. It must not create approved or mock-eligible questions.

| Page | Record | Source-marked answer | Decision | Evidence basis |
|---:|---|---|---|---|
| 217 | `p0217-q0054` | Upper medial thigh | Restore | The ilioinguinal nerve supplies upper anteromedial-thigh skin. [1] |
| 221 | `p0221-q0055` | Tail | Restore | The pancreatic tail in the splenorenal ligament is described as the only intraperitoneal pancreatic part. [2] |
| 226 | `p0226-q0056` | Right subhepatic space | Restore | Morison's pouch is the right subhepatic/hepatorenal space between the right liver lobe and kidney. [3] |
| 230 | `p0230-q0057` | About 2.5 cm below the umbilicus | Restore with qualification | The conventional surface description is just below the umbilicus, but the exact relation varies between individuals. [4] |
| 233 | `p0233-q0058` | Rib 12 | Restore | The right kidney lies slightly lower and its upper pole is frequently crossed by the 12th rib. [5] |
| 239 | `p0239-q0059` | Ureters descend on the medial aspect of psoas major | Restore | Ureters arise at the ureteropelvic junction, travel retroperitoneally anterior to psoas, and right-sided appendix proximity is documented. [6] |
| 242 | `p0242-q0060` | Ureter | Restore | The renal pelvis is the funnel-shaped transition to the proximal ureter. [5] |
| 248 | `p0248-q0061` | Dorsal-root ganglia S2-S4 | Restrict | Human lower-urinary-tract afferents arise from DRG at both S2-S4 and T11-L2, so a sole S2-S4 answer is incomplete. [7] |
| 253 | `p0253-q0062` | Coeliac trunk | Restore with qualification | The proper hepatic artery is a coeliac-trunk branch, while hepatic arterial variants exist. [8] |
| 259 | `p0259-q0063` | Ascending colon | Restore | The ascending colon is retroperitoneal; the other source options are intraperitoneal. [9] |

## Guarded changes

The runner will replace only source-corrupted stems, options, answer indices, explanations, and learning aids. It preserves record identifiers and source provenance. Restored records are set to `ocr_draft`, remain excluded from mocks, and receive the exact warning: `Source page and external anatomy reference reviewed; remains an unapproved OCR draft.`

Page 248 remains `needs_review` and `askable: false`, with `correctOption: null`. Its warning begins exactly with `Source page reviewed,` so the source-page queue recognises the completed inspection. The runner removes learning aids from this restricted record defensively.

## Learning-aid constraints

Every restoration receives a concise explanation, learning note, high-yield note, mnemonic, and structured `memoryAid` with one to three textual emoji cues plus an HTTPS source URL. Page 230 will state the source's conventional approximation without presenting it as a universal individual measurement. Page 253 will state the ordinary coeliac-trunk origin and note normal arterial variation.

## References

[1]: https://www.ncbi.nlm.nih.gov/books/NBK538256/ "NCBI Bookshelf: Ilioinguinal Neuralgia"
[2]: https://www.mdpi.com/2227-9059/12/11/2627 "Mihoc et al., Pancreatic Morphology, Immunology, and the Pathogenesis of Acute Pancreatitis"
[3]: https://pmc.ncbi.nlm.nih.gov/articles/PMC9968550/ "Kaur et al., Morrison's Pouch: Anatomy and Radiological Appearance of Pathological Processes"
[4]: https://pmc.ncbi.nlm.nih.gov/articles/PMC3924739/ "Jeong et al., Vertical Distance Between Umbilicus and Aortic Bifurcation"
[5]: https://www.ncbi.nlm.nih.gov/books/NBK482385/ "NCBI Bookshelf: Anatomy, Abdomen and Pelvis: Kidneys"
[6]: https://www.ncbi.nlm.nih.gov/books/NBK532980/ "NCBI Bookshelf: Anatomy, Abdomen and Pelvis Ureter"
[7]: https://pmc.ncbi.nlm.nih.gov/articles/PMC3383010/ "de Groat and Yoshimura, Afferent Nerve Regulation of Bladder Function"
[8]: https://www.ncbi.nlm.nih.gov/books/NBK500014/ "NCBI Bookshelf: Anatomy, Abdomen and Pelvis: Liver"
[9]: https://www.ncbi.nlm.nih.gov/books/NBK470577/ "NCBI Bookshelf: Anatomy, Abdomen and Pelvis: Large Intestine"
