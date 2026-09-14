# Anatomy Batch 10 Correction Plan

## Decision standard

Original source screenshots establish question wording, option order, and the marked answer. External sources must directly corroborate each anatomy key before a source-linked learning aid is added. Every restored record retains `status: "ocr_draft"`, remains explicitly unapproved, and is excluded from mock construction. No record may be automatically approved.

| Page | Record | Source-marked answer | Decision | Evidence basis |
|---:|---|---|---|---|
| 377 | `p0377-q0095` | Umbilical region | Restore | Midgut pain refers to the umbilicus. [1] |
| 380 | `p0380-q0096` | Anterior rami L1-L3 | Restore | Lumbar-plexus branches L1-L3 innervate psoas major. [2] |
| 384 | `p0384-q0097` | L5 | Restore | Common iliac veins unite to form the IVC at L5. [3] |
| 388 | `p0388-q0098` | Pelvic splanchnic nerves | Restore | Pelvic splanchnic nerves carry rectal visceral afferents. [4] |
| 393 | `p0393-q0099` | Uterine artery | Restore | Uterine artery passes anterior to the distal ureter. [5] |
| 396 | `p0396-q0100` | Abdominal aorta | Restore | Ovarian artery is a direct abdominal-aortic branch. [5] |
| 399 | `p0399-q0101` | Ureter crosses common iliac vessels | Restore | Ureter crosses the common-iliac bifurcation at the pelvic brim. [6] |
| 400 | `p0400-q0102` | Superior mesenteric artery | Restore | Uncinate process lies dorsal to the SMA and hooks posteriorly to superior mesenteric vessels. [7] |
| 405 | `p0405-q0103` | Ribs 9-11 | Restore | Spleen typically spans ribs 9-11. [8] |
| 409 | `p0409-q0104` | Common bile duct | Restore | Bile duct lies in a groove on the pancreatic head's posterosuperior surface. [9] |

## Guarded changes

The application runner will check `sourcePage`, immutable pre-correction stem, and immutable pre-correction options from `anatomy-all-pdf-batch-10-ocr-records.json`. Any drift will abort the update. Each restoration will use literal source-clean wording, an externally supported explanation, a source-linked high-yield note, mnemonic, and one to three emoji cues.

The runner will set only `status: "ocr_draft"`, `askable: true`, and `Source page and external anatomy reference reviewed; remains an unapproved OCR draft.` for the ten reviewed records. It cannot create an approved record, alter mock-eligibility rules, or classify these OCR drafts as mock eligible. The triage utility was attempted with a 120-second bound and timed out; its lack of output is documented and does not replace the completed evidence review.

## References

[1]: https://www.ncbi.nlm.nih.gov/books/NBK553104/ "NCBI Bookshelf: Anatomy, Abdomen and Pelvis: Abdomen"
[2]: https://www.ncbi.nlm.nih.gov/books/NBK531508/ "NCBI Bookshelf: Anatomy, Bony Pelvis and Lower Limb: Iliopsoas Muscle"
[3]: https://www.ncbi.nlm.nih.gov/books/NBK482353/ "NCBI Bookshelf: Anatomy, Abdomen and Pelvis: Inferior Vena Cava"
[4]: https://www.ncbi.nlm.nih.gov/books/NBK560504/ "NCBI Bookshelf: Anatomy, Abdomen and Pelvis, Splanchnic Nerves"
[5]: https://www.ncbi.nlm.nih.gov/books/NBK482267/ "NCBI Bookshelf: Anatomy, Abdomen and Pelvis: Uterine Arteries"
[6]: https://www.ncbi.nlm.nih.gov/books/NBK532980/ "NCBI Bookshelf: Anatomy, Abdomen and Pelvis Ureter"
[7]: https://pmc.ncbi.nlm.nih.gov/articles/PMC7522846/ "Zhu et al.: Novel morphological classification of the normal pancreatic uncinate process based on computed tomography"
[8]: https://www.ncbi.nlm.nih.gov/books/NBK482235/ "NCBI Bookshelf: Anatomy, Abdomen and Pelvis, Spleen"
[9]: https://www.ncbi.nlm.nih.gov/books/NBK532912/ "NCBI Bookshelf: Anatomy, Abdomen and Pelvis, Pancreas"
