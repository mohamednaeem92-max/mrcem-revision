/**
 * Builds a deterministic source-page queue for the full OCR audit.
 * It never changes question content or review status.
 */
import { access, mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const draftsPath = path.join(root, "client", "src", "lib", "ocrDraftSections.ts");
const outputDir = path.join(root, "docs", "audit");
const sourceDir = path.resolve(root, "..", "mrcem-source");
const completedAnatomyPageCeiling = 40;
const pagesPerBatch = 10;

function extractDrafts(source) {
  const prefix = "export const ocrDraftQuestions: OcrDraftQuestion[] = ";
  const start = source.indexOf(prefix);
  const arrayStart = start + prefix.length;
  const end = source.indexOf("];", arrayStart);
  if (start < 0 || end < 0) throw new Error("Could not parse OCR draft export");
  return JSON.parse(source.slice(arrayStart, end + 1));
}

async function isCachedSource(sourceFile) {
  try {
    await access(path.join(sourceDir, sourceFile));
    return true;
  } catch {
    return false;
  }
}

function slug(value) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function batchRows(sourceFile, subject, rows, cached, batchOffset = 0) {
  const byPage = new Map();
  for (const row of rows) {
    const page = row.sourcePage;
    const pageRows = byPage.get(page) ?? [];
    pageRows.push(row);
    byPage.set(page, pageRows);
  }
  const pageGroups = [...byPage.entries()].sort(([left], [right]) => left - right);
  const batches = [];
  for (let index = 0; index < pageGroups.length; index += pagesPerBatch) {
    const group = pageGroups.slice(index, index + pagesPerBatch);
    const pages = group.map(([page]) => page);
    const records = group.flatMap(([, questions]) => questions).sort((left, right) => left.id.localeCompare(right.id));
    batches.push({
      id: `${slug(sourceFile)}-batch-${String(Math.floor(index / pagesPerBatch) + 1 + batchOffset).padStart(2, "0")}`,
      subject,
      sourceFile,
      pageStart: pages[0],
      pageEnd: pages.at(-1),
      sourcePages: pages,
      recordCount: records.length,
      cachedSourceAvailable: cached,
      status: cached ? "queued_for_source_page_review" : "blocked_source_pdf_not_cached",
      records: records.map((record) => ({
        id: record.id,
        sourcePage: record.sourcePage,
        topic: record.topic,
        questionStatus: record.status,
        askable: Boolean(record.askable),
        needsImage: Boolean(record.needsImage),
        warnings: record.warnings ?? [],
        sourceLink: record.source?.sourceLink ?? null,
      })),
    });
  }
  return batches;
}

function markdown(queue) {
  const rows = queue.batches.map((batch) => `| ${batch.id} | ${batch.subject} | ${batch.sourceFile} | ${batch.pageStart}-${batch.pageEnd} | ${batch.recordCount} | ${batch.cachedSourceAvailable ? "Cached" : "Not cached"} | ${batch.status} |`);
  return `# Full-Bank Source-Page Audit Queue

This deterministic queue groups OCR records by source PDF and source pages. It is a routing artifact only: it does not assert that a detected key is correct and does not change any question status.

| Measure | Count |
|---|---:|
| OCR records queued | ${queue.summary.queuedRecords} |
| Completed source-reviewed or restricted records excluded | ${queue.summary.completedSourceReviewRecords} |
| Batches with cached source PDFs | ${queue.summary.cachedBatches} |
| Batches blocked pending source-PDF availability | ${queue.summary.blockedBatches} |

## Batches

| Batch | Subject | Source | Source pages | Records | Source availability | Status |
|---|---|---|---:|---:|---|---|
${rows.join("\n")}

## Gate

Only batches with a cached original PDF may proceed to source-page transcription review. A Google Drive link is retained for blocked batches, but no medical or answer-key correction may be made until the original page is available and readable.
`;
}

const drafts = extractDrafts(await readFile(draftsPath, "utf8"));
const isCompletedSourceReview = (draft) => draft.subject === "Anatomy"
  && draft.source?.sourceFile === "Anatomy-All.pdf"
  && (draft.sourcePage <= completedAnatomyPageCeiling
    || draft.warnings?.some((warning) => warning.startsWith("Source page and external anatomy reference reviewed;") || warning.startsWith("Source page reviewed,")));
const completed = drafts.filter(isCompletedSourceReview);
const pending = drafts.filter((draft) => !isCompletedSourceReview(draft));
const completedAnatomyPages = new Set(completed.filter((draft) => draft.source?.sourceFile === "Anatomy-All.pdf").map((draft) => draft.sourcePage));
const anatomyBatchOffset = Math.ceil(completedAnatomyPages.size / pagesPerBatch);
const groups = new Map();
for (const draft of pending) {
  const sourceFile = draft.source?.sourceFile ?? "unknown-source";
  const subject = draft.subject ?? "Unknown";
  const key = `${sourceFile}::${subject}`;
  const records = groups.get(key) ?? [];
  records.push(draft);
  groups.set(key, records);
}

const batches = [];
for (const [key, records] of [...groups.entries()].sort(([left], [right]) => left.localeCompare(right))) {
  const [sourceFile, subject] = key.split("::");
  batches.push(...batchRows(sourceFile, subject, records, await isCachedSource(sourceFile), sourceFile === "Anatomy-All.pdf" ? anatomyBatchOffset : 0));
}

const queue = {
  generatedAt: new Date().toISOString(),
  rules: { pagesPerBatch, completedAnatomyPageCeiling, sourcePageFirst: true, externalEvidenceCannotApproveOcrAlone: true },
  completedSourceReview: { sourceFile: "Anatomy-All.pdf", sourcePages: [...completedAnatomyPages].sort((left, right) => left - right), recordCount: completed.length, status: "source_reviewed_or_restricted" },
  summary: {
    queuedRecords: pending.length,
    completedSourceReviewRecords: completed.length,
    batchCount: batches.length,
    cachedBatches: batches.filter((batch) => batch.cachedSourceAvailable).length,
    blockedBatches: batches.filter((batch) => !batch.cachedSourceAvailable).length,
  },
  batches,
};

await mkdir(outputDir, { recursive: true });
await Promise.all([
  writeFile(path.join(outputDir, "full-bank-source-page-batch-queue.json"), `${JSON.stringify(queue, null, 2)}\n`),
  writeFile(path.join(outputDir, "full-bank-source-page-batch-queue.md"), markdown(queue)),
]);
console.log(JSON.stringify({ summary: queue.summary, nextCachedBatch: batches.find((batch) => batch.cachedSourceAvailable) ?? null }, null, 2));
