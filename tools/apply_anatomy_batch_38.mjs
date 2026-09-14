import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const bankPath = path.join(root, "client", "src", "lib", "ocrDraftSections.ts");
const snapshotPath = path.join(root, "docs", "audit", "anatomy-all-pdf-batch-38-ocr-records.json");
const auditDir = path.join(root, "docs", "audit");
const reviewedWarning = "Source page and external anatomy reference reviewed; remains an unapproved OCR draft.";
const memoryAid = (coreFact, mnemonic, emojiCues, sourceLabel, sourceUrl) => ({ coreFact, mnemonic, emojiCues, cueLabel: "Source-confirmed anatomy fact", sourceLabel, sourceUrl });

const restorations = [
  {
    id: "anatomy-anatomy-all-pdf-p1202-q0139", page: 1202,
    expectedStem: "Which of the following best describes the relationship of the psoas major and quadratus lumborum muscles:",
    expectedOptions: ["The psoas major muscle lies adjacent to the lateral border of the quadratus lumborum muscle.", "The psoas major muscle overlaps the quadratus lumborum muscle medially.", "The psoas major muscle originates inferior to the quadratus lumborum muscle.", "The psoas major muscle lies deep to the quadratus lumborum muscle. 6%", "The psoas major muscle lies superior to the quadratus lumborum muscle. 5%"],
    stem: "Which of the following best describes the relationship of the psoas major and quadratus lumborum muscles:",
    options: ["The psoas major muscle lies adjacent to the lateral border of the quadratus lumborum muscle.", "The psoas major muscle overlaps the quadratus lumborum muscle medially.", "The psoas major muscle originates inferior to the quadratus lumborum muscle.", "The psoas major muscle lies deep to the quadratus lumborum muscle.", "The psoas major muscle lies superior to the quadratus lumborum muscle."], correctOption: 1,
    fact: "In cross-section of the posterior abdominal wall, quadratus lumborum is typically overlapped medially by psoas major.", mnemonic: "Psoas sits medial to quadratus.",
    aid: memoryAid("Quadratus lumborum is typically overlapped medially by psoas major.", "Psoas sits medial to quadratus.", ["⬅️", "💪"], "Journal of Pain Research: Psoas and Quadratus Lumborum", "https://www.dovepress.com/a-dynamic-test-to-identify-the-potential-recess-between-the-psoas-majo-peer-reviewed-fulltext-article-JPR"),
    sourceUrl: "https://www.dovepress.com/a-dynamic-test-to-identify-the-potential-recess-between-the-psoas-majo-peer-reviewed-fulltext-article-JPR", finding: "A peer-reviewed article states that quadratus lumborum is typically overlapped medially by psoas major."
  },
  {
    id: "anatomy-anatomy-all-pdf-p1203-q0140", page: 1203,
    expectedStem: "ww The ejaculatory duct is formed by the union of which of the following structures:",
    expectedOptions: ["Ductus deferens and the prostatic urethra 4%", "Ductus deferens and the epididymis 3% (x) Ductus deferens and prostatic ducts bee () Ductus deferens and duct from the seminal vesicle 28%", "Prostatic ducts and duct from seminal vesicle 48%"],
    stem: "The ejaculatory duct is formed by the union of which of the following structures:",
    options: ["Ductus deferens and the prostatic urethra", "Ductus deferens and the epididymis", "Ductus deferens and prostatic ducts", "Ductus deferens and duct from the seminal vesicle", "Prostatic ducts and duct from seminal vesicle"], correctOption: 3,
    fact: "Each ejaculatory duct forms where the ductus deferens joins the duct of the seminal vesicle and then opens into the prostatic urethra.", mnemonic: "Deferens plus seminal-vesicle duct makes the ejaculatory duct.",
    aid: memoryAid("The ejaculatory duct forms from the ductus deferens and duct of the seminal vesicle.", "Deferens plus seminal-vesicle duct makes the ejaculatory duct.", ["➕", "➡️"], "NCBI Bookshelf: Seminal Vesicle", "https://www.ncbi.nlm.nih.gov/books/NBK499854/"),
    sourceUrl: "https://www.ncbi.nlm.nih.gov/books/NBK499854/", finding: "NCBI states that the seminal vesicle converges with the ampulla of the vas deferens to form the ejaculatory duct."
  },
  {
    id: "anatomy-anatomy-all-pdf-p1205-q0141", page: 1205,
    expectedStem: "ww The external anal sphincter is innervated by which of the following nerves:",
    expectedOptions: ["Genitofemoral nerve 3%", "Pudendal nerve (x) Coccygeal nerve 6%", "llioinguinal nerve 5%", "lliohypogastric nerve 3%"],
    stem: "The external anal sphincter is innervated by which of the following nerves:",
    options: ["Genitofemoral nerve", "Pudendal nerve", "Coccygeal nerve", "Ilioinguinal nerve", "Iliohypogastric nerve"], correctOption: 1,
    fact: "The pudendal nerve innervates the external anal sphincter; its inferior rectal branch carries the sphincter's somatic motor fibres.", mnemonic: "Pudendal powers the external anal sphincter.",
    aid: memoryAid("The pudendal nerve, through its inferior rectal branch, supplies somatic motor fibres to the external anal sphincter.", "Pudendal powers the external anal sphincter.", ["🔒", "🧠"], "NCBI Bookshelf: Pudendal Nerve", "https://www.ncbi.nlm.nih.gov/books/NBK554736/"),
    sourceUrl: "https://www.ncbi.nlm.nih.gov/books/NBK554736/", finding: "NCBI states that the pudendal nerve and its inferior rectal branch innervate the external anal sphincter."
  },
  {
    id: "anatomy-anatomy-all-pdf-p1209-q0142", page: 1209,
    expectedStem: "ww The inguinal ligament is formed from which of the following:",
    expectedOptions: ["The lower free border of the external oblique aponeurosis", "The lower free border of the internal oblique aponeurosis 6%", "The lower free border of the transversus abdominis aponeurosis 1%", "The lower free border of the rectus abdominis aponeurosis 2%", "The lower free border of the thoracolumbar fascia 1%"],
    stem: "The inguinal ligament is formed from which of the following:",
    options: ["The lower free border of the external oblique aponeurosis", "The lower free border of the internal oblique aponeurosis", "The lower free border of the transversus abdominis aponeurosis", "The lower free border of the rectus abdominis aponeurosis", "The lower free border of the thoracolumbar fascia"], correctOption: 0,
    fact: "Anteroinferior fibres of the external-oblique aponeurosis fold inward to form the inguinal ligament between the ASIS and pubic tubercle.", mnemonic: "External oblique folds to form the inguinal ligament.",
    aid: memoryAid("The inguinal ligament forms when anteroinferior fibres of the external-oblique aponeurosis fold inward.", "External oblique folds to form the inguinal ligament.", ["↩️", "📐"], "NCBI Bookshelf: Inguinal Ligament", "https://www.ncbi.nlm.nih.gov/books/NBK542321/"),
    sourceUrl: "https://www.ncbi.nlm.nih.gov/books/NBK542321/", finding: "NCBI states that the anteroinferior fibres of the external-oblique aponeurosis fold inward to form the inguinal ligament."
  },
  {
    id: "anatomy-anatomy-all-pdf-p1212-q0143", page: 1212,
    expectedStem: "ww The male bladder lies immediately anterior to which of the following structures:",
    expectedOptions: ["Anus 1%", "Prostate gland 19%", "Sigmoid colon 1%", "Abdominal aorta 2%"],
    stem: "The male bladder lies immediately anterior to which of the following structures:",
    options: ["Anus", "Prostate gland", "Sigmoid colon", "Abdominal aorta", "Rectum"], correctOption: 4,
    fact: "In males, the rectum is posterior to the bladder, so the bladder lies immediately anterior to the rectum.", mnemonic: "Male bladder: rectum behind.",
    aid: memoryAid("In males, the rectum lies posterior to the urinary bladder.", "Male bladder: rectum behind.", ["⬅️", "📍"], "NCBI Bookshelf: Bladder", "https://www.ncbi.nlm.nih.gov/books/NBK531465/"),
    sourceUrl: "https://www.ncbi.nlm.nih.gov/books/NBK531465/", finding: "NCBI states that the rectum is located posterior to the male bladder."
  },
  {
    id: "anatomy-anatomy-all-pdf-p1213-q0144", page: 1213,
    expectedStem: "ww The ileum predominantly occupies which region of the abdomen:",
    expectedOptions: ["Left upper quadrant 7%", "Right upper quadrant 4%", "Left lower quadrant 16%", "Right lower quadrant"],
    stem: "The ileum predominantly occupies which region of the abdomen:",
    options: ["Left upper quadrant", "Right upper quadrant", "Left lower quadrant", "Right lower quadrant", "Epigastric region"], correctOption: 3,
    fact: "The ileum is the terminal small-intestinal segment and is located mainly in the right lower quadrant.", mnemonic: "Ileum ends in the right lower quadrant.",
    aid: memoryAid("The ileum is located mainly in the right lower quadrant.", "Ileum ends in the right lower quadrant.", ["➡️", "⬇️"], "NCBI Bookshelf: Physiology, Small Bowel", "https://www.ncbi.nlm.nih.gov/books/NBK532263/"),
    sourceUrl: "https://www.ncbi.nlm.nih.gov/books/NBK532263/", finding: "NCBI states that the ileum is located mainly in the right lower quadrant."
  },
  {
    id: "anatomy-anatomy-all-pdf-p1216-q0145", page: 1216,
    expectedStem: "ww The greater omentum descends from which of the following structures:",
    expectedOptions: ["The quadrate lobe of the liver 1%", "The lesser curvature of the stomach and first part of the duodenum 6%", "The greater curvature of the stomach and first part of the duodenum", "The transverse colon 6%", "The duodenojejunal junction 2%"],
    stem: "The greater omentum descends from which of the following structures:",
    options: ["The quadrate lobe of the liver", "The lesser curvature of the stomach and first part of the duodenum", "The greater curvature of the stomach and first part of the duodenum", "The transverse colon", "The duodenojejunal junction"], correctOption: 2,
    fact: "The greater omentum hangs from the greater curvature of the stomach, descends over the anterior intestine, then returns to the transverse colon.", mnemonic: "Greater curve gives the greater omentum.",
    aid: memoryAid("The greater omentum hangs from the greater curvature of the stomach and descends over the anterior intestine.", "Greater curve gives the greater omentum.", ["🧣", "⬇️"], "NCBI Bookshelf: Peritoneum", "https://www.ncbi.nlm.nih.gov/books/NBK534788/"),
    sourceUrl: "https://www.ncbi.nlm.nih.gov/books/NBK534788/", finding: "NCBI states that the greater omentum hangs from the greater curvature of the stomach and folds over the anterior intestine."
  },
  {
    id: "anatomy-anatomy-all-pdf-p1224-q0147", page: 1224,
    expectedStem: "A patient presents following a fall. Imaging shows damage to the L1 nerve root. Which of the following muscles are most likely to be affected:",
    expectedOptions: ["Transversus abdominis and rectus abdominis muscles", "Gluteus medius and minimus muscles", "Transversus abdominis and internal oblique muscles", "Internal and external oblique muscles"],
    stem: "A patient presents following a fall. Imaging shows damage to the L1 nerve root. Which of the following muscles are most likely to be affected:",
    options: ["Transversus abdominis and rectus abdominis muscles", "Rectus abdominis and external oblique muscles", "Gluteus medius and minimus muscles", "Transversus abdominis and internal oblique muscles", "Internal and external oblique muscles"], correctOption: 3,
    fact: "The ilioinguinal nerve arises from anterior rami of T12 and L1 and gives motor innervation to transversus abdominis and internal oblique, so the L1-root scenario supports that pair among the options.", mnemonic: "L1 via ilioinguinal serves internal oblique and transversus.",
    aid: memoryAid("The ilioinguinal nerve has T12-L1 origin and supplies motor fibres to transversus abdominis and internal oblique.", "L1 via ilioinguinal serves internal oblique and transversus.", ["1️⃣", "💪"], "NCBI Bookshelf: Ilioinguinal Neuralgia", "https://www.ncbi.nlm.nih.gov/books/NBK538256/"),
    sourceUrl: "https://www.ncbi.nlm.nih.gov/books/NBK538256/", finding: "NCBI states that the ilioinguinal nerve arises from T12-L1 anterior rami and innervates transversus abdominis and internal oblique."
  }
];

