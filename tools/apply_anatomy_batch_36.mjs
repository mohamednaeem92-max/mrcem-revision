import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const bankPath = path.join(root, "client", "src", "lib", "ocrDraftSections.ts");
const snapshotPath = path.join(root, "docs", "audit", "anatomy-all-pdf-batch-36-ocr-records.json");
const auditDir = path.join(root, "docs", "audit");
const reviewedWarning = "Source page and external anatomy reference reviewed; remains an unapproved OCR draft.";

const aid = (coreFact, mnemonic, emojiCues, sourceLabel, sourceUrl) => ({
  coreFact,
  mnemonic,
  emojiCues,
  cueLabel: "Source-confirmed anatomy fact",
  sourceLabel,
  sourceUrl,
});

const restore = (id, page, expectedStem, expectedOptions, stem, options, correctOption, fact, mnemonic, memoryAid, sourceUrl, finding) => ({
  id,
  page,
  expectedStem,
  expectedOptions,
  stem,
  options,
  correctOption,
  fact,
  mnemonic,
  memoryAid,
  sourceUrl,
  finding,
});

const restorations = [
  restore(
    "anatomy-anatomy-all-pdf-p1134-q0117",
    1134,
    "The infraduodenal region of the common bile duct: (Vv) ins in a groove posterior to the head of the pancreas. 30%",
    ["lies posterior to the inferior vena cava.", "lies anterior to the left renal vein.", "empties into the third part of the duodenum."],
    "The infraduodenal region of the common bile duct:",
    ["runs in a groove posterior to the head of the pancreas.", "lies posterior to the first part of the duodenum.", "lies posterior to the inferior vena cava.", "lies anterior to the left renal vein.", "empties into the third part of the duodenum."],
    0,
    "The infraduodenal common bile duct runs in a groove on the posterior surface of the pancreatic head, anterior to the inferior vena cava.",
    "CBD grooves behind the head and ahead of the IVC.",
    aid("The infraduodenal common bile duct lies in a groove on the posterior surface of the pancreatic head and anterior to the inferior vena cava.", "CBD grooves behind the head and ahead of the IVC.", ["🟡", "🧠"], "NCBI Bookshelf: Pancreas", "https://www.ncbi.nlm.nih.gov/books/NBK532912/"),
    "https://www.ncbi.nlm.nih.gov/books/NBK532912/",
    "NCBI states that the bile duct lies in a groove on the posterosuperior surface of the pancreatic head or may be embedded in it."
  ),
  restore(
    "anatomy-anatomy-all-pdf-p1137-q0118",
    1137,
    "ww The inguinal ligament spans between which of the following two structures:",
    ["Anterior superior iliac spine and pubic tubercle", "Anterior superior iliac spine and pubic symphysis 58%", "Iliac crest and pubic symphysis 1%", "lliac crest and pubic tubercle 1%", "Anterior superior iliac spine and pubic crest 1%"],
    "The inguinal ligament spans between which of the following two structures:",
    ["Anterior superior iliac spine and pubic tubercle", "Anterior superior iliac spine and pubic symphysis", "Iliac crest and pubic symphysis", "Iliac crest and pubic tubercle", "Anterior superior iliac spine and pubic crest"],
    0,
    "The inguinal ligament is the rolled inferior border of external oblique aponeurosis extending from the anterior superior iliac spine to the pubic tubercle.",
    "Inguinal ligament: ASIS to tubercle.",
    aid("The inguinal ligament spans from the anterior superior iliac spine laterally to the pubic tubercle medially.", "Inguinal ligament: ASIS to tubercle.", ["🦴", "↔️"], "NCBI Bookshelf: Inguinal Canal", "https://www.ncbi.nlm.nih.gov/books/NBK542321/"),
    "https://www.ncbi.nlm.nih.gov/books/NBK542321/",
    "NCBI identifies the inguinal ligament as extending from the anterior superior iliac spine to the pubic tubercle."
  ),
  restore(
    "anatomy-anatomy-all-pdf-p1144-q0120",
    1144,
    "A 65 year old lady presents to ED complaining of anal pain and bleeding. Examination reveals external haemorrhoids. Which of the following nerves carries pain sensation from the anus:",
    ["Genitofemoral nerve 3%", "Hypogastric nerve 2%", "Pudendal nerve", "Pelvic splanchnic nerve", "llioinguinal nerve 2%"],
    "A 65 year old lady presents to ED complaining of anal pain and bleeding. Examination reveals external haemorrhoids. Which of the following nerves carries pain sensation from the anus:",
    ["Genitofemoral nerve", "Hypogastric nerve", "Pudendal nerve", "Pelvic splanchnic nerve", "Ilioinguinal nerve"],
    2,
    "Pain from the anal canal below the pectinate line, including external haemorrhoid pain, is carried by somatic fibres in the inferior rectal branch of the pudendal nerve.",
    "Below pectinate: pudendal perceives pain.",
    aid("The pudendal nerve, through its inferior rectal branches, carries somatic pain below the pectinate line.", "Below pectinate: pudendal perceives pain.", ["⬇️", "⚡"], "NCBI Bookshelf: Anus", "https://www.ncbi.nlm.nih.gov/books/NBK554736/"),
    "https://www.ncbi.nlm.nih.gov/books/NBK554736/",
    "NCBI describes somatic sensory innervation of the lower anal canal by inferior rectal branches of the pudendal nerve."
  ),
  restore(
    "anatomy-anatomy-all-pdf-p1148-q0121",
    1148,
    "ww The rectum starts at the rectosigmoid junction at which vertebral level: c",
    ["S2 59%", "S4 3%"],
    "The rectum starts at the rectosigmoid junction at which vertebral level:",
    ["L5", "S1", "S2", "S3", "S4"],
    3,
    "The rectum begins at the rectosigmoid junction at the S3 level, where it continues from the sigmoid colon.",
    "Rectum starts at sacral S3.",
    aid("The rectum starts at the rectosigmoid junction at S3.", "Rectum starts at sacral S3.", ["3️⃣", "🦴"], "NCBI Bookshelf: Rectum", "https://www.ncbi.nlm.nih.gov/books/NBK537245/"),
    "https://www.ncbi.nlm.nih.gov/books/NBK537245/",
    "NCBI states that the rectum begins at S3 as a continuation of the sigmoid colon."
  ),
  restore(
    "anatomy-anatomy-all-pdf-p1153-q0122",
    1153,
    "ww The sacrotuberous ligament spans between which of the following structures:",
    ["Pubic ramus to the posterior iliac spine and the sacrum 51% (x) Ischial spine to the iliac crest 1%", "Ischial tuberosity to the anterior superior iliac spine 4%", "Ischial tuberosity to the posterior superior iliac spine and the sacrum", "Ischial spine to the posterior superior iliac spine and the sacrum 4%"],
    "The sacrotuberous ligament spans between which of the following structures:",
    ["Pubic ramus to the posterior iliac spine and the sacrum", "Ischial spine to the iliac crest", "Ischial tuberosity to the anterior superior iliac spine", "Ischial tuberosity to the posterior superior iliac spine and the sacrum", "Ischial spine to the posterior superior iliac spine and the sacrum"],
    3,
    "The sacrotuberous ligament extends from the posterior sacrum and posterior superior iliac spine to the ischial tuberosity.",
    "Sacrotuberous: sacrum to tuberosity.",
    aid("The sacrotuberous ligament attaches the sacrum and posterior superior iliac spine to the ischial tuberosity.", "Sacrotuberous: sacrum to tuberosity.", ["🦴", "🔺"], "NCBI Bookshelf: Ligaments", "https://www.ncbi.nlm.nih.gov/books/NBK493215/"),
    "https://www.ncbi.nlm.nih.gov/books/NBK493215/",
    "NCBI describes the sacrotuberous ligament extending from sacral and posterior iliac attachments to the ischial tuberosity."
  ),
  restore(
    "anatomy-anatomy-all-pdf-p1156-q0123",
    1156,
    "ww The base of the bladder faces:",
    ["Posteroinferiorly", "Posterosuperiorly 10%", "Anteroinferiorly 57%", "Superiorly 4%"],
    "The base of the bladder faces:",
    ["Posteroinferiorly", "Posterosuperiorly", "Anteroinferiorly", "Anterosuperiorly", "Superiorly"],
    0,
    "The bladder base, also called the fundus, is the posteroinferior part of the bladder.",
    "Bladder base points back and down.",
    aid("The bladder fundus, or base, faces posteroinferiorly.", "Bladder base points back and down.", ["⬅️", "⬇️"], "NCBI Bookshelf: Bladder", "https://www.ncbi.nlm.nih.gov/books/NBK531465/"),
    "https://www.ncbi.nlm.nih.gov/books/NBK531465/",
    "NCBI identifies the fundus, or base, as the posteroinferior part of the urinary bladder."
  ),
  restore(
    "anatomy-anatomy-all-pdf-p1161-q0124",
    1161,
    "ww The aorta enters the abdomen at which of the following vertebral levels:",
    ["T8 54%", "Ig 0%", "r12", "u 1%"],
    "The aorta enters the abdomen at which of the following vertebral levels:",
    ["T8", "T9", "T10", "T12", "L1"],
    3,
    "The descending thoracic aorta passes through the diaphragmatic aortic hiatus at T12 and continues as the abdominal aorta.",
    "Aortic hiatus: T12.",
    aid("The descending thoracic aorta enters the abdomen through the aortic hiatus at T12.", "Aortic hiatus: T12.", ["🩸", "1️⃣2️⃣"], "NCBI Bookshelf: Aorta", "https://www.ncbi.nlm.nih.gov/books/NBK537319/"),
    "https://www.ncbi.nlm.nih.gov/books/NBK537319/",
    "NCBI states that the descending thoracic aorta passes through the aortic hiatus at T12 and continues as the abdominal aorta."
  ),
  restore(
    "anatomy-anatomy-all-pdf-p1164-q0125",
    1164,
    "Ld A 36 year old male is brought into ED complaining of fever, abdominal pain and tenderness. Imaging shows that an abdominal infection has spread retroperitoneally. Which of the following structures is most likely affected:",
    ["Jejunum 1%", "Head of the pancreas", "Transverse colon 4%", "First part of duodenum 56%"],
    "A 36 year old male is brought into ED complaining of fever, abdominal pain and tenderness. Imaging shows that an abdominal infection has spread retroperitoneally. Which of the following structures is most likely affected:",
    ["Jejunum", "Head of the pancreas", "Transverse colon", "First part of duodenum", "Appendix"],
    1,
    "The pancreas is retroperitoneal, and the pancreatic head lies within the duodenal C loop; among the listed structures it is the source-confirmed retroperitoneal option.",
    "Pancreatic head stays retroperitoneal.",
    aid("The pancreatic head is part of the retroperitoneal pancreas and lies in the C-shaped duodenal loop.", "Pancreatic head stays retroperitoneal.", ["🧠", "🫥"], "NCBI Bookshelf: Pancreas", "https://www.ncbi.nlm.nih.gov/books/NBK532912/"),
    "https://www.ncbi.nlm.nih.gov/books/NBK532912/",
    "NCBI describes the pancreas as situated retroperitoneally on the posterior abdominal wall and identifies the head within the duodenal C loop."
  ),
  restore(
    "anatomy-anatomy-all-pdf-p1167-q0126",
    1167,
    "ww The sigmoid colon extends as low as which of the following vertebral levels:",
    ["L5 1%", "s1 18%", "s2 18%"],
    "The sigmoid colon extends as low as which of the following vertebral levels:",
    ["L4", "L5", "S1", "S2", "S3"],
    4,
    "The sigmoid colon becomes continuous with the rectum at the S3 level.",
    "Sigmoid sinks to sacral S3.",
    aid("The sigmoid colon reaches S3, where it becomes continuous with the rectum.", "Sigmoid sinks to sacral S3.", ["3️⃣", "↘️"], "NCBI Bookshelf: Sigmoid Colon", "https://www.ncbi.nlm.nih.gov/books/NBK549824/"),
    "https://www.ncbi.nlm.nih.gov/books/NBK549824/",
    "NCBI states that the sigmoid colon becomes the rectum at the third sacral vertebral level."
  ),
  restore(
    "anatomy-anatomy-all-pdf-p1172-q0127",
    1172,
    "ww The mesentery connects which of the following structures to the posterior abdominal wall:",
    ["Transverse colon 62%", "Stomach 3%", "Jejunum and ileum", "Duodenum 5%"],
    "The mesentery connects which of the following structures to the posterior abdominal wall:",
    ["Transverse colon", "Stomach", "Jejunum and ileum", "Duodenum", "Liver"],
    2,
    "The mesentery is a double peritoneal fold that anchors the jejunum and ileum to the posterior abdominal wall.",
    "Mesentery: jejunum and ileum are tethered.",
    aid("The mesentery is a double fold of peritoneum anchoring the jejunum and ileum to the posterior abdominal wall.", "Mesentery: jejunum and ileum are tethered.", ["🪢", "🧻"], "NCBI Bookshelf: Small Intestine", "https://www.ncbi.nlm.nih.gov/books/NBK459366/"),
    "https://www.ncbi.nlm.nih.gov/books/NBK459366/",
    "NCBI directly defines the mesentery as a double peritoneal fold anchoring the jejunum and ileum to the posterior abdominal wall."
  ),
];

