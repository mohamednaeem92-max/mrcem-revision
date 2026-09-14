# Local Question Audit Inventory

This inventory contains one ledger row per locally stored record. It is a **status and evidence inventory**, not a clinical content correction. OCR drafts remain unapproved even where their original source page and an authoritative external source support a correction.

| Measure | Count |
|---|---:|
| All local records | 4454 |
| Source-reviewed approved pilot | 4 |
| OCR drafts | 4450 |
| OCR drafts with a detected key | 1193 |
| Records without a detected key | 3257 |
| Records with an in-range answer index | 1197 |
| Records with source links | 4450 |
| Records with OCR artefact signals | 3610 |
| Records with high-yield notes | 676 |
| Records with mnemonics | 676 |

## Subject distribution

| Subject | Records |
|---|---:|
| Anatomy | 2408 |
| Evidence-based medicine | 137 |
| Microbiology | 291 |
| Pathology | 257 |
| Pharmacology | 503 |
| Physiology | 858 |

## Audit-state distribution

| Audit state | Records |
|---|---:|
| 0 | manual_source_review_required,3770 |
| 1 | needs_source_confirmation,10 |
| 2 | source_page_and_external_evidence_verified_ocr_draft,670 |
| 3 | source_reviewed,4 |

## Next audit gate

This inventory does not modify records. A future batch may correct an OCR draft only after comparison with its source-linked PDF page and a corroborating authoritative external source.
