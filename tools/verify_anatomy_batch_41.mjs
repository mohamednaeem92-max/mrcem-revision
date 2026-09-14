import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const artifactPath = path.join(root, "docs", "audit", "applied-anatomy-batch-41.json");
const bankPath = path.join(root, "client", "src", "lib", "ocrDraftSections.ts");
const expectedRestored = new Map([
  ["anatomy-anatomy-all-pdf-p1262-q0169", [1262, 2, 5]],
  ["anatomy-anatomy-all-pdf-p1263-q0170", [1263, 2, 5]],
  ["anatomy-anatomy-all-pdf-p1264-q0171", [1264, 3, 5]],
  ["anatomy-anatomy-all-pdf-p1265-q0172", [1265, 0, 4]],
  ["anatomy-anatomy-all-pdf-p1266-q0173", [1266, 1, 5]],
  ["anatomy-anatomy-all-pdf-p1267-q0174", [1267, 3, 5]],
  ["anatomy-anatomy-all-pdf-p1269-q0176", [1269, 2, 5]],
  ["anatomy-anatomy-all-pdf-p1279-q0179", [1279, 2, 5]],
]);
const expectedRestricted = new Map([
  ["anatomy-anatomy-all-pdf-p1268-q0175", 1268],
  ["anatomy-anatomy-all-pdf-p1276-q0178", 1276],
]);
const warning = "Source page and external anatomy reference reviewed; remains an unapproved OCR draft.";
const fail = (message) => { throw new Error(message); };
const parseBank = (text) => { const token = "export const ocrDraftQuestions: OcrDraftQuestion[] = "; const start = text.indexOf(token) + token.length; const end = text.indexOf("];", start); if (start < token.length || end < 0) fail("OCR draft export not found"); return JSON.parse(text.slice(start, end + 1)); };
const artifact = JSON.parse(await readFile(artifactPath, "utf8"));
if (artifact.automaticApproval !== false) fail("automaticApproval must be false");
if (artifact.mockEligibility !== "No restored OCR draft is mock eligible.") fail("mock eligibility control missing");
if (!Array.isArray(artifact.applied) || artifact.applied.length !== 8) fail("expected eight applied records");
if (!Array.isArray(artifact.restricted) || artifact.restricted.length !== 2) fail("expected two restricted records");
if (artifact.applied.some((entry) => entry.after?.status !== "ocr_draft" || entry.after?.askable !== true || entry.after?.needsImage !== false || entry.after?.warnings?.length !== 1 || entry.after.warnings[0] !== warning || entry.after?.correctOption === null || !entry.after?.highYieldNote || !entry.after?.mnemonic || !entry.after?.memoryAid?.sourceUrl?.startsWith("https://") || !Array.isArray(entry.after.memoryAid.emojiCues) || entry.after.memoryAid.emojiCues.length < 1 || entry.after.memoryAid.emojiCues.length > 3 || entry.after?.approved !== undefined)) fail("restored artifact safeguards failed");
if (artifact.restricted.some((entry) => entry.after?.status !== "needs_review" || entry.after?.askable !== false || entry.after?.correctOption !== null || entry.after?.learningNote !== "" || entry.after?.highYieldNote !== "" || entry.after?.mnemonic !== "" || entry.after?.memoryAid !== null || entry.after?.warnings?.length !== 1 || !entry.after.warnings[0].startsWith("Source page reviewed,") || entry.after?.approved !== undefined)) fail("restricted artifact safeguards failed");
const appliedIds = new Set(artifact.applied.map((entry) => entry.id));
const restrictedIds = new Set(artifact.restricted.map((entry) => entry.id));
if (appliedIds.size !== 8 || restrictedIds.size !== 2 || [...appliedIds].some((id) => !expectedRestored.has(id)) || [...restrictedIds].some((id) => !expectedRestricted.has(id))) fail("artifact ID set mismatch");
for (const entry of artifact.applied) { const [page, key, count] = expectedRestored.get(entry.id); if (entry.sourcePage !== page || entry.before?.options?.length !== undefined && entry.after?.options?.length !== count || entry.after?.correctOption !== key || entry.evidence?.externalSource?.startsWith("https://") !== true || !entry.evidence?.externalFinding) fail(`restored artifact evidence mismatch: ${entry.id}`); }
for (const entry of artifact.restricted) { const page = expectedRestricted.get(entry.id); if (entry.sourcePage !== page || entry.after?.sourcePage !== undefined || entry.evidence?.externalSource?.startsWith("https://") !== true || !entry.evidence?.externalFinding) fail(`restricted artifact evidence mismatch: ${entry.id}`); }
const bank = parseBank(await readFile(bankPath, "utf8"));
const byId = new Map(bank.map((item) => [item.id, item]));
for (const [id, [page, key, count]] of expectedRestored) { const item = byId.get(id); if (!item || item.sourcePage !== page || item.status !== "ocr_draft" || item.askable !== true || item.needsImage !== false || item.correctOption !== key || item.options.length !== count || item.warnings.length !== 1 || item.warnings[0] !== warning || !item.explanation || !item.learningNote || !item.highYieldNote || !item.mnemonic || !item.memoryAid?.coreFact || !item.memoryAid?.mnemonic || !item.memoryAid?.cueLabel || !item.memoryAid?.sourceLabel || !item.memoryAid?.sourceUrl?.startsWith("https://") || !Array.isArray(item.memoryAid.emojiCues) || item.memoryAid.emojiCues.length < 1 || item.memoryAid.emojiCues.length > 3 || Object.prototype.hasOwnProperty.call(item, "approved")) fail(`restored bank safeguards failed: ${id}`); }
for (const [id, page] of expectedRestricted) { const item = byId.get(id); if (!item || item.sourcePage !== page || item.status !== "needs_review" || item.askable !== false || item.correctOption !== null || item.needsImage !== false || item.warnings.length !== 1 || !item.warnings[0].startsWith("Source page reviewed,") || item.learningNote !== "" || item.highYieldNote !== "" || item.mnemonic !== "" || item.memoryAid !== undefined || Object.prototype.hasOwnProperty.call(item, "approved")) fail(`restricted bank safeguards failed: ${id}`); }
console.log(JSON.stringify({ restoredVerified: 8, restrictedVerified: 2, approvedRecordsCreated: 0, result: "pass" }));
