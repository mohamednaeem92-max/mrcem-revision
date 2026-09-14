/**
 * Full-bank option and answer-key consistency audit.
 *
 * The output is a review ledger only. This script never changes options,
 * correctOption values, explanations, learning notes, or study status.
 */
import { readFile, writeFile, mkdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, "..");
const outputDir = path.join(root, "docs", "audit");

function extractDrafts(source) {
  const prefix = "export const ocrDraftQuestions: OcrDraftQuestion[] = ";
  const start = source.indexOf(prefix);
  if (start < 0) throw new Error("OCR draft export not found");
  const arrayStart = start + prefix.length;
  const end = source.indexOf("];", arrayStart);
  if (end < 0) throw new Error("OCR draft export terminator not found");
  return JSON.parse(source.slice(arrayStart, end + 1));
}

function extractPilot(source) {
  const start = source.indexOf("export const pilotQuestions: Question[] = [");
  const end = source.indexOf("\n];", start);
  if (start < 0 || end < 0) throw new Error("Pilot export not found");
  const block = source.slice(start, end);
  return [...block.matchAll(/\{\n\s+id:\s+"([^"]+)",([\s\S]*?)\n\s+\},/g)].map((match) => {
    const item = match[2];
    const options = (item.match(/options:\s+\[([\s\S]*?)\],\n\s+correctOption:/) ?? [])[1] ?? "";
    const values = [...options.matchAll(/"((?:[^"\\]|\\.)*)"/g)].map((option) => JSON.parse(`"${option[1]}"`));
    return {
      id: match[1],
      subject: (item.match(/subject:\s+"([^"]+)"/) ?? [])[1] ?? "Unknown",
      topic: (item.match(/topic:\s+"([^"]+)"/) ?? [])[1] ?? "Unknown",
      source: (item.match(/source:\s+"([^"]+)"/) ?? [])[1] ?? null,
      sourcePage: Number((item.match(/sourcePage:\s+(\d+)/) ?? [])[1] ?? 0),
      options: values,
      correctOption: Number((item.match(/correctOption:\s+(\d+)/) ?? [])[1] ?? -1),
      status: "source_reviewed",
      warnings: [],
      sourceLink: null,
      recordType: "approved_pilot",
    };
  });
}

function letter(index) {
  return Number.isInteger(index) && index >= 0 && index < 26 ? String.fromCharCode(65 + index) : null;
}

function normalize(value) {
  return value
    .normalize("NFKC")
    .toLowerCase()
    .replace(/\s+/g, " ")
    .replace(/[^\p{L}\p{N} ]/gu, "")
    .trim();
}

function optionSignals(option) {
  const signals = [];
  if (!option?.trim()) signals.push("blank_option");
  if (/^\s*[A-E]\s*[.)]/i.test(option)) signals.push("embedded_option_letter");
  if (/\(x\)|\b[0-9]{1,2}%/iu.test(option)) signals.push("source_selection_annotation");
  if (/[£§©®]/u.test(option)) signals.push("unexpected_symbol");
  if (/\b(?:lliac|Li-|E2=|m10-11)\b/u.test(option)) signals.push("probable_character_substitution");
  return signals;
}

function auditQuestion(question) {
  const options = question.options ?? [];
  const correctOption = question.correctOption;
  const indexInRange = Number.isInteger(correctOption) && correctOption >= 0 && correctOption < options.length;
  const optionFlagMatrix = options.map((option, index) => ({ index, displayLetter: letter(index), signals: optionSignals(option) }));
  const duplicateKeys = new Map();
  for (const [index, option] of options.entries()) {
    const key = normalize(option);
    if (!key) continue;
    duplicateKeys.set(key, [...(duplicateKeys.get(key) ?? []), index]);
  }
  const duplicateOptionIndexes = [...duplicateKeys.values()].filter((indexes) => indexes.length > 1);
  const flags = [
    ...(options.length < 2 ? ["fewer_than_two_options"] : []),
    ...(correctOption === null ? ["no_detected_answer_key"] : []),
    ...(!indexInRange && correctOption !== null ? ["answer_index_out_of_range"] : []),
    ...(duplicateOptionIndexes.length ? ["duplicate_option_text"] : []),
    ...optionFlagMatrix.flatMap((item) => item.signals.map((signal) => `option_${item.displayLetter}_${signal}`)),
    ...(question.warnings ?? []).map((warning) => `source_warning:${warning}`),
  ];
  const recordType = question.recordType ?? "ocr_draft";
  const sourceTrace = recordType === "approved_pilot"
    ? Boolean(question.source && question.sourcePage)
    : Boolean(question.source?.sourceLink && question.source?.markdownFile && question.sourcePage);
  const answerEvidence = recordType === "approved_pilot"
    ? "manual_source_review"
    : correctOption === null
      ? "no_detected_key"
      : indexInRange
        ? "ocr_detected_key"
        : "invalid_detected_key";
  const mechanicalState = recordType === "approved_pilot"
    ? "source_reviewed"
    : !indexInRange
      ? "source_page_required"
      : flags.length
        ? "source_page_required"
        : "source_confirmation_required";
  return {
    id: question.id,
    recordType,
    subject: question.subject,
    topic: question.topic,
    sourceFile: recordType === "approved_pilot" ? question.source : question.source?.sourceFile ?? null,
    sourcePage: question.sourcePage ?? null,
    sourceLink: recordType === "approved_pilot" ? null : question.source?.sourceLink ?? null,
    questionStatus: question.status,
    optionCount: options.length,
    options: optionFlagMatrix.map((item) => ({ index: item.index, displayLetter: item.displayLetter, signals: item.signals })),
    duplicateOptionIndexes,
    correctOption,
    displayedCorrectLetter: letter(correctOption),
    correctOptionInRange: indexInRange,
    answerEvidence,
    sourceTraceAvailable: sourceTrace,
    flags,
    mechanicalState,
    proposedCorrection: null,
    correctionAllowed: false,
    correctionGate: recordType === "approved_pilot"
      ? "Original source page plus external authoritative source required for a factual amendment."
      : "Original source page plus external authoritative source required; OCR drafts remain unapproved.",
  };
}

