import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const bankPath = path.join(root, "client", "src", "lib", "ocrDraftSections.ts");
const artifactPath = path.join(root, "docs", "audit", "applied-anatomy-batch-22.json");
const reviewedWarning = "Source page and external anatomy reference reviewed; remains an unapproved OCR draft.";
const restored = new Map([
  ["anatomy-anatomy-all-pdf-p0650-q0039", [650, 2]],
  ["anatomy-anatomy-all-pdf-p0651-q0040", [651, 3]],
  ["anatomy-anatomy-all-pdf-p0652-q0041", [652, 0]],
  ["anatomy-anatomy-all-pdf-p0653-q0042", [653, 3]],
  ["anatomy-anatomy-all-pdf-p0654-q0043", [654, 1]],
  ["anatomy-anatomy-all-pdf-p0655-q0044", [655, 0]],
  ["anatomy-anatomy-all-pdf-p0656-q0045", [656, 3]],
  ["anatomy-anatomy-all-pdf-p0659-q0046", [659, 2]],
  ["anatomy-anatomy-all-pdf-p0660-q0047", [660, 3]],
  ["anatomy-anatomy-all-pdf-p0663-q0048", [663, 4]]
]);
function drafts(source) { const p = "export const ocrDraftQuestions: OcrDraftQuestion[] = "; const s = source.indexOf(p); const a = s + p.length; const e = source.indexOf("];", a); if (s < 0 || e < 0) throw new Error("OCR draft export not found"); return JSON.parse(source.slice(a, e + 1)); }

const [bank, artifactText] = await Promise.all([readFile(bankPath, "utf8"), readFile(artifactPath, "utf8")]);
const byId = new Map(drafts(bank).map((d) => [d.id, d]));
const artifact = JSON.parse(artifactText);
if (artifact.automaticApproval !== false || artifact.mockEligibility !== "No restored OCR draft is mock eligible.") throw new Error("Audit artifact lacks required approval or mock-exclusion safeguards.");
if (artifact.applied.length !== restored.size || artifact.restricted.length !== 0) throw new Error("Batch 22 artifact count mismatch.");
for (const row of artifact.applied) {
  const expect = restored.get(row.id);
  const d = byId.get(row.id);
  if (!expect || !d || d.sourcePage !== expect[0] || row.sourcePage !== expect[0]) throw new Error(`Unexpected restored record ${row.id}.`);
  if (d.status !== "ocr_draft" || !d.askable || d.approved === true || d.needsImage || d.correctOption !== expect[1] || d.correctOption < 0 || d.correctOption >= d.options.length) throw new Error(`${row.id} restoration state invalid.`);
  if (!Array.isArray(d.warnings) || d.warnings.length !== 1 || d.warnings[0] !== reviewedWarning) throw new Error(`${row.id} lacks exact review warning.`);
  if (d.options.length !== 5 || d.options.some((o) => !o?.trim()) || !d.highYieldNote?.trim() || !d.mnemonic?.trim() || !d.memoryAid?.coreFact?.trim() || !d.memoryAid?.mnemonic?.trim() || !d.memoryAid?.cueLabel?.trim() || !d.memoryAid?.sourceLabel?.trim() || !d.memoryAid?.sourceUrl?.startsWith("https://") || !Array.isArray(d.memoryAid.emojiCues) || d.memoryAid.emojiCues.length < 1 || d.memoryAid.emojiCues.length > 3 || d.memoryAid.emojiCues.some((c) => !c?.trim())) throw new Error(`${row.id} learning-aid state invalid.`);
  if (!row.evidence?.externalSource?.startsWith("https://") || !row.evidence?.externalFinding?.trim()) throw new Error(`${row.id} lacks evidence.`);
}
console.log(JSON.stringify({ restoredVerified: artifact.applied.length, restrictedVerified: 0, approvedRecordsCreated: 0, result: "pass" }, null, 2));
