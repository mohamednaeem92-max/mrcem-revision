# Full Answer-Key Consistency Audit

This report assesses **every local record** for mechanical answer-letter display and OCR-integrity risks. It does not treat an OCR-detected index as clinically verified and does not alter content.

| Measure | Count |
|---|---:|
| Total records audited | 4454 |
| Approved pilot records | 4 |
| OCR draft records | 4450 |
| Records with in-range answer index | 1197 |
| Records with no detected answer key | 3257 |
| Records with option/order integrity flags | 4347 |
| Records with source-page trace | 4454 |
| Automatically corrected records | 0 |

## Mechanical states

| State | Records |
|---|---:|
| source_confirmation_required | 103 |
| source_page_required | 4347 |
| source_reviewed | 4 |

## Rule applied

The interface derives answer letters from the stored zero-based index, so a correct option at index 0 renders as A, index 1 as B, and so on. A valid index only establishes a mechanically coherent letter; it does not prove the key is factually correct. Records with OCR artefacts, missing keys, invalid keys, duplicated options, or source warnings remain blocked from automatic correction.

No answer key or option text was automatically changed.
