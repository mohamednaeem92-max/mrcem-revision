#!/usr/bin/env python3
"""Create, review, validate, and prepare offline MRCEM question-bank records.

The source PDFs are screenshots. This utility keeps source images and OCR text
alongside every draft, then exports only reviewer-approved records for import.
"""

from __future__ import annotations

import argparse
import html
import json
import re
import subprocess
from collections import Counter
from pathlib import Path
from typing import Any


SCHEMA_VERSION = 2
REVIEW_STATES = {"pending", "needs-image", "approved"}
PRIMARY_BLUEPRINT_CATEGORIES = (
    "Anatomy",
    "Physiology",
    "Pharmacology",
    "Microbiology",
    "Pathology",
    "Evidence-based medicine",
)
UI_NOISE = (
    "viber",
    "frcemsuccess.com",
    "this website uses cookies",
    "cookie settings",
    "end session",
    "score",
)


def command_output(command: list[str]) -> str:
    completed = subprocess.run(command, check=True, text=True, capture_output=True)
    return completed.stdout


def get_page_count(pdf: Path) -> int:
    details = command_output(["pdfinfo", str(pdf)])
    found = re.search(r"^Pages:\s+(\d+)$", details, re.MULTILINE)
    if not found:
        raise RuntimeError("Could not determine page count from pdfinfo output.")
    return int(found.group(1))


def write_json(path: Path, data: Any) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(data, indent=2, ensure_ascii=False), encoding="utf-8")


def normalise(text: str) -> str:
    return "\n".join(line.rstrip() for line in text.splitlines() if line.strip())


def clean_line(line: str) -> str:
    line = re.sub(r"^[|\s]+", "", line)
    line = re.sub(r"^\([xv✓✔]\)\s*", "", line, flags=re.IGNORECASE)
    line = line.strip(" -|_\t")
    line = re.sub(r"\s+\d{1,3}%\s*$", "", line)
    line = re.sub(r"\s+", " ", line).strip(" -|_\t")
    return line


def remove_ui_noise(text: str) -> str:
    kept: list[str] = []
    for raw_line in text.splitlines():
        line = raw_line.strip()
        lowered = line.lower()
        if any(marker in lowered for marker in UI_NOISE):
            continue
        if re.fullmatch(r"[\W_]+", line):
            continue
        kept.append(line)
    return "\n".join(kept)


def render_page(pdf: Path, page: int, dpi: int, image_path: Path) -> None:
    image_path.parent.mkdir(parents=True, exist_ok=True)
    output_prefix = image_path.with_suffix("")
    subprocess.run(
        [
            "pdftoppm",
            "-f",
            str(page),
            "-l",
            str(page),
            "-r",
            str(dpi),
            "-png",
            "-singlefile",
            str(pdf),
            str(output_prefix),
        ],
        check=True,
        capture_output=True,
    )


def ocr_image(image_path: Path, psm: int) -> str:
    return normalise(command_output(["tesseract", str(image_path), "stdout", "--psm", str(psm)]))


def split_question_and_explanation(raw_ocr: str) -> tuple[str, str, bool]:
    marker = re.search(r"\bANSWER\b", raw_ocr, re.IGNORECASE)
    question_block = raw_ocr[: marker.start()] if marker else raw_ocr
    explanation_block = raw_ocr[marker.end() :] if marker else ""
    explanation_block = re.split(r"\bSCORE\b", explanation_block, maxsplit=1, flags=re.IGNORECASE)[0]
    return remove_ui_noise(question_block), remove_ui_noise(explanation_block), bool(marker)


def looks_like_option(line: str) -> bool:
    return bool(
        re.match(r"^\s*\|", line)
        or re.match(r"^\s*\([xv✓✔]\)", line, flags=re.IGNORECASE)
        or re.match(r"^\s*[A-E][\).:]\s+", line)
        or re.match(r"^\s*[1-5][\).:]\s+", line)
    )


