import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const bankPath = path.join(root, "client", "src", "lib", "ocrDraftSections.ts");
const planPath = path.join(root, "docs", "audit", "anatomy-batch-46-restorations.json");
const artifactPath = path.join(root, "docs", "audit", "applied-anatomy-batch-46.json");
const parse = (text) => {
  const token = "export const ocrDraftQuestions: OcrDraftQuestion[] = ";
  const start = text.indexOf(token) + token.length;
  const end = text.indexOf("];", start);
  if (start < token.length || end < 0) throw new Error("OCR draft export not found");
  return JSON.parse(text.slice(start, end + 1));
};
const [text, plan, artifact] = await Promise.all([
  readFile(bankPath, "utf8"),
  readFile(planPath, "utf8").then(JSON.parse),
  readFile(artifactPath, "utf8").then(JSON.parse),
]);
const drafts = new Map(parse(text).map((item) => [item.id, item]));
if (plan.length !== 10 || artifact.applied?.length !== 10 || artifact.restricted?.length !== 0 || artifact.automaticApproval !== false) throw new Error("Batch 46 artifact count/status contract failed");
for (const item of plan) {
  const draft = drafts.get(item.id);
  if (!draft || draft.sourcePage !== item.page) throw new Error(`Missing or mispaged record: ${item.id}`);
  if (draft.stem !== item.stem || JSON.stringify(draft.options) !== JSON.stringify(item.options) || draft.correctOption !== item.correctOption) throw new Error(`Literal restoration failed: ${item.id}`);
  if (draft.options.length !== 5 || draft.correctOption < 0 || draft.correctOption >= draft.options.length) throw new Error(`Option/key contract failed: ${item.id}`);
  if (draft.status !== "ocr_draft" || draft.askable !== true || draft.needsImage !== false || draft.approved !== undefined) throw new Error(`OCR/mock safeguard failed: ${item.id}`);
  if (!Array.isArray(draft.warnings) || !draft.warnings.includes("Source page and external anatomy reference reviewed; remains an unapproved OCR draft.")) throw new Error(`Review warning missing: ${item.id}`);
  if (!draft.memoryAid?.sourceUrl || !draft.memoryAid?.coreFact || !draft.memoryAid?.mnemonic || !Array.isArray(draft.memoryAid?.emojiCues)) throw new Error(`Learning-aid evidence missing: ${item.id}`);
  const evidence = artifact.applied.find((entry) => entry.id === item.id);
  if (!evidence || evidence.sourcePage !== item.page || evidence.evidence?.externalSource !== item.sourceUrl || !evidence.evidence?.externalFinding) throw new Error(`Evidence artifact missing: ${item.id}`);
}
console.log(JSON.stringify({ batch: 46, verified: 10, restored: 10, restricted: 0, automaticApproval: false, mockEligible: false }, null, 2));
