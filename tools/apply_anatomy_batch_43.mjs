import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const bankPath = path.join(root, "client", "src", "lib", "ocrDraftSections.ts");
const snapshotPath = path.join(root, "docs", "audit", "anatomy-all-pdf-batch-43-ocr-records.json");
const planPath = path.join(root, "docs", "audit", "anatomy-batch-43-restorations.json");
const artifactPath = path.join(root, "docs", "audit", "applied-anatomy-batch-43.json");
const reviewedWarning = "Source page and external anatomy reference reviewed; remains an unapproved OCR draft.";

const parse = (text) => {
  const token = "export const ocrDraftQuestions: OcrDraftQuestion[] = ";
  const start = text.indexOf(token) + token.length;
  const end = text.indexOf("];", start);
  if (start < token.length || end < 0) throw new Error("OCR draft export not found");
  return { start, end, drafts: JSON.parse(text.slice(start, end + 1)) };
};
const same = (a, b) => JSON.stringify(a) === JSON.stringify(b);
const record = (draft) => ({
  id: draft.id,
  sourcePage: draft.sourcePage,
  stem: draft.stem,
  options: draft.options,
  correctOption: draft.correctOption,
  status: draft.status,
  askable: draft.askable,
  needsImage: draft.needsImage,
  warnings: draft.warnings ?? [],
  explanation: draft.explanation ?? "",
  learningNote: draft.learningNote ?? "",
  highYieldNote: draft.highYieldNote ?? "",
  mnemonic: draft.mnemonic ?? "",
  memoryAid: draft.memoryAid ?? null,
});

const [text, snapshotPayload, plan] = await Promise.all([
  readFile(bankPath, "utf8"),
  readFile(snapshotPath, "utf8").then(JSON.parse),
  readFile(planPath, "utf8").then(JSON.parse),
]);
const parsed = parse(text);
const snapshots = new Map(snapshotPayload.records.map((item) => [item.id, item]));
const live = new Map(parsed.drafts.map((item) => [item.id, item]));
if (plan.length !== 10 || snapshotPayload.batch?.id !== "anatomy-all-pdf-batch-43") throw new Error("Batch 43 artifact contract failed");

const applied = [];
for (const item of plan) {
  const draft = live.get(item.id);
  const snapshot = snapshots.get(item.id);
  if (!draft || !snapshot) throw new Error(`Missing Batch 43 record: ${item.id}`);
  const baseline = { id: snapshot.id, sourcePage: snapshot.sourcePage, stem: snapshot.stem, options: snapshot.options, correctOption: snapshot.correctOption, status: snapshot.status, askable: snapshot.askable, needsImage: snapshot.needsImage, warnings: snapshot.warnings ?? [] };
  const current = { id: draft.id, sourcePage: draft.sourcePage, stem: draft.stem, options: draft.options, correctOption: draft.correctOption, status: draft.status, askable: draft.askable, needsImage: draft.needsImage, warnings: draft.warnings ?? [] };
  if (!same(current, baseline) || draft.sourcePage !== item.page) throw new Error(`Immutable literal/status drift check failed: ${item.id}`);
  const before = record(draft);
  Object.assign(draft, {
    stem: item.stem,
    options: item.options,
    correctOption: item.correctOption,
    explanation: item.fact,
    learningNote: item.fact,
    highYieldNote: item.fact,
    mnemonic: item.mnemonic,
    memoryAid: { coreFact: item.fact, mnemonic: item.mnemonic, emojiCues: item.emojiCues, cueLabel: "Source-confirmed anatomy fact", sourceLabel: item.sourceLabel, sourceUrl: item.sourceUrl },
    status: "ocr_draft",
    askable: true,
    needsImage: false,
    warnings: [reviewedWarning],
  });
  delete draft.approved;
  applied.push({ id: item.id, sourcePage: item.page, before, after: record(draft), evidence: { externalSource: item.sourceUrl, externalFinding: item.finding } });
}

await writeFile(bankPath, `${text.slice(0, parsed.start)}${JSON.stringify(parsed.drafts)}${text.slice(parsed.end + 1)}`);
await mkdir(path.dirname(artifactPath), { recursive: true });
await writeFile(artifactPath, `${JSON.stringify({ generatedAt: new Date().toISOString(), batch: "anatomy-all-pdf-batch-43", applied, restricted: [], automaticApproval: false, mockEligibility: "No restored OCR draft is mock eligible." }, null, 2)}\n`);
console.log(JSON.stringify({ batch: 43, restored: applied.length, restricted: 0, automaticApproval: false, mockEligibility: "No restored OCR draft is mock eligible." }, null, 2));
