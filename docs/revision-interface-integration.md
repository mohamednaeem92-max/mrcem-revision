# Revision-interface integration and eligibility

## Eligibility rule

Meridian Revision now has two boundaries.

**Private revision** accepts any structurally complete source record: stem, two or more options, subject, topic, and a source page. OCR drafts and unresolved-review markers remain visible, but they do not block local study.

**Timed Primary mocks** stay fail-closed. A record may enter a mock only when it is keyed, blueprint-tagged, and free of OCR, review, and image-dependency markers.

The runtime predicates live in `client/src/lib/questionEligibility.ts`. Study-session filters (keyed vs ungraded, subject, topic, search) live in `client/src/lib/studySession.ts`.

| Record state | Active revision | Spaced repetition | High-yield recall | Primary mock |
|---|---:|---:|---:|---:|
| Bundled verified pilot | Yes | Yes | If aid is complete | If blueprint-tagged |
| Reviewed import with `needsReview: false` | Yes | Yes | If aid is complete | If blueprint-tagged |
| OCR draft with detected answer key | Yes, scored | Yes | If aid is complete | No |
| OCR draft with missing key | Yes, ungraded | No | If aid is complete | No |

Ungraded records can be opened and used as reading prompts. They never increment scored attempts and never enter the missed queue.

## Current catalogue state

The bundled source catalogue contains thousands of OCR records across Anatomy, Physiology, Pharmacology, Microbiology, Pathology, and Evidence-based medicine. About 1,190 currently carry a detected answer key and can be marked. The rest remain available as ungraded source records.

The four manually reviewed EBM pilot questions remain in the verified mock-eligible bank until further reviewed JSON is imported.

## Interface behavior

The **Study desk** opens subject folders and topic chips directly into revision. **Revise** defaults to keyed items, with All records and Ungraded lanes available. **Quick 20** shuffles a short keyed set. Daily review and incorrect-answer review use keyed items only. Timed mocks continue to exclude OCR drafts.
