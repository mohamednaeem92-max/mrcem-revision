"""Assertions for Primary blueprint metadata in the reviewed-import workflow."""
import json
from argparse import Namespace
from pathlib import Path
from tempfile import TemporaryDirectory

from extract_mrcem_pdf import app_record, build_review_html, prepare_import_command, quality_report, validate_record


def approved_record() -> dict:
    return {
        "reviewStatus": "approved",
        "id": "anatomy-p0001",
        "source": "Anatomy-All.pdf",
        "sourcePage": 1,
        "subject": "Anatomy",
        "topic": "Peripheral nerves",
        "primaryBlueprintCategory": "Anatomy",
        "primaryBlueprintSubcategory": "Peripheral nerves",
        "stem": "The femoral nerve is formed from which roots?",
        "options": ["L2-L4", "L5-S1"],
        "correctOption": 0,
        "explanation": "The femoral nerve forms from L2-L4.",
        "learningNote": "Femoral roots are L2-L4.",
        "tags": ["femoral nerve", "roots"],
    }


record = approved_record()
record["highYieldNote"] = "Femoral roots are L2-L4."
record["mnemonic"] = "Count two, three, four."
record["memoryAid"] = {
    "coreFact": "Femoral nerve roots are L2-L4.",
    "mnemonic": "Count two, three, four.",
    "emojiCues": ["🦵", "2️⃣3️⃣4️⃣"],
    "cueLabel": "Leg and roots cue.",
    "sourceLabel": "NCBI Bookshelf: Femoral Nerve",
    "sourceUrl": "https://www.ncbi.nlm.nih.gov/books/NBK556065/",
}
assert validate_record(record) == []
review_html = build_review_html([record], "Blueprint review test")
assert "Primary blueprint category" in review_html
assert "Primary blueprint subcategory" in review_html
assert "Evidence-based medicine" in review_html
exported = app_record(record)
assert exported["primaryBlueprintCategory"] == "Anatomy"
assert exported["primaryBlueprintSubcategory"] == "Peripheral nerves"
assert exported["needsReview"] is False
assert exported["memoryAid"]["emojiCues"] == ["🦵", "2️⃣3️⃣4️⃣"]

invalid_category = approved_record()
invalid_category["primaryBlueprintCategory"] = "Emergency medicine"
assert "Primary blueprint category must be one of the six MRCEM Primary categories." in validate_record(invalid_category)

missing_subcategory = approved_record()
missing_subcategory["primaryBlueprintSubcategory"] = ""
assert "Missing primary blueprint subcategory." in validate_record(missing_subcategory)

report = quality_report([record])
assert report["approvedWithBlueprintMetadata"] == 1
assert report["approvedBlueprintCategoryCounts"] == {"Anatomy": 1}

with TemporaryDirectory() as directory:
    root = Path(directory)
    review_file = root / "records.reviewed.json"
    output_dir = root / "preflight"
    review_file.write_text(json.dumps([record]), encoding="utf-8")
    prepare_import_command(Namespace(review_file=review_file, output_dir=output_dir))
    generated = json.loads((output_dir / "approved-questions.json").read_text(encoding="utf-8"))
    import_report = json.loads((output_dir / "import-report.json").read_text(encoding="utf-8"))
    assert generated[0]["primaryBlueprintCategory"] == "Anatomy"
    assert generated[0]["primaryBlueprintSubcategory"] == "Peripheral nerves"
    assert generated[0]["highYieldNote"] == "Femoral roots are L2-L4."
    assert generated[0]["memoryAid"]["sourceUrl"] == "https://www.ncbi.nlm.nih.gov/books/NBK556065/"
    assert import_report["approvedRecords"] == 1
    assert import_report["rejectedRecords"] == 0

print("reviewed-import blueprint metadata assertions passed")