const restrictions = [
  {
    id: "anatomy-anatomy-all-pdf-p1201-q0138", page: 1201,
    expectedStem: "A 66 year old man presents to ED complaining of difficulty passing urine and nocturia. On examination you note the prostate is enlarged and you suspect BPH. Which of the following lobes of the prostate is most likely hypertrophied: Lateral lobe 5%",
    expectedOptions: ["Anterior lobe", "Fibromuscular zone"],
    stem: "A 66 year old man presents to ED complaining of difficulty passing urine and nocturia. On examination you note the prostate is enlarged and you suspect BPH. Which of the following lobes of the prostate is most likely hypertrophied:",
    options: ["Lateral lobe", "Posterior lobe", "Anterior lobe", "Median lobe", "Fibromuscular zone"],
    warning: "Source page reviewed, but authoritative current anatomy describes BPH as tending to arise in the transition zone; the source's unqualified historic median-lobe formulation is not safely inferred.", sourceUrl: "https://www.ncbi.nlm.nih.gov/books/NBK540987/",
    finding: "NCBI distinguishes historical lobes from zones and states that BPH tends to appear in the transition zone."
  },
  {
    id: "anatomy-anatomy-all-pdf-p1220-q0146", page: 1220,
    expectedStem: "Regarding the male urethra, which of the following statements is CORRECT:",
    expectedOptions: ["The membranous urethra is the widest part.", "The spongy urethra penetrates the urogenital diaphragm. 5%", "The internal urethral sphincter is associated with the prostatic urethra. 58%", "The prostatic urethra is the longest part. V) The spongy urethra (in the flaccid penis) bends twice in its course, first anteriorly and then 32%"],
    stem: "Regarding the male urethra, which of the following statements is CORRECT:",
    options: ["The membranous urethra is the widest part.", "The spongy urethra penetrates the urogenital diaphragm.", "The internal urethral sphincter is associated with the prostatic urethra.", "The prostatic urethra is the longest part.", "The spongy urethra (in the flaccid penis) bends twice in its course, first anteriorly and then inferiorly."],
    warning: "Source page reviewed, but accessible authoritative references did not directly corroborate the source's exact two-bend directional formulation of the flaccid spongy urethra; no answer is inferred.", sourceUrl: "https://www.ncbi.nlm.nih.gov/books/NBK482236/",
    finding: "NCBI confirms that the spongy urethra lies within the corpus spongiosum but does not directly establish the source's exact curvature wording."
  }
];

