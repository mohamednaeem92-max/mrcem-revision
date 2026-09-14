import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const bankPath = path.join(root, "client", "src", "lib", "ocrDraftSections.ts");
const artifactPath = path.join(root, "docs", "audit", "applied-anatomy-batch-38.json");
const source = await readFile(bankPath, "utf8");
const artifact = JSON.parse(await readFile(artifactPath, "utf8"));
const prefix = "export const ocrDraftQuestions: OcrDraftQuestion[] = ";
const start = source.indexOf(prefix) + prefix.length;
const end = source.indexOf("];", start);
if (start < prefix.length || end < 0) throw new Error("OCR draft export not found");
const byId = new Map(JSON.parse(source.slice(start, end + 1)).map((draft) => [draft.id, draft]));
const exactWarning = "Source page and external anatomy reference reviewed; remains an unapproved OCR draft.";
const same = (left, right) => JSON.stringify(left) === JSON.stringify(right);
const restored = [
  ["p1202-q0139", 1202, 1, "Which of the following best describes the relationship of the psoas major and quadratus lumborum muscles:", ["The psoas major muscle lies adjacent to the lateral border of the quadratus lumborum muscle.", "The psoas major muscle overlaps the quadratus lumborum muscle medially.", "The psoas major muscle originates inferior to the quadratus lumborum muscle.", "The psoas major muscle lies deep to the quadratus lumborum muscle.", "The psoas major muscle lies superior to the quadratus lumborum muscle."], "https://www.dovepress.com/a-dynamic-test-to-identify-the-potential-recess-between-the-psoas-majo-peer-reviewed-fulltext-article-JPR"],
  ["p1203-q0140", 1203, 3, "The ejaculatory duct is formed by the union of which of the following structures:", ["Ductus deferens and the prostatic urethra", "Ductus deferens and the epididymis", "Ductus deferens and prostatic ducts", "Ductus deferens and duct from the seminal vesicle", "Prostatic ducts and duct from seminal vesicle"], "https://www.ncbi.nlm.nih.gov/books/NBK499854/"],
  ["p1205-q0141", 1205, 1, "The external anal sphincter is innervated by which of the following nerves:", ["Genitofemoral nerve", "Pudendal nerve", "Coccygeal nerve", "Ilioinguinal nerve", "Iliohypogastric nerve"], "https://www.ncbi.nlm.nih.gov/books/NBK554736/"],
  ["p1209-q0142", 1209, 0, "The inguinal ligament is formed from which of the following:", ["The lower free border of the external oblique aponeurosis", "The lower free border of the internal oblique aponeurosis", "The lower free border of the transversus abdominis aponeurosis", "The lower free border of the rectus abdominis aponeurosis", "The lower free border of the thoracolumbar fascia"], "https://www.ncbi.nlm.nih.gov/books/NBK542321/"],
  ["p1212-q0143", 1212, 4, "The male bladder lies immediately anterior to which of the following structures:", ["Anus", "Prostate gland", "Sigmoid colon", "Abdominal aorta", "Rectum"], "https://www.ncbi.nlm.nih.gov/books/NBK531465/"],
  ["p1213-q0144", 1213, 3, "The ileum predominantly occupies which region of the abdomen:", ["Left upper quadrant", "Right upper quadrant", "Left lower quadrant", "Right lower quadrant", "Epigastric region"], "https://www.ncbi.nlm.nih.gov/books/NBK532263/"],
  ["p1216-q0145", 1216, 2, "The greater omentum descends from which of the following structures:", ["The quadrate lobe of the liver", "The lesser curvature of the stomach and first part of the duodenum", "The greater curvature of the stomach and first part of the duodenum", "The transverse colon", "The duodenojejunal junction"], "https://www.ncbi.nlm.nih.gov/books/NBK534788/"],
  ["p1224-q0147", 1224, 3, "A patient presents following a fall. Imaging shows damage to the L1 nerve root. Which of the following muscles are most likely to be affected:", ["Transversus abdominis and rectus abdominis muscles", "Rectus abdominis and external oblique muscles", "Gluteus medius and minimus muscles", "Transversus abdominis and internal oblique muscles", "Internal and external oblique muscles"], "https://www.ncbi.nlm.nih.gov/books/NBK538256/"]
];
const restricted = [
  ["p1201-q0138", 1201, "A 66 year old man presents to ED complaining of difficulty passing urine and nocturia. On examination you note the prostate is enlarged and you suspect BPH. Which of the following lobes of the prostate is most likely hypertrophied:", ["Lateral lobe", "Posterior lobe", "Anterior lobe", "Median lobe", "Fibromuscular zone"]],
  ["p1220-q0146", 1220, "Regarding the male urethra, which of the following statements is CORRECT:", ["The membranous urethra is the widest part.", "The spongy urethra penetrates the urogenital diaphragm.", "The internal urethral sphincter is associated with the prostatic urethra.", "The prostatic urethra is the longest part.", "The spongy urethra (in the flaccid penis) bends twice in its course, first anteriorly and then inferiorly."]]
];

