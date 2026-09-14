# Anatomy Batch 07 Correction Plan

## Decision standard

Original source screenshots establish exact wording, option order, and marked answers. A restored item remains an unapproved `ocr_draft` and needs direct external corroboration before receiving learning aids. The non-mutating automated triage timed out after a valid invocation and is not used as evidence or as a decision gate; all dispositions below rely on source-page inspection and documented external references.

| Page | Record | Source-marked answer | Decision | Evidence basis |
|---:|---|---|---|---|
| 262 | `p0262-q0064` | Spleen | Restore | Spleen spans left ribs 9-11 and left rib trauma can cause splenic hemorrhage. [1] |
| 266 | `p0266-q0065` | Inserts on lower 3-4 ribs and pubic crest | Restore | Internal-oblique layer, fibre direction, and lower-rib/pubic insertion are corroborated. [2] |
| 269 | `p0269-q0066` | Para-aortic nodes | Restore | Lumbar para-aortic nodes drain testes; superficial inguinal nodes drain scrotum. [3] |
| 272 | `p0272-q0067` | L1 | Restore | Ilioinguinal nerve is an L1 branch. [4] |
| 277 | `p0277-q0068` | Posterior to first duodenal part | Restore | Retroduodenal CBD passes behind the superior/first duodenum, right of GDA, anterior to portal vein. [5] |
| 280 | `p0280-q0069` | Tail of pancreas | Restore | Pancreatic tail enters peritoneum near splenic hilum. [6] |
| 283 | `p0283-q0070` | Spleen | Restrict | Exact full posterior-relation set was not externally corroborated in this pass. |
| 288 | `p0288-q0071` | Preprostatic urethra | Restrict | Direct source establishes internal sphincter at bladder neck, not the source's exact segment-specific phrasing. [7] |
| 292 | `p0292-q0072` | Hepatorenal recess | Restore | Morison's/hepatorenal pouch is dependent and included in eFAST right-upper-quadrant assessment. [8] |
| 296 | `p0296-q0073` | Uterine tubes | Restore | The tubal ampulla is the commonest ectopic-pregnancy site. [9] |

## Guarded changes

The application runner will fail closed if an OCR record drifts from `anatomy-all-pdf-batch-07-ocr-records.json`. It will preserve identifiers and source provenance, set restorations to `ocr_draft` and `askable: true`, and add the reviewed-draft warning. It cannot approve a question or change mock eligibility.

Pages 283 and 288 will remain `needs_review`, non-askable, and without high-yield notes, mnemonics, or memory aids. Their source-review warnings begin exactly with `Source page reviewed,` so the deterministic queue advances without implying medical validation.

## References

[1]: https://www.ncbi.nlm.nih.gov/books/NBK482235/ "NCBI Bookshelf: Anatomy, Abdomen and Pelvis, Spleen"
[2]: https://www.ncbi.nlm.nih.gov/books/NBK525975/ "NCBI Bookshelf: Anatomy, Abdomen and Pelvis: Anterolateral Abdominal Wall"
[3]: https://www.ncbi.nlm.nih.gov/books/NBK557720/ "NCBI Bookshelf: Anatomy, Abdomen and Pelvis: Lymphatic Drainage"
[4]: https://www.ncbi.nlm.nih.gov/books/NBK470204/ "NCBI Bookshelf: Anatomy, Abdomen and Pelvis: Inguinal Region"
[5]: https://pmc.ncbi.nlm.nih.gov/articles/PMC4244820/ "Babu and Sharma: Biliary Tract Anatomy and its Relationship with Venous Drainage"
[6]: https://www.ncbi.nlm.nih.gov/books/NBK545243/ "NCBI Bookshelf: Embryology, Pancreas"
[7]: https://www.ncbi.nlm.nih.gov/books/NBK531465/ "NCBI Bookshelf: Anatomy, Abdomen and Pelvis: Bladder"
[8]: https://pmc.ncbi.nlm.nih.gov/articles/PMC9968550/ "Kaur et al.: Morrison's Pouch Anatomy"
[9]: https://www.ncbi.nlm.nih.gov/books/NBK547660/ "NCBI Bookshelf: Anatomy, Abdomen and Pelvis: Fallopian Tube"
