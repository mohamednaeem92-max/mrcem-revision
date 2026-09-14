import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const bankPath = path.join(root, "client", "src", "lib", "ocrDraftSections.ts");
const artifactPath = path.join(root, "docs", "audit", "applied-anatomy-batch-33.json");
const source = await readFile(bankPath, "utf8"), artifact = JSON.parse(await readFile(artifactPath, "utf8"));
const prefix = "export const ocrDraftQuestions: OcrDraftQuestion[] = ", start = source.indexOf(prefix) + prefix.length, end = source.indexOf("];", start);
if (start < prefix.length || end < 0) throw new Error("OCR draft export not found");
const byId = new Map(JSON.parse(source.slice(start, end + 1)).map((draft) => [draft.id, draft]));
const restored = ["p1033-q0086", "p1036-q0087", "p1040-q0088", "p1044-q0089", "p1048-q0090", "p1050-q0092", "p1053-q0093", "p1060-q0095"];
const restricted = ["p1057-q0094", "p1063-q0096"];
const exactWarning = "Source page and external anatomy reference reviewed; remains an unapproved OCR draft.";
if (artifact.automaticApproval !== false || artifact.mockEligibility !== "No restored OCR draft is mock eligible." || artifact.applied?.length !== 8 || artifact.restricted?.length !== 2) throw new Error("Invalid Batch 33 artifact controls.");
for (const suffix of restored) { const id = `anatomy-anatomy-all-pdf-${suffix}`, draft = byId.get(id), row = artifact.applied.find((entry) => entry.id === id); if (!draft || !row || draft.status !== "ocr_draft" || !draft.askable || draft.approved === true || draft.correctOption == null || draft.options.length !== 5 || draft.warnings?.length !== 1 || draft.warnings[0] !== exactWarning || !draft.highYieldNote?.trim() || !draft.mnemonic?.trim() || !draft.memoryAid?.coreFact?.trim() || !draft.memoryAid?.mnemonic?.trim() || !draft.memoryAid?.cueLabel?.trim() || !draft.memoryAid?.sourceLabel?.trim() || !draft.memoryAid?.sourceUrl?.startsWith("https://") || !Array.isArray(draft.memoryAid.emojiCues) || draft.memoryAid.emojiCues.length < 1 || draft.memoryAid.emojiCues.length > 3 || !row.before || !row.after || !row.evidence?.externalSource?.startsWith("https://") || !row.evidence?.externalFinding?.trim()) throw new Error(`Invalid restored Batch 33 record: ${suffix}`); }
for (const suffix of restricted) { const id = `anatomy-anatomy-all-pdf-${suffix}`, draft = byId.get(id), row = artifact.restricted.find((entry) => entry.id === id); if (!draft || !row || draft.status !== "needs_review" || draft.askable || draft.approved === true || draft.correctOption !== null || draft.learningNote || draft.highYieldNote || draft.mnemonic || draft.memoryAid || draft.warnings?.length !== 1 || !draft.warnings[0].startsWith("Source page reviewed,") || !row.before || !row.after || !row.evidence?.externalSource?.startsWith("https://") || !row.evidence?.externalFinding?.trim()) throw new Error(`Invalid restricted Batch 33 record: ${suffix}`); }
console.log(JSON.stringify({ restoredVerified: 8, restrictedVerified: 2, approvedRecordsCreated: 0, result: "pass" }, null, 2));

