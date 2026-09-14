# Anatomy Batch 17 Correction Plan

## Scope

This plan applies only to the ten records in `anatomy-all-pdf-batch-17-ocr-records.json`. The implementation must reject any drift in record ID, source page, pre-correction stem, or pre-correction option array.

## Decisions

| Record | Source-clean result | State after application | Learning-aid basis |
|---|---|---|---|
| `p0574-q0166` | Five source options; key withheld because afferent-specific external evidence extends to T6–L2 | `needs_review`, not askable | No aid: exact source-key range is not externally corroborated |
| `p0575-q0167` | Five source options; key 3, ischial spine to sacrum and coccyx | `ocr_draft`, askable | Sacrospinous attachment, [NCBI Pelvic Ligaments](https://www.ncbi.nlm.nih.gov/sites/books/NBK493215/) |
| `p0579-q0169` | Five source options; key 2, posterior to stomach and liver | `ocr_draft`, askable | Lesser sac behind stomach, [NCBI Foramen of Winslow](https://www.ncbi.nlm.nih.gov/books/NBK482186/) |
| `p0580-q0170` | Five source options; key 2, right and left common iliac arteries | `ocr_draft`, askable | Aortic bifurcation, [NCBI Aorta](https://www.ncbi.nlm.nih.gov/books/NBK537319/) |
| `p0581-q0171` | Five source options; key 3, upper anterior thigh | `ocr_draft`, askable | Femoral genitofemoral territory, [NCBI Genitofemoral Nerve](https://www.ncbi.nlm.nih.gov/books/NBK430733/) |
| `p0582-q0172` | Five source options; key withheld because authoritative NCBI references conflict | `needs_review`, not askable | No aid: source-key formulation is externally unresolved |
| `p0583-q0173` | Five source options; key 1, internal oblique and transversus abdominis | `ocr_draft`, askable | Iliohypogastric motor supply, [NCBI Posterior Abdominal Wall Nerves](https://www.ncbi.nlm.nih.gov/books/NBK557605/) |
| `p0584-q0174` | Five source options; key 3, rectus aponeurosis forms inguinal ligament | `ocr_draft`, askable | Inguinal ligament arises from external oblique, [NCBI Inguinal Region](https://www.ncbi.nlm.nih.gov/sites/books/NBK470204/) |
| `p0585-q0175` | Five source options; key 2, anal canal | `ocr_draft`, askable | Below-pectinate anal canal drains to superficial inguinal nodes, [NCBI Inguinal Lymph Node](https://www.ncbi.nlm.nih.gov/books/NBK557639/) |
| `p0586-q0176` | Five source options; key 2, vestibule between labia minora | `ocr_draft`, askable | Female urethral opening is in vestibule, [NCBI Female External Genitalia](https://www.ncbi.nlm.nih.gov/books/NBK547703/) |

## Non-negotiable safeguards

1. Every restored record retains `status: 'ocr_draft'`, the exact standard source-review warning, `automaticApproval: false` in the audit artifact, and mock exclusion.
2. Restored aids must have a nonempty high-yield note, mnemonic, HTTPS source URL, complete structured memory aid, and one to three nonempty emoji cues.
3. Both restricted records must have `status: 'needs_review'`, `askable: false`, `correctOption: null`, no learning note, no mnemonic, no memory aid, and a warning beginning exactly `Source page reviewed,`.
4. The runner must write before and after snapshots, source-page evidence, external evidence, and an explicit mock-ineligibility note to `docs/audit/applied-anatomy-batch-17.json`.
