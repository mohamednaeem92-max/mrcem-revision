# Approved Question Spaced-Repetition Model

## Scope

Scheduling applies only to **approved questions** in the verified bank: the built-in EBM pilot and any reviewed question JSON imported through the source library. OCR drafts remain excluded because their answer keys and explanations have not been confirmed.

## Local review record

Each approved question can store this optional local schedule record alongside existing attempts and bookmarks.

| Field | Meaning |
|---|---|
| `dueDate` | Local calendar date on which the question returns to the review queue. |
| `intervalDays` | Current successful interval in days. |
| `ease` | Multiplicative interval factor, constrained between 1.3 and 3.0. |
| `repetitions` | Consecutive successful reviews. |
| `lapses` | Number of `Again` ratings. |
| `lastRating` | Most recent self-rating: `again`, `hard`, `good`, or `easy`. |
| `lastReviewed` | Timestamp of the most recent scheduled review. |

## Rating rules

After submitting an answer in a scheduled review, select a recall rating. The result is local and can be adjusted independently of the answer result.

| Rating | First review | Later review | Ease change |
|---|---:|---:|---:|
| Again | Today | Today | −0.20 |
| Hard | 1 day | Current interval × 1.2 | −0.15 |
| Good | 1 day, then 3 days | Current interval × ease | No change |
| Easy | 4 days | Current interval × ease × 1.3 | +0.15 |

Incorrect answers visually recommend **Again**; correct answers recommend **Good**. The learner retains the final rating choice.

## Daily queue

The daily review queue uses all approved questions due today or earlier, then adds up to **20 unscheduled new questions**. Due items are ordered by oldest due date, then lowest ease, so frequently lapsed questions return earlier. A review session is created from this queue and does not include OCR drafts.

## Backup and migration

Progress storage moves from version 1 to version 2. Existing attempts, bookmarks, and activity dates remain unchanged; questions without a schedule are treated as new. The backup importer accepts version 1 and version 2 files, normalises them to version 2, and exports the new schedule fields in the same local JSON backup.
