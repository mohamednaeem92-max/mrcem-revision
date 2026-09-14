# High-Yield Notes and Mnemonics

## Data rules

High-yield notes and mnemonics are optional fields on an approved question record. They are shown only after answer feedback alongside the explanation and learning note.

| Field | Purpose | Import rule |
|---|---|---|
| `highYieldNote` | A concise examinable distinction, threshold, trap, or action point. | Optional for backward-compatible reviewed imports. |
| `mnemonic` | A short recall cue or phrase tied directly to the approved question. | Optional for backward-compatible reviewed imports. |

## Emoji mnemonic convention

For source-reviewed questions, a mnemonic may use one or two compact emojis when they reinforce the recall cue. Emojis support the wording; they never replace an explanation, introduce a new clinical claim, or appear as invented learning content on unreviewed OCR drafts.

## Safety rules

The built-in EBM pilot includes manually authored learning aids derived from its already verified source questions. Imported approved questions can include the fields directly in their JSON. If either field is absent, the app presents a neutral prompt to add it during the next source-review pass; it does not invent a note or mnemonic.

OCR draft questions remain separate from approved questions. Their extracted learning notes can appear as OCR content, but they do not receive an authoritative high-yield note or mnemonic until a reviewer confirms the record.

## Live verification

For the reviewed mean-and-outliers pilot item, the post-answer sequence displayed the correct option letter and wording, its explanation, learning note, high-yield note, and the authored cue: “📈 Mean moves with the extremes; ⚖️ median stays in the middle.” The learning-aid visibility control remained available.

## Example reviewed import record

```json
{
  "id": "example-question",
  "highYieldNote": "Use the median when skew or outliers make the mean misleading.",
  "mnemonic": "Median = middle after ordering."
}
```
