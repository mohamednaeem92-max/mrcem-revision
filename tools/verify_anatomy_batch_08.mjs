/** Verifies post-application safeguards for Anatomy Batch 08. */
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const bankPath = path.join(root, "client", "src", "lib", "ocrDraftSections.ts");
const artifactPath = path.join(root, "docs", "audit", "applied-anatomy-batch-08.json");
const reviewedWarning = "Source page and external anatomy reference reviewed; remains an unapproved OCR draft.";

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
if (artifact.applied.length !== 8) throw new Error(`Expected eight restored records, found ${artifact.applied.length}.`);
if (artifact.restricted.length !== 2) throw new Error(`Expected two restricted records, found ${artifact.restricted.length}.`);

for (const item of artifact.applied) {
  const draft = drafts.get(item.id);
  if (!draft) throw new Error(`Missing restored draft ${item.id}.`);
  if (draft.status !== "ocr_draft" || !draft.askable) throw new Error(`${item.id} was promoted or incorrectly excluded.`);
  if (!draft.warnings?.includes(reviewedWarning)) throw new Error(`${item.id} lacks the source-review warning.`);
  if (!draft.highYieldNote?.trim() || !draft.mnemonic?.trim() || !draft.memoryAid?.coreFact?.trim() || !draft.memoryAid?.sourceUrl?.startsWith("https://")) {
    throw new Error(`${item.id} lacks a complete source-linked learning aid.`);
  }
  if (!Array.isArray(draft.memoryAid.emojiCues) || draft.memoryAid.emojiCues.length < 1 || draft.memoryAid.emojiCues.length > 3 || draft.memoryAid.emojiCues.some((cue) => typeof cue !== "string" || !cue.trim())) {
    throw new Error(`${item.id} has invalid emoji recall cues.`);
  }
  if (draft.correctOption !== item.after.correctOption || draft.correctOption < 0 || draft.correctOption >= draft.options.length) {
    throw new Error(`${item.id} has a corrected-key mismatch.`);
  }
}

for (const item of artifact.restricted) {
  const draft = drafts.get(item.id);
  if (!draft) throw new Error(`Missing restricted draft ${item.id}.`);
  if (draft.status !== "needs_review" || draft.askable) throw new Error(`${item.id} is not correctly excluded from answer learning.`);
  if (!draft.warnings?.some((warning) => warning.startsWith("Source page reviewed,"))) throw new Error(`${item.id} lacks a source-reviewed restriction warning.`);
  if (draft.highYieldNote || draft.mnemonic || draft.memoryAid) throw new Error(`${item.id} incorrectly received a learning aid.`);
  if (draft.correctOption !== null) throw new Error(`${item.id} retains a key despite medical restriction.`);
}

console.log(JSON.stringify({ restoredVerified: artifact.applied.length, restrictedVerified: artifact.restricted.length, approvedRecordsCreated: 0, result: "pass" }, null, 2));
