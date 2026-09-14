import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const bankPath = path.join(root, "client", "src", "lib", "ocrDraftSections.ts");
const auditDir = path.join(root, "docs", "audit");
const reviewedWarning = "Source page and external anatomy reference reviewed; remains an unapproved OCR draft.";
const aid = (coreFact, mnemonic, emojiCues, cueLabel, sourceLabel, sourceUrl) => ({ coreFact, mnemonic, emojiCues, cueLabel, sourceLabel, sourceUrl });

const restorations = [
  {
    id: "anatomy-anatomy-all-pdf-p0514-q0137", page: 514,
    expectedStem: "ww Regarding the relations of the uterus, which of the following statements is INCORRECT:", expectedOptions: ["The vagina is inferior to the uterus. 6%", "The broad ligament is lateral to the uterus. 4%", "The vesicouterine pouch is anterior to the uterus. 12%", "The pouch of Douglas is anterior to the uterus. (x) The small intestine is superior to the uterus. 4%"],
    stem: "Regarding the relations of the uterus, which statement is incorrect?", options: ["The vagina is inferior to the uterus", "The broad ligament is lateral to the uterus", "The vesicouterine pouch is anterior to the uterus", "The pouch of Douglas is anterior to the uterus", "The small intestine is superior to the uterus"], correctOption: 3,
    explanation: "The uterus lies posterior to the bladder and anterior to the rectum. The rectouterine pouch, also called the pouch of Douglas, lies between the uterus and rectum, so it is posterior rather than anterior to the uterus.",
    learningNote: "Pouch of Douglas is posterior to uterus.", highYieldNote: "Rectouterine pouch lies between posterior uterus and rectum.", mnemonic: "⬅️ Douglas sits behind the uterus.",
    memoryAid: aid("The rectouterine pouch is between the uterus and rectum, posterior to the uterus.", "Douglas sits behind the uterus.", ["⬅️", "🌊"], "A posterior pouch cues Douglas behind uterus.", "NCBI Bookshelf: Uterus", "https://www.ncbi.nlm.nih.gov/books/NBK470297/"),
    sourceUrl: "https://www.ncbi.nlm.nih.gov/books/NBK470297/", finding: "Uterus lies posterior to bladder and anterior to rectum; rectouterine pouch is between uterus and rectum."
  },
  {
    id: "anatomy-anatomy-all-pdf-p0519-q0139", page: 519,
    expectedStem: "Which of the following best describes the relationship of the psoas major and quadratus lumborum muscles:", expectedOptions: ["The psoas major muscle lies adjacent to the lateral border of the quadratus lumborum muscle.", "The psoas major muscle overlaps the quadratus lumborum muscle medially.", "The psoas major muscle originates inferior to the quadratus lumborum muscle.", "The psoas major muscle lies deep to the quadratus lumborum muscle. 6%", "The psoas major muscle lies superior to the quadratus lumborum muscle. 5%"],
    stem: "Which statement best describes the relationship of psoas major and quadratus lumborum?", options: ["Psoas major lies adjacent to the lateral border of quadratus lumborum", "Psoas major overlaps quadratus lumborum medially", "Psoas major originates inferior to quadratus lumborum", "Psoas major lies deep to quadratus lumborum", "Psoas major lies superior to quadratus lumborum"], correctOption: 1,
    explanation: "On the posterior abdominal wall, quadratus lumborum lies between psoas major medially and transversus abdominis laterally. Therefore psoas major occupies the medial relation to quadratus lumborum.",
    learningNote: "QL: medial psoas, lateral transversus.", highYieldNote: "Quadratus lumborum lies between medial psoas major and lateral transversus abdominis.", mnemonic: "⬅️ Psoas is medial to QL.",
    memoryAid: aid("Quadratus lumborum lies between medial psoas major and lateral transversus abdominis.", "Psoas is medial to QL.", ["⬅️", "💪"], "The leftward psoas cue marks its medial position.", "NCBI Bookshelf: Posterior Abdominal Wall Nerves", "https://www.ncbi.nlm.nih.gov/books/NBK557605/"),
    sourceUrl: "https://www.ncbi.nlm.nih.gov/books/NBK557605/", finding: "Quadratus lumborum is between medial psoas and lateral transversus abdominis."
  },
  {
    id: "anatomy-anatomy-all-pdf-p0520-q0140", page: 520,
    expectedStem: "ww The ejaculatory duct is formed by the union of which of the following structures:", expectedOptions: ["Ductus deferens and the prostatic urethra 4%", "Ductus deferens and the epididymis 3% (x) Ductus deferens and prostatic ducts bee () Ductus deferens and duct from the seminal vesicle 28%", "Prostatic ducts and duct from seminal vesicle 48%"],
    stem: "The ejaculatory duct is formed by the union of which structures?", options: ["Ductus deferens and prostatic urethra", "Ductus deferens and epididymis", "Ductus deferens and prostatic ducts", "Ductus deferens and duct from seminal vesicle", "Prostatic ducts and duct from seminal vesicle"], correctOption: 3,
    explanation: "Each ejaculatory duct forms where the ductus deferens joins the duct of a seminal vesicle. It then enters the prostate and opens into the prostatic urethra.",
    learningNote: "Ejaculatory duct = ductus deferens plus seminal-vesicle duct.", highYieldNote: "Ductus deferens joins seminal-vesicle duct to form ejaculatory duct.", mnemonic: "🤝 Deferens meets seminal vesicle.",
    memoryAid: aid("The ejaculatory duct forms from union of ductus deferens and seminal-vesicle duct.", "Deferens meets seminal vesicle.", ["🤝", "➡️"], "A handshake cues the duct union.", "NCBI Bookshelf: Seminal Vesicle", "https://www.ncbi.nlm.nih.gov/books/NBK499854/"),
    sourceUrl: "https://www.ncbi.nlm.nih.gov/books/NBK499854/", finding: "Seminal-vesicle duct converges with ductus deferens to form ejaculatory duct."
  },
  {
    id: "anatomy-anatomy-all-pdf-p0522-q0141", page: 522,
    expectedStem: "ww The external anal sphincter is innervated by which of the following nerves:", expectedOptions: ["Genitofemoral nerve 3%", "Pudendal nerve (x) Coccygeal nerve 6%", "llioinguinal nerve 5%", "lliohypogastric nerve 3%"],
    stem: "The external anal sphincter is innervated by which nerve?", options: ["Genitofemoral nerve", "Pudendal nerve", "Coccygeal nerve", "Ilioinguinal nerve", "Iliohypogastric nerve"], correctOption: 1,
    explanation: "The inferior rectal branch of the pudendal nerve supplies somatic motor fibres to the external anal sphincter, which permits voluntary continence.",
    learningNote: "External anal sphincter: pudendal via inferior rectal nerve.", highYieldNote: "Inferior rectal branch of pudendal nerve supplies external anal sphincter.", mnemonic: "🛡️ Pudendal guards the external anal sphincter.",
    memoryAid: aid("Pudendal inferior-rectal branch provides somatic motor supply to external anal sphincter.", "Pudendal guards the external sphincter.", ["🛡️", "🧠"], "A voluntary guard cues somatic pudendal control.", "NCBI Bookshelf: Pudendal Nerve", "https://www.ncbi.nlm.nih.gov/books/NBK554736/"),
    sourceUrl: "https://www.ncbi.nlm.nih.gov/books/NBK554736/", finding: "Inferior rectal pudendal branch carries somatic motor fibres to external anal sphincter."
  },
  {
    id: "anatomy-anatomy-all-pdf-p0526-q0142", page: 526,
    expectedStem: "ww The inguinal ligament is formed from which of the following:", expectedOptions: ["The lower free border of the external oblique aponeurosis", "The lower free border of the internal oblique aponeurosis 6%", "The lower free border of the transversus abdominis aponeurosis 1%", "The lower free border of the rectus abdominis aponeurosis 2%", "The lower free border of the thoracolumbar fascia 1%"],
    stem: "The inguinal ligament is formed from which structure?", options: ["Lower free border of external-oblique aponeurosis", "Lower free border of internal-oblique aponeurosis", "Lower free border of transversus-abdominis aponeurosis", "Lower free border of rectus-abdominis aponeurosis", "Lower free border of thoracolumbar fascia"], correctOption: 0,
    explanation: "The inferior free border of the external-oblique aponeurosis folds to form the inguinal ligament, extending from the anterior superior iliac spine to the pubic tubercle.",
    learningNote: "Inguinal ligament is external oblique's free lower border.", highYieldNote: "External-oblique inferior border forms inguinal ligament from ASIS to pubic tubercle.", mnemonic: "🧷 External oblique pins ASIS to pubic tubercle.",
    memoryAid: aid("The inferior border of external-oblique aponeurosis forms the inguinal ligament.", "External oblique pins ASIS to pubic tubercle.", ["🧷", "↔️"], "A pin between two landmarks cues the ligament.", "NCBI Bookshelf: Abdominal Wall", "https://www.ncbi.nlm.nih.gov/books/NBK551649/"),
    sourceUrl: "https://www.ncbi.nlm.nih.gov/books/NBK551649/", finding: "External-oblique inferior border forms inguinal ligament between ASIS and pubic tubercle."
  },
  {
    id: "anatomy-anatomy-all-pdf-p0530-q0144", page: 530,
    expectedStem: "ww The ileum predominantly occupies which region of the abdomen:", expectedOptions: ["Left upper quadrant 7%", "Right upper quadrant 4%", "Left lower quadrant 16%", "Right lower quadrant"],
    stem: "The ileum predominantly occupies which abdominal region?", options: ["Left upper quadrant", "Right upper quadrant", "Left lower quadrant", "Right lower quadrant", "Epigastric region"], correctOption: 3,
    explanation: "The ileum is the terminal and longest segment of small intestine. It lies mainly in the right lower quadrant before entering the caecum at the ileocaecal valve.",
    learningNote: "Ileum mainly occupies right lower quadrant.", highYieldNote: "Ileum lies mainly in right lower quadrant and ends at ileocaecal valve.", mnemonic: "➡️ Ileum ends in the right lower quadrant.",
    memoryAid: aid("The ileum is located mainly in the right lower quadrant.", "Ileum ends in the right lower quadrant.", ["➡️", "⬇️"], "Right-and-down cues the terminal ileum in RLQ.", "NCBI Bookshelf: Physiology, Small Bowel", "https://www.ncbi.nlm.nih.gov/books/NBK532263/"),
    sourceUrl: "https://www.ncbi.nlm.nih.gov/books/NBK532263/", finding: "Ileum is located mainly in the right lower quadrant."
  },
  {
    id: "anatomy-anatomy-all-pdf-p0533-q0145", page: 533,
    expectedStem: "ww The greater omentum descends from which of the following structures:", expectedOptions: ["The quadrate lobe of the liver 1%", "The lesser curvature of the stomach and first part of the duodenum 6%", "The greater curvature of the stomach and first part of the duodenum", "The transverse colon 6%", "The duodenojejunal junction 2%"],
    stem: "The greater omentum descends from which structures?", options: ["Quadrate lobe of liver", "Lesser curvature of stomach and first duodenum", "Greater curvature of stomach and first duodenum", "Transverse colon", "Duodenojejunal junction"], correctOption: 2,
    explanation: "The greater omentum is a four-layered peritoneal apron. It continues from the greater curvature of the stomach and proximal first part of the duodenum, then descends over the transverse colon and small bowel.",
    learningNote: "Greater omentum hangs from greater gastric curvature and first duodenum.", highYieldNote: "Greater omentum continues from greater curvature of stomach and first part of duodenum.", mnemonic: "🧣 Greater curve grows the greater apron.",
    memoryAid: aid("Greater omentum continues from the greater gastric curvature and first part of duodenum.", "Greater curve grows the greater apron.", ["🧣", "⬇️"], "A descending apron cues the greater omentum.", "NCBI Bookshelf: Stomach", "https://www.ncbi.nlm.nih.gov/books/NBK482334/"),
    sourceUrl: "https://www.ncbi.nlm.nih.gov/books/NBK482334/", finding: "Peritoneal layers continue as greater omentum at greater curvature."
  }
];

