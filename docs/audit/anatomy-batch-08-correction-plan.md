# Anatomy Batch 08 Correction Plan

## Decision standard

Original source screenshots establish the question text, option order, and marked answer. A restored record remains an unapproved `ocr_draft`; it is not mock eligible. External evidence must directly corroborate the factual key before source-linked learning aids are added. The Batch 08 automated triage did not complete and is not used as evidence or a decision gate.

| Page | Record | Source-marked answer | Decision | Evidence basis |
|---:|---|---|---|---|
| 299 | `p0299-q0074` | Shoulder tip | Restore | Diaphragmatic peritoneal irritation can refer to the right shoulder through the phrenic nerve. [1] |
| 302 | `p0302-q0075` | S2-S4 | Restore | Pelvic splanchnic parasympathetics arise from S2-S4. [2] |
| 307 | `p0307-q0076` | Azygos system of veins | Restore | Gastro-oesophageal collaterals drain into the azygos system in oesophageal varices. [3] |
| 311 | `p0311-q0077` | T12-L5 vertebrae | Restore | Psoas major has thoracolumbar vertebral and disc attachments, including T12 and lumbar vertebrae. [4] |
| 315 | `p0315-q0078` | Puborectalis contraction | Restore | Puborectalis relaxes to permit defaecation; its contraction therefore does not facilitate it. [5] |
| 319 | `p0319-q0079` | Transversalis fascia | Restrict | Available direct sources establish the deep-ring relation but not the source's exact fascial-derivation statement. |
| 323 | `p0323-q0080` | L2-L4 | Restore | Obturator nerve arises from L2-L4 lumbar plexus roots. [6] |
| 327 | `p0327-q0081` | Third duodenum inferior to pancreas | Restrict | Reviewed sources establish the duodenal course and pancreatic C-loop relation but do not directly state this exact source-marked relation. |
| 331 | `p0331-q0082` | Superficial inguinal nodes | Restore | Scrotal skin drains to superficial inguinal nodes. [7] |
| 334 | `p0334-q0083` | Rib 11 | Restore | The superior left-kidney margin is usually at the level of rib 11; the right kidney lies lower. [8] |

## Guarded changes

The application runner will compare every pre-correction stem and option array to `anatomy-all-pdf-batch-08-ocr-records.json` and fail closed on any drift. Restorations receive source-linked learning aids, `status: "ocr_draft"`, `askable: true`, and the standard reviewed-draft warning. It cannot approve records or alter mock eligibility.

Pages 319 and 327 remain `needs_review`, non-askable, keyless, and without learning aids. Their warnings begin `Source page reviewed,` to record completed page inspection and advance the deterministic queue without implying medical validation.

## References

[1]: https://www.ncbi.nlm.nih.gov/books/NBK459288/ "NCBI Bookshelf: Gallbladder"
[2]: https://www.ncbi.nlm.nih.gov/books/NBK531465/ "NCBI Bookshelf: Bladder"
[3]: https://www.ncbi.nlm.nih.gov/books/NBK448078/ "NCBI Bookshelf: Esophageal Varices"
[4]: https://www.ncbi.nlm.nih.gov/books/NBK535418/ "NCBI Bookshelf: Psoas Major"
[5]: https://www.ncbi.nlm.nih.gov/books/NBK539732/ "NCBI Bookshelf: Physiology, Defecation"
[6]: https://www.ncbi.nlm.nih.gov/books/NBK551640/ "NCBI Bookshelf: Obturator Nerve"
[7]: https://www.ncbi.nlm.nih.gov/books/NBK557720/ "NCBI Bookshelf: Lymphatic Drainage"
[8]: https://www.ncbi.nlm.nih.gov/books/NBK459339/ "NCBI Bookshelf: Kidney Nerve Supply"
