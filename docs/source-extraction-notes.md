# Source Extraction Notes

## Pilot source

The publicly shared `EBM-All.pdf` was downloaded as a pilot. It is a 197-page, unencrypted A4 PDF. Standard text extraction returned almost no content, confirming that it consists chiefly of page screenshots rather than embedded text.

## Confirmed page pattern

Visual inspection and a pilot OCR pass show a recurring sequence of screenshot pages from the user-provided revision material:

| Page type | Extractable elements | Intended offline app field |
| --- | --- | --- |
| Question page | Question number, stem, five answer options, a visible correct option, visible selected option, answer/explanation text | Question record with choices, correct-answer index, explanation |
| Reference page | Topic title, subject/subtopic label, detailed learning note | Topic note linked to a question sequence |

The pilot question pages show a single-best-answer format. They include the explanation on the same page after the answer options, which supports the requested immediate-feedback workflow.

## Extraction approach

The importer will render scanned PDF pages, use local OCR, identify question pages by the `QUESTION` marker, and retain source page references for review. OCR output will need human verification for questions containing tables, images, ECGs, equations, special symbols, or poorly captured answer choices. The application must provide an import-review view rather than treat raw OCR as inherently accurate.

## Scope constraint

The six merged PDFs total roughly 1.7 GB and the subject folders contain smaller, partly duplicated source files. The first delivery will therefore include the full offline app mechanics, an import-ready schema, and a validated EBM pilot dataset. Complete collection import should run subject by subject, retain an audit record, and be verified before relying on it for examination study.
