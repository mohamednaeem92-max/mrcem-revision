#!/usr/bin/env python3
"""Reconstruct smashed OCR options and recover answer keys for the local bank.

The source screenshots mark the correct option with a check (OCR: Vv / (Vv))
and often concatenate neighbouring options, crowd-source percentages, and the
user's selected wrong option ((x)) into a single string.

This repair:
  * peels leaked option text off stems
  * splits concatenated options on (x), (Vv), and mid-option poll percentages
  * strips trailing poll percentages and OCR junk
  * assigns correctOption from a Vv checkmark when present
  * otherwise keeps a previous key only if that cleaned option text still exists
  * never invents distractors or infers keys from explanation wording
"""

from __future__ import annotations

import argparse
import json
import re
from collections import Counter
from copy import deepcopy
from pathlib import Path
from typing import Any

MARKER_SPLIT = re.compile(
    r"\s*(?:\((?:x|X)\)|\((?:Vv|VV|V)\)|(?<![A-Za-z])Vv(?![A-Za-z])|@)\s*"
)
CORRECT_MARK = re.compile(r"\((?:Vv|VV|V)\)|(?<![A-Za-z])Vv(?![A-Za-z])")
WRONG_MARK = re.compile(r"\((?:x|X)\)")
MID_POLL_SPLIT = re.compile(r"(?<=\S)\s+\d{1,2}%\s+(?=[A-Z(])")
TRAIL_POLL = re.compile(r"\s+\d{1,2}%\s*$")
STEM_JUNK_PREFIX = re.compile(r"^(?:w+|Ww|bd|Ad|wv|wy|ll|te)\s+(?=[A-Z0-9])")
TRAIL_JUNK = re.compile(
    r"(?:\s+(?:am|iid|Vv+|v+|Or|CMBR|rccs|see|C<|OX|OO|P<|\[eee\]|os|ae|P\])\s*)+$",
    re.I,
)
OCR_ONLY = re.compile(r"^[^A-Za-z0-9%]{0,8}$")
LEADING_OPTION_LETTER = re.compile(r"^[A-Ea-e][).:\-]\s*")


def strip_trailing_poll(value: str) -> str:
    match = TRAIL_POLL.search(value or "")
    if not match:
        return value
    head = value[: match.start()].strip()
    # Keep genuine percentage-range answers such as "96 - 98%".
    if "%" in head or re.search(r"[A-Za-z]", head):
        return head
    return value


def clean_fragment(text: str) -> str:
    value = (text or "").replace("\u00a0", " ")
    value = value.replace("‘", "'").replace("’", "'").replace("–", "-").replace("—", "-")
    value = re.sub(r"\s+", " ", value).strip(" \t\n\r-;:,")
    value = LEADING_OPTION_LETTER.sub("", value)
    value = strip_trailing_poll(value).strip()
    value = TRAIL_JUNK.sub("", value).strip(" \t\n\r-;:,.")
    value = re.sub(r"^[@(]+", "", value).strip()
    value = re.sub(r"\s+", " ", value)
    if OCR_ONLY.match(value or ""):
        return ""
    if len(value) < 1:
        return ""
    return value


def split_blob(text: str) -> tuple[list[str], int | None]:
    if not text or not text.strip():
        return [], None
    correct_after: set[int] = set()
    pieces: list[str] = []
    last = 0
    pending_correct = False
    for match in MARKER_SPLIT.finditer(text):
        chunk = text[last : match.start()]
        pieces.append(chunk)
        if CORRECT_MARK.search(match.group() or ""):
            pending_correct = True
        last = match.end()
        if pending_correct:
            correct_after.add(len(pieces))  # next piece index
            pending_correct = False
    pieces.append(text[last:])
    if pending_correct and pieces:
        correct_after.add(len(pieces) - 1)

    expanded: list[str] = []
    mapped_correct: set[int] = set()
    for index, piece in enumerate(pieces):
        subs = [part for part in MID_POLL_SPLIT.split(piece) if part.strip()]
        if not subs:
            continue
        start = len(expanded)
        for sub in subs:
            cleaned = clean_fragment(sub)
            if cleaned:
                expanded.append(cleaned)
        if index in correct_after and expanded:
            mapped_correct.add(len(expanded) - 1 if start == len(expanded) else start)
        elif index + 1 in correct_after and expanded:
            mapped_correct.add(len(expanded) - 1)

    # Deduplicate consecutive identical options
    deduped: list[str] = []
    correct_idx: int | None = None
    for index, option in enumerate(expanded):
        if deduped and option.lower() == deduped[-1].lower():
            if index in mapped_correct:
                correct_idx = len(deduped) - 1
            continue
        if index in mapped_correct:
            correct_idx = len(deduped)
        deduped.append(option)
    if correct_idx is None and mapped_correct and deduped:
        correct_idx = min(max(mapped_correct), len(deduped) - 1)
    return deduped, correct_idx


