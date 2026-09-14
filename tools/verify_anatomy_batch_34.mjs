import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const bankPath = path.join(root, "client", "src", "lib", "ocrDraftSections.ts");
const artifactPath = path.join(root, "docs", "audit", "applied-anatomy-batch-34.json");
const source = await readFile(bankPath, "utf8");
const artifact = JSON.parse(await readFile(artifactPath, "utf8"));
const prefix = "export const ocrDraftQuestions: OcrDraftQuestion[] = ";
const start = source.indexOf(prefix) + prefix.length;
const end = source.indexOf("];", start);
if (start < prefix.length || end < 0) throw new Error("OCR draft export not found");
const byId = new Map(JSON.parse(source.slice(start, end + 1)).map((draft) => [draft.id, draft]));

const restored = [
  ["p1067-q0097", 1067],
  ["p1076-q0099", 1076],
  ["p1079-q0100", 1079],
  ["p1082-q0101", 1082],
  ["p1083-q0102", 1083],
  ["p1088-q0103", 1088],
  ["p1092-q0104", 1092],
  ["p1095-q0105", 1095],
  ["p1100-q0106", 1100],
];
const restricted = [["p1071-q0098", 1071]];
const exactWarning = "Source page and external anatomy reference reviewed; remains an unapproved OCR draft.";

if (
  artifact.automaticApproval !== false ||
  artifact.mockEligibility !== "No restored OCR draft is mock eligible." ||
  artifact.applied?.length !== 9 ||
  artifact.restricted?.length !== 1
) {
  throw new Error("Invalid Batch 34 artifact controls.");
}

for (const [suffix, page] of restored) {
  const id = `anatomy-anatomy-all-pdf-${suffix}`;
  const draft = byId.get(id);
  const row = artifact.applied.find((entry) => entry.id === id);
  const validCues = Array.isArray(draft?.memoryAid?.emojiCues) && draft.memoryAid.emojiCues.length >= 1 && draft.memoryAid.emojiCues.length <= 3 && draft.memoryAid.emojiCues.every((cue) => typeof cue === "string" && cue.trim());
  if (
    !draft ||
    !row ||
    draft.sourcePage !== page ||
    row.sourcePage !== page ||
    draft.status !== "ocr_draft" ||
    !draft.askable ||
    draft.approved === true ||
    draft.correctOption == null ||
    draft.options.length !== 5 ||
    draft.warnings?.length !== 1 ||
    draft.warnings[0] !== exactWarning ||
    !draft.learningNote?.trim() ||
    !draft.highYieldNote?.trim() ||
    !draft.mnemonic?.trim() ||
    !draft.memoryAid?.coreFact?.trim() ||
    !draft.memoryAid?.mnemonic?.trim() ||
    !draft.memoryAid?.cueLabel?.trim() ||
    !draft.memoryAid?.sourceLabel?.trim() ||
    !draft.memoryAid?.sourceUrl?.startsWith("https://") ||
    !validCues ||
    !row.before ||
    !row.after ||
    !row.evidence?.externalSource?.startsWith("https://") ||
    !row.evidence?.externalFinding?.trim()
  ) {
    throw new Error(`Invalid restored Batch 34 record: ${suffix}`);
  }
}

for (const [suffix, page] of restricted) {
  const id = `anatomy-anatomy-all-pdf-${suffix}`;
  const draft = byId.get(id);
  const row = artifact.restricted.find((entry) => entry.id === id);
  if (
    !draft ||
    !row ||
    draft.sourcePage !== page ||
    row.sourcePage !== page ||
    draft.status !== "needs_review" ||
    draft.askable ||
    draft.approved === true ||
    draft.correctOption !== null ||
    draft.learningNote ||
    draft.highYieldNote ||
    draft.mnemonic ||
    draft.memoryAid ||
    draft.warnings?.length !== 1 ||
    !draft.warnings[0].startsWith("Source page reviewed,") ||
    !row.before ||
    !row.after ||
    !row.evidence?.externalSource?.startsWith("https://") ||
    !row.evidence?.externalFinding?.trim()
  ) {
    throw new Error(`Invalid restricted Batch 34 record: ${suffix}`);
  }
}

console.log(JSON.stringify({ restoredVerified: 9, restrictedVerified: 1, approvedRecordsCreated: 0, result: "pass" }, null, 2));

