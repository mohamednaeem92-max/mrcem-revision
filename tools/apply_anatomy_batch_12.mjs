/** Guarded Anatomy Batch 12 application; this script never approves OCR records. */
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
    id: "anatomy-anatomy-all-pdf-p0442-q0115", page: 442,
    expectedStem: "Which of the following best describes the relationship of the bladder and prostate gland:", expectedOptions: ["The prostate gland lies anterosuperior to the bladder.", "The prostate gland lies posterosuperior to the bladder.", "The prostate gland lies superior to the bladder. (x) e prostate gland lies posteroinferior to the bladder. 23%"],
    stem: "Which statement best describes the relationship between the bladder and prostate gland?",
    options: ["The prostate gland lies anterosuperior to the bladder.", "The prostate gland lies posterosuperior to the bladder.", "The prostate gland lies superior to the bladder.", "The prostate gland lies inferior to the bladder.", "The prostate gland lies posteroinferior to the bladder."], correctOption: 3,
    explanation: "The prostate lies directly inferior to the bladder and surrounds the proximal urethra. It is anterior to the rectum and above the external urethral sphincter.",
    learningNote: "Prostate: inferior to bladder, anterior to rectum.",
    highYieldNote: "Male pelvic relation: prostate directly inferior to bladder and anterior to rectum.",
    mnemonic: "⬇️ Prostate sits below the bladder.",
    memoryAid: aid("The prostate lies directly inferior to the bladder and anterior to the rectum.", "Prostate sits below the bladder.", ["⬇️", "🫧"], "Down arrow below the bladder cues the prostate relation.", "NCBI Bookshelf: Prostate", "https://www.ncbi.nlm.nih.gov/books/NBK540987/"),
    sourceUrl: "https://www.ncbi.nlm.nih.gov/books/NBK540987/", finding: "The prostate lies directly inferior to the bladder."
  },
  {
    id: "anatomy-anatomy-all-pdf-p0451-q0117", page: 451,
    expectedStem: "The infraduodenal region of the common bile duct: (Vv) ins in a groove posterior to the head of the pancreas. 30%", expectedOptions: ["lies posterior to the inferior vena cava.", "lies anterior to the left renal vein.", "empties into the third part of the duodenum."],
    stem: "Which statement describes the infraduodenal region of the common bile duct?",
    options: ["Runs in a groove posterior to the head of the pancreas.", "Lies posterior to the first part of the duodenum.", "Lies posterior to the inferior vena cava.", "Lies anterior to the left renal vein.", "Empties into the third part of the duodenum."], correctOption: 0,
    explanation: "The distal common bile duct traverses a groove on the posterior or posterosuperior surface of the pancreatic head before joining the pancreatic duct and entering the second part of the duodenum.",
    learningNote: "Distal CBD: posterior pancreatic-head groove, then second duodenum.",
    highYieldNote: "Common bile duct runs in a posterior pancreatic-head groove and opens into descending (second) duodenum.",
    mnemonic: "🟢 CBD grooves behind the pancreatic head.",
    memoryAid: aid("The common bile duct lies in a groove on the posterosuperior surface of the pancreatic head before entering the descending duodenum.", "CBD grooves behind the pancreatic head.", ["🟢", "⬇️"], "Green bile behind the head cues the duct course.", "NCBI Bookshelf: Pancreas", "https://www.ncbi.nlm.nih.gov/books/NBK532912/"),
    sourceUrl: "https://www.ncbi.nlm.nih.gov/books/NBK532912/", finding: "The bile duct lies in a groove on the posterosuperior surface of the pancreatic head."
  },
  {
    id: "anatomy-anatomy-all-pdf-p0454-q0118", page: 454,
    expectedStem: "ww The inguinal ligament spans between which of the following two structures:", expectedOptions: ["Anterior superior iliac spine and pubic tubercle", "Anterior superior iliac spine and pubic symphysis 58%", "Iliac crest and pubic symphysis 1%", "lliac crest and pubic tubercle 1%", "Anterior superior iliac spine and pubic crest 1%"],
    stem: "The inguinal ligament spans between which two structures?",
    options: ["Anterior superior iliac spine and pubic tubercle", "Anterior superior iliac spine and pubic symphysis", "Iliac crest and pubic symphysis", "Iliac crest and pubic tubercle", "Anterior superior iliac spine and pubic crest"], correctOption: 0,
    explanation: "The inferomedial fibers of external-oblique aponeurosis fold to form the inguinal ligament, which runs from the anterior superior iliac spine to the pubic tubercle.",
    learningNote: "Inguinal ligament: ASIS to pubic tubercle.",
    highYieldNote: "Inguinal ligament is folded external-oblique aponeurosis from ASIS to pubic tubercle.",
    mnemonic: "📍 ASIS to tubercle marks the groin line.",
    memoryAid: aid("The inguinal ligament runs from the anterior superior iliac spine to the pubic tubercle.", "ASIS to tubercle marks the groin line.", ["📍", "↘️"], "A line from ASIS toward pubic tubercle cues the ligament.", "NCBI Bookshelf: Inguinal Ligament", "https://www.ncbi.nlm.nih.gov/books/NBK542321/"),
    sourceUrl: "https://www.ncbi.nlm.nih.gov/books/NBK542321/", finding: "The inguinal ligament runs between the ASIS and pubic tubercle."
  },
  {
    id: "anatomy-anatomy-all-pdf-p0461-q0120", page: 461,
    expectedStem: "A 65 year old lady presents to ED complaining of anal pain and bleeding. Examination reveals external haemorrhoids. Which of the following nerves carries pain sensation from the anus:", expectedOptions: ["Genitofemoral nerve 3%", "Hypogastric nerve 2%", "Pudendal nerve", "Pelvic splanchnic nerve", "llioinguinal nerve 2%"],
    stem: "A 65-year-old woman has anal pain and bleeding from external haemorrhoids. Which nerve carries pain sensation from the anus?",
    options: ["Genitofemoral nerve", "Hypogastric nerve", "Pudendal nerve", "Pelvic splanchnic nerve", "Ilioinguinal nerve"], correctOption: 2,
    explanation: "External haemorrhoids occur below the pectinate line, where somatic sensation is carried by inferior rectal branches of the pudendal nerve. This explains their sharp pain sensitivity.",
    learningNote: "Below pectinate line: somatic pain via pudendal inferior rectal nerve.",
    highYieldNote: "External haemorrhoids hurt because inferior rectal branches of pudendal nerve carry somatic pain below pectinate line.",
    mnemonic: "⚡ Below pectinate = pudendal pain.",
    memoryAid: aid("The inferior rectal branch of the pudendal nerve carries somatic sensation below the pectinate line, including external-haemorrhoid pain.", "Below pectinate means pudendal pain.", ["⚡", "⬇️"], "Pain below a line cues pudendal somatic sensation.", "NCBI Bookshelf: Pudendal Nerve", "https://www.ncbi.nlm.nih.gov/books/NBK554736/"),
    sourceUrl: "https://www.ncbi.nlm.nih.gov/books/NBK554736/", finding: "The pudendal inferior rectal branch carries pain from external hemorrhoids."
  },
  {
    id: "anatomy-anatomy-all-pdf-p0465-q0121", page: 465,
    expectedStem: "ww The rectum starts at the rectosigmoid junction at which vertebral level: c", expectedOptions: ["S2 59%", "S4 3%"],
    stem: "At which vertebral level does the rectum start at the rectosigmoid junction?",
    options: ["L5", "S1", "S2", "S3", "S4"], correctOption: 3,
    explanation: "The rectum begins at the S3 level as a continuation of the sigmoid colon. It follows the sacral concavity before reaching the anal canal.",
    learningNote: "Rectosigmoid junction: S3.",
    highYieldNote: "Rectum begins as sigmoid colon becomes rectum at S3.",
    mnemonic: "3️⃣ Sigmoid turns to rectum at S3.",
    memoryAid: aid("The rectum starts at the level of S3 around the sacral promontory as a continuation of the sigmoid colon.", "Sigmoid turns to rectum at S3.", ["3️⃣", "↪️"], "A turn at three cues the rectosigmoid junction.", "NCBI Bookshelf: Rectum", "https://www.ncbi.nlm.nih.gov/books/NBK537245/"),
    sourceUrl: "https://www.ncbi.nlm.nih.gov/books/NBK537245/", finding: "The rectum starts at S3 as a continuation of the sigmoid colon."
  },
  {
    id: "anatomy-anatomy-all-pdf-p0470-q0122", page: 470,
    expectedStem: "ww The sacrotuberous ligament spans between which of the following structures:", expectedOptions: ["Pubic ramus to the posterior iliac spine and the sacrum 51% (x) Ischial spine to the iliac crest 1%", "Ischial tuberosity to the anterior superior iliac spine 4%", "Ischial tuberosity to the posterior superior iliac spine and the sacrum", "Ischial spine to the posterior superior iliac spine and the sacrum 4%"],
    stem: "The sacrotuberous ligament spans between which structures?",
    options: ["Pubic ramus to the posterior iliac spine and the sacrum", "Ischial spine to the iliac crest", "Ischial tuberosity to the anterior superior iliac spine", "Ischial tuberosity to the posterior superior iliac spine and the sacrum", "Ischial spine to the posterior superior iliac spine and the sacrum"], correctOption: 3,
    explanation: "The sacrotuberous ligament is a broad posterior pelvic ligament running from the sacrum and posterior iliac spines, with coccygeal contribution, to the ischial tuberosity.",
    learningNote: "Sacrotuberous: sacrum/posterior ilium to ischial tuberosity.",
    highYieldNote: "Sacrotuberous ligament anchors sacrum and posterior iliac spines to ischial tuberosity.",
    mnemonic: "🦴 Sacrum to tuberosity: sacro-tuberous.",
    memoryAid: aid("The sacrotuberous ligament runs from the sacrum and posterior iliac spines to the ischial tuberosity.", "Sacrum to tuberosity: sacro-tuberous.", ["🦴", "↘️"], "A posterior pelvic line to the sitting bone cues the ligament.", "NCBI Bookshelf: Pelvic Ligaments", "https://www.ncbi.nlm.nih.gov/books/NBK493215/"),
    sourceUrl: "https://www.ncbi.nlm.nih.gov/books/NBK493215/", finding: "Sacrotuberous ligament arises from sacrum and posterior iliac spines and attaches to ischial tuberosity."
  },
  {
    id: "anatomy-anatomy-all-pdf-p0473-q0123", page: 473,
    expectedStem: "ww The base of the bladder faces:", expectedOptions: ["Posteroinferiorly", "Posterosuperiorly 10%", "Anteroinferiorly 57%", "Superiorly 4%"],
    stem: "In which direction does the base of the bladder face?",
    options: ["Posteroinferiorly", "Posterosuperiorly", "Anteroinferiorly", "Anterosuperiorly", "Superiorly"], correctOption: 0,
    explanation: "The bladder fundus, also called its base, is the posteroinferior portion. The apex is anterosuperior and points toward the anterior abdominal wall.",
    learningNote: "Bladder base/fundus faces posteroinferiorly.",
    highYieldNote: "Bladder: apex anterosuperior; fundus or base posteroinferior.",
    mnemonic: "⬅️⬇️ Base looks back and down.",
    memoryAid: aid("The bladder fundus or base is the posteroinferior part of the bladder.", "Base looks back and down.", ["⬅️", "⬇️"], "Back and down arrows cue the bladder base.", "NCBI Bookshelf: Bladder", "https://www.ncbi.nlm.nih.gov/books/NBK531465/"),
    sourceUrl: "https://www.ncbi.nlm.nih.gov/books/NBK531465/", finding: "The fundus or base is the posteroinferior part of the bladder."
  },
  {
    id: "anatomy-anatomy-all-pdf-p0478-q0124", page: 478,
    expectedStem: "ww The aorta enters the abdomen at which of the following vertebral levels:", expectedOptions: ["T8 54%", "Ig 0%", "r12", "u 1%"],
    stem: "At which vertebral level does the aorta enter the abdomen?",
    options: ["T8", "T9", "T10", "T12", "L1"], correctOption: 3,
    explanation: "The aorta passes through the aortic hiatus in the diaphragm at T12 to enter the abdomen. The IVC and oesophageal hiatuses lie at T8 and T10 respectively.",
    learningNote: "Aortic hiatus: T12.",
    highYieldNote: "Diaphragm levels: IVC T8, oesophagus T10, aorta T12.",
    mnemonic: "8️⃣ 10️⃣ 12️⃣ IVC, oesophagus, aorta.",
    memoryAid: aid("The aorta passes through the aortic hiatus at T12 to enter the abdomen.", "Eight, ten, twelve: IVC, oesophagus, aorta.", ["8️⃣", "🔟", "1️⃣2️⃣"], "Increasing hiatus levels cue aorta at twelve.", "NCBI Bookshelf: Posterior Abdominal Wall Arteries", "https://www.ncbi.nlm.nih.gov/books/NBK532972/"),
    sourceUrl: "https://www.ncbi.nlm.nih.gov/books/NBK532972/", finding: "The aorta passes the aortic hiatus at T12."
  },
  {
    id: "anatomy-anatomy-all-pdf-p0481-q0125", page: 481,
    expectedStem: "Ld A 36 year old male is brought into ED complaining of fever, abdominal pain and tenderness. Imaging shows that an abdominal infection has spread retroperitoneally. Which of the following structures is most likely affected:", expectedOptions: ["Jejunum 1%", "Head of the pancreas", "Transverse colon 4%", "First part of duodenum 56%"],
    stem: "A 36-year-old man has fever, abdominal pain, and tenderness. Imaging shows retroperitoneal spread of infection. Which listed structure is most likely affected?",
    options: ["Jejunum", "Head of the pancreas", "Transverse colon", "First part of duodenum", "Appendix"], correctOption: 1,
    explanation: "The pancreas is retroperitoneal except for its mobile tail. The pancreatic head is therefore the retroperitoneal option in this list, whereas the jejunum, transverse colon, proximal first duodenum, and appendix are intraperitoneal.",
    learningNote: "Pancreatic head is retroperitoneal; pancreatic tail is the mobile exception.",
    highYieldNote: "Retroperitoneal pancreas: head, neck, and body; tail is the mobile peritoneal exception.",
    mnemonic: "🧩 Pancreatic head hides behind peritoneum.",
    memoryAid: aid("The pancreas is retroperitoneal, including the pancreatic head; the tail is the peritoneal exception.", "Pancreatic head hides behind peritoneum.", ["🧩", "⬅️"], "A hidden pancreatic head cues retroperitoneal position.", "NCBI Bookshelf: Pancreas", "https://www.ncbi.nlm.nih.gov/books/NBK532912/"),
    sourceUrl: "https://www.ncbi.nlm.nih.gov/books/NBK532912/", finding: "The pancreas is a retroperitoneal gland and its head is in the duodenal C-loop."
  }
];

