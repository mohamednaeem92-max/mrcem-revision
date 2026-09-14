"""Structured, non-mutating OCR audit triage for one exported source-page batch.

The model is used only to flag possible issues and research queries. It cannot
approve a record, infer an answer, or modify the bank. Source-page and external
evidence gates remain mandatory for every correction.
"""

from __future__ import annotations

import argparse
import json
import os
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

from openai import OpenAI


SCHEMA: dict[str, Any] = {
    "type": "object",
    "properties": {
        "id": {"type": "string"},
        "languageIssues": {
            "type": "array",
            "items": {
                "type": "object",
                "properties": {
                    "kind": {"type": "string", "enum": ["ocr_artifact", "grammar", "terminology", "ambiguity", "option_structure"]},
                    "span": {"type": "string"},
                    "reason": {"type": "string"},
                    "severity": {"type": "string", "enum": ["low", "medium", "high"]},
                },
                "required": ["kind", "span", "reason", "severity"],
                "additionalProperties": False,
            },
        },
        "medicalReview": {
            "type": "object",
            "properties": {
                "needed": {"type": "boolean"},
                "reason": {"type": "string"},
                "suggestedAuthorityQuery": {"type": "string"},
                "risk": {"type": "string", "enum": ["none", "possible_outdated", "possible_inaccuracy", "possible_ambiguity"]},
            },
            "required": ["needed", "reason", "suggestedAuthorityQuery", "risk"],
            "additionalProperties": False,
        },
        "sourcePageGate": {
            "type": "object",
            "properties": {
                "required": {"type": "boolean"},
                "reason": {"type": "string"},
            },
            "required": ["required", "reason"],
            "additionalProperties": False,
        },
        "disposition": {"type": "string", "enum": ["candidate_for_literal_source_correction", "needs_external_evidence", "manual_review_required", "possible_medical_error"]},
    },
    "required": ["id", "languageIssues", "medicalReview", "sourcePageGate", "disposition"],
    "additionalProperties": False,
}


SYSTEM_PROMPT = """You are a cautious quality-triage assistant for scanned medical multiple-choice questions.
You do not validate answers, never infer a missing answer, and never propose a factual correction as true.
Identify only possible OCR, grammar, terminology, ambiguity, option-structure, or medical-review issues from the supplied OCR text.
Treat source-page inspection and authoritative external evidence as mandatory gates. If the source text may be wrong, say source-page gate required.
Return JSON matching the requested schema only."""


def record_payload(record: dict[str, Any]) -> str:
    return json.dumps(
        {
            "id": record["id"],
            "subject": record.get("subject"),
            "topic": record.get("topic"),
            "stem": record.get("stem"),
            "options": record.get("options"),
            "correctOption": record.get("correctOption"),
            "explanation": record.get("explanation"),
            "status": record.get("status"),
            "warnings": record.get("warnings", []),
        },
        ensure_ascii=False,
    )


def triage_record(client: OpenAI, model: str, record: dict[str, Any]) -> dict[str, Any]:
    response = client.chat.completions.create(
        model=model,
        messages=[
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user", "content": f"Triage this OCR draft without changing it:\n{record_payload(record)}"},
        ],
        response_format={
            "type": "json_schema",
            "json_schema": {"name": "ocr_audit_triage", "strict": True, "schema": SCHEMA},
        },
        max_completion_tokens=1200,
    )
    return json.loads(response.choices[0].message.content)


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("input", type=Path, help="Exported audit batch records JSON")
    parser.add_argument("--model", default="gpt-5-mini")
    parser.add_argument("--output", type=Path)
    args = parser.parse_args()

    payload = json.loads(args.input.read_text())
    records = payload["records"]
    client = OpenAI(api_key=os.environ["OPENAI_API_KEY"], base_url=os.environ["OPENAI_API_BASE"])
    triage: list[dict[str, Any]] = []
    for record in records:
        result = triage_record(client, args.model, record)
        if result["id"] != record["id"]:
            raise RuntimeError(f"Model ID drift for {record['id']}")
        triage.append(result)

    output = args.output or args.input.with_name(f"{args.input.stem}-automated-triage.json")
    report = {
        "generatedAt": datetime.now(timezone.utc).isoformat(),
        "input": str(args.input),
        "model": args.model,
        "recordCount": len(records),
        "nonMutationRule": "Triage does not alter question text, answer keys, explanations, learning aids, or review status.",
        "evidenceRule": "Every correction requires source-page confirmation; medical corrections additionally require an authoritative external source.",
        "triage": triage,
    }
    output.write_text(json.dumps(report, indent=2, ensure_ascii=False) + "\n")
    print(json.dumps({"output": str(output), "records": len(records), "model": args.model}, indent=2))


if __name__ == "__main__":
    main()