def extract_draft(question_block: str, explanation_block: str) -> tuple[str, list[str], str, list[str]]:
    marker = re.search(r"QUESTION\s*\d+", question_block, re.IGNORECASE)
    after_marker = question_block[marker.end() :] if marker else question_block
    stem_lines: list[str] = []
    options: list[str] = []
    warnings: list[str] = []

    for raw_line in after_marker.splitlines():
        line = raw_line.strip()
        if not line:
            continue
        if looks_like_option(line):
            option = clean_line(line)
            if option and len(option) > 1:
                options.append(option)
            continue
        if options:
            continuation = clean_line(line)
            if continuation and not re.match(r"^(QUESTION|ANSWER)\b", continuation, re.IGNORECASE):
                options[-1] = f"{options[-1]} {continuation}".strip()
        else:
            candidate = clean_line(line)
            if candidate and not re.fullmatch(r"[A-Za-z]{1,4}", candidate):
                stem_lines.append(candidate)

    stem = " ".join(stem_lines).strip()
    explanation = " ".join(clean_line(line) for line in explanation_block.splitlines()).strip()
    if len(stem) < 16:
        warnings.append("Draft stem is short or incomplete. Check against the source image.")
    if len(options) < 4:
        warnings.append("Fewer than four candidate answer options were detected.")
    if len(options) > 5:
        warnings.append("More than five candidate answer options were detected. Remove OCR noise or merge wrapped text.")
    if re.search(r"[$%]", stem):
        warnings.append("Draft stem contains suspicious OCR characters.")
    if any(re.search(r"\b(?:eroeer|vv|pe)\b", option, re.IGNORECASE) for option in options):
        warnings.append("One or more answer options contain likely screen or OCR noise.")
    if any(re.search(r"[$%]", option) for option in options):
        warnings.append("One or more answer options retain percentage or symbol artefacts.")
    if not explanation:
        warnings.append("No explanation text was detected after the ANSWER marker.")
    return stem, options, explanation, warnings


def review_record(subject: str, topic: str, pdf: Path, page: int, image_path: Path, raw_ocr: str) -> dict[str, Any] | None:
    marker = re.search(r"QUESTION\s*(\d+)", raw_ocr, re.IGNORECASE)
    if not marker:
        return None
    question_block, explanation_block, has_answer = split_question_and_explanation(raw_ocr)
    stem, options, explanation, warnings = extract_draft(question_block, explanation_block)
    if not has_answer:
        warnings.append("No ANSWER marker was detected. Confirm that this is a complete question page.")

    return {
        "schemaVersion": SCHEMA_VERSION,
        "id": f"{slugify(subject)}-p{page:04d}",
        "reviewStatus": "pending",
        "reviewNotes": "",
        "source": pdf.name,
        "sourcePage": page,
        "sourceQuestionNumber": int(marker.group(1)),
        "sourceImage": image_path.as_posix(),
        "subject": subject,
        "topic": topic,
        "primaryBlueprintCategory": subject if subject in PRIMARY_BLUEPRINT_CATEGORIES else "",
        "primaryBlueprintSubcategory": topic,
        "stem": stem,
        "options": options,
        "correctOption": None,
        "explanation": explanation,
        "learningNote": "",
        "highYieldNote": "",
        "mnemonic": "",
        "memoryAid": None,
        "tags": [],
        "needsReview": True,
        "draftWarnings": warnings,
        "rawOcr": raw_ocr,
        "questionOcr": question_block,
        "explanationOcr": explanation_block,
        "hasAnswerMarker": has_answer,
    }


def slugify(value: str) -> str:
    return re.sub(r"[^a-z0-9]+", "-", value.lower()).strip("-")


def quality_report(records: list[dict[str, Any]], source_pdf: str | None = None, settings: dict[str, Any] | None = None) -> dict[str, Any]:
    warning_counts = Counter(warning for record in records for warning in record.get("draftWarnings", []))
    review_counts = Counter(record.get("reviewStatus", "pending") for record in records)
    approved_records = [record for record in records if record.get("reviewStatus") == "approved"]
    approved_blueprint_counts = Counter(record.get("primaryBlueprintCategory", "") for record in approved_records)
    return {
        "schemaVersion": SCHEMA_VERSION,
        "sourcePdf": source_pdf,
        "settings": settings or {},
        "recordCount": len(records),
        "reviewStatusCounts": dict(review_counts),
        "recordsWithWarnings": sum(1 for record in records if record.get("draftWarnings")),
        "warningCounts": dict(warning_counts),
        "approvedCount": review_counts.get("approved", 0),
        "approvedWithBlueprintMetadata": sum(
            1
            for record in approved_records
            if record.get("primaryBlueprintCategory") in PRIMARY_BLUEPRINT_CATEGORIES
            and isinstance(record.get("primaryBlueprintSubcategory"), str)
            and record["primaryBlueprintSubcategory"].strip()
        ),
        "approvedBlueprintCategoryCounts": dict(approved_blueprint_counts),
    }


