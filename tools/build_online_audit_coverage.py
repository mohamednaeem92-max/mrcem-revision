"""Map existing online-evidence coverage onto the 105 bank-review batches.

Evidence tiers:
  external_finding  - id appears in anatomy-batch-NN-restorations.json
                      (fact + finding + rank 2-3 sourceUrl)
  memory_aid_source - bank record carries memoryAid.sourceUrl
  mechanical_audit  - id present in question/answer-key audit ledgers
                      (structural only, no online evidence)
  none              - no audit artifact found

Writes docs/audit/online-audit-coverage.json
"""
import json
import re
from collections import Counter
from datetime import datetime, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
AUDIT = ROOT / "docs" / "audit"
OUTPUT = AUDIT / "online-audit-coverage.json"


def load_json(path):
    with open(path, encoding="utf-8") as handle:
        return json.load(handle)


def main():
    queue_doc = load_json(AUDIT / "review-queue.json")
    bank = load_json(ROOT / "client/public/ocr-questions.json")
    questions = bank.get("questions", bank) if isinstance(bank, dict) else bank
    by_id = {q.get("id"): q for q in questions}

    external_ids = set()
    for path in AUDIT.glob("anatomy-batch-*-restorations.json"):
        for row in load_json(path):
            if row.get("id"):
                external_ids.add(row["id"])

    memory_aid_ids = {
        qid for qid, q in by_id.items()
        if isinstance(q.get("memoryAid"), dict) and q["memoryAid"].get("sourceUrl")
    }

    mechanical_ids = set()
    for name in ("question-audit-ledger.json", "answer-key-audit-ledger.json"):
        for row in load_json(AUDIT / name):
            if row.get("id") in by_id:
                mechanical_ids.add(row["id"])

    note_files = sorted(p.name for p in AUDIT.glob("*-research-notes.md"))
    note_id_hits = 0
    for name in note_files:
        text = (AUDIT / name).read_text(encoding="utf-8")
        note_id_hits += len(re.findall(r"`([^`]+)`", text))

    def tier(qid):
        if qid in external_ids:
            return "external_finding"
        if qid in memory_aid_ids:
            return "memory_aid_source"
        if qid in mechanical_ids:
            return "mechanical_audit"
        return "none"

    batches = []
    tier_total = Counter()
    for batch in queue_doc["batches"]:
        tiers = Counter(tier(qid) for qid in batch["ids"])
        tier_total.update(tiers)
        batches.append(
            {
                "id": batch["id"],
                "subject": batch["subject"],
                "positions": batch["positions"],
                "recordCount": batch["recordCount"],
                "tiers": dict(tiers),
                "uncovered": [qid for qid in batch["ids"] if tier(qid) == "none"],
            }
        )

    doc = {
        "generatedAt": datetime.now(timezone.utc).isoformat(),
        "total": queue_doc["total"],
        "tierTotals": dict(tier_total),
        "externalFindingCount": len(external_ids),
        "memoryAidSourceCount": len(memory_aid_ids),
        "mechanicalAuditCount": len(mechanical_ids),
        "researchNoteFiles": len(note_files),
        "researchNoteIdMentions": note_id_hits,
        "fullyUncoveredBatches": sum(1 for b in batches if b["tiers"].get("none", 0) == b["recordCount"]),
        "batches": batches,
    }
    OUTPUT.write_text(json.dumps(doc, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    print("tierTotals:", doc["tierTotals"])
    print("fullyUncoveredBatches:", doc["fullyUncoveredBatches"])
    print("researchNoteFiles:", doc["researchNoteFiles"])
    uncovered_by_subject = Counter()
    for b in batches:
        uncovered_by_subject[b["subject"]] += b["tiers"].get("none", 0)
    print("uncoveredBySubject:", dict(uncovered_by_subject))


if __name__ == "__main__":
    main()