const restrictions = [
  {
    id: "anatomy-anatomy-all-pdf-p0513-q0136", page: 513,
    expectedStem: "ww The rectovesical fascia is located at which of the following sites:", expectedOptions: ["Between the ampulla of the rectum and the sacrum 1%", "Between the fundus of the bladder and the ampulla of the rectum (x) Between the rectum and the posterior fornix and cervix 4%", "Between the rectum and the seminal vesicle 9%", "Between the sigmoid colon and the rectum 3%"],
    stem: "The rectovesical fascia is located at which site?", options: ["Between ampulla of rectum and sacrum", "Between fundus of bladder and ampulla of rectum", "Between rectum and posterior fornix and cervix", "Between rectum and seminal vesicle", "Between sigmoid colon and rectum"],
    explanation: "The original source marks a male pelvic fascial location. Reviewed external sources describe Denonvilliers' fascia between rectum and prostate, but do not precisely corroborate the source’s named fascia and exact formulation; this record remains excluded.",
    warning: "Source page reviewed, but the exact rectovesical-fascia label and source-marked location are not precisely corroborated by the reviewed external anatomy literature. This record remains excluded from answer learning.",
    sourceUrl: "https://pmc.ncbi.nlm.nih.gov/articles/PMC8833507/", finding: "Denonvilliers' fascia is described between rectum and posterior prostate."
  },
  {
    id: "anatomy-anatomy-all-pdf-p0518-q0138", page: 518,
    expectedStem: "A 66 year old man presents to ED complaining of difficulty passing urine and nocturia. On examination you note the prostate is enlarged and you suspect BPH. Which of the following lobes of the prostate is most likely hypertrophied: Lateral lobe 5%", expectedOptions: ["Anterior lobe", "Fibromuscular zone"],
    stem: "A 66-year-old man has difficulty passing urine and nocturia with an enlarged prostate. In BPH, which prostate lobe is most likely hypertrophied?", options: ["Lateral lobe", "Posterior lobe", "Anterior lobe", "Median lobe", "Fibromuscular zone"],
    explanation: "The original source marks the median lobe. Current external evidence describes BPH as periurethral and transition-zone hyperplasia, rather than a uniquely most-likely lobe, so this record remains excluded from answer learning.",
    warning: "Source page reviewed, but the source-marked single-lobe BPH formulation is not precisely corroborated by reviewed current transition-zone anatomy evidence. This record remains excluded from answer learning.",
    sourceUrl: "https://www.ncbi.nlm.nih.gov/books/NBK558920/", finding: "BPH develops through stromal and epithelial proliferation in periurethral and transition zones."
  },
  {
    id: "anatomy-anatomy-all-pdf-p0529-q0143", page: 529,
    expectedStem: "ww The male bladder lies immediately anterior to which of the following structures:", expectedOptions: ["Anus 1%", "Prostate gland 19%", "Sigmoid colon 1%", "Abdominal aorta 2%"],
    stem: "The male bladder lies immediately anterior to which structure?", options: ["Anus", "Prostate gland", "Sigmoid colon", "Abdominal aorta", "Rectum"],
    explanation: "The original source marks rectum. Reviewed anatomy evidence describes seminal vesicles inferior to bladder fundus and superior to rectum, separated from rectum by Denonvilliers' fascia; the word “immediately” is not precisely supported, so this record remains excluded.",
    warning: "Source page reviewed, but the exact immediate male bladder-to-rectum relation is not precisely corroborated by reviewed external evidence because intervening pelvic relations are described. This record remains excluded from answer learning.",
    sourceUrl: "https://www.ncbi.nlm.nih.gov/books/NBK499854/", finding: "Seminal vesicles lie inferior to bladder fundus and superior to rectum, separated from rectum by Denonvilliers' fascia."
  }
];

