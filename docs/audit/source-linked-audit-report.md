# Source-Linked Question and Learning-Aid Audit

## Scope and result

The audit inspected **all 4,454 local question records**. It evaluated option-count and answer-letter integrity, source trace availability, high-yield note coverage, mnemonic coverage, and correction eligibility. The MRCEM Primary scope remains tied to the current RCEM Basic Sciences Curriculum for the October 2026 sitting, with a new syllabus due from April 2027.[1] [2]

| Audit outcome | Count | Handling |
|---|---:|---|
| Source-reviewed pilot records | 4 | Retained as approved. Each learning aid now has a direct external reference in the audit registry. |
| OCR draft records | 4,450 | Retained as unapproved OCR drafts. |
| Records with a mechanically in-range answer index | 886 | An index is not treated as a verified clinical answer without source-page review. |
| Records with no detected answer key | 3,568 | Kept unresolved. |
| Records with source-page trace | 4,454 | Trace information preserved in the audit ledgers. |
| Source-supported option/order restorations applied | 3 | Remain `ocr_draft`; no automatic approval or learning-aid generation. |
| New learning aids generated for OCR drafts | 0 | Blocked pending source-page validation. |

## Corrections applied

Three EBM OCR-draft records were corrected only after source-page review and external corroboration. All three retain their OCR-draft status and a warning stating that full content review remains required.

| Record | Source page | Change | Evidence gate |
|---|---:|---|---|
| `evidence-based-medicine-ebm-all-pdf-p0144-q0088` | 144 | Restored a missing option, corrected the answer to **E**, and removed OCR-contaminated option text. | Source page marked the fifth option correct; an NCBI-hosted review states case-control studies are suited to rare outcomes, while cohort studies are advantageous for rare exposures.[5] |
| `evidence-based-medicine-ebm-all-pdf-p0169-q0105` | 169 | Restored missing `4%` option and corrected the answer to **E (50%)**. | The source page marks the fifth option correct; the answer follows the displayed risks, 20/1000 divided by 40/1000. |
| `evidence-based-medicine-ebm-all-pdf-p0171-q0105` | 171 | Applied the same restoration to the duplicate capture of question 105. | Duplicate source-page capture of the same marked answer. |

## Learning-aid rule

The four approved EBM pilot learning aids remain source-linked. BMJ statistics material supports the mean/median and correlation claims: the mean is sensitive to outliers, the median is obtained from ordered observations, and correlation measures linear association without establishing causation.[3] [4] No high-yield note or mnemonic was written for the OCR drafts because external web evidence cannot prove that an OCR-transcribed stem, option order, or key exactly matches the original page.

> **Safety rule:** an OCR draft is not promoted, and no factual learning aid is generated, unless the source page and a suitable external reference both support the specific record.

## Audit files

| File | Purpose |
|---|---|
| `question-audit-ledger.json` | One source and evidence-status row per local record. |
| `answer-key-audit-ledger.json` | Mechanical option/index and answer-letter audit for every record. |
| `learning-aid-audit-ledger.json` | Learning-aid coverage and research eligibility for every record. |
| `ebm-source-marker-verification.json` | Read-only source-marker comparison for 133 EBM OCR pages. |
| `applied-source-verified-corrections.json` | Before/after values and evidence for the three applied corrections. |
| `source-hierarchy-and-rules.md` | Correction and non-hallucination policy. |

## References

[1]: [RCEM, MRCEM Exams](https://rcem.ac.uk/mrcem-exams/)
[2]: [RCEM, New Basic Sciences Syllabus to Apply from 2027](https://rcem.ac.uk/college-news/new-basic-sciences-syllabus-to-apply-from-2027/)
[3]: [BMJ, Statistics at Square One: Data display and summary](https://www.bmj.com/about-bmj/resources-readers/publications/statistics-square-one/1-data-display-and-summary)
[4]: [BMJ, Statistics at Square One: Mean and standard deviation](https://www.bmj.com/about-bmj/resources-readers/publications/statistics-square-one/2-mean-and-standard-deviation) and [Correlation and regression](https://www.bmj.com/about-bmj/resources-readers/publications/statistics-square-one/11-correlation-and-regression)
[5]: [Song JW, Chung KC. Observational Studies: Cohort and Case-Control Studies. *Plast Reconstr Surg*. 2010.](https://pmc.ncbi.nlm.nih.gov/articles/PMC2998589/)