def validate_record(record: Any) -> list[str]:
    if not isinstance(record, dict):
        return ["Record is not an object."]
    errors: list[str] = []
    if record.get("reviewStatus") != "approved":
        errors.append("Review status is not approved.")
    if not isinstance(record.get("id"), str) or not record["id"].strip():
        errors.append("Missing id.")
    if not isinstance(record.get("source"), str) or not record["source"].strip():
        errors.append("Missing source file name.")
    if not isinstance(record.get("sourcePage"), int) or record["sourcePage"] < 1:
        errors.append("Source page must be a positive integer.")
    for field in ("subject", "topic", "stem", "explanation", "learningNote"):
        if not isinstance(record.get(field), str) or not record[field].strip():
            errors.append(f"Missing {field}.")
    options = record.get("options")
    if not isinstance(options, list) or len(options) < 2 or any(not isinstance(option, str) or not option.strip() for option in options):
        errors.append("At least two non-empty options are required.")
    correct_option = record.get("correctOption")
    if not isinstance(correct_option, int) or isinstance(correct_option, bool) or not isinstance(options, list) or not 0 <= correct_option < len(options):
        errors.append("Correct option must be a zero-based index within the options list.")
    if not isinstance(record.get("tags"), list) or any(not isinstance(tag, str) or not tag.strip() for tag in record["tags"]):
        errors.append("Tags must be a list of non-empty strings.")
    for field in ("highYieldNote", "mnemonic"):
        if field in record and not isinstance(record.get(field), str):
            errors.append(f"{field} must be a string when supplied.")
    memory_aid = record.get("memoryAid")
    if memory_aid is not None:
        if not isinstance(memory_aid, dict):
            errors.append("Memory aid must be an object when supplied.")
        else:
            for field in ("coreFact", "mnemonic", "cueLabel", "sourceLabel", "sourceUrl"):
                if not isinstance(memory_aid.get(field), str) or not memory_aid[field].strip():
                    errors.append(f"Memory aid is missing {field}.")
            emoji_cues = memory_aid.get("emojiCues")
            if not isinstance(emoji_cues, list) or not 1 <= len(emoji_cues) <= 3 or any(not isinstance(cue, str) or not cue.strip() for cue in emoji_cues):
                errors.append("Memory aid needs one to three non-empty emoji cues.")
            if not isinstance(memory_aid.get("sourceUrl"), str) or not memory_aid["sourceUrl"].startswith("https://"):
                errors.append("Memory aid source URL must use HTTPS.")
    if record.get("primaryBlueprintCategory") not in PRIMARY_BLUEPRINT_CATEGORIES:
        errors.append("Primary blueprint category must be one of the six MRCEM Primary categories.")
    if not isinstance(record.get("primaryBlueprintSubcategory"), str) or not record["primaryBlueprintSubcategory"].strip():
        errors.append("Missing primary blueprint subcategory.")
    return errors


def app_record(record: dict[str, Any]) -> dict[str, Any]:
    result = {
        "id": record["id"],
        "source": record["source"],
        "sourcePage": record["sourcePage"],
        "subject": record["subject"],
        "topic": record["topic"],
        "stem": record["stem"],
        "options": record["options"],
        "correctOption": record["correctOption"],
        "explanation": record["explanation"],
        "learningNote": record["learningNote"],
        "primaryBlueprintCategory": record["primaryBlueprintCategory"],
        "primaryBlueprintSubcategory": record["primaryBlueprintSubcategory"],
        "tags": record["tags"],
        "needsReview": False,
    }
    if record.get("highYieldNote", "").strip():
        result["highYieldNote"] = record["highYieldNote"].strip()
    if record.get("mnemonic", "").strip():
        result["mnemonic"] = record["mnemonic"].strip()
    if record.get("memoryAid") is not None:
        result["memoryAid"] = record["memoryAid"]
    return result


