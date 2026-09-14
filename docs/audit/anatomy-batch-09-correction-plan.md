# Anatomy Batch 09 Correction Plan

## Decision standard

Original source screenshots establish question text, option order, and marked answers. Any restoration remains an unapproved `ocr_draft` and is not mock eligible. External evidence must directly corroborate the factual key before a source-linked learning aid is added. The non-mutating automated triage was attempted with a bounded run but timed out; it is not evidence and did not inform a disposition.

| Page | Record | Source-marked answer | Decision | Evidence basis |
|---:|---|---|---|---|
| 340 | `p0340-q0084` | Left lobe of the liver | Restore | The left hepatic lobe is an anterior relation of the stomach. [1] |
| 345 | `p0345-q0085` | Membranous urethra | Restrict | Direct evidence places the external sphincter at the membranous urethra but does not directly use the source’s urogenital-diaphragm formulation. |
| 350 | `p0350-q0086` | Proximal duodenum | Restore | Except for its first segment, the duodenum is retroperitoneal. [2] |
| 353 | `p0353-q0087` | L1-L4 | Restrict | The reviewed lumbar-plexus source describes a T12-L5 distribution, not the source’s exact L1-L4 formulation. |
| 357 | `p0357-q0088` | Membranous urethra | Restore | The male external urethral sphincter is at the membranous-urethral level. [3] |
| 361 | `p0361-q0089` | Puborectalis muscle | Restrict | Puborectalis relaxation permits stool passage, but the source’s specific clinical inference was not directly corroborated. |
| 365 | `p0365-q0090` | Left kidney | Restore | Kidneys span T12-L3, their upper poles are often crossed by rib 12, and the left lies higher. [4] |
| 367 | `p0367-q0092` | Common bile duct | Restore | Gallstone obstruction of the common bile duct impairs bile flow and can cause jaundice. [5] [6] |
| 370 | `p0370-q0093` | Transversalis fascia | Restore | The deep inguinal ring is formed by transversalis fascia. [7] |
| 374 | `p0374-q0094` | L1 | Restrict | Reviewed evidence confirms that the renal pelvis is the ureter’s superior end but does not directly establish the source-marked L1 level. |

## Guarded changes

The application runner will compare each immutable pre-correction stem and option array against `anatomy-all-pdf-batch-09-ocr-records.json` and fail closed if any record drifts. Restored records receive `status: "ocr_draft"`, `askable: true`, the reviewed-draft warning, and source-linked learning aids. The runner cannot approve records or alter mock eligibility.

Pages 345, 353, 361, and 374 remain `needs_review`, non-askable, keyless, and without learning aids. Each restriction warning begins `Source page reviewed,` so the queue records completed source inspection without implying medical validation.

## References

[1]: https://www.ncbi.nlm.nih.gov/books/NBK482334/ "NCBI Bookshelf: Stomach"
[2]: https://www.ncbi.nlm.nih.gov/books/NBK482390/ "NCBI Bookshelf: Duodenum"
[3]: https://www.ncbi.nlm.nih.gov/books/NBK482438/ "NCBI Bookshelf: Sphincter Urethrae"
[4]: https://www.ncbi.nlm.nih.gov/books/NBK482385/ "NCBI Bookshelf: Kidneys"
[5]: https://www.ncbi.nlm.nih.gov/books/NBK539698/ "NCBI Bookshelf: Biliary Obstruction"
[6]: https://www.ncbi.nlm.nih.gov/books/NBK459246/ "NCBI Bookshelf: Biliary Ducts"
[7]: https://www.ncbi.nlm.nih.gov/books/NBK470204/ "NCBI Bookshelf: Inguinal Region"
