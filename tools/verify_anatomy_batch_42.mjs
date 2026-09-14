import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const artifactPath = path.join(root, "docs", "audit", "applied-anatomy-batch-42.json");
const bankPath = path.join(root, "client", "src", "lib", "ocrDraftSections.ts");
const expected = new Map([
  ["anatomy-anatomy-all-pdf-p1283-q0180", [1283, 4, 5]],
  ["anatomy-anatomy-all-pdf-p1284-q0001", [1284, 1, 5]],
  ["anatomy-anatomy-all-pdf-p1286-q0003", [1286, 0, 5]],
  ["anatomy-anatomy-all-pdf-p1287-q0004", [1287, 3, 5]],
  ["anatomy-anatomy-all-pdf-p1288-q0005", [1288, 0, 5]],
  ["anatomy-anatomy-all-pdf-p1289-q0006", [1289, 2, 5]],
  ["anatomy-anatomy-all-pdf-p1293-q0007", [1293, 3, 5]],
  ["anatomy-anatomy-all-pdf-p1294-q0008", [1294, 2, 5]],
  ["anatomy-anatomy-all-pdf-p1297-q0009", [1297, 3, 5]],
  ["anatomy-anatomy-all-pdf-p1298-q0010", [1298, 4, 5]],
]);
const warning = "Source page and external anatomy reference reviewed; remains an unapproved OCR draft.";
const fail = (message) => { throw new Error(message); };
const parseBank = (text) => { const token = "export const ocrDraftQuestions: OcrDraftQuestion[] = "; const start = text.indexOf(token) + token.length; const end = text.indexOf("];", start); if (start < token.length || end < 0) fail("OCR draft export not found"); return JSON.parse(text.slice(start, end + 1)); };
const artifact = JSON.parse(await readFile(artifactPath, "utf8"));
if (artifact.automaticApproval !== false) fail("automaticApproval must be false");
if (artifact.mockEligibility !== "No restored OCR draft is mock eligible.") fail("mock eligibility control missing");
if (!Array.isArray(artifact.applied) || artifact.applied.length !== 10) fail("expected ten applied records");
if (!Array.isArray(artifact.restricted) || artifact.restricted.length !== 0) fail("Batch 42 should have no separate restricted records");
const appliedIds = new Set(artifact.applied.map((entry) => entry.id));
if (appliedIds.size !== 10 || [...appliedIds].some((id) => !expected.has(id))) fail("artifact ID set mismatch");
for (const entry of artifact.applied) { const [page, key, count] = expected.get(entry.id); if (entry.sourcePage !== page || entry.after?.options?.length !== count || entry.after?.correctOption !== key || entry.after?.status !== "ocr_draft" || entry.after?.askable !== true || entry.after?.needsImage !== false || entry.after?.warnings?.length !== 1 || entry.after.warnings[0] !== warning || !entry.after?.highYieldNote || !entry.after?.mnemonic || !entry.after?.memoryAid?.sourceUrl?.startsWith("https://") || !Array.isArray(entry.after.memoryAid.emojiCues) || entry.after.memoryAid.emojiCues.length < 1 || entry.after.memoryAid.emojiCues.length > 3 || entry.after?.approved !== undefined || !entry.evidence?.externalSource?.startsWith("https://") || !entry.evidence?.externalFinding) fail(`artifact safeguards/evidence failed: ${entry.id}`); }
const bank = parseBank(await readFile(bankPath, "utf8"));
const byId = new Map(bank.map((item) => [item.id, item]));
for (const [id, [page, key, count]] of expected) { const item = byId.get(id); if (!item || item.sourcePage !== page || item.status !== "ocr_draft" || item.askable !== true || item.needsImage !== false || item.correctOption !== key || item.options.length !== count || item.warnings.length !== 1 || item.warnings[0] !== warning || !item.explanation || !item.learningNote || !item.highYieldNote || !item.mnemonic || !item.memoryAid?.coreFact || !item.memoryAid?.mnemonic || !item.memoryAid?.cueLabel || !item.memoryAid?.sourceLabel || !item.memoryAid?.sourceUrl?.startsWith("https://") || !Array.isArray(item.memoryAid.emojiCues) || item.memoryAid.emojiCues.length < 1 || item.memoryAid.emojiCues.length > 3 || Object.prototype.hasOwnProperty.call(item, "approved")) fail(`restored bank safeguards failed: ${id}`); }
console.log(JSON.stringify({ restoredVerified: 10, restrictedVerified: 0, approvedRecordsCreated: 0, result: "pass" }));
