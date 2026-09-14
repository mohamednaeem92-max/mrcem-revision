import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const bankPath = path.join(root, "client", "src", "lib", "ocrDraftSections.ts");
const artifactPath = path.join(root, "docs", "audit", "applied-anatomy-batch-37.json");
const source = await readFile(bankPath, "utf8");
const artifact = JSON.parse(await readFile(artifactPath, "utf8"));
const prefix = "export const ocrDraftQuestions: OcrDraftQuestion[] = ";
const start = source.indexOf(prefix) + prefix.length;
const end = source.indexOf("];", start);
if (start < prefix.length || end < 0) throw new Error("OCR draft export not found");
const byId = new Map(JSON.parse(source.slice(start, end + 1)).map((draft) => [draft.id, draft]));

const restored = [
  ["p1176-q0128", 1176, 3, "The third part of the duodenum lies at which of the following vertebral levels:", ["T12", "L1", "L2", "L3", "L4"], "https://www.ncbi.nlm.nih.gov/books/NBK585130/"],
  ["p1180-q0129", 1180, 2, "The lumbar plexus forms within which of the following muscles:", ["Rectus abdominis", "Pyramidalis", "Psoas major", "Iliacus", "Quadratus lumborum"], "https://www.ncbi.nlm.nih.gov/books/NBK545137/"],
  ["p1181-q0130", 1181, 2, "The ejaculatory ducts open into which of the following structures:", ["Prostate", "Preprostatic urethra", "Prostatic urethra", "Membranous urethra", "Spongy urethra"], "https://www.ncbi.nlm.nih.gov/books/NBK499854/"],
  ["p1188-q0132", 1188, 3, "The pancreas occupies which of the following abdominal regions:", ["Left hypochondrium and left flank", "Left hypochondrium", "Right hypochondrium and epigastrium", "Left hypochondrium and epigastrium", "Epigastrium and umbilicus"], "https://www.ncbi.nlm.nih.gov/books/NBK553104/"],
  ["p1194-q0134", 1194, 1, "The second part of the duodenum extends between which of the following vertebral levels:", ["T12 - L1", "L1 - L3", "L1 - L2", "T12 - L2", "L2 - L3"], "https://pmc.ncbi.nlm.nih.gov/articles/PMC7315055/"],
  ["p1195-q0135", 1195, 0, "Visceral afferent fibres from the testes usually travel to which of the following spinal cord levels:", ["T10 - L1", "T9 - T12", "L1 - L3", "L2 - L4", "S3, S4"], "https://pmc.ncbi.nlm.nih.gov/articles/PMC5503924/"],
  ["p1197-q0137", 1197, 3, "Regarding the relations of the uterus, which of the following statements is INCORRECT:", ["The vagina is inferior to the uterus.", "The broad ligament is lateral to the uterus.", "The vesicouterine pouch is anterior to the uterus.", "The pouch of Douglas is anterior to the uterus.", "The small intestine is superior to the uterus."], "https://www.ncbi.nlm.nih.gov/books/NBK470297/"],
];
const restricted = [
  ["p1183-q0131", 1183],
  ["p1189-q0133", 1189],
  ["p1196-q0136", 1196],
];
const exactWarning = "Source page and external anatomy reference reviewed; remains an unapproved OCR draft.";
const same = (left, right) => JSON.stringify(left) === JSON.stringify(right);

if (
  artifact.automaticApproval !== false ||
  artifact.mockEligibility !== "No restored OCR draft is mock eligible." ||
  artifact.applied?.length !== 7 ||
  artifact.restricted?.length !== 3 ||
  new Set(artifact.applied.map((entry) => entry.id)).size !== 7 ||
  new Set(artifact.restricted.map((entry) => entry.id)).size !== 3
) {
  throw new Error("Invalid Batch 37 artifact controls.");
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
    throw new Error(`Invalid restored Batch 37 record: ${suffix}`);
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
    row.after.correctOption !== null ||
    row.after.status !== "needs_review" ||
    row.after.askable !== false ||
    !row.evidence?.externalSource?.startsWith("https://") ||
    !row.evidence?.externalFinding?.trim()
  ) {
    throw new Error(`Invalid restricted Batch 37 record: ${suffix}`);
  }
}

console.log(JSON.stringify({ restoredVerified: 7, restrictedVerified: 3, approvedRecordsCreated: 0, result: "pass" }, null, 2));

