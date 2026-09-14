# Anatomy Batch 16 Correction Plan

## Scope

This plan applies only to the ten records in `anatomy-all-pdf-batch-16-ocr-records.json`. The implementation must reject any drift in record ID, source page, pre-correction stem, or pre-correction option array.

## Decisions

| Record | Source-clean result | State after application | Learning-aid basis |
|---|---|---|---|
| `p0556-q0156` | Five original options; key 4, Pancreas | `ocr_draft`, askable | Right renal anterior relations, [NCBI Kidney Anatomy](https://www.ncbi.nlm.nih.gov/books/NBK482385/) |
| `p0557-q0157` | Five source options; no trusted learning key | `needs_review`, not askable | No aid: exact pubic-tubercle level lacks direct corroboration |
| `p0558-q0158` | T8, T9, T10, T11, T12; key 2 | `ocr_draft`, askable | Oesophageal hiatus at T10, [NCBI Diaphragm Anatomy](https://www.ncbi.nlm.nih.gov/books/NBK519558/) |
| `p0561-q0159` | Five source options; key 1, Transversalis fascia | `ocr_draft`, askable | Direct hernia through posterior wall, [Medscape Inguinal Region Anatomy](https://emedicine.medscape.com/article/2075362-overview) |
| `p0563-q0160` | Five source options; key 3, Pudendal nerve | `ocr_draft`, askable | Cord contents exclude pudendal nerve, [NCBI Inguinal Canal](https://www.ncbi.nlm.nih.gov/books/NBK470204/) |
| `p0566-q0161` | Five source options; key 2, Third part of duodenum | `ocr_draft`, askable | Aortomesenteric compression of D3, [NCBI SMA Syndrome](https://www.ncbi.nlm.nih.gov/books/NBK482209/) |
| `p0567-q0162` | T6, T8, T10, T12, L1; key 1 | `ocr_draft`, askable | Caval opening at T8, [NCBI Diaphragm Anatomy](https://www.ncbi.nlm.nih.gov/books/NBK519558/) |
| `p0571-q0163` | Five source options; key 1, Portal vein | `ocr_draft`, askable | Portal vein behind pancreatic neck, [Medscape Pancreas Anatomy](https://emedicine.medscape.com/article/1948885-overview) |
| `p0572-q0164` | Five source options; key 4, Inferior epigastric artery | `ocr_draft`, askable | Cord-content exclusion, [Medscape Inguinal Region Anatomy](https://emedicine.medscape.com/article/2075362-overview) |
| `p0573-q0165` | Five source options; key 4, Anterior rami T12-L4 | `ocr_draft`, askable | QL innervation T12-L4, [TeachMeAnatomy Quadratus Lumborum](https://teachmeanatomy.info/encyclopaedia/q/quadratus-lumborum/) |

## Non-negotiable safeguards

1. Every restored record retains `status: 'ocr_draft'`, the exact standard source-review warning, `automaticApproval: false` in the audit artifact, and mock exclusion.
2. Restored aids must have a nonempty high-yield note, mnemonic, HTTPS source URL, complete structured memory aid, and one to three nonempty emoji cues.
3. The restricted ureteric-landmark record must have `status: 'needs_review'`, `askable: false`, `correctOption: null`, no learning note, no mnemonic, no memory aid, and a warning beginning exactly `Source page reviewed,`.
4. The runner must write before/after snapshots, source-page evidence, external evidence, and an explicit mock-ineligibility note to `docs/audit/applied-anatomy-batch-16.json`.