if (artifact.automaticApproval !== false || artifact.mockEligibility !== "No restored OCR draft is mock eligible." || artifact.applied?.length !== 8 || artifact.restricted?.length !== 2 || new Set(artifact.applied.map((entry) => entry.id)).size !== 8 || new Set(artifact.restricted.map((entry) => entry.id)).size !== 2) throw new Error("Invalid Batch 38 artifact controls.");
for (const [suffix, page, key, stem, options, sourceUrl] of restored) {
  const id = `anatomy-anatomy-all-pdf-${suffix}`; const draft = byId.get(id); const row = artifact.applied.find((entry) => entry.id === id);
  const cues = draft?.memoryAid?.emojiCues;
  if (!draft || !row || draft.sourcePage !== page || row.sourcePage !== page || draft.stem !== stem || !same(draft.options, options) || draft.correctOption !== key || draft.status !== "ocr_draft" || !draft.askable || draft.approved === true || draft.needsImage !== false || draft.warnings?.length !== 1 || draft.warnings[0] !== exactWarning || !draft.explanation?.trim() || !draft.learningNote?.trim() || !draft.highYieldNote?.trim() || !draft.mnemonic?.trim() || !draft.memoryAid?.coreFact?.trim() || !draft.memoryAid?.mnemonic?.trim() || !draft.memoryAid?.cueLabel?.trim() || !draft.memoryAid?.sourceLabel?.trim() || !draft.memoryAid?.sourceUrl?.startsWith("https://") || !Array.isArray(cues) || cues.length < 1 || cues.length > 3 || !cues.every((cue) => typeof cue === "string" && cue.trim()) || !row.before || !row.after || row.after.stem !== stem || !same(row.after.options, options) || row.after.correctOption !== key || row.after.status !== "ocr_draft" || row.after.askable !== true || row.after.warnings?.[0] !== exactWarning || row.evidence?.externalSource !== sourceUrl || !row.evidence?.externalFinding?.trim()) throw new Error(`Invalid restored Batch 38 record: ${suffix}`);
}
for (const [suffix, page, stem, options] of restricted) {
  const id = `anatomy-anatomy-all-pdf-${suffix}`; const draft = byId.get(id); const row = artifact.restricted.find((entry) => entry.id === id);
  if (!draft || !row || draft.sourcePage !== page || row.sourcePage !== page || draft.stem !== stem || !same(draft.options, options) || draft.status !== "needs_review" || draft.askable || draft.approved === true || draft.correctOption !== null || draft.learningNote || draft.highYieldNote || draft.mnemonic || draft.memoryAid || draft.warnings?.length !== 1 || !draft.warnings[0].startsWith("Source page reviewed,") || !row.before || !row.after || row.after.correctOption !== null || row.after.status !== "needs_review" || row.after.askable !== false || !row.evidence?.externalSource?.startsWith("https://") || !row.evidence?.externalFinding?.trim()) throw new Error(`Invalid restricted Batch 38 record: ${suffix}`);
}
console.log(JSON.stringify({ restoredVerified: 8, restrictedVerified: 2, approvedRecordsCreated: 0, result: "pass" }, null, 2));

