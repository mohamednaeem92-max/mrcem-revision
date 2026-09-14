import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const bankPath = path.join(root, "client", "src", "lib", "ocrDraftSections.ts");
const artifactPath = path.join(root, "docs", "audit", "applied-anatomy-batch-15.json");
const reviewedWarning = "Source page and external anatomy reference reviewed; remains an unapproved OCR draft.";
const expected = new Map([
  ["anatomy-anatomy-all-pdf-p0537-q0146", { page: 537, key: 4 }],
  ["anatomy-anatomy-all-pdf-p0541-q0147", { page: 541, key: 3 }],
  ["anatomy-anatomy-all-pdf-p0546-q0148", { page: 546, key: 2 }],
  ["anatomy-anatomy-all-pdf-p0547-q0149", { page: 547, key: 1 }],
  ["anatomy-anatomy-all-pdf-p0550-q0150", { page: 550, key: 2 }],
  ["anatomy-anatomy-all-pdf-p0551-q0151", { page: 551, key: 0 }],
  ["anatomy-anatomy-all-pdf-p0552-q0152", { page: 552, key: 3 }],
  ["anatomy-anatomy-all-pdf-p0553-q0153", { page: 553, key: 2 }],
  ["anatomy-anatomy-all-pdf-p0554-q0154", { page: 554, key: 2 }],
  ["anatomy-anatomy-all-pdf-p0555-q0155", { page: 555, key: 0 }]
]);

function parseDrafts(source) {
  const prefix = "export const ocrDraftQuestions: OcrDraftQuestion[] = ";
  const start = source.indexOf(prefix); const arrayStart = start + prefix.length; const end = source.indexOf("];", arrayStart);
  if (start < 0 || end < 0) throw new Error("OCR draft export not found");
  return JSON.parse(source.slice(arrayStart, end + 1));
}

const [bankSource, artifactSource] = await Promise.all([readFile(bankPath, "utf8"), readFile(artifactPath, "utf8")]);
const drafts = new Map(parseDrafts(bankSource).map((item) => [item.id, item]));
const artifact = JSON.parse(artifactSource);
if (artifact.automaticApproval !== false) throw new Error("Audit artifact must prohibit automatic approval.");
if (artifact.mockEligibility !== "No restored OCR draft is mock eligible.") throw new Error("Audit artifact lacks the explicit mock-exclusion note.");
if (artifact.applied.length !== 10 || artifact.restricted.length !== 0) throw new Error(`Expected 10 restored and 0 restricted records; found ${artifact.applied.length} and ${artifact.restricted.length}.`);
if (new Set(artifact.applied.map((item) => item.id)).size !== expected.size) throw new Error("Applied Batch 15 IDs are duplicated or incomplete.");

for (const item of artifact.applied) {
  const expectation = expected.get(item.id); const draft = drafts.get(item.id);
  if (!expectation || !draft) throw new Error(`Unexpected or missing restored draft ${item.id}.`);
  if (draft.sourcePage !== expectation.page || item.sourcePage !== expectation.page) throw new Error(`${item.id} has source-page drift.`);
  if (draft.status !== "ocr_draft" || !draft.askable || draft.approved === true) throw new Error(`${item.id} was promoted, approved, or incorrectly excluded.`);
  if (!Array.isArray(draft.warnings) || draft.warnings.length !== 1 || draft.warnings[0] !== reviewedWarning) throw new Error(`${item.id} lacks the exact source-review warning.`);
  if (!draft.highYieldNote?.trim() || !draft.mnemonic?.trim() || !draft.memoryAid?.coreFact?.trim() || !draft.memoryAid?.mnemonic?.trim() || !draft.memoryAid?.cueLabel?.trim() || !draft.memoryAid?.sourceLabel?.trim() || !draft.memoryAid?.sourceUrl?.startsWith("https://")) throw new Error(`${item.id} lacks a complete source-linked learning aid.`);
  if (!Array.isArray(draft.memoryAid.emojiCues) || draft.memoryAid.emojiCues.length < 1 || draft.memoryAid.emojiCues.length > 3 || draft.memoryAid.emojiCues.some((cue) => typeof cue !== "string" || !cue.trim())) throw new Error(`${item.id} has invalid emoji recall cues.`);
  if (draft.correctOption !== expectation.key || item.after.correctOption !== expectation.key || draft.correctOption < 0 || draft.correctOption >= draft.options.length) throw new Error(`${item.id} has a corrected-key mismatch.`);
  if (draft.options.length !== 5 || draft.options.some((option) => !option?.trim())) throw new Error(`${item.id} does not have five source-clean options.`);
  if (!item.evidence?.externalSource?.startsWith("https://") || !item.evidence.externalFinding?.trim()) throw new Error(`${item.id} lacks documented external evidence.`);
}

console.log(JSON.stringify({ restoredVerified: artifact.applied.length, restrictedVerified: artifact.restricted.length, approvedRecordsCreated: 0, result: "pass" }, null, 2));