def build_review_html(records: list[dict[str, Any]], title: str) -> str:
    records_json = json.dumps(records, ensure_ascii=False).replace("</script>", "<\\/script>")
    safe_title = html.escape(title)
    return f"""<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>{safe_title}</title>
  <style>
    :root {{ color-scheme: light; font-family: ui-sans-serif, system-ui, sans-serif; background: #f4f5f1; color: #193d38; }}
    * {{ box-sizing: border-box; }} body {{ margin: 0; }}
    header {{ position: sticky; top: 0; z-index: 2; border-bottom: 1px solid #cbdad4; background: rgba(255,255,255,.95); backdrop-filter: blur(12px); padding: 16px 24px; }}
    h1 {{ margin: 0; font-family: Georgia, serif; font-size: 25px; }} .sub {{ margin: 4px 0 0; color: #5e7770; font-size: 13px; }}
    .toolbar {{ display: flex; flex-wrap: wrap; align-items: center; gap: 10px; margin-top: 14px; }}
    input, textarea, select, button {{ font: inherit; }} input, textarea, select {{ width: 100%; border: 1px solid #c9d8d1; border-radius: 8px; background: #fff; padding: 9px 10px; color: #193d38; }} textarea {{ min-height: 76px; resize: vertical; line-height: 1.45; }}
    button {{ border: 0; border-radius: 8px; background: #087c77; color: #fff; padding: 10px 13px; cursor: pointer; font-weight: 700; }} button.alt {{ border: 1px solid #bfcfc8; background: #fff; color: #31544e; }} button.warn {{ background: #a34f37; }}
    .toolbar input {{ width: min(340px, 100%); }} .status {{ margin-left: auto; color: #607b73; font-size: 12px; }}
    main {{ max-width: 1500px; margin: 0 auto; padding: 22px; }} .card {{ display: grid; grid-template-columns: minmax(280px, .8fr) minmax(0, 1.2fr); gap: 20px; margin-bottom: 18px; border: 1px solid #d4dfd9; border-left: 5px solid #8a9c95; border-radius: 14px; background: #fff; padding: 16px; box-shadow: 0 4px 16px rgba(26,54,49,.05); }} .card.approved {{ border-left-color: #087c77; }} .card.needs-image {{ border-left-color: #bd6a3f; }}
    .image-box {{ border: 1px solid #d8e2dc; border-radius: 10px; overflow: hidden; background: #eef2ef; }} .image-box img {{ display: block; width: 100%; height: auto; }} .image-caption {{ padding: 8px 10px; color: #5d756e; font-size: 12px; }}
    .record-head {{ display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 8px; }} .record-head h2 {{ margin: 0; font-size: 16px; }} .chip {{ border-radius: 999px; background: #e7f3ee; color: #087c77; padding: 5px 8px; font-size: 11px; font-weight: 800; }}
    .fields {{ display: grid; gap: 12px; }} .row {{ display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }} label {{ display: grid; gap: 5px; color: #4d6860; font-size: 12px; font-weight: 700; }} .options {{ display: grid; gap: 7px; }} .option {{ display: grid; grid-template-columns: 28px 1fr 28px; align-items: center; gap: 7px; }} .option b {{ color: #087c77; text-align: center; }} .remove {{ padding: 6px; background: #fff2ec; color: #a34f37; }}
    details {{ border-radius: 8px; background: #f4f7f5; padding: 10px; }} summary {{ cursor: pointer; color: #4f6d65; font-size: 12px; font-weight: 800; }} pre {{ overflow: auto; white-space: pre-wrap; font-size: 11px; line-height: 1.45; }} .warnings {{ margin: 0; padding-left: 18px; color: #a34f37; font-size: 12px; line-height: 1.5; }} .empty {{ padding: 50px 20px; color: #607b73; text-align: center; }}
    @media (max-width: 800px) {{ header, main {{ padding-left: 12px; padding-right: 12px; }} .card {{ grid-template-columns: 1fr; }} .row {{ grid-template-columns: 1fr; }} .status {{ margin-left: 0; width: 100%; }} }}
  </style>
</head>
<body>
  <header><h1>{safe_title}</h1><p class="sub">Correct each field against the adjacent source image. Only <strong>approved</strong> records can be prepared for app import.</p><div class="toolbar"><input id="search" type="search" placeholder="Filter by page, question, topic, or text" /><select id="state" style="width:auto"><option value="all">All review states</option><option value="pending">Pending</option><option value="needs-image">Needs image</option><option value="approved">Approved</option></select><button onclick="downloadRecords()">Download reviewed JSON</button><button class="alt" onclick="downloadSummary()">Download status report</button><span id="status" class="status"></span></div></header>
  <main id="records"></main>
  <script>
    const records = {records_json};
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const blueprintCategories = {json.dumps(PRIMARY_BLUEPRINT_CATEGORIES)};
    const esc = value => String(value ?? '').replace(/[&<>"']/g, char => ({{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}}[char]));
    const normalise = record => {{ record.needsReview = record.reviewStatus !== 'approved'; record.tags = Array.isArray(record.tags) ? record.tags : []; record.options = Array.isArray(record.options) ? record.options : []; record.primaryBlueprintCategory = typeof record.primaryBlueprintCategory === 'string' ? record.primaryBlueprintCategory : ''; record.primaryBlueprintSubcategory = typeof record.primaryBlueprintSubcategory === 'string' ? record.primaryBlueprintSubcategory : ''; return record; }};
    records.forEach(normalise);
    function update(index, key, value) {{ records[index][key] = value; normalise(records[index]); refreshStatus(); }}
    function updateOption(index, optionIndex, value) {{ records[index].options[optionIndex] = value; }}
    function addOption(index) {{ records[index].options.push(''); render(); }}
    function removeOption(index, optionIndex) {{ records[index].options.splice(optionIndex, 1); if (records[index].correctOption === optionIndex) records[index].correctOption = null; render(); }}
    function buildCard(record, index) {{
      const warningHtml = record.draftWarnings?.length ? `<ul class="warnings">${{record.draftWarnings.map(esc).map(text => `<li>${{text}}</li>`).join('')}}</ul>` : '<span class="chip">No automated warnings</span>';
      const options = record.options.map((option, optionIndex) => `<div class="option"><b>${{alphabet[optionIndex] || optionIndex + 1}}</b><input value="${{esc(option)}}" oninput="updateOption(${{index}},${{optionIndex}},this.value)" placeholder="Option ${{alphabet[optionIndex] || optionIndex + 1}}" /><button class="remove" title="Remove option" onclick="removeOption(${{index}},${{optionIndex}})">×</button></div>`).join('');
      const correctChoices = ['<option value="">Select answer</option>', ...record.options.map((option, optionIndex) => `<option value="${{optionIndex}}" ${{record.correctOption === optionIndex ? 'selected' : ''}}>${{alphabet[optionIndex] || optionIndex + 1}}. ${{esc(option || 'Empty option')}}</option>`)].join('');
      const blueprintChoices = ['<option value="">Select category</option>', ...blueprintCategories.map(category => `<option value="${{esc(category)}}" ${{record.primaryBlueprintCategory === category ? 'selected' : ''}}>${{esc(category)}}</option>`)].join('');
      return `<article class="card ${{esc(record.reviewStatus)}}" data-index="${{index}}"><div><div class="image-box"><img loading="lazy" src="${{esc(record.sourceImage)}}" alt="Source page ${{record.sourcePage}}" /><div class="image-caption">${{esc(record.source)}} · page ${{record.sourcePage}} · original question ${{record.sourceQuestionNumber}}</div></div><div style="margin-top:12px"><strong style="font-size:12px;color:#4d6860">Automated checks</strong><div style="margin-top:7px">${{warningHtml}}</div></div><details style="margin-top:12px"><summary>Show raw OCR</summary><pre>${{esc(record.rawOcr)}}</pre></details></div><div class="fields"><div class="record-head"><h2>Question ${{esc(record.sourceQuestionNumber)}} <span class="chip">${{esc(record.id)}}</span></h2><select style="width:auto" onchange="update(${{index}},'reviewStatus',this.value);render()"><option value="pending" ${{record.reviewStatus === 'pending' ? 'selected' : ''}}>Pending</option><option value="needs-image" ${{record.reviewStatus === 'needs-image' ? 'selected' : ''}}>Needs image</option><option value="approved" ${{record.reviewStatus === 'approved' ? 'selected' : ''}}>Approved</option></select></div><div class="row"><label>Subject<input value="${{esc(record.subject)}}" oninput="update(${{index}},'subject',this.value)" /></label><label>Topic<input value="${{esc(record.topic)}}" oninput="update(${{index}},'topic',this.value)" /></label></div><div class="row"><label>Primary blueprint category<select onchange="update(${{index}},'primaryBlueprintCategory',this.value)">${{blueprintChoices}}</select></label><label>Primary blueprint subcategory<input value="${{esc(record.primaryBlueprintSubcategory)}}" oninput="update(${{index}},'primaryBlueprintSubcategory',this.value)" placeholder="e.g. Peripheral nerves" /></label></div><label>Question stem<textarea oninput="update(${{index}},'stem',this.value)">${{esc(record.stem)}}</textarea></label><label>Answer options<div class="options">${{options}}</div><button type="button" class="alt" style="justify-self:start" onclick="addOption(${{index}})">Add option</button></label><label>Correct option<select onchange="update(${{index}},'correctOption',this.value === '' ? null : Number(this.value))">${{correctChoices}}</select></label><label>Explanation<textarea oninput="update(${{index}},'explanation',this.value)">${{esc(record.explanation)}}</textarea></label><label>Learning note<textarea oninput="update(${{index}},'learningNote',this.value)">${{esc(record.learningNote)}}</textarea></label><div class="row"><label>Tags, comma separated<input value="${{esc(record.tags.join(', '))}}" oninput="update(${{index}},'tags',this.value.split(',').map(tag => tag.trim()).filter(Boolean))" /></label><label>Reviewer notes<textarea oninput="update(${{index}},'reviewNotes',this.value)">${{esc(record.reviewNotes)}}</textarea></label></div></div></article>`;
    }}
    function render() {{ const query = document.getElementById('search').value.toLowerCase(); const state = document.getElementById('state').value; const visible = records.map((record,index)=>({{record,index}})).filter(({{record}}) => (state === 'all' || record.reviewStatus === state) && JSON.stringify(record).toLowerCase().includes(query)); document.getElementById('records').innerHTML = visible.length ? visible.map(({{record,index}})=>buildCard(record,index)).join('') : '<div class="empty">No matching records.</div>'; refreshStatus(); }}
    function refreshStatus() {{ const counts = records.reduce((result, record) => {{ result[record.reviewStatus] = (result[record.reviewStatus] || 0) + 1; return result; }}, {{}}); document.getElementById('status').textContent = `${{records.length}} records · ${{counts.pending || 0}} pending · ${{counts['needs-image'] || 0}} need image · ${{counts.approved || 0}} approved`; }}
    function download(name, data) {{ const blob = new Blob([JSON.stringify(data,null,2)],{{type:'application/json'}}); const url = URL.createObjectURL(blob); const anchor = document.createElement('a'); anchor.href=url; anchor.download=name; anchor.click(); URL.revokeObjectURL(url); }}
    function downloadRecords() {{ records.forEach(normalise); download('records.reviewed.json', records); }}
    function downloadSummary() {{ const counts = records.reduce((result, record) => {{ result[record.reviewStatus] = (result[record.reviewStatus] || 0) + 1; return result; }}, {{}}); download('review-status.json', {{recordCount:records.length, reviewStatusCounts:counts, generatedAt:new Date().toISOString()}}); }}
    document.getElementById('search').addEventListener('input', render); document.getElementById('state').addEventListener('change', render); render();
  </script>
</body>
</html>"""