function parse(source) {
  const prefix = "export const ocrDraftQuestions: OcrDraftQuestion[] = ";
  const arrayStart = source.indexOf(prefix) + prefix.length;
  const end = source.indexOf("];", arrayStart);
  if (arrayStart < prefix.length || end < 0) throw new Error("OCR draft export not found");
  return { arrayStart, end, drafts: JSON.parse(source.slice(arrayStart, end + 1)) };
}

function snapshot(draft) {
  return {
    stem: draft.stem,
    options: draft.options,
    correctOption: draft.correctOption,
    status: draft.status,
    askable: draft.askable,
    needsImage: draft.needsImage,
    warnings: draft.warnings ?? [],
    memoryAid: draft.memoryAid ?? null,
  };
}

function guard(draft, original, item) {
  const optionsMatch = (value, expected) => JSON.stringify(value) === JSON.stringify(expected);
  if (
    !draft ||
    !original ||
    draft.id !== item.id ||
    original.id !== item.id ||
    draft.sourcePage !== item.page ||
    original.sourcePage !== item.page ||
    draft.stem !== item.expectedStem ||
    original.stem !== item.expectedStem ||
    !optionsMatch(draft.options, item.expectedOptions) ||
    !optionsMatch(original.options, item.expectedOptions)
  ) {
    throw new Error(`Immutable literal drift check failed: ${item.id}`);
  }
}