const parse = (source) => {
  const prefix = "export const ocrDraftQuestions: OcrDraftQuestion[] = ";
  const start = source.indexOf(prefix) + prefix.length;
  const end = source.indexOf("];", start);
  if (start < prefix.length || end < 0) throw new Error("OCR draft export not found");
  return { start, end, drafts: JSON.parse(source.slice(start, end + 1)) };
};
const recordSnapshot = (draft) => ({ stem: draft.stem, options: draft.options, correctOption: draft.correctOption, status: draft.status, askable: draft.askable, needsImage: draft.needsImage, warnings: draft.warnings ?? [], memoryAid: draft.memoryAid ?? null });
const same = (left, right) => JSON.stringify(left) === JSON.stringify(right);
const guard = (live, original, item) => {
  if (!live || !original || live.id !== item.id || original.id !== item.id || live.sourcePage !== item.page || original.sourcePage !== item.page || live.stem !== item.expectedStem || original.stem !== item.expectedStem || !same(live.options, item.expectedOptions) || !same(original.options, item.expectedOptions)) throw new Error(`Immutable literal drift check failed: ${item.id}`);
};

const source = await readFile(bankPath, "utf8");
const parsed = parse(source);
const originals = new Map(JSON.parse(await readFile(snapshotPath, "utf8")).records.map((record) => [record.id, record]));
const drafts = new Map(parsed.drafts.map((draft) => [draft.id, draft]));
const applied = [];
const restricted = [];