def extract_command(args: argparse.Namespace) -> None:
    pdf = args.pdf.resolve()
    if not pdf.exists():
        raise FileNotFoundError(f"Source PDF not found: {pdf}")
    output_dir = args.output_dir.resolve()
    output_dir.mkdir(parents=True, exist_ok=True)
    image_dir = output_dir / "images"
    final_page = min(args.end_page or get_page_count(pdf), get_page_count(pdf))
    if args.start_page < 1 or args.start_page > final_page:
        raise ValueError("The requested page range is invalid.")

    records: list[dict[str, Any]] = []
    for page in range(args.start_page, final_page + 1):
        image_path = image_dir / f"page-{page:04d}.png"
        render_page(pdf, page, args.dpi, image_path)
        raw_ocr = ocr_image(image_path, args.psm)
        record = review_record(args.subject, args.topic or args.subject, pdf, page, image_path.relative_to(output_dir), raw_ocr)
        if record:
            records.append(record)
            print(f"Detected question {record['sourceQuestionNumber']} on page {page}.")
        elif not args.keep_all_images:
            image_path.unlink(missing_ok=True)

    review_path = output_dir / "records.review.json"
    write_json(review_path, records)
    report = quality_report(records, pdf.name, {"dpi": args.dpi, "psm": args.psm, "pageRange": [args.start_page, final_page]})
    write_json(output_dir / "report.json", report)
    (output_dir / "review.html").write_text(build_review_html(records, f"{args.subject} OCR Review"), encoding="utf-8")
    print(f"\nCreated review bundle: {output_dir}")
    print(f"Question pages: {len(records)} | with warnings: {report['recordsWithWarnings']}")
    print("Open review.html locally, edit records, download records.reviewed.json, then run prepare-import.")


