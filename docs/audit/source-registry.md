# Learning-Aid Source Registry

| Source | Subjects / use | Audit status | Rule |
|---|---|---|---|
| [RCEM MRCEM Exams](https://rcem.ac.uk/mrcem-exams/) | Curriculum scope and assessment framing | Reviewed | Use for scope only, not individual factual answer keys. |
| [RCEM Basic Sciences Curriculum](https://res.cloudinary.com/studio-republic/images/v1633506877/1.4.4_Basic_Sciences_Curriculum/1-4-4_Basic_Sciences_Curriculum-pdf?_i=AA) | Topic scope across the six MRCEM Primary subjects | Reviewed | Use to tag the scope of a question, not as sole factual validation. |
| [NCBI Bookshelf: Kidney Anatomy](https://www.ncbi.nlm.nih.gov/books/NBK482385/) | Anatomy and renal physiology fallback reference | Reviewed | Use only to corroborate a specific source-page-confirmed fact. |
| [BNF via NICE](https://bnf.nice.org.uk/) | Pharmacology reference | Access restricted | Do not scrape or mine. Use only where the user has lawful access or replace with an openly accessible regulatory product document. |
| [UKHSA specialist and reference microbiology services](https://www.gov.uk/guidance/specialist-and-reference-microbiology-laboratory-tests-and-services) | Microbiology, laboratory testing, and infection-control context | Reviewed | Use as an official UK public-health reference. Verify organism-specific claims against its linked guidance or another specific rank 1 to 3 source. |
| [Cochrane Handbook](https://www.cochrane.org/authors/handbooks-and-manuals/handbook) | EBM methods, study selection, risk of bias, statistical analysis, and interpretation | Reviewed | Use for EBM methodology statements; use an applicable chapter rather than the landing page for a specific claim. |
| [BMJ: Mean and standard deviation](https://www.bmj.com/about-bmj/resources-readers/publications/statistics-square-one/2-mean-and-standard-deviation) | Mean, median, and outliers | Reviewed text extraction | The page states that the mean is sensitive to outlying points while the median is unchanged by extreme values. Supports the first three EBM pilot learning aids. |
| [BMJ: Data display and summary](https://www.bmj.com/about-bmj/resources-readers/publications/statistics-square-one/1-data-display-and-summary) | Median calculation and ordered observations | Reviewed text extraction | The page explains that the median is identified from ordered observations and that, with 15 values, it is the eighth value. Supports the two reviewed median pilot items. |
| [BMJ: Correlation and regression](https://www.bmj.com/about-bmj/resources-readers/publications/statistics-square-one/11-correlation-and-regression) | Correlation coefficient interpretation | Reviewed text extraction | The page describes r as a measure of linear association from +1 through 0 to -1 and cautions that correlation is not causation. Supports the fourth EBM pilot learning aid. |

## Access finding

The BNF page states that the service blocks non-UK IP addresses and prohibits data scraping or data mining. The audit will therefore not automate BNF retrieval. For pharmacology facts, it will prioritise publicly accessible MHRA product information or other rank 1 to 3 sources described in the source hierarchy.
