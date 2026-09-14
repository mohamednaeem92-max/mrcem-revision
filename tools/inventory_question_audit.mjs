/**
 * Source-linked audit inventory for Meridian Revision.
 *
 * This tool deliberately does not change question text, answer keys, notes, or
 * mnemonics. It records what evidence exists for each local record and flags
 * OCR patterns that require a source-page comparison before any correction.
 */
import { readFile, writeFile, mkdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, "..");
const draftPath = path.join(root, "client", "src", "lib", "ocrDraftSections.ts");
const pilotPath = path.join(root, "client", "src", "lib", "questionBank.ts");
const outputDir = path.join(root, "docs", "audit");

function extractJsonArray(source, prefix) {
  const start = source.indexOf(prefix);
  if (start < 0) throw new Error(`Could not locate ${prefix}`);
  const arrayStart = start + prefix.length;
  const end = source.indexOf("];", arrayStart);
  if (end < 0) throw new Error(`Could not locate end marker for ${prefix}`);
  return JSON.parse(source.slice(arrayStart, end + 1));
}

function countOcrSignals(text) {
  const signals = [];
  if (!text?.trim()) return signals;
  if (/[£§©®]/u.test(text)) signals.push("unexpected_symbol");
  if (/\b(?:Py|Vv|Cee|Gescs)\b/u.test(text)) signals.push("ocr_footer_token");
  if (/\(x\)|\b[0-9]{1,2}%/iu.test(text)) signals.push("source_annotation_in_text");
  if (/\b(?:lliac|Li-|E2=|m10-11)\b/u.test(text)) signals.push("probable_character_substitution");
  return signals;
}

function auditDraft(question) {
  const combined = [question.stem, ...(question.options ?? []), question.explanation, question.learningNote].join(" ");
  const signals = countOcrSignals(combined);
  const correctOptionInRange = Number.isInteger(question.correctOption)
    && question.correctOption >= 0
    && question.correctOption < question.options.length;
  const answerEvidence = question.correctOption === null
    ? "no_detected_key"
    : correctOptionInRange
      ? "ocr_detected_key"
      : "invalid_detected_key";
  const hasSourceLink = Boolean(question.source?.sourceLink && question.source?.markdownFile && question.sourcePage > 0);
  const sourceReviewedDraft = question.status === "ocr_draft"
    && question.warnings?.includes("Source page and external anatomy reference reviewed; remains an unapproved OCR draft.")
    && Boolean(question.highYieldNote?.trim())
    && Boolean(question.mnemonic?.trim());
  const auditStatus = sourceReviewedDraft
    ? "source_page_and_external_evidence_verified_ocr_draft"
    : question.status === "ocr_draft" && correctOptionInRange && !signals.length
      ? "needs_source_confirmation"
      : "manual_source_review_required";
  return {
    id: question.id,
    recordType: "ocr_draft",
    subject: question.subject,
    topic: question.topic,
    sourceFile: question.source?.sourceFile ?? null,
    markdownFile: question.source?.markdownFile ?? null,
    sourcePage: question.sourcePage ?? null,
    sourceLink: question.source?.sourceLink ?? null,
    questionStatus: question.status,
    askable: Boolean(question.askable),
    optionCount: question.options?.length ?? 0,
    correctOption: question.correctOption,
    correctOptionInRange,
    answerEvidence,
    hasExplanation: Boolean(question.explanation?.trim()),
    hasLearningNote: Boolean(question.learningNote?.trim()),
    hasHighYieldNote: Boolean(question.highYieldNote?.trim()),
    hasMnemonic: Boolean(question.mnemonic?.trim()),
    needsImage: Boolean(question.needsImage),
    sourceWarnings: question.warnings ?? [],
    ocrSignals: signals,
    auditStatus,
    correctionAllowed: false,
    correctionRule: sourceReviewedDraft ? "This record has source-page and external evidence, but remains an OCR draft and requires a separate approval decision." : "Do not change OCR draft content until the original source page and an authoritative external source agree.",
  };
}