def load_record_list(path: Path) -> list[dict[str, Any]]:
    data = json.loads(path.read_text(encoding="utf-8"))
    if isinstance(data, list):
        return data
    if isinstance(data, dict) and isinstance(data.get("records"), list):
        return data["records"]
    raise ValueError("Expected a JSON array of review records or an object containing a records array.")


def prepare_import_command(args: argparse.Namespace) -> None:
    review_file = args.review_file.resolve()
    records = load_record_list(review_file)
    approved: list[dict[str, Any]] = []
    rejected: list[dict[str, Any]] = []
    for index, record in enumerate(records):
        errors = validate_record(record)
        if errors:
            rejected.append({"index": index, "id": record.get("id") if isinstance(record, dict) else None, "errors": errors})
        else:
            approved.append(app_record(record))

    output_dir = args.output_dir.resolve()
    output_dir.mkdir(parents=True, exist_ok=True)
    write_json(output_dir / "approved-questions.json", approved)
    report = {
        "sourceReviewFile": review_file.name,
        "totalRecords": len(records),
        "approvedRecords": len(approved),
        "rejectedRecords": len(rejected),
        "rejected": rejected,
    }
    write_json(output_dir / "import-report.json", report)
    print(f"Prepared {len(approved)} importable question(s). Rejected {len(rejected)} record(s).")
    print(f"Import file: {output_dir / 'approved-questions.json'}")
    print(f"Validation report: {output_dir / 'import-report.json'}")