const source = await readFile(bankPath, "utf8");
const parsed = parse(source);
const immutable = JSON.parse(await readFile(snapshotPath, "utf8")).records;
const byId = new Map(parsed.drafts.map((draft) => [draft.id, draft]));
const originals = new Map(immutable.map((record) => [record.id, record]));
const applied = [];
const restricted = [];

for (const item of restorations) {
  const draft = byId.get(item.id);
  const original = originals.get(item.id);
  guard(draft, original, item);
  const before = snapshot(draft);
  Object.assign(draft, {
    stem: item.stem,
    options: item.options,
    correctOption: item.correctOption,
    explanation: item.fact,
    learningNote: item.fact,
    highYieldNote: item.fact,
    mnemonic: item.mnemonic,
    memoryAid: item.memoryAid,
    status: "ocr_draft",
    askable: true,
    needsImage: false,
    warnings: [reviewedWarning],
  });
  delete draft.approved;
  applied.push({
    id: item.id,
    sourcePage: item.page,
    before,
    after: snapshot(draft),
    evidence: { externalSource: item.sourceUrl, externalFinding: item.finding },
  });
}

await writeFile(bankPath, `${source.slice(0, parsed.arrayStart)}${JSON.stringify(parsed.drafts)}${source.slice(parsed.end + 1)}`);
await mkdir(auditDir, { recursive: true });
await writeFile(
  path.join(auditDir, "applied-anatomy-batch-36.json"),
  `${JSON.stringify({ generatedAt: new Date().toISOString(), applied, restricted, automaticApproval: false, mockEligibility: "No restored OCR draft is mock eligible." }, null, 2)}\n`
);
console.log(JSON.stringify({ restored: applied.length, restricted: restricted.length, automaticApproval: false }, null, 2));
