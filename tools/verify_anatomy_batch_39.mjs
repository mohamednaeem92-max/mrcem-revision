import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const bankPath = path.join(root, "client", "src", "lib", "ocrDraftSections.ts");
const artifactPath = path.join(root, "docs", "audit", "applied-anatomy-batch-39.json");
const source = await readFile(bankPath, "utf8");
const artifact = JSON.parse(await readFile(artifactPath, "utf8"));
const prefix = "export const ocrDraftQuestions: OcrDraftQuestion[] = "; const start = source.indexOf(prefix) + prefix.length; const end = source.indexOf("];", start);
if (start < prefix.length || end < 0) throw new Error("OCR draft export not found");
const byId = new Map(JSON.parse(source.slice(start, end + 1)).map((draft) => [draft.id, draft]));
const exactWarning = "Source page and external anatomy reference reviewed; remains an unapproved OCR draft.";
const same = (left, right) => JSON.stringify(left) === JSON.stringify(right);
const restored = [
  ["p1229-q0148", 1229, 2, "The renal arteries arise from the abdominal aorta at which of the following vertebral levels:", ["T11/T12", "T12/L1", "L1/L2", "L2/L3", "L3/L4"], "https://www.ncbi.nlm.nih.gov/books/NBK459158/"],
  ["p1233-q0150", 1233, 2, "The fourth part of the duodenum terminates at which of the following vertebral levels:", ["T12", "L1", "L2", "L3", "L4"], "https://pmc.ncbi.nlm.nih.gov/articles/PMC7315055/"],
  ["p1234-q0151", 1234, 0, "The linea alba is formed from which of the following:", ["The aponeuroses of the three flat anterior abdominal muscles", "The free edge of the external oblique aponeurosis", "The tendinous intersection of the rectus abdominis muscle", "The thoracolumbar fascia", "The tendon of the pyramidalis muscle"], "https://www.ncbi.nlm.nih.gov/books/NBK551649/"],
  ["p1235-q0152", 1235, 3, "The kidneys extend between which of the following vertebral levels:", ["T9 - T12", "T12 - L1", "L1 - L3", "T12 - L3", "L2 - L5"], "https://www.ncbi.nlm.nih.gov/books/NBK482385/"],
  ["p1236-q0153", 1236, 2, "Regarding the external oblique muscle, which of the following statements is INCORRECT:", ["It is the largest and most superficial of the anterior abdominal muscles.", "Its aponeurosis forms the linea alba at the midline.", "It originates from the xiphoid process.", "It inserts into the lateral lip of the iliac crest.", "The lower free border of the external oblique aponeurosis forms the inguinal ligament."], "https://www.ncbi.nlm.nih.gov/books/NBK551649/"],
  ["p1237-q0154", 1237, 2, "The greater sac of the peritoneal cavity is divided into two compartments by which of the following structures:", ["Liver", "Stomach", "Transverse mesocolon", "Duodenum", "Mesentery"], "https://pmc.ncbi.nlm.nih.gov/articles/PMC4584112/"],
  ["p1238-q0155", 1238, 0, "The jejunum predominantly occupies which region of the abdomen:", ["Left upper quadrant", "Right upper quadrant", "Left lower quadrant", "Right lower quadrant", "Suprapubic region"], "https://www.ncbi.nlm.nih.gov/books/NBK532263/"],
  ["p1239-q0156", 1239, 4, "The right kidney is related anteriorly to all of the following structures EXCEPT for the:", ["Right adrenal gland", "Liver", "Second part of the duodenum", "Hepatic flexure", "Pancreas"], "https://www.ncbi.nlm.nih.gov/books/NBK482385/"]
];
const restricted = [
  ["p1230-q0149", 1230, "Pain from the ureters is usually referred to dermatomes supplied by:", ["T10 - T12", "T11 - L2", "L1 - L3", "L2 - L4", "T5 - T9"]],
  ["p1240-q0157", 1240, "The ureters enter the bladder and end at the level of which of the following landmarks:", ["Pubic symphysis", "Pubic tubercle", "Anterior superior iliac spine", "Inguinal ligament", "Iliac crest"]]
];

if (artifact.automaticApproval !== false || artifact.mockEligibility !== "No restored OCR draft is mock eligible." || artifact.applied?.length !== 8 || artifact.restricted?.length !== 2 || new Set(artifact.applied.map((entry) => entry.id)).size !== 8 || new Set(artifact.restricted.map((entry) => entry.id)).size !== 2) throw new Error("Invalid Batch 39 artifact controls.");
for (const [suffix, page, key, stem, options, sourceUrl] of restored) {
  const id = `anatomy-anatomy-all-pdf-${suffix}`; const draft = byId.get(id); const row = artifact.applied.find((entry) => entry.id === id); const cues = draft?.memoryAid?.emojiCues;
  if (!draft || !row || draft.sourcePage !== page || row.sourcePage !== page || draft.stem !== stem || !same(draft.options, options) || draft.correctOption !== key || draft.status !== "ocr_draft" || !draft.askable || draft.approved === true || draft.needsImage !== false || draft.warnings?.length !== 1 || draft.warnings[0] !== exactWarning || !draft.explanation?.trim() || !draft.learningNote?.trim() || !draft.highYieldNote?.trim() || !draft.mnemonic?.trim() || !draft.memoryAid?.coreFact?.trim() || !draft.memoryAid?.mnemonic?.trim() || !draft.memoryAid?.cueLabel?.trim() || !draft.memoryAid?.sourceLabel?.trim() || !draft.memoryAid?.sourceUrl?.startsWith("https://") || !Array.isArray(cues) || cues.length < 1 || cues.length > 3 || !cues.every((cue) => typeof cue === "string" && cue.trim()) || !row.before || !row.after || row.after.stem !== stem || !same(row.after.options, options) || row.after.correctOption !== key || row.after.status !== "ocr_draft" || row.after.askable !== true || row.after.warnings?.[0] !== exactWarning || row.evidence?.externalSource !== sourceUrl || !row.evidence?.externalFinding?.trim()) throw new Error(`Invalid restored Batch 39 record: ${suffix}`);
}
for (const [suffix, page, stem, options] of restricted) {
  const id = `anatomy-anatomy-all-pdf-${suffix}`; const draft = byId.get(id); const row = artifact.restricted.find((entry) => entry.id === id);
  if (!draft || !row || draft.sourcePage !== page || row.sourcePage !== page || draft.stem !== stem || !same(draft.options, options) || draft.status !== "needs_review" || draft.askable || draft.approved === true || draft.correctOption !== null || draft.learningNote || draft.highYieldNote || draft.mnemonic || draft.memoryAid || draft.warnings?.length !== 1 || !draft.warnings[0].startsWith("Source page reviewed,") || !row.before || !row.after || row.after.correctOption !== null || row.after.status !== "needs_review" || row.after.askable !== false || !row.evidence?.externalSource?.startsWith("https://") || !row.evidence?.externalFinding?.trim()) throw new Error(`Invalid restricted Batch 39 record: ${suffix}`);
}
console.log(JSON.stringify({ restoredVerified: 8, restrictedVerified: 2, approvedRecordsCreated: 0, result: "pass" }, null, 2));

