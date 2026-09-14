# Revision-interface integration and eligibility

## Eligibility rule

Meridian Revision has one active-study boundary. A record may enter **revision**, **spaced repetition**, **incorrect-answer review**, **high-yield recall**, or a **Primary mock** only when it is a verified question record with no unresolved review markers.

The runtime predicate is `isRevisionEligible` in `client/src/lib/questionEligibility.ts`. It accepts the trusted bundled pilot records and records emitted by the reviewed-import pipeline with `needsReview: false`. It rejects any record with `needsReview`, `isOcrDraft`, `ocrStatus`, or `needsImage` set.

Mock exams add one further requirement: an eligible record must carry a valid `primaryBlueprintCategory`. This prevents an otherwise complete question from being used in a blueprint-balanced sitting without source-reviewed classification.

| Record state | Active revision | Spaced repetition | High-yield recall | Primary mock |
|---|---:|---:|---:|---:|
| Bundled verified pilot | Yes | Yes | If aid is complete | If blueprint-tagged |
| Reviewed import with `needsReview: false` | Yes | Yes | If aid is complete | If blueprint-tagged |
| OCR draft with detected answer key | No | No | No | No |
| OCR draft with missing key, text warning, or visual dependency | No | No | No | No |

## Current catalogue state

The bundled source catalogue currently contains **4,450 OCR draft records** across **42 sections**. Of these, **878 have a detected answer key**, **3,481 remain in a needs-review state**, and **109 carry a visual dependency**. A detected key is an extraction signal, not approval.

The active verified bank contains the four manually reviewed EBM pilot questions until a reviewed JSON import is added. Imported records are merged with the pilot in IndexedDB and are filtered through the same predicate before entering application state.

## Interface behavior

The **Revise** view, daily queue, incorrect-answer review, and recall-aid session consume only the filtered verified bank. The **Source library** displays OCR counts, detected-key counts, text-review counts, and visual dependencies as audit metadata. It no longer opens OCR records as answerable practice questions.

After a verified question is answered, the interface shows the correct option, explanation, learning note, optional source-supported learning aids, and page-level source trace. Progress and scheduling remain local to the browser.

## Import safeguard

The extractor’s `prepare-import` command remains the approval gate. It requires `reviewStatus: "approved"`, complete question fields, a valid answer index, tags, and Primary blueprint metadata before writing `approved-questions.json`. Meridian then validates the serialized record again and rejects any imported record that carries a draft marker.

The halted Anatomy audit remains separate from this integration. Later Anatomy batches are not treated as verified, and their OCR records cannot enter active study until the source-review workflow produces an approved import.
