import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const bankPath = path.join(root, "client", "src", "lib", "ocrDraftSections.ts");
const artifactPath = path.join(root, "docs", "audit", "applied-anatomy-batch-25.json");
const reviewedWarning = "Source page and external anatomy reference reviewed; remains an unapproved OCR draft.";
const restored = new Map([
  ["anatomy-anatomy-all-pdf-p0696-q0004", [696, 2]],
  ["anatomy-anatomy-all-pdf-p0700-q0005", [700, 1]],
  ["anatomy-anatomy-all-pdf-p0710-q0007", [710, 2]],
  ["anatomy-anatomy-all-pdf-p0715-q0008", [715, 0]],
  ["anatomy-anatomy-all-pdf-p0719-q0009", [719, 2]]
]);
const restricted = new Map([
  ["anatomy-anatomy-all-pdf-p0692-q0003", 692],
  ["anatomy-anatomy-all-pdf-p0705-q0006", 705],
  ["anatomy-anatomy-all-pdf-p0723-q0010", 723],
  ["anatomy-anatomy-all-pdf-p0731-q0012", 731],
  ["anatomy-anatomy-all-pdf-p0737-q0013", 737]
]);

function drafts(source) {
  const prefix = "export const ocrDraftQuestions: OcrDraftQuestion[] = ";
  const start = source.indexOf(prefix);
  const arrayStart = start + prefix.length;
  const end = source.indexOf("];", arrayStart);
  if (start < 0 || end < 0) throw new Error("OCR draft export not found");
  return JSON.parse(source.slice(arrayStart, end + 1));
}

const [bank, artifactText] = await Promise.all([readFile(bankPath, "utf8"), readFile(artifactPath, "utf8")]);
const byId = new Map(drafts(bank).map((draft) => [draft.id, draft]));
const artifact = JSON.parse(artifactText);
if (artifact.automaticApproval !== false || artifact.mockEligibility !== "No restored OCR draft is mock eligible.") throw new Error("Audit artifact lacks required approval or mock-exclusion safeguards.");
if (artifact.applied.length !== restored.size || artifact.restricted.length !== restricted.size) throw new Error("Batch 25 artifact count mismatch.");

for (const row of artifact.applied) {
  const expected = restored.get(row.id);
  const draft = byId.get(row.id);
  if (!expected || !draft || draft.sourcePage !== expected[0] || row.sourcePage !== expected[0]) throw new Error(`Unexpected restored record ${row.id}.`);
  if (draft.status !== "ocr_draft" || !draft.askable || draft.approved === true || draft.needsImage || draft.correctOption !== expected[1] || draft.correctOption < 0 || draft.correctOption >= draft.options.length) throw new Error(`${row.id} restoration state invalid.`);
  if (!Array.isArray(draft.warnings) || draft.warnings.length !== 1 || draft.warnings[0] !== reviewedWarning) throw new Error(`${row.id} lacks exact review warning.`);
  if (draft.options.length !== 5 || draft.options.some((option) => !option?.trim()) || !draft.highYieldNote?.trim() || !draft.mnemonic?.trim() || !draft.memoryAid?.coreFact?.trim() || !draft.memoryAid?.mnemonic?.trim() || !draft.memoryAid?.cueLabel?.trim() || !draft.memoryAid?.sourceLabel?.trim() || !draft.memoryAid?.sourceUrl?.startsWith("https://") || !Array.isArray(draft.memoryAid.emojiCues) || draft.memoryAid.emojiCues.length < 1 || draft.memoryAid.emojiCues.length > 3 || draft.memoryAid.emojiCues.some((cue) => !cue?.trim())) throw new Error(`${row.id} learning-aid state invalid.`);
  if (!row.evidence?.externalSource?.startsWith("https://") || !row.evidence?.externalFinding?.trim()) throw new Error(`${row.id} lacks evidence.`);
}

for (const row of artifact.restricted) {
  const expectedPage = restricted.get(row.id);
  const draft = byId.get(row.id);
  if (!expectedPage || !draft || draft.sourcePage !== expectedPage || row.sourcePage !== expectedPage) throw new Error(`Unexpected restricted record ${row.id}.`);
  if (draft.status !== "needs_review" || draft.askable || draft.approved === true || draft.needsImage || draft.correctOption !== null) throw new Error(`${row.id} restricted state invalid.`);
  if (draft.learningNote || draft.highYieldNote || draft.mnemonic || draft.memoryAid) throw new Error(`${row.id} retains prohibited learning aids.`);
  if (!Array.isArray(draft.warnings) || draft.warnings.length !== 1 || !draft.warnings[0].startsWith("Source page reviewed,")) throw new Error(`${row.id} lacks the required source-page warning.`);
  if (!row.evidence?.externalSource?.startsWith("https://") || !row.evidence?.externalFinding?.trim()) throw new Error(`${row.id} lacks restriction evidence.`);
}

console.log(JSON.stringify({ restoredVerified: artifact.applied.length, restrictedVerified: artifact.restricted.length, approvedRecordsCreated: 0, result: "pass" }, null, 2));
