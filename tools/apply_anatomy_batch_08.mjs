/** Guarded Anatomy Batch 08 restoration; this script never approves OCR records. */
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const bankPath = path.join(root, "client", "src", "lib", "ocrDraftSections.ts");
const auditDir = path.join(root, "docs", "audit");
const reviewedWarning = "Source page and external anatomy reference reviewed; remains an unapproved OCR draft.";

function aid(coreFact, mnemonic, emojiCues, cueLabel, sourceLabel, sourceUrl) {
  return { coreFact, mnemonic, emojiCues, cueLabel, sourceLabel, sourceUrl };
}

const restorations = [
  {
    id: "anatomy-anatomy-all-pdf-p0299-q0074", page: 299,
    expectedStem: "Irritation of the central part of the diaphragmatic peritoneum is typically referred to:",
    expectedOptions: ["The jaw a", "The epigastric region The periumbilical region 4% (x) The flanks 1%"],
    stem: "Irritation of the central diaphragmatic peritoneum is typically referred to where?",
    options: ["The jaw", "The shoulder tip", "The epigastric region", "The periumbilical region", "The flanks"], correctOption: 1,
    explanation: "The central diaphragmatic peritoneum is supplied by the phrenic nerve (C3-C5). Irritation may therefore be felt as referred pain at the shoulder tip.",
    learningNote: "Central diaphragm irritation refers to the shoulder tip through the phrenic nerve.",
    highYieldNote: "Central diaphragm → phrenic nerve (C3-C5) → shoulder-tip pain.",
    mnemonic: "🫁➡️🧠➡️🦴 C3-5 diaphragm points to the shoulder.",
    memoryAid: aid("Central diaphragmatic irritation can produce shoulder-tip pain through the phrenic nerve (C3-C5).", "C3-5 diaphragm points to the shoulder.", ["🫁", "🧠", "🦴"], "Diaphragm, nerve, shoulder: trace phrenic referred pain.", "NCBI Bookshelf: Gallbladder", "https://www.ncbi.nlm.nih.gov/books/NBK459288/"),
    sourceUrl: "https://www.ncbi.nlm.nih.gov/books/NBK459288/", finding: "Central diaphragmatic irritation is transmitted by phrenic afferents and can cause shoulder-tip referred pain."
  },
  {
    id: "anatomy-anatomy-all-pdf-p0302-q0075", page: 302,
    expectedStem: "The bladder receives its efferent parasympathetic fibres derived from spinal cord segments:",
    expectedOptions: ["L4-L5", "$1-S2", "L4-S2"],
    stem: "The bladder receives efferent parasympathetic fibres from which spinal cord segments?",
    options: ["L4-L5", "S3-S4", "S2-S4", "S1-S2", "L4-S2"], correctOption: 2,
    explanation: "Pelvic splanchnic nerves from S2-S4 provide parasympathetic input to the bladder. Parasympathetic activity contracts detrusor muscle during micturition.",
    learningNote: "Bladder parasympathetics travel in pelvic splanchnic nerves from S2-S4.",
    highYieldNote: "Pelvic splanchnics S2-S4: parasympathetic supply to detrusor.",
    mnemonic: "2️⃣3️⃣4️⃣ Pelvic splanchnics open the bladder door.",
    memoryAid: aid("Bladder parasympathetic efferents travel in pelvic splanchnic nerves from S2-S4.", "Pelvic splanchnics open the bladder door.", ["2️⃣", "3️⃣", "4️⃣"], "Read 2-3-4 as the sacral parasympathetic sequence.", "NCBI Bookshelf: Bladder", "https://www.ncbi.nlm.nih.gov/books/NBK531465/"),
    sourceUrl: "https://www.ncbi.nlm.nih.gov/books/NBK531465/", finding: "Pelvic splanchnic nerves from S2-S4 mediate bladder parasympathetic activity."
  },
  {
    id: "anatomy-anatomy-all-pdf-p0307-q0076", page: 307,
    expectedStem: "A 64 year old man is brought to ED with profuse haematemesis. Endoscopy shows oesophageal varices which are most likely the result of anastomosis of the left gastric vein with which of the following vessels:",
    expectedOptions: ["Abdominal aorta", "Inferior mesenteric vein Superior mesenteric vein 8%"],
    stem: "Oesophageal varices result from an anastomosis of the left gastric vein with which vessel system?",
    options: ["Abdominal aorta", "Azygos system of veins", "Inferior mesenteric vein", "Superior mesenteric vein", "Portal vein"], correctOption: 1,
    explanation: "At the gastro-oesophageal junction, left-gastric portal tributaries communicate with oesophageal veins draining to the azygos system. Portal hypertension can dilate this portosystemic collateral pathway.",
    learningNote: "Left gastric (portal) connects with oesophageal veins to the azygos system (systemic).",
    highYieldNote: "Oesophageal varices: left gastric vein ↔ oesophageal veins ↔ azygos system.",
    mnemonic: "🍽️↔️🫀 Left gastric meets azygos at the oesophagus.",
    memoryAid: aid("Oesophageal varices arise at a portosystemic connection between left-gastric tributaries and oesophageal veins draining to the azygos system.", "Left gastric meets azygos at the oesophagus.", ["🍽️", "↔️", "🫀"], "Stomach, connection, and systemic-vein cue the portal-systemic site.", "NCBI Bookshelf: Esophageal Varices", "https://www.ncbi.nlm.nih.gov/books/NBK448078/"),
    sourceUrl: "https://www.ncbi.nlm.nih.gov/books/NBK448078/", finding: "Gastro-oesophageal portosystemic collaterals communicate with the azygos venous system."
  },
  {
    id: "anatomy-anatomy-all-pdf-p0311-q0077", page: 311,
    expectedStem: "ww The psoas major muscle originates from which of the following:",
    expectedOptions: ["The T12 - LS vertebrae", "The 11th and 12th rib 5%", "The T11 - 112 vertebrae 10%", "The sacrum 2%", "The iliac crest 7%"],
    stem: "Psoas major originates from which vertebral levels?",
    options: ["T12-L5 vertebrae", "Eleventh and twelfth ribs", "T11-T12 vertebrae", "Sacrum", "Iliac crest"], correctOption: 0,
    explanation: "Psoas major has thoracolumbar attachments, including T12 and the lumbar vertebrae with their intervertebral discs. It joins iliacus to insert on the lesser trochanter.",
    learningNote: "Psoas major spans the thoracolumbar region before joining iliacus at the lesser trochanter.",
    highYieldNote: "Psoas major: T12 and lumbar vertebral/disc attachments → lesser trochanter with iliacus.",
    mnemonic: "T1️⃣2️⃣ to L5, psoas dives to the lesser trochanter.",
    memoryAid: aid("Psoas major has T12 and lumbar vertebral attachments and joins iliacus at the lesser trochanter.", "T12 to L5, psoas dives to the lesser trochanter.", ["1️⃣", "2️⃣", "🦴"], "Twelve and bone cue the thoracolumbar origin and femoral insertion.", "NCBI Bookshelf: Psoas Major", "https://www.ncbi.nlm.nih.gov/books/NBK535418/"),
    sourceUrl: "https://www.ncbi.nlm.nih.gov/books/NBK535418/", finding: "Psoas major has distal thoracic and upper lumbar vertebral/disc attachments."
  },
  {
    id: "anatomy-anatomy-all-pdf-p0315-q0078", page: 315,
    expectedStem: "Which of the following actions does NOT facilitate defaecation:",
    expectedOptions: ["Increased intra-abdominal pressure 53% (x) traction of rectal smooth muscle 5%", "Relaxation of the internal anal sphincter 6%", "Relaxation of the external anal sphincter"],
    stem: "Which action does not facilitate defaecation?",
    options: ["Increased intra-abdominal pressure", "Contraction of rectal smooth muscle", "Contraction of the puborectalis muscle", "Relaxation of the internal anal sphincter", "Relaxation of the external anal sphincter"], correctOption: 2,
    explanation: "During defaecation, puborectalis relaxes along with the external anal sphincter to allow passage of stool. Therefore, contraction of puborectalis does not facilitate defaecation.",
    learningNote: "Puborectalis relaxation helps straighten the anorectal route for stool passage.",
    highYieldNote: "Defaecation requires puborectalis relaxation, not contraction.",
    mnemonic: "🚪 Puborectalis relaxes to open the exit.",
    memoryAid: aid("Puborectalis relaxes during defaecation to allow faeces to leave the rectum.", "Puborectalis relaxes to open the exit.", ["🚪", "⬇️"], "An open door cues relaxation for stool passage.", "NCBI Bookshelf: Physiology, Defecation", "https://www.ncbi.nlm.nih.gov/books/NBK539732/"),
    sourceUrl: "https://www.ncbi.nlm.nih.gov/books/NBK539732/", finding: "The puborectalis and external anal sphincter relax to permit defaecation."
  },
  {
    id: "anatomy-anatomy-all-pdf-p0323-q0080", page: 323,
    expectedStem: "ww The obturator nerve is formed from the anterior rami of:",
    expectedOptions: ["Eels", "Ey-L2 5% Oe", "L2-L3 1%", "L3-L4 5%"],
    stem: "The obturator nerve is formed from the anterior rami of which roots?",
    options: ["L2-L4", "L1-L2", "L1-L4", "L2-L3", "L3-L4"], correctOption: 0,
    explanation: "The obturator nerve arises from L2-L4 lumbar plexus roots. It descends through psoas major and supplies the medial thigh compartment.",
    learningNote: "Obturator nerve is an L2-L4 nerve for medial-thigh adduction.",
    highYieldNote: "Obturator = L2-L4; motor supply to medial thigh adductors.",
    mnemonic: "2️⃣3️⃣4️⃣ Obturator opens the adductor door.",
    memoryAid: aid("The obturator nerve arises from L2-L4 lumbar plexus roots and supplies medial-thigh adductors.", "2-3-4, obturator opens the adductor door.", ["2️⃣", "3️⃣", "4️⃣"], "Read 2-3-4 as the obturator-root sequence.", "NCBI Bookshelf: Obturator Nerve", "https://www.ncbi.nlm.nih.gov/books/NBK551640/"),
    sourceUrl: "https://www.ncbi.nlm.nih.gov/books/NBK551640/", finding: "The obturator nerve arises from the second through fourth lumbar roots."
  },
  {
    id: "anatomy-anatomy-all-pdf-p0331-q0082", page: 331,
    expectedStem: "ww A 41 year old man presents to ED with a painful, infected abscess on the posterior aspect of the scrotum. Which of the following lymph nodes is most likely to be affected first:",
    expectedOptions: ["Internal iliac nodes 4%", "External iliac nodes 2%", "Superficial inguinal nodes", "Deep inguinal nodes 9%"],
    stem: "A man has an infected posterior-scrotal skin abscess. Which lymph nodes are most likely affected first?",
    options: ["Internal iliac nodes", "External iliac nodes", "Superficial inguinal nodes", "Deep inguinal nodes", "Para-aortic nodes"], correctOption: 2,
    explanation: "Scrotal skin drains to superficial inguinal nodes. This differs from the testes, whose lymphatics follow gonadal vessels to para-aortic nodes.",
    learningNote: "Scrotum → superficial inguinal nodes; testis → para-aortic nodes.",
    highYieldNote: "Scrotal skin drains to superficial inguinal nodes, not para-aortic nodes.",
    mnemonic: "🩲⬇️ Scrotum goes down to superficial inguinal nodes.",
    memoryAid: aid("Scrotal skin lymphatics drain first to superficial inguinal nodes, unlike testicular lymphatics.", "Scrotum goes down to superficial inguinal nodes.", ["🩲", "⬇️"], "Scrotum and downward arrow cue superficial inguinal drainage.", "NCBI Bookshelf: Lymphatic Drainage", "https://www.ncbi.nlm.nih.gov/books/NBK557720/"),
    sourceUrl: "https://www.ncbi.nlm.nih.gov/books/NBK557720/", finding: "Superficial inguinal nodes receive lymph from the scrotum."
  },
  {
    id: "anatomy-anatomy-all-pdf-p0334-q0083", page: 334,
    expectedStem: "The superior pole of the left kidney reaches as high as which of the following:",
    expectedOptions: ["Rib 8", "Rib 9", "Rib 10"],
    stem: "The superior pole of the left kidney typically reaches as high as which rib?",
    options: ["Rib 8", "Rib 9", "Rib 10", "Rib 11", "Rib 12"], correctOption: 3,
    explanation: "The left kidney lies slightly higher than the right. Its superior margin is usually near T12 at approximately the level of the eleventh rib; the right kidney lies lower because of the liver.",
    learningNote: "Left renal superior pole: approximately rib 11; right renal superior pole: lower.",
    highYieldNote: "Left kidney sits higher: superior margin near rib 11; right kidney is lower under the liver.",
    mnemonic: "1️⃣1️⃣ Left kidney lives higher at eleven.",
    memoryAid: aid("The superior margin of the left kidney is usually at approximately the level of the eleventh rib.", "Left kidney lives higher at eleven.", ["1️⃣", "1️⃣", "🫘"], "Two ones and a kidney cue the left upper pole at rib 11.", "NCBI Bookshelf: Kidney Nerve Supply", "https://www.ncbi.nlm.nih.gov/books/NBK459339/"),
    sourceUrl: "https://www.ncbi.nlm.nih.gov/books/NBK459339/", finding: "The left kidney's superior margin is usually near the eleventh rib and lies higher than the right."
  }
];

