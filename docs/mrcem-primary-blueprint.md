# MRCEM Primary Basic Sciences Blueprint

## Current official blueprint

The current MRCEM Primary is a 180-question, three-hour single-best-answer paper. RCEM’s published regulations set the following category totals: Anatomy 60, Physiology 60, Pharmacology 24, Microbiology 17, Pathology 9, and Evidence-based Medicine 10.[1] RCEM states that a new Basic Sciences Syllabus will apply from the 21 April 2027 examination; the updated syllabus retains these six disciplines.[2]

| Blueprint category | Official questions | Share of 180 |
|---|---:|---:|
| Anatomy | 60 | 33.3% |
| Physiology | 60 | 33.3% |
| Pharmacology | 24 | 13.3% |
| Microbiology | 17 | 9.4% |
| Evidence-based medicine | 10 | 5.6% |
| Pathology | 9 | 5.0% |

## Meridian balancing policy

Every approved question may receive one source-reviewed `primaryBlueprintCategory` from the six categories above. Mock construction targets the official mix when each category has sufficient approved questions. It never repeats a question, never draws from OCR drafts, and does not fabricate coverage. If any category lacks approved items, the app uses all available approved tagged questions and fills the remaining places from other available categories, reporting the shortfall as **bank-limited coverage**.

The four approved EBM pilot questions are tagged as **Evidence-based medicine**. Until reviewed questions from other Basic Sciences categories are imported, mock balance reporting will transparently show the missing category coverage.

## Compatibility check

A completed local mock created before blueprint coverage was added continued to render its summary after the update. New mock generation applies blueprint eligibility and reports the available categories before a new sitting begins.

The live setup currently shows four tagged Evidence-based Medicine questions against its official target of ten, and zero approved items in the other five blueprint categories. It therefore labels the next sitting as bank-limited rather than implying complete Primary coverage.

A new live sitting selected the four tagged EBM questions only, set the paced four-minute partial duration, and kept feedback concealed. The browser console showed no client-side errors.

## Sources

1. [RCEM, MRCEM Primary Regulations and Information Pack, November 2023](https://rcem.ac.uk/wp-content/uploads/2023/11/MRCEM_Primary_Regulations_and_Information_Pack.pdf)
2. [RCEM, New Basic Sciences Syllabus to Apply from 2027](https://rcem.ac.uk/college-news/new-basic-sciences-syllabus-to-apply-from-2027/)
