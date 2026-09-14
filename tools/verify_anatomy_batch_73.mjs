import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const bankPath = path.join(root, "client", "src", "lib", "ocrDraftSections.ts");
const planPath = path.join(root, "docs", "audit", "anatomy-batch-73-restorations.json");
const artifactPath = path.join(root, "docs", "audit", "applied-anatomy-batch-73.json");
const reviewedWarning = "Source page and external anatomy reference reviewed; remains an unapproved OCR draft.";
const restrictedWarning = "Restricted: complete source option list and answer key unavailable; image-dependent item.";
const parse = (text) => {
  const token = "export const ocrDraftQuestions: OcrDraftQuestion[] = ";
  const start = text.indexOf(token) + token.length;
  const end = text.indexOf("];", start);
  if (start < token.length || end < 0) throw new Error("OCR draft export not found");
  return JSON.parse(text.slice(start, end + 1));
};
const [text, plan, artifact] = await Promise.all([readFile(bankPath, "utf8"), readFile(planPath, "utf8").then(JSON.parse), readFile(artifactPath, "utf8").then(JSON.parse)]);
const drafts = new Map(parse(text).map((item) => [item.id, item]));
if (plan.length !== 10 || artifact.applied?.length !== 10 || artifact.restricted?.length !== 0 || artifact.automaticApproval !== false) throw new Error("Batch 73 artifact count/status contract failed");
for (const item of plan) {
  const draft = drafts.get(item.id);
  if (!draft || draft.sourcePage !== item.page) throw new Error(`Missing or mispaged record: ${item.id}`);
  const evidence = item.restricted ? artifact.restricted.find((entry) => entry.id === item.id) : artifact.applied.find((entry) => entry.id === item.id);
  if (!evidence || evidence.sourcePage !== item.page || evidence.evidence?.externalSource !== item.sourceUrl || !evidence.evidence?.externalFinding) throw new Error(`Evidence artifact missing: ${item.id}`);
  if (item.restricted) {
    if (draft.stem !== item.stem || JSON.stringify(draft.options) !== JSON.stringify(item.options) || draft.correctOption !== null) throw new Error(`Restricted literal contract failed: ${item.id}`);
    if (draft.status !== "needs_image" || draft.askable !== false || draft.needsImage !== true || draft.approved !== undefined || !draft.warnings?.includes(reviewedWarning) || !draft.warnings?.includes(restrictedWarning)) throw new Error(`Restricted safeguard failed: ${item.id}`);
    if (!draft.memoryAid?.sourceUrl || !draft.memoryAid?.coreFact || !draft.memoryAid?.mnemonic || !Array.isArray(draft.memoryAid?.emojiCues)) throw new Error(`Restricted evidence aid missing: ${item.id}`);
  } else {
    if (draft.stem !== item.stem || JSON.stringify(draft.options) !== JSON.stringify(item.options) || draft.correctOption !== item.correctOption) throw new Error(`Literal restoration failed: ${item.id}`);
    if (draft.options.length !== 5 || draft.correctOption < 0 || draft.correctOption >= draft.options.length) throw new Error(`Option/key contract failed: ${item.id}`);
    if (draft.status !== "ocr_draft" || draft.askable !== true || draft.needsImage !== false || draft.approved !== undefined || !draft.warnings?.includes(reviewedWarning)) throw new Error(`OCR/mock safeguard failed: ${item.id}`);
    if (!draft.memoryAid?.sourceUrl || !draft.memoryAid?.coreFact || !draft.memoryAid?.mnemonic || !Array.isArray(draft.memoryAid?.emojiCues)) throw new Error(`Learning-aid evidence missing: ${item.id}`);
  }
}
console.log(JSON.stringify({ batch: 73, verified: 10, restored: 10, restricted: 0, automaticApproval: false, mockEligible: false }, null, 2));