const restrictions = [
  {
    id: "anatomy-anatomy-all-pdf-p0319-q0079", page: 319,
    expectedStem: "A 40 year old man is undergoing a vasectomy. During the procedure the various layers of the spermatic cord are separated to expose the ductus deferens. The internal spermatic fascia is derived from which of the following: External oblique aponeurosis 3%",
    expectedOptions: ["Internal oblique aponeurosis", "Internal oblique muscle", "Transversus abdominis muscle"],
    stem: "During vasectomy, the internal spermatic fascia is derived from which layer?",
    options: ["External oblique aponeurosis", "Internal oblique aponeurosis", "Transversalis fascia", "Internal oblique muscle", "Transversus abdominis muscle"],
    explanation: "The source marks transversalis fascia. The reviewed external sources confirm the deep inguinal-ring relation but do not directly corroborate this exact derivation statement, so the record remains excluded from answer learning.",
    warning: "Source page reviewed, but the available authoritative sources did not directly corroborate the source's exact internal-spermatic-fascia derivation statement. This record remains excluded from answer learning."
  },
  {
    id: "anatomy-anatomy-all-pdf-p0327-q0081", page: 327,
    expectedStem: "w Which of the following best describes the relationship of the duodenum to the pancreas:",
    expectedOptions: ["The first part of the duodenum lies superior to the tail of the pancreas. 2% (x) [he second part of the duodenum lies medial to the head of the pancreas. 14%", "The third part of the duodenum lies inferior to the pancreas.", "The fourth part of the duodenum lies inferior to the head of the pancreas. 3%", "The head of the pancreas lies posterior to the second part of the duodenum. 9%"],
    stem: "Which statement best describes the relationship of the duodenum to the pancreas?",
    options: ["The first part of the duodenum lies superior to the tail of the pancreas.", "The second part of the duodenum lies medial to the head of the pancreas.", "The third part of the duodenum lies inferior to the pancreas.", "The fourth part of the duodenum lies inferior to the head of the pancreas.", "The head of the pancreas lies posterior to the second part of the duodenum."],
    explanation: "The source marks the third duodenal part as inferior to the pancreas. Reviewed external sources establish the broader duodenal and pancreatic relations but do not directly state this exact source-marked relationship, so the record remains excluded from answer learning.",
    warning: "Source page reviewed, but the exact source-marked third-duodenal-part relation was not directly corroborated by an authoritative external source. This record remains excluded from answer learning."
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
  if (!['ocr_draft', 'needs_review'].includes(draft.status)) throw new Error(`Unexpected status for ${item.id}`);
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
  Object.assign(draft, { stem: item.stem, options: item.options, correctOption: null, explanation: item.explanation, status: "needs_review", askable: false, highYieldNote: undefined, mnemonic: undefined, memoryAid: undefined, warnings: [...new Set([...(draft.warnings ?? []), item.warning])] });
  restricted.push({ id: item.id, sourcePage: item.page, before, after: { stem: draft.stem, options: draft.options, correctOption: draft.correctOption, status: draft.status, askable: draft.askable, warnings: draft.warnings } });
}

await writeFile(bankPath, `${source.slice(0, parsed.arrayStart)}${JSON.stringify(parsed.drafts)}${source.slice(parsed.end + 1)}`);
await mkdir(auditDir, { recursive: true });
await writeFile(path.join(auditDir, "applied-anatomy-batch-08.json"), `${JSON.stringify({ generatedAt: new Date().toISOString(), applied, restricted, automaticApproval: false, mockEligibility: "No restored OCR draft is mock eligible." }, null, 2)}\n`);
console.log(JSON.stringify({ restored: applied.map((row) => row.id), restricted: restricted.map((row) => row.id), automaticApproval: false }, null, 2));
