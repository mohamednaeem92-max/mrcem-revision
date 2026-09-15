# Review Batch 001 Triage Note

Date: 2026-09-15. Batch: `review-batch-001` (positions 1-50, Anatomy).

## Finding

49 of 50 records are `anatomy-markdown-p0001-qXXXX` raw markdown dumps:
2-4 garbled options, `correctOption: null`, `askable: false`, stems containing
answer text and percentage annotations (e.g. `Oo) L2-L4 72% ... ANSWER ...`).
They are not auditable against online sources: there is no valid key or
option set to verify, and per `source-hierarchy-and-rules.md` rule 4 they
must remain unresolved, not guessed.

The single valid record is `anatomy-anatomy-all-pdf-p0001-q0001`
(femoral nerve L2-L4, askable, key A).

## Disposition

- The 49 markdown records need source-page re-extraction (or exclusion from
  the askable bank), not online audit. Recommend excluding `*-markdown-*`
  IDs from online-audit batches and queuing them for the extractor workflow
  (`docs/ocr-review-workflow.md`).
- Pilot online audit therefore ran on `review-batch-018` (50/50 valid,
  positions 851-900); see `review-batch-018-online-evidence.*`.