function parseDrafts(source) {
  const prefix = "export const ocrDraftQuestions: OcrDraftQuestion[] = ";
  const start = source.indexOf(prefix); const arrayStart = start + prefix.length; const end = source.indexOf("];", arrayStart);
  if (start < 0 || end < 0) throw new Error("OCR draft export not found");
  return { arrayStart, end, drafts: JSON.parse(source.slice(arrayStart, end + 1)) };
}
function assertSnapshot(draft, item) {
  if (!draft || draft.sourcePage !== item.page) throw new Error(`Source-page drift for ${item.id}`);
  if (draft.stem !== item.expectedStem || JSON.stringify(draft.options) !== JSON.stringify(item.expectedOptions)) throw new Error(`OCR drift for ${item.id}; refusing update.`);
  if (!["ocr_draft", "needs_review"].includes(draft.status)) throw new Error(`Unexpected status for ${item.id}`);
}

const source = await readFile(bankPath, "utf8");
const parsed = parseDrafts(source);
const byId = new Map(parsed.drafts.map((item) => [item.id, item]));
const applied = [], restricted = [];
for (const item of restorations) {
  const draft = byId.get(item.id); assertSnapshot(draft, item);
  const before = { stem: draft.stem, options: draft.options, correctOption: draft.correctOption, status: draft.status, askable: draft.askable };
  Object.assign(draft, { stem: item.stem, options: item.options, correctOption: item.correctOption, explanation: item.explanation, learningNote: item.learningNote, highYieldNote: item.highYieldNote, mnemonic: item.mnemonic, memoryAid: item.memoryAid, status: "ocr_draft", askable: true, warnings: [reviewedWarning] });
  applied.push({ id: item.id, sourcePage: item.page, before, after: { stem: draft.stem, options: draft.options, correctOption: draft.correctOption, status: draft.status, askable: draft.askable }, evidence: { externalSource: item.sourceUrl, externalFinding: item.finding } });
}
for (const item of restrictions) {
  const draft = byId.get(item.id); assertSnapshot(draft, item);
  const before = { stem: draft.stem, options: draft.options, correctOption: draft.correctOption, status: draft.status, askable: draft.askable, warnings: draft.warnings ?? [], highYieldNote: draft.highYieldNote, mnemonic: draft.mnemonic, memoryAid: draft.memoryAid };
  Object.assign(draft, { stem: item.stem, options: item.options, correctOption: null, explanation: item.explanation, learningNote: "", status: "needs_review", askable: false, highYieldNote: undefined, mnemonic: undefined, memoryAid: undefined, warnings: [...new Set([...(draft.warnings ?? []), item.warning])] });
  restricted.push({ id: item.id, sourcePage: item.page, before, after: { stem: draft.stem, options: draft.options, correctOption: draft.correctOption, status: draft.status, askable: draft.askable, warnings: draft.warnings }, evidence: { externalSource: item.sourceUrl, externalFinding: item.finding } });
}
await writeFile(bankPath, `${source.slice(0, parsed.arrayStart)}${JSON.stringify(parsed.drafts)}${source.slice(parsed.end + 1)}`);
await mkdir(auditDir, { recursive: true });
await writeFile(path.join(auditDir, "applied-anatomy-batch-14.json"), `${JSON.stringify({ generatedAt: new Date().toISOString(), applied, restricted, automaticApproval: false, mockEligibility: "No restored OCR draft is mock eligible." }, null, 2)}\n`);
console.log(JSON.stringify({ restored: applied.map((row) => row.id), restricted: restricted.map((row) => row.id), automaticApproval: false }, null, 2));