def report_command(args: argparse.Namespace) -> None:
    records = load_record_list(args.review_file.resolve())
    report = quality_report(records)
    if args.output:
        write_json(args.output.resolve(), report)
    print(json.dumps(report, indent=2, ensure_ascii=False))


def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(description="OCR review-bundle utility for scanned MRCEM PDFs.")
    subparsers = parser.add_subparsers(dest="command", required=True)

    extract = subparsers.add_parser("extract", help="Render source pages, create OCR drafts, and write a local review bundle.")
    extract.add_argument("pdf", type=Path, help="Path to a downloaded source PDF.")
    extract.add_argument("--subject", required=True, help="Subject name stored with each draft.")
    extract.add_argument("--topic", help="Default topic label. Defaults to the subject name.")
    extract.add_argument("--output-dir", type=Path, required=True, help="New or existing directory for the review bundle.")
    extract.add_argument("--dpi", type=int, default=220, help="Render DPI. Default: 220.")
    extract.add_argument("--psm", type=int, default=6, help="Tesseract page segmentation mode. Default: 6.")
    extract.add_argument("--start-page", type=int, default=1, help="First PDF page to inspect. Default: 1.")
    extract.add_argument("--end-page", type=int, help="Last PDF page to inspect. Default: final page.")
    extract.add_argument("--keep-all-images", action="store_true", help="Keep images from reference pages as well as detected question pages.")
    extract.set_defaults(handler=extract_command)

    prepare = subparsers.add_parser("prepare-import", help="Validate approved review records and create browser-importable JSON.")
    prepare.add_argument("review_file", type=Path, help="Reviewed JSON downloaded from review.html or manually edited.")
    prepare.add_argument("--output-dir", type=Path, required=True, help="Directory for approved-questions.json and import-report.json.")
    prepare.set_defaults(handler=prepare_import_command)

    report = subparsers.add_parser("report", help="Print a review-state and warning summary for a review JSON file.")
    report.add_argument("review_file", type=Path, help="Review JSON to summarise.")
    report.add_argument("--output", type=Path, help="Optional path for report JSON.")
    report.set_defaults(handler=report_command)
    return parser


def main() -> None:
    args = build_parser().parse_args()
    args.handler(args)


if __name__ == "__main__":
    main()