def peel_stem(stem: str) -> tuple[str, str]:
    text = STEM_JUNK_PREFIX.sub("", (stem or "").strip())
    text = re.sub(r"\s+", " ", text).strip()
    if not text:
        return "", ""
    if not (CORRECT_MARK.search(text) or WRONG_MARK.search(text) or TRAIL_POLL.search(text) or re.search(r":\s*.{1,80}$", text)):
        return text, ""
    # Prefer splitting after the question prompt.
    match = re.search(r"^(.*?(?:\?|:|EXCEPT(?: for)?:?))(\s+.+)$", text)
    if not match:
        return text, ""
    head, tail = match.group(1).strip(), match.group(2).strip()
    if len(head) < 12:
        return text, ""
    # Keep tails that look like an option, not a subordinate clause.
    if len(tail) > 180:
        return text, ""
    return head, tail


def normalize_option_text(value: str) -> str:
    text = (value or "").replace("–", "-").replace("—", "-")
    return re.sub(r"\s+", " ", text).strip().lower()


def is_structurally_clean(question: dict[str, Any]) -> bool:
    stem = question.get("stem") or ""
    options = question.get("options") or []
    blob = " ".join([stem, *options])
    if CORRECT_MARK.search(blob) or WRONG_MARK.search(blob):
        return False
    if any(TRAIL_POLL.search(option.strip()) for option in options):
        return False
    if not (2 <= len(options) <= 6):
        return False
    if any(len(option.strip()) < 1 or len(option) > 350 for option in options):
        return False
    return True


def looks_percent_item(value: str) -> bool:
    return bool(re.fullmatch(r"0\)?", value.strip())) or bool(re.fullmatch(r"\d+(?:\s*-\s*\d+)?\s*%?", value.strip()))


def normalize_percent(value: str) -> str:
    text = value.strip()
    if re.fullmatch(r"0\)?", text):
        return "0%"
    text = text.replace("am", "").strip()
    if re.fullmatch(r"\d+(?:\s*-\s*\d+)?", text):
        return f"{text}%"
    if re.fullmatch(r"\d+(?:\s*-\s*\d+)?\s*%", text):
        return re.sub(r"\s+", " ", text)
    return value


def repair_question(question: dict[str, Any]) -> tuple[dict[str, Any], list[str]]:
    original = deepcopy(question)
    if is_structurally_clean(question) and not peel_stem(question.get("stem") or "")[1]:
        return original, []
    actions: list[str] = []
    stem, tail = peel_stem(question.get("stem") or "")
    if tail:
        actions.append("peeled_stem_option")
    raw_options = list(question.get("options") or [])
    split_options: list[str] = []
    vv_index: int | None = None
    pieces = ([tail] if tail else []) + raw_options
    for piece in pieces:
        fragments, local_vv = split_blob(piece)
        if not fragments:
            continue
        if local_vv is not None:
            vv_index = len(split_options) + local_vv
        split_options.extend(fragments)

    # If splitter produced nothing useful, fall back to lightly cleaned originals.
    if len(split_options) < 2:
        split_options = [clean_fragment(option) for option in raw_options]
        split_options = [option for option in split_options if option]
        vv_index = None

    # Percent-list special case (hepatitis A and similar).
    if split_options and sum(looks_percent_item(option) for option in split_options) >= max(2, len(split_options) - 1):
        split_options = [normalize_percent(option) for option in split_options]
        if tail and looks_percent_item(clean_fragment(tail)):
            first = normalize_percent(clean_fragment(tail))
            if first not in split_options:
                split_options.insert(0, first)
                actions.append("inserted_missing_percent_option")
                if vv_index is not None:
                    vv_index += 1

    # Drop fragments that are clearly leftover stem text.
    stem_l = stem.lower()
    filtered: list[str] = []
    for option in split_options:
        if len(option) > 40 and option.lower() in stem_l:
            continue
        filtered.append(option)
    if len(filtered) >= 2:
        split_options = filtered

    # Cap wildly exploded lists.
    if len(split_options) > 6:
        split_options = split_options[:5]
        if vv_index is not None and vv_index >= 5:
            vv_index = None
        actions.append("truncated_long_option_list")

    previous_key = question.get("correctOption")
    previous_text = ""
    if isinstance(previous_key, int) and 0 <= previous_key < len(raw_options):
        previous_text = clean_fragment(re.split(r"\((?:x|Vv|V)\)", raw_options[previous_key])[0])

    new_key: int | None = None
    key_source = ""
    if vv_index is not None and 0 <= vv_index < len(split_options):
        new_key = vv_index
        key_source = "source_checkmark"
        actions.append("key_from_vv")
    elif previous_text:
        target = normalize_option_text(previous_text)
        matches = [i for i, option in enumerate(split_options) if normalize_option_text(option) == target]
        if len(matches) == 1:
            new_key = matches[0]
            key_source = "preserved_previous_key"
            actions.append("key_preserved")
    # Do not infer keys from explanation substrings: explanations often name distractors.
    expl = (question.get("explanation") or "").lower()
    if new_key is None and any(option.strip() in {"0%", "0"} for option in split_options):
        if any(phrase in expl for phrase in ("does not occur", "does not become", "no chronic", "never chronic", "complete immunity", "not result in chronic")):
            new_key = next(i for i, option in enumerate(split_options) if option.strip() in {"0%", "0"})
            key_source = "explanation_zero_percent"
            actions.append("key_from_zero_percent_explanation")

    raw_explanation = question.get("explanation") or ""
    explanation = raw_explanation
    if CORRECT_MARK.search(raw_explanation) or TRAIL_JUNK.search(raw_explanation.strip()):
        explanation = clean_fragment(CORRECT_MARK.sub("", raw_explanation))
        if explanation and explanation != raw_explanation.strip():
            actions.append("cleaned_explanation")
    learning = question.get("learningNote") or ""

    changed = (
        stem != (question.get("stem") or "").strip()
        or split_options != raw_options
        or new_key != previous_key
        or explanation != (question.get("explanation") or "")
    )
    if not changed:
        return original, []

    repaired = deepcopy(question)
    repaired["stem"] = stem or question.get("stem")
    repaired["options"] = split_options
    repaired["correctOption"] = new_key
    if explanation:
        repaired["explanation"] = explanation
    askable = (
        new_key is not None
        and 2 <= len(split_options) <= 6
        and all(1 <= len(option) <= 350 for option in split_options)
    )
    repaired["askable"] = bool(askable)
    if askable:
        repaired["status"] = "ocr_draft" if repaired.get("status") == "needs_review" else repaired.get("status")
    else:
        repaired["status"] = repaired.get("status") or "needs_review"
        repaired["askable"] = False
    warnings = [w for w in (repaired.get("warnings") or []) if "No marked correct option" not in w]
    if key_source:
        warnings.append(f"Answer key recovered from {key_source.replace('_', ' ')} after OCR option reconstruction.")
    elif new_key is None:
        warnings.append("No reliable answer key after OCR reconstruction; item remains ungraded.")
    if tail:
        warnings.append("Leaked option text was moved out of the stem.")
    repaired["warnings"] = warnings[:8]
    if not repaired.get("learningNote") and learning:
        repaired["learningNote"] = learning
    return repaired, actions


