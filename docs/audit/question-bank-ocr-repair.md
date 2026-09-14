# Question-bank OCR repair (2026-09-15)

The Excel workbook is the same smashed OCR as `ocr-questions.json`, not a clean A–E source. Repair used source checkmarks (`(Vv)` / `Vv`), concatenated-option splits, and conservative key preservation.

## Headline counts (5,233 records)

| | Before | After |
|---|---:|---:|
| Detected keys | 1,193 | 2,622 |
| Five-option items | 862 | 2,170 |
| Four-option items | 1,009 | 1,775 |
| Askable / scorable | — | 2,621 |
| `(Vv)` / `(x)` left in options | 3,262 / 1,389 | 0 |
| Keys lost by repair | — | 0 |

Keys were taken only from:

1. Source checkmark (`Vv`) after splitting smashed options (1,428)
2. A previous key whose cleaned option text still exists exactly (412)
3. Hepatitis A zero-percent special case, confirmed against CDC (1)

Explanations were **not** used to guess keys. They often name distractors.

Ungraded items stay ungraded: no invented fifth option, no auto-mark.

## Hepatitis A (the reported miss)

Stem: *About what percentage of patients with hepatitis A develop chronic infection*

- Before: options `5% / 10% / 10–20%`, no key; `0)` had leaked into the stem
- After: `0% / 5% / 10% / 10–20%`, key **0%**
- CDC: HAV is acute only and does not become chronic. A minority have prolonged or relapsing disease for up to 6 months, but there is no chronic carrier state.

## Other reconstructed items checked against references

| Item | Reconstructed key | Check |
|---|---|---|
| Parotid secretomotor | Auriculotemporal nerve | TeachMeAnatomy / Wikipedia |
| Superficial temporal artery | External carotid artery | Elsevier / IMAIOS |
| Tetanus booster mechanism | Neutralise the protein exotoxin | Tetanus toxoid / TIG |
| Orbicularis oculi | Closure of the eyelids | TeachMeAnatomy |
| Adult HbA fraction | 96–98% | Preserved source key; matches adult HbA share |
| *C. difficile* commensal | Normally found in gut flora | Preserved source key |
| Femoral nerve roots | L2–L4 | Unchanged clean item |

Handlebar-trauma items whose options omit liver/spleen remain **ungraded**.

## What was not done

- No distractors invented to force five options
- Timed mocks still fail-closed (complete key + blueprint, no OCR draft)
- Remaining ~2,600 records have no reliable checkmark or previous key after reconstruction