for (const item of restorations) {
  const draft = drafts.get(item.id); guard(draft, originals.get(item.id), item); const before = recordSnapshot(draft);
  Object.assign(draft, { stem: item.stem, options: item.options, correctOption: item.correctOption, explanation: item.fact, learningNote: item.fact, highYieldNote: item.fact, mnemonic: item.mnemonic, memoryAid: item.aid, status: "ocr_draft", askable: true, needsImage: false, warnings: [reviewedWarning] });
  delete draft.approved;
  applied.push({ id: item.id, sourcePage: item.page, before, after: recordSnapshot(draft), evidence: { externalSource: item.sourceUrl, externalFinding: item.finding } });
}
for (const item of restrictions) {
  const draft = drafts.get(item.id); guard(draft, originals.get(item.id), item); const before = recordSnapshot(draft);
  Object.assign(draft, { stem: item.stem, options: item.options, correctOption: null, explanation: item.finding, learningNote: "", highYieldNote: "", mnemonic: "", status: "needs_review", askable: false, needsImage: false, warnings: [item.warning] });
  delete draft.memoryAid; delete draft.approved;
  restricted.push({ id: item.id, sourcePage: item.page, before, after: recordSnapshot(draft), evidence: { externalSource: item.sourceUrl, externalFinding: item.finding } });
}

await writeFile(bankPath, `${source.slice(0, parsed.start)}${JSON.stringify(parsed.drafts)}${source.slice(parsed.end + 1)}`);
await mkdir(auditDir, { recursive: true });
await writeFile(path.join(auditDir, "applied-anatomy-batch-38.json"), `${JSON.stringify({ generatedAt: new Date().toISOString(), applied, restricted, automaticApproval: false, mockEligibility: "No restored OCR draft is mock eligible." }, null, 2)}\n`);
console.log(JSON.stringify({ restored: applied.length, restricted: restricted.length, automaticApproval: false }, null, 2));