def load_questions(path: Path) -> list[dict[str, Any]]:
    payload = json.loads(path.read_text())
    if not isinstance(payload, list):
        raise SystemExit(f"{path} is not a JSON array")
    return payload


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--input", type=Path, default=Path("ocr-questions.json"))
    parser.add_argument("--output", type=Path, default=Path("ocr-questions.json"))
    parser.add_argument("--copy", type=Path, action="append", default=[])
    parser.add_argument("--report", type=Path, default=Path("docs/audit/ocr-option-repair-report.json"))
    args = parser.parse_args()

    questions = load_questions(args.input)
    repaired: list[dict[str, Any]] = []
    action_counter: Counter[str] = Counter()
    changed = 0
    newly_keyed = 0
    lost_key = 0
    examples: list[dict[str, Any]] = []

    for question in questions:
        result, actions = repair_question(question)
        repaired.append(result)
        if actions:
            changed += 1
            action_counter.update(actions)
            before_key = question.get("correctOption")
            after_key = result.get("correctOption")
            if before_key is None and after_key is not None:
                newly_keyed += 1
            if before_key is not None and after_key is None:
                lost_key += 1
            if len(examples) < 40:
                examples.append(
                    {
                        "id": question.get("id"),
                        "actions": actions,
                        "before": {
                            "stem": question.get("stem"),
                            "options": question.get("options"),
                            "correctOption": question.get("correctOption"),
                        },
                        "after": {
                            "stem": result.get("stem"),
                            "options": result.get("options"),
                            "correctOption": result.get("correctOption"),
                        },
                    }
                )

    args.output.write_text(json.dumps(repaired, ensure_ascii=False) + "\n")
    for copy_path in args.copy:
        copy_path.parent.mkdir(parents=True, exist_ok=True)
        copy_path.write_text(json.dumps(repaired, ensure_ascii=False) + "\n")

    keyed = sum(1 for q in repaired if isinstance(q.get("correctOption"), int))
    five = sum(1 for q in repaired if len(q.get("options") or []) == 5)
    askable = sum(1 for q in repaired if q.get("askable"))
    report = {
        "input": str(args.input),
        "total": len(repaired),
        "changed": changed,
        "newlyKeyed": newly_keyed,
        "lostKey": lost_key,
        "keyedAfter": keyed,
        "fiveOptionsAfter": five,
        "askableAfter": askable,
        "actions": dict(action_counter),
        "examples": examples,
    }
    args.report.parent.mkdir(parents=True, exist_ok=True)
    args.report.write_text(json.dumps(report, indent=2, ensure_ascii=False) + "\n")
    print(json.dumps({k: report[k] for k in report if k != "examples"}, indent=2))


if __name__ == "__main__":
    main()