const restrictions = [
  {
    id: "anatomy-anatomy-all-pdf-p0446-q0116", page: 446,
    expectedStem: "ww The body of the pancreas lies at which of the following vertebral levels:", expectedOptions: ["™ 7%", "L2 26%"],
    stem: "At which vertebral level does the body of the pancreas lie?",
    options: ["T11", "T12", "L1", "L2", "L3"],
    explanation: "The source marks L1, but the reviewed current anatomy reference places the pancreas across L1-L2 and states that the body passes over L2. This record remains excluded from answer learning because the exact source formulation is not precisely corroborated.",
    warning: "Source page reviewed, but the source-marked isolated L1 level for the pancreatic body conflicts with the reviewed authoritative L1-L2 and body-over-L2 description. This record remains excluded from answer learning.",
    sourceUrl: "https://www.ncbi.nlm.nih.gov/books/NBK532912/", finding: "The pancreas crosses L1-L2 and the body passes over L2."
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
await writeFile(path.join(auditDir, "applied-anatomy-batch-12.json"), `${JSON.stringify({ generatedAt: new Date().toISOString(), applied, restricted, automaticApproval: false, mockEligibility: "No restored OCR draft is mock eligible." }, null, 2)}\n`);
console.log(JSON.stringify({ restored: applied.map((row) => row.id), restricted: restricted.map((row) => row.id), automaticApproval: false }, null, 2));