function counts(rows, predicate) {
  return rows.filter(predicate).length;
}

function grouped(rows, selector) {
  return Object.fromEntries(Object.entries(rows.reduce((result, row) => {
    const key = selector(row);
    result[key] = (result[key] ?? 0) + 1;
    return result;
  }, {})).sort(([left], [right]) => left.localeCompare(right)));
}

function markdown(summary) {
  const rows = [
    ["Total records audited", summary.total],
    ["Approved pilot records", summary.byRecordType.approved_pilot ?? 0],
    ["OCR draft records", summary.byRecordType.ocr_draft ?? 0],
    ["Records with in-range answer index", summary.inRangeAnswerIndexes],
    ["Records with no detected answer key", summary.noDetectedAnswerKey],
    ["Records with option/order integrity flags", summary.withIntegrityFlags],
    ["Records with source-page trace", summary.withSourceTrace],
    ["Automatically corrected records", 0],
  ];
  const stateRows = Object.entries(summary.byMechanicalState);
  return `# Full Answer-Key Consistency Audit\n\nThis report assesses **every local record** for mechanical answer-letter display and OCR-integrity risks. It does not treat an OCR-detected index as clinically verified and does not alter content.\n\n| Measure | Count |\n|---|---:|\n${rows.map(([label, count]) => `| ${label} | ${count} |`).join("\n")}\n\n## Mechanical states\n\n| State | Records |\n|---|---:|\n${stateRows.map(([state, count]) => `| ${state} | ${count} |`).join("\n")}\n\n## Rule applied\n\nThe interface derives answer letters from the stored zero-based index, so a correct option at index 0 renders as A, index 1 as B, and so on. A valid index only establishes a mechanically coherent letter; it does not prove the key is factually correct. Records with OCR artefacts, missing keys, invalid keys, duplicated options, or source warnings remain blocked from automatic correction.\n\nNo answer key or option text was automatically changed.\n`;
}

const [draftSource, pilotSource] = await Promise.all([
  readFile(path.join(root, "client", "src", "lib", "ocrDraftSections.ts"), "utf8"),
  readFile(path.join(root, "client", "src", "lib", "questionBank.ts"), "utf8"),
]);
const drafts = extractDrafts(draftSource).map((item) => ({ ...item, recordType: "ocr_draft" }));
const rows = [...extractPilot(pilotSource), ...drafts].map(auditQuestion);
const summary = {
  generatedAt: new Date().toISOString(),
  total: rows.length,
  byRecordType: grouped(rows, (row) => row.recordType),
  byMechanicalState: grouped(rows, (row) => row.mechanicalState),
  bySubject: grouped(rows, (row) => row.subject),
  inRangeAnswerIndexes: counts(rows, (row) => row.correctOptionInRange),
  noDetectedAnswerKey: counts(rows, (row) => row.answerEvidence === "no_detected_key"),
  withIntegrityFlags: counts(rows, (row) => row.flags.length > 0),
  withSourceTrace: counts(rows, (row) => row.sourceTraceAvailable),
  correctionProposals: counts(rows, (row) => row.proposedCorrection !== null),
};
await mkdir(outputDir, { recursive: true });
await Promise.all([
  writeFile(path.join(outputDir, "answer-key-audit-ledger.json"), `${JSON.stringify(rows, null, 2)}\n`),
  writeFile(path.join(outputDir, "answer-key-audit-summary.json"), `${JSON.stringify(summary, null, 2)}\n`),
  writeFile(path.join(outputDir, "answer-key-audit.md"), markdown(summary)),
]);
console.log(JSON.stringify(summary, null, 2));
