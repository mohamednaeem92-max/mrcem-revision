/**
 * Exports the current OCR records for one deterministic audit batch.
 * This is read-only and creates a comparison artifact before corrections.
 */
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const queuePath = path.join(root, "docs", "audit", "full-bank-source-page-batch-queue.json");
const bankPath = path.join(root, "client", "src", "lib", "ocrDraftSections.ts");
const auditDir = path.join(root, "docs", "audit");
const batchId = process.argv[2];

if (!batchId) throw new Error("Usage: node tools/export_audit_batch_records.mjs <batch-id>");

function extractDrafts(source) {
  const prefix = "export const ocrDraftQuestions: OcrDraftQuestion[] = ";
  const start = source.indexOf(prefix);
  const arrayStart = start + prefix.length;
  const end = source.indexOf("];", arrayStart);
  if (start < 0 || end < 0) throw new Error("Could not parse OCR drafts");
  return JSON.parse(source.slice(arrayStart, end + 1));
}

const [queue, bankSource] = await Promise.all([
  readFile(queuePath, "utf8").then(JSON.parse),
  readFile(bankPath, "utf8"),
]);
const batch = queue.batches.find((candidate) => candidate.id === batchId);
if (!batch) throw new Error(`Unknown batch ${batchId}`);
const drafts = new Map(extractDrafts(bankSource).map((draft) => [draft.id, draft]));
const records = batch.records.map((row) => {
  const draft = drafts.get(row.id);
  if (!draft) throw new Error(`Queued record missing from draft bank: ${row.id}`);
  return draft;
});

const payload = {
  exportedAt: new Date().toISOString(),
  batch: {
    id: batch.id,
    sourceFile: batch.sourceFile,
    sourcePages: batch.sourcePages,
    cachedSourceAvailable: batch.cachedSourceAvailable,
  },
  records,
};
await mkdir(auditDir, { recursive: true });
const fileName = `${batchId}-ocr-records.json`;
await writeFile(path.join(auditDir, fileName), `${JSON.stringify(payload, null, 2)}\n`);
console.log(JSON.stringify({ batchId, recordCount: records.length, output: path.join("docs", "audit", fileName) }, null, 2));