function pilotInventory(source) {
  const items = [];
  const start = source.indexOf("export const pilotQuestions: Question[] = [");
  const end = source.indexOf("\n];", start);
  const block = source.slice(start, end);
  const idMatches = [...block.matchAll(/id:\s+"([^"]+)"/g)];
  for (const match of idMatches) {
    const slice = block.slice(match.index, block.indexOf("\n  },", match.index));
    const sourcePage = Number((slice.match(/sourcePage:\s+(\d+)/) ?? [])[1] ?? 0);
    const sourceFile = (slice.match(/source:\s+"([^"]+)"/) ?? [])[1] ?? null;
    const optionLines = slice.match(/options:\s+\[([\s\S]*?)\],\n\s+correctOption:/);
    const optionCount = optionLines ? [...optionLines[1].matchAll(/"/g)].length / 2 : 0;
    const correctOption = Number((slice.match(/correctOption:\s+(\d+)/) ?? [])[1] ?? -1);
    items.push({
      id: match[1],
      recordType: "approved_pilot",
      subject: "Evidence-based medicine",
      topic: "Statistics",
      sourceFile,
      markdownFile: null,
      sourcePage,
      sourceLink: null,
      questionStatus: "source_reviewed",
      askable: true,
      optionCount,
      correctOption,
      correctOptionInRange: correctOption >= 0 && correctOption < optionCount,
      answerEvidence: "manual_source_review",
      hasExplanation: /explanation:\s+"/.test(slice),
      hasLearningNote: /learningNote:\s+"/.test(slice),
      hasHighYieldNote: /highYieldNote:\s+"/.test(slice),
      hasMnemonic: /mnemonic:\s+"/.test(slice),
      needsImage: false,
      sourceWarnings: [],
      ocrSignals: [],
      auditStatus: "source_reviewed",
      correctionAllowed: true,
      correctionRule: "A correction requires the supplied source page plus a corroborating authoritative external source when factual content changes.",
    });
  }
  return items;
}

function byCount(rows, selector) {
  return Object.entries(rows.reduce((accumulator, row) => {
    const key = selector(row);
    accumulator[key] = (accumulator[key] ?? 0) + 1;
    return accumulator;
  }, {})).sort(([a], [b]) => a.localeCompare(b));
}

function toMarkdown(summary) {
  const rows = [
    ["All local records", summary.totalRecords],
    ["Source-reviewed approved pilot", summary.byRecordType.approved_pilot ?? 0],
    ["OCR drafts", summary.byRecordType.ocr_draft ?? 0],
    ["OCR drafts with a detected key", summary.ocrDetectedKeys],
    ["Records without a detected key", summary.noDetectedKey],
    ["Records with an in-range answer index", summary.correctOptionInRange],
    ["Records with source links", summary.withSourceLink],
    ["Records with OCR artefact signals", summary.withOcrSignals],
    ["Records with high-yield notes", summary.withHighYieldNote],
    ["Records with mnemonics", summary.withMnemonic],
  ];
  return `# Local Question Audit Inventory\n\nThis inventory contains one ledger row per locally stored record. It is a **status and evidence inventory**, not a clinical content correction. OCR drafts remain unapproved even where their original source page and an authoritative external source support a correction.\n\n| Measure | Count |\n|---|---:|\n${rows.map(([label, count]) => `| ${label} | ${count} |`).join("\n")}\n\n## Subject distribution\n\n| Subject | Records |\n|---|---:|\n${summary.bySubject.map(([subject, count]) => `| ${subject} | ${count} |`).join("\n")}\n\n## Audit-state distribution\n\n| Audit state | Records |\n|---|---:|\n${Object.entries(summary.byAuditStatus).map(([state, count]) => `| ${state} | ${count} |`).join("\n")}\n\n## Next audit gate\n\nThis inventory does not modify records. A future batch may correct an OCR draft only after comparison with its source-linked PDF page and a corroborating authoritative external source.\n`;
}

const [draftSource, pilotSource] = await Promise.all([readFile(draftPath, "utf8"), readFile(pilotPath, "utf8")]);
const drafts = extractJsonArray(draftSource, "export const ocrDraftQuestions: OcrDraftQuestion[] = ");
const rows = [...pilotInventory(pilotSource), ...drafts.map(auditDraft)];
const summary = {
  generatedAt: new Date().toISOString(),
  totalRecords: rows.length,
  byRecordType: Object.fromEntries(byCount(rows, (row) => row.recordType)),
  bySubject: byCount(rows, (row) => row.subject),
  byAuditStatus: byCount(rows, (row) => row.auditStatus),
  ocrDetectedKeys: rows.filter((row) => row.answerEvidence === "ocr_detected_key").length,
  noDetectedKey: rows.filter((row) => row.answerEvidence === "no_detected_key").length,
  correctOptionInRange: rows.filter((row) => row.correctOptionInRange).length,
  withSourceLink: rows.filter((row) => Boolean(row.sourceLink && row.markdownFile && row.sourcePage)).length,
  withOcrSignals: rows.filter((row) => row.ocrSignals.length > 0).length,
  withHighYieldNote: rows.filter((row) => row.hasHighYieldNote).length,
  withMnemonic: rows.filter((row) => row.hasMnemonic).length,
};
await mkdir(outputDir, { recursive: true });
await Promise.all([
  writeFile(path.join(outputDir, "question-audit-ledger.json"), `${JSON.stringify(rows, null, 2)}\n`),
  writeFile(path.join(outputDir, "question-audit-summary.json"), `${JSON.stringify(summary, null, 2)}\n`),
  writeFile(path.join(outputDir, "question-audit-inventory.md"), toMarkdown(summary)),
]);
console.log(JSON.stringify(summary, null, 2));
