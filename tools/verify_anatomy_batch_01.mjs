/** Verifies the post-application constraints for Anatomy Batch 01. */
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const bankPath = path.join(root, "client", "src", "lib", "ocrDraftSections.ts");
const artifactPath = path.join(root, "docs", "audit", "applied-anatomy-batch-01.json");
const reviewedWarning = "Source page and external anatomy reference reviewed; remains an unapproved OCR draft.";
const unresolvedIds = ["anatomy-anatomy-all-pdf-p0006-q0002", "anatomy-anatomy-all-pdf-p0009-q0003"];

function parseDrafts(source) {
  const prefix = "export const ocrDraftQuestions: OcrDraftQuestion[] = ";
  const start = source.indexOf(prefix);
  const arrayStart = start + prefix.length;
  const end = source.indexOf("];", arrayStart);
  if (start < 0 || end < 0) throw new Error("OCR draft export not found");
  return JSON.parse(source.slice(arrayStart, end + 1));
}

const [bankSource, artifactSource] = await Promise.all([readFile(bankPath, "utf8"), readFile(artifactPath, "utf8")]);
const drafts = new Map(parseDrafts(bankSource).map((item) => [item.id, item]));
const artifact = JSON.parse(artifactSource);
if (artifact.automaticApproval !== false) throw new Error("Audit artifact must explicitly prohibit automatic approval.");
if (artifact.applied.length !== 8) throw new Error(`Expected eight applied records, found ${artifact.applied.length}.`);

for (const item of artifact.applied) {
  const draft = drafts.get(item.id);
  if (!draft) throw new Error(`Missing applied draft ${item.id}.`);
  if (draft.status !== "ocr_draft") throw new Error(`${item.id} was promoted from OCR draft status.`);
  if (!draft.askable) throw new Error(`${item.id} was not retained as available OCR-draft practice.`);
  if (!draft.warnings?.includes(reviewedWarning)) throw new Error(`${item.id} lacks the retained source-verification warning.`);
  if (!draft.highYieldNote?.trim() || !draft.mnemonic?.trim()) throw new Error(`${item.id} lacks a complete source-supported learning aid.`);
  if (draft.correctOption !== item.after.correctOption) throw new Error(`${item.id} has a corrected-key mismatch.`);
}

for (const id of unresolvedIds) {
  const draft = drafts.get(id);
  if (!draft) throw new Error(`Missing unresolved draft ${id}.`);
  if (draft.status !== "needs_review") throw new Error(`${id} is not retained as needs_review.`);
  if (draft.highYieldNote || draft.mnemonic) throw new Error(`${id} incorrectly received a learning aid.`);
}

console.log(JSON.stringify({ appliedVerified: artifact.applied.length, unresolvedVerified: unresolvedIds.length, approvedRecordsCreated: 0, result: "pass" }, null, 2));
