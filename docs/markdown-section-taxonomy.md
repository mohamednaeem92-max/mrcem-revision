# Markdown Question Section Taxonomy

## Canonical input policy

The six root `folder__*-All.md` files are the canonical source set for the first app bank. The nested Anatomy and Physiology files remain available as source evidence and topic references, but are not merged into the canonical app bank because they overlap substantially with the merged files.

| Subject | Canonical file | Section rule |
|---|---|---|
| Anatomy | `folder__Anatomy-All.md` | Use the first heading component after Anatomy, such as Abdomen, Thorax, or Lower Limb; otherwise use Anatomy · General. |
| Physiology | `folder__Physiology-All.md` | Use the first heading component after Physiology, such as Cardiovascular or Endocrine; otherwise use Physiology · General. |
| Evidence-based medicine | `folder__EBM-All.md` | Use Evidence-based medicine · General unless a page heading provides a more specific topic. |
| Microbiology | `folder__Microbiology-All.md` | Use Microbiology · General unless a page heading provides a more specific topic. |
| Pathology | `folder__Pathology-All.md` | Use Pathology · General unless a page heading provides a more specific topic. |
| Pharmacology | `folder__Pharmacology-All.md` | Use Pharmacology · General unless a page heading provides a more specific topic. |

## Conversion policy

Each `## Page N` block containing `QUESTION N` becomes one **OCR draft question**. The converter retains the exact source Markdown filename, source page, raw page OCR, question number, detected options, detected correct option where marked with `(v)`, and explanation text after the `ANSWER` marker.

| Outcome | Rule | App state |
|---|---|---|
| Ready for review | Stem, at least two options, and a marked answer are detected. | `ocr_draft` |
| Incomplete OCR draft | Stem, answer options, or marked answer is missing or suspicious. | `needs_review` |
| Visual-dependent draft | The page text contains an image, figure, diagram, table, radiograph, ECG, or similar marker. | `needs_image` |

No OCR draft is converted to an approved question or given an invented answer. The browser app will display these as **OCR draft sections** and will keep them separate from approved imported questions until a reviewer confirms the record.

## Output layout

```text
question-sections/
  manifest.json                 Counts by subject and topic
  draft-bank.json               Complete canonical OCR draft bank
  sections/<subject>/<topic>.json  One topic section per file
  conversion-report.json        Parsing and review-status statistics
```
