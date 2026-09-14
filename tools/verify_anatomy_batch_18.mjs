import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const bankPath = path.join(root, "client", "src", "lib", "ocrDraftSections.ts");
const artifactPath = path.join(root, "docs", "audit", "applied-anatomy-batch-18.json");
const reviewedWarning = "Source page and external anatomy reference reviewed; remains an unapproved OCR draft.";
const restored = new Map([
  ["anatomy-anatomy-all-pdf-p0593-q0178", { page: 593, key: 1 }],
  ["anatomy-anatomy-all-pdf-p0596-q0179", { page: 596, key: 2 }],
  ["anatomy-anatomy-all-pdf-p0600-q0180", { page: 600, key: 4 }],
  ["anatomy-anatomy-all-pdf-p0601-q0001", { page: 601, key: 1 }],
  ["anatomy-anatomy-all-pdf-p0603-q0003", { page: 603, key: 0 }],
  ["anatomy-anatomy-all-pdf-p0604-q0004", { page: 604, key: 3 }],
  ["anatomy-anatomy-all-pdf-p0610-q0007", { page: 610, key: 3 }],
  ["anatomy-anatomy-all-pdf-p0611-q0008", { page: 611, key: 2 }]
]);
const restricted = new Map([
  ["anatomy-anatomy-all-pdf-p0605-q0005", { page: 605 }],
  ["anatomy-anatomy-all-pdf-p0606-q0006", { page: 606 }]
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
if (artifact.applied.length !== restored.size || artifact.restricted.length !== restricted.size) throw new Error(`Expected ${restored.size} restored and ${restricted.size} restricted records; found ${artifact.applied.length} and ${artifact.restricted.length}.`);

for (const item of artifact.applied) {
  const expectation = restored.get(item.id); const draft = drafts.get(item.id);
  if (!expectation || !draft) throw new Error(`Unexpected or missing restored draft ${item.id}.`);
  if (draft.sourcePage !== expectation.page || item.sourcePage !== expectation.page) throw new Error(`${item.id} has source-page drift.`);
  if (draft.status !== "ocr_draft" || !draft.askable || draft.approved === true || draft.needsImage) throw new Error(`${item.id} was promoted, approved, or incorrectly excluded.`);
  if (!Array.isArray(draft.warnings) || draft.warnings.length !== 1 || draft.warnings[0] !== reviewedWarning) throw new Error(`${item.id} lacks the exact source-review warning.`);
  if (!draft.highYieldNote?.trim() || !draft.mnemonic?.trim() || !draft.memoryAid?.coreFact?.trim() || !draft.memoryAid?.mnemonic?.trim() || !draft.memoryAid?.cueLabel?.trim() || !draft.memoryAid?.sourceLabel?.trim() || !draft.memoryAid?.sourceUrl?.startsWith("https://")) throw new Error(`${item.id} lacks a complete source-linked learning aid.`);
  if (!Array.isArray(draft.memoryAid.emojiCues) || draft.memoryAid.emojiCues.length < 1 || draft.memoryAid.emojiCues.length > 3 || draft.memoryAid.emojiCues.some((cue) => typeof cue !== "string" || !cue.trim())) throw new Error(`${item.id} has invalid emoji recall cues.`);
  if (draft.correctOption !== expectation.key || item.after.correctOption !== expectation.key || draft.correctOption < 0 || draft.correctOption >= draft.options.length) throw new Error(`${item.id} has a corrected-key mismatch.`);
  if (draft.options.length !== 5 || draft.options.some((option) => !option?.trim())) throw new Error(`${item.id} does not have five source-clean options.`);
  if (!item.evidence?.externalSource?.startsWith("https://") || !item.evidence.externalFinding?.trim()) throw new Error(`${item.id} lacks documented external evidence.`);
}

for (const item of artifact.restricted) {
  const expectation = restricted.get(item.id); const draft = drafts.get(item.id);
  if (!expectation || !draft) throw new Error(`Unexpected or missing restricted draft ${item.id}.`);
  if (draft.sourcePage !== expectation.page || item.sourcePage !== expectation.page) throw new Error(`${item.id} has source-page drift.`);
  if (draft.status !== "needs_review" || draft.askable || draft.correctOption !== null || draft.approved === true || draft.needsImage) throw new Error(`${item.id} is not safely excluded.`);
  if (!Array.isArray(draft.warnings) || draft.warnings.length !== 1 || !draft.warnings[0].startsWith("Source page reviewed,")) throw new Error(`${item.id} lacks the required restriction warning.`);
  if (draft.learningNote || draft.highYieldNote || draft.mnemonic || draft.memoryAid) throw new Error(`${item.id} retains learning aids despite restriction.`);
  if (draft.options.length !== 5 || draft.options.some((option) => !option?.trim())) throw new Error(`${item.id} does not have five source-clean options.`);
  if (!item.evidence?.externalSource?.startsWith("https://") || !item.evidence.externalFinding?.trim()) throw new Error(`${item.id} lacks documented restriction evidence.`);
}

console.log(JSON.stringify({ restoredVerified: artifact.applied.length, restrictedVerified: artifact.restricted.length, approvedRecordsCreated: 0, result: "pass" }, null, 2));
