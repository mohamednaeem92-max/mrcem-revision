"""Build the deterministic bank-review queue for solo full sign-off.

Reads client/public/ocr-questions.json (UTF-8) and writes
docs/audit/review-queue.json with subject-by-subject ordering:
subject rank (Anatomy first) -> sourcePage -> sourceQuestionNumber -> id.

Also prints reconciled counts (status / askable / subject) so the
hardcoded manifest constants in ocrDraftSections.ts can be checked.
"""
import json
from collections import Counter
from datetime import datetime, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
BANK_PATH = ROOT / "client" / "public" / "ocr-questions.json"
OUTPUT_PATH = ROOT / "docs" / "audit" / "review-queue.json"

SUBJECT_ORDER = [
    "Anatomy",
    "Physiology",
    "Pharmacology",
    "Microbiology",
    "Pathology",
    "Evidence-based medicine",
]
SUBJECT_RANK = {name: rank for rank, name in enumerate(SUBJECT_ORDER)}
BATCH_SIZE = 50


def main() -> None:
    with open(BANK_PATH, encoding="utf-8") as handle:
        payload = json.load(handle)
    questions = payload.get("questions", payload) if isinstance(payload, dict) else payload

    def sort_key(item):
        return (
            SUBJECT_RANK.get(item.get("subject"), 99),
            item.get("sourcePage") or 0,
            item.get("sourceQuestionNumber") or 0,
            item.get("id") or "",
        )

    ordered = sorted(questions, key=sort_key)
    by_id = {item.get("id"): item for item in questions}

    queue = [
        {
            "position": position,
            "id": item.get("id"),
            "subject": item.get("subject"),
            "topic": item.get("topic"),
            "status": item.get("status"),
            "askable": bool(item.get("askable")),
            "needsImage": bool(item.get("needsImage")),
            "sourcePage": item.get("sourcePage"),
            "sourceQuestionNumber": item.get("sourceQuestionNumber"),
            "warningCount": len(item.get("warnings") or []),
        }
        for position, item in enumerate(ordered, start=1)
    ]

    batches = []
    for start in range(0, len(queue), BATCH_SIZE):
        chunk = queue[start : start + BATCH_SIZE]
        batches.append(
            {
                "id": f"review-batch-{len(batches) + 1:03d}",
                "subject": chunk[0]["subject"],
                "subjects": sorted({row["subject"] for row in chunk}),
                "positions": [chunk[0]["position"], chunk[-1]["position"]],
                "recordCount": len(chunk),
                "ids": [row["id"] for row in chunk],
            }
        )

    document = {
        "generatedAt": datetime.now(timezone.utc).isoformat(),
        "source": "client/public/ocr-questions.json",
        "batchSize": BATCH_SIZE,
        "total": len(queue),
        "subjectOrder": SUBJECT_ORDER,
        "subjectCounts": dict(Counter(row["subject"] for row in queue)),
        "statusCounts": dict(Counter(row["status"] for row in queue)),
        "askableCount": sum(1 for row in queue if row["askable"]),
        "needsImageCount": sum(1 for row in queue if row["needsImage"]),
        "batchCount": len(batches),
        "batches": batches,
        "queue": queue,
    }
    OUTPUT_PATH.parent.mkdir(parents=True, exist_ok=True)
    with open(OUTPUT_PATH, "w", encoding="utf-8") as handle:
        json.dump(document, handle, indent=2, ensure_ascii=False)
        handle.write("\n")

    missing = [row["id"] for row in queue if row["id"] not in by_id]
    print(f"total={len(queue)} batches={len(batches)} output={OUTPUT_PATH.relative_to(ROOT)}")
    print(f"subjects={document['subjectCounts']}")
    print(f"status={document['statusCounts']} askable={document['askableCount']} needsImage={document['needsImageCount']}")
    if missing:
        raise SystemExit(f"queue integrity failure, missing ids: {missing[:5]}")


if __name__ == "__main__":
    main()
