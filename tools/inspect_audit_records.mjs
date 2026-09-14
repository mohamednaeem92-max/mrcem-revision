import { readFile } from "node:fs/promises";
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
const sourceFile = process.argv[2];
const pages = new Set(process.argv.slice(3).map(Number));
const matches = drafts.filter((draft) => draft.source?.sourceFile === sourceFile && pages.has(draft.sourcePage));
console.log(JSON.stringify(matches, null, 2));
