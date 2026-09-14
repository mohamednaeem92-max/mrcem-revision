import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const bankPath = path.join(root, "client", "src", "lib", "ocrDraftSections.ts");
const artifactPath = path.join(root, "docs", "audit", "applied-anatomy-batch-36.json");
const source = await readFile(bankPath, "utf8");
const artifact = JSON.parse(await readFile(artifactPath, "utf8"));
const prefix = "export const ocrDraftQuestions: OcrDraftQuestion[] = ";
const start = source.indexOf(prefix) + prefix.length;
const end = source.indexOf("];", start);
if (start < prefix.length || end < 0) throw new Error("OCR draft export not found");
const byId = new Map(JSON.parse(source.slice(start, end + 1)).map((draft) => [draft.id, draft]));

const restored = [
  ["p1134-q0117", 1134, 0, "The infraduodenal region of the common bile duct:", ["runs in a groove posterior to the head of the pancreas.", "lies posterior to the first part of the duodenum.", "lies posterior to the inferior vena cava.", "lies anterior to the left renal vein.", "empties into the third part of the duodenum."], "https://www.ncbi.nlm.nih.gov/books/NBK532912/"],
  ["p1137-q0118", 1137, 0, "The inguinal ligament spans between which of the following two structures:", ["Anterior superior iliac spine and pubic tubercle", "Anterior superior iliac spine and pubic symphysis", "Iliac crest and pubic symphysis", "Iliac crest and pubic tubercle", "Anterior superior iliac spine and pubic crest"], "https://www.ncbi.nlm.nih.gov/books/NBK542321/"],
  ["p1144-q0120", 1144, 2, "A 65 year old lady presents to ED complaining of anal pain and bleeding. Examination reveals external haemorrhoids. Which of the following nerves carries pain sensation from the anus:", ["Genitofemoral nerve", "Hypogastric nerve", "Pudendal nerve", "Pelvic splanchnic nerve", "Ilioinguinal nerve"], "https://www.ncbi.nlm.nih.gov/books/NBK554736/"],
  ["p1148-q0121", 1148, 3, "The rectum starts at the rectosigmoid junction at which vertebral level:", ["L5", "S1", "S2", "S3", "S4"], "https://www.ncbi.nlm.nih.gov/books/NBK537245/"],
  ["p1153-q0122", 1153, 3, "The sacrotuberous ligament spans between which of the following structures:", ["Pubic ramus to the posterior iliac spine and the sacrum", "Ischial spine to the iliac crest", "Ischial tuberosity to the anterior superior iliac spine", "Ischial tuberosity to the posterior superior iliac spine and the sacrum", "Ischial spine to the posterior superior iliac spine and the sacrum"], "https://www.ncbi.nlm.nih.gov/books/NBK493215/"],
  ["p1156-q0123", 1156, 0, "The base of the bladder faces:", ["Posteroinferiorly", "Posterosuperiorly", "Anteroinferiorly", "Anterosuperiorly", "Superiorly"], "https://www.ncbi.nlm.nih.gov/books/NBK531465/"],
  ["p1161-q0124", 1161, 3, "The aorta enters the abdomen at which of the following vertebral levels:", ["T8", "T9", "T10", "T12", "L1"], "https://www.ncbi.nlm.nih.gov/books/NBK537319/"],
  ["p1164-q0125", 1164, 1, "A 36 year old male is brought into ED complaining of fever, abdominal pain and tenderness. Imaging shows that an abdominal infection has spread retroperitoneally. Which of the following structures is most likely affected:", ["Jejunum", "Head of the pancreas", "Transverse colon", "First part of duodenum", "Appendix"], "https://www.ncbi.nlm.nih.gov/books/NBK532912/"],
  ["p1167-q0126", 1167, 4, "The sigmoid colon extends as low as which of the following vertebral levels:", ["L4", "L5", "S1", "S2", "S3"], "https://www.ncbi.nlm.nih.gov/books/NBK549824/"],
  ["p1172-q0127", 1172, 2, "The mesentery connects which of the following structures to the posterior abdominal wall:", ["Transverse colon", "Stomach", "Jejunum and ileum", "Duodenum", "Liver"], "https://www.ncbi.nlm.nih.gov/books/NBK459366/"],
];
const exactWarning = "Source page and external anatomy reference reviewed; remains an unapproved OCR draft.";
const same = (left, right) => JSON.stringify(left) === JSON.stringify(right);

if (
  artifact.automaticApproval !== false ||
  artifact.mockEligibility !== "No restored OCR draft is mock eligible." ||
  artifact.applied?.length !== 10 ||
  artifact.restricted?.length !== 0 ||
  new Set(artifact.applied.map((entry) => entry.id)).size !== 10
) {
  throw new Error("Invalid Batch 36 artifact controls.");
}

for (const [suffix, page, correctOption, stem, options, sourceUrl] of restored) {
  const id = `anatomy-anatomy-all-pdf-${suffix}`;
  const draft = byId.get(id);
  const row = artifact.applied.find((entry) => entry.id === id);
  const validCues = Array.isArray(draft?.memoryAid?.emojiCues) && draft.memoryAid.emojiCues.length >= 1 && draft.memoryAid.emojiCues.length <= 3 && draft.memoryAid.emojiCues.every((cue) => typeof cue === "string" && cue.trim());
  if (
    !draft ||
    !row ||
    draft.sourcePage !== page ||
    row.sourcePage !== page ||
    draft.stem !== stem ||
    !same(draft.options, options) ||
    draft.correctOption !== correctOption ||
    draft.status !== "ocr_draft" ||
    !draft.askable ||
    draft.approved === true ||
    draft.needsImage !== false ||
    draft.warnings?.length !== 1 ||
    draft.warnings[0] !== exactWarning ||
    !draft.explanation?.trim() ||
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
    row.after.stem !== stem ||
    !same(row.after.options, options) ||
    row.after.correctOption !== correctOption ||
    row.after.status !== "ocr_draft" ||
    row.after.askable !== true ||
    row.after.warnings?.[0] !== exactWarning ||
    row.evidence?.externalSource !== sourceUrl ||
    !row.evidence?.externalFinding?.trim()
  ) {
    throw new Error(`Invalid restored Batch 36 record: ${suffix}`);
  }
}

console.log(JSON.stringify({ restoredVerified: 10, restrictedVerified: 0, approvedRecordsCreated: 0, result: "pass" }, null, 2));

