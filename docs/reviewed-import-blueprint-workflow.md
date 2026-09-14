# Reviewed-Import Blueprint Workflow

The local OCR review page now captures the metadata required for a source-reviewed record to be eligible for a blueprint-balanced MRCEM Primary mock exam.

## Review-page fields

When a source page confirms the stem, options, and marked answer, select one Primary blueprint category and write a concise subcategory. The allowed category values are:

| Valid value | Example subcategory |
|---|---|
| `Anatomy` | Peripheral nerves |
| `Physiology` | Renal physiology |
| `Pharmacology` | Autonomic pharmacology |
| `Microbiology` | Antimicrobials |
| `Pathology` | Inflammation |
| `Evidence-based medicine` | Statistics |

The subcategory is a locally consistent curriculum label. It must not alter the question wording or replace source-page verification.

## Pre-import commands

```bash
cd /home/ubuntu/mrcem-offline-revision

# Review state, OCR warnings, and blueprint-metadata coverage.
python3 tools/extract_mrcem_pdf.py report \
  /path/to/records.reviewed.json \
  --output /path/to/preflight/review-status.json

# Reject approved records missing valid blueprint metadata and create the browser-import JSON.
python3 tools/extract_mrcem_pdf.py prepare-import \
  /path/to/records.reviewed.json \
  --output-dir /path/to/preflight

# Confirm that no approved record was rejected.
cat /path/to/preflight/import-report.json
```

Only import `/path/to/preflight/approved-questions.json` through **Source library → Import reviewed JSON** when `rejectedRecords` is `0` and the expected reviewed questions appear in `approvedRecords`.

> The generator retains `primaryBlueprintCategory` and `primaryBlueprintSubcategory` in each approved record. The browser stores imported questions locally; retain the reviewed JSON and generated approved JSON outside the browser as your reusable source-controlled bank.
