/** Generate a read-only manifest of unique Drive PDFs referenced by OCR drafts. */
import { readFile, writeFile, mkdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const source = await readFile(path.join(root, "client", "src", "lib", "ocrDraftSections.ts"), "utf8");
const prefix = "export const ocrDraftQuestions: OcrDraftQuestion[] = ";
const start = source.indexOf(prefix);
const arrayStart = start + prefix.length;
const end = source.indexOf("];", arrayStart);
if (start < 0 || end < 0) throw new Error("OCR draft export not found");
const drafts = JSON.parse(source.slice(arrayStart, end + 1));
const sources = [...drafts.reduce((map, draft) => {
  const item = draft.source;
  const existing = map.get(item.driveId) ?? {
    driveId: item.driveId,
    sourceFile: item.sourceFile,
    markdownFile: item.markdownFile,
    sourceLink: item.sourceLink,
    subjects: new Set(),
    recordCount: 0,
    pageCount: new Set(),
  };
  existing.subjects.add(draft.subject);
  existing.recordCount += 1;
  existing.pageCount.add(draft.sourcePage);
  map.set(item.driveId, existing);
  return map;
}, new Map()).values()].map((item) => ({
  driveId: item.driveId,
  sourceFile: item.sourceFile,
  markdownFile: item.markdownFile,
  sourceLink: item.sourceLink,
  subjects: [...item.subjects].sort(),
  recordCount: item.recordCount,
  referencedPageCount: item.pageCount.size,
})).sort((left, right) => left.sourceFile.localeCompare(right.sourceFile));
const outputDir = path.join(root, "docs", "audit");
await mkdir(outputDir, { recursive: true });
await writeFile(path.join(outputDir, "source-pdf-manifest.json"), `${JSON.stringify(sources, null, 2)}\n`);
console.log(JSON.stringify(sources, null, 2));
