/**
 * Guarded source-page batch update for Anatomy Batch 01.
 * It restores only records confirmed against user-supplied source pages and
 * authoritative external anatomy references. Every item stays an OCR draft.
 */
import { readFile, writeFile, mkdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const bankPath = path.join(root, "client", "src", "lib", "ocrDraftSections.ts");
const auditDir = path.join(root, "docs", "audit");

const validated = [
  {
    id: "anatomy-anatomy-all-pdf-p0001-q0001",
    sourcePage: 1,
    expectedOptions: ["L2-L4", "£1 - L2", "Li-L4 ac", "E2=L3.", "L3-L4"],
    stem: "The femoral nerve is formed from the anterior rami of:",
    options: ["L2-L4", "L1-L2", "L1-L4", "L2-L3", "L3-L4"],
    correctOption: 0,
    explanation: "The femoral nerve is formed from the anterior rami of L2 to L4. It innervates the iliacus, pectineus, sartorius and muscles in the anterior compartment of the thigh, and supplies skin on the anterior thigh and medial surface of the leg.",
    learningNote: "The femoral nerve arises from L2-L4. It runs lateral to the femoral vessels beneath the inguinal ligament before entering the femoral triangle.",
    highYieldNote: "Femoral nerve roots are L2-L4. In the femoral triangle, remember the nerve is lateral to the femoral artery and vein.",
    mnemonic: "🧠 Femoral = L2-L4: count 2, 3, 4 before the knee can extend.",
    externalSource: "https://www.ncbi.nlm.nih.gov/books/NBK556065/",
    externalFinding: "The femoral nerve forms from the dorsal divisions of the L2-L4 ventral rami.",
  },
  {
    id: "anatomy-anatomy-all-pdf-p0013-q0004",
    sourcePage: 13,
    expectedOptions: ["The prostate gland lies inferior to the rectum.", "The prostate gland lies posterior to the rectum.", "The prostate gland is not in relation to the rectum."],
    stem: "Which of the following best describes the relationship of the prostate gland and rectum:",
    options: ["The prostate gland lies superior to the rectum.", "The prostate gland lies inferior to the rectum.", "The prostate gland lies anterior to the rectum.", "The prostate gland lies posterior to the rectum.", "The prostate gland is not in relation to the rectum."],
    correctOption: 2,
    explanation: "The prostate lies immediately inferior to the bladder and internal urethral sphincter, superior to the external urethral sphincter, and anterior to the rectum.",
    learningNote: "The prostate is palpable on digital rectal examination because it lies anterior to the rectal wall.",
    highYieldNote: "In a sagittal pelvic relation, the prostate is anterior to the rectum and inferior to the bladder.",
    mnemonic: "🧠 PROstate is BEFORE the rectum: prostate in front, rectum behind.",
    externalSource: "https://www.ncbi.nlm.nih.gov/books/NBK537245/",
    externalFinding: "The rectal anatomy reference states that the prostate sits anterior to the rectal wall.",
  },
  {
    id: "anatomy-anatomy-all-pdf-p0017-q0005",
    sourcePage: 17,
    expectedOptions: ["Superior hypogastric plexus 2%", "Pelvic splanchnic nerves", "Lumbar splanchnic nerves 13% Cee rowvemne", "Sacral splanchnic nerves 19%"],
    stem: "The parasympathetic supply to the rectum is from which of the following:",
    options: ["Superior hypogastric plexus", "Pelvic splanchnic nerves", "Lumbar splanchnic nerves", "Inferior hypogastric nerves", "Sacral splanchnic nerves"],
    correctOption: 1,
    explanation: "Parasympathetic supply to the rectum is from the pelvic splanchnic nerves (S2-S4) via the inferior hypogastric plexus.",
    learningNote: "Pelvic splanchnic nerves arise from S2-S4 and provide parasympathetic innervation to the hindgut and pelvic organs, including the rectum.",
    highYieldNote: "Do not confuse pelvic splanchnic nerves with sacral splanchnic nerves: pelvic splanchnics are parasympathetic and arise from S2-S4.",
    mnemonic: "🧠 Pelvic splanchnics: S2, S3, S4 keep the pelvis parasympathetic.",
    externalSource: "https://www.ncbi.nlm.nih.gov/books/NBK560504/",
    externalFinding: "Pelvic splanchnic nerves arise from S2-S4 and provide parasympathetic innervation to pelvic organs, including the rectum.",
  },
  {
    id: "anatomy-anatomy-all-pdf-p0022-q0006",
    sourcePage: 22,
    expectedOptions: ["Superior surface", "Inferolateral surface", "Apex", "Inferior base"],
    stem: "The ureters enter the bladder through which of the following:",
    options: ["Superior surface", "Inferolateral surface", "Apex", "Superior base", "Inferior base"],
    correctOption: 3,
    explanation: "The triangular bladder base, or fundus, faces posteroinferiorly. The ureters enter at the upper corners of the base, while the urethra drains from the lower corner.",
    learningNote: "The bladder base contains the trigone, which includes the ureteric openings and the beginning of the urethra.",
    highYieldNote: "The ureteric openings form the upper corners of the trigone at the bladder base; the urethral opening is the lower corner.",
    mnemonic: "🔺 Bladder trigone: two ureters at the top corners, urethra at the bottom.",
    externalSource: "https://www.ncbi.nlm.nih.gov/books/NBK538533/",
    externalFinding: "The bladder base includes the trigone, encompassing the ureteric openings and the beginning of the urethra.",
  },
  {
    id: "anatomy-anatomy-all-pdf-p0027-q0007",
    sourcePage: 27,
    expectedOptions: ["The rectum is continuous with the rectosigmoid junction at the level of vertebra S2. (x) The rectum is connected to the posterior abdominal wall by the sigmoid mesocolon. 5%", "The rectum is the most posterior viscera in the pelvic cavity.", "The rectum lies immediately posterior to the bladder in women. 4%", "The rectum is an intraperitoneal structure. 55%"],
    stem: "Regarding the rectum, which of the following statements is CORRECT:",
    options: ["The rectum is continuous with the rectosigmoid junction at the level of vertebra S2.", "The rectum is connected to the posterior abdominal wall by the sigmoid mesocolon.", "The rectum is the most posterior viscus in the pelvic cavity.", "The rectum lies immediately posterior to the bladder in women.", "The rectum is an intraperitoneal structure."],
    correctOption: 2,
    explanation: "The rectum is the most posterior visceral organ in the pelvic cavity. It begins at approximately S3, and only its upper third is covered by peritoneum anteriorly and laterally.",
    learningNote: "The rectum is the posterior pelvic viscus. In women, the cervix, uterus, and vagina lie anterior to it; in men, the prostate and bladder are anterior.",
    highYieldNote: "The rectum is not intraperitoneal throughout. Its lower third lacks peritoneal covering, and it is the most posterior pelvic viscus.",
    mnemonic: "🧠 RECTUM = Rear-most pelvic viscus.",
    externalSource: "https://www.ncbi.nlm.nih.gov/books/NBK537245/",
    externalFinding: "The rectum is described as the most posterior visceral organ in the pelvic cavity; its upper third is covered by peritoneum anteriorly and laterally.",
  },
  {
    id: "anatomy-anatomy-all-pdf-p0032-q0008",
    sourcePage: 32,
    expectedOptions: ["m10-11", "T9-T12 Be", "Li-L3 19%", "L2-L4 20%", "T5-19 we"],
    stem: "The uterine visceral afferent fibres usually follow sympathetic efferents to which of the following spinal cord segments:",
    options: ["T10-L1", "T9-T12", "L1-L3", "L2-L4", "T5-T9"],
    correctOption: 0,
    explanation: "The uterus receives sympathetic input through the inferior hypogastric plexus. Its visceral afferent fibres usually follow sympathetic fibres to enter the spinal cord through T10-T12 and L1 nerve fibres.",
    learningNote: "Uterine visceral afferents travel in hypogastric nerves to thoracolumbar segments. T10-L1 is the useful examination range.",
    highYieldNote: "Uterine visceral pain fibres travel with sympathetic pathways to T10-L1. This differs from pelvic splanchnic parasympathetic outflow at S2-S4.",
    mnemonic: "🧠 Uterus = T10 to L1: remember “ten to one.”",
    externalSource: "https://pmc.ncbi.nlm.nih.gov/articles/PMC4119661/",
    externalFinding: "The review identifies T10-L1 visceral afferent pain fibres for the uterus, adnexa, and cervix.",
  },
  {
    id: "anatomy-anatomy-all-pdf-p0036-q0009",
    sourcePage: 36,
    expectedOptions: ["Transversus abdominis muscle", "External oblique aponeurosis 8%", "Transversalis fascia 7A%", "External oblique muscle 2%", "Internal oblique muscle 6%"],
    stem: "The posterior wall of the inguinal canal is formed primarily by which of the following structures:",
    options: ["Transversus abdominis muscle", "External oblique aponeurosis", "Transversalis fascia", "External oblique muscle", "Internal oblique muscle"],
    correctOption: 2,
    explanation: "The posterior wall of the inguinal canal is formed along its length by transversalis fascia and is reinforced medially by the conjoint tendon.",
    learningNote: "The posterior wall of the inguinal canal includes transversalis fascia; the conjoint tendon contributes to its medial part.",
    highYieldNote: "Match the wall to its layer: posterior inguinal canal wall = transversalis fascia, with medial conjoint-tendon reinforcement.",
    mnemonic: "🧠 The posterior wall starts with T: Transversalis fascia at the back.",
    externalSource: "https://www.ncbi.nlm.nih.gov/books/NBK470204/",
    externalFinding: "The posterior wall of the inguinal canal is formed by transversalis fascia with a medial conjoint-tendon contribution.",
  },
  {
    id: "anatomy-anatomy-all-pdf-p0040-q0010",
    sourcePage: 40,
    expectedOptions: ["Splenic artery", "Hepatic artery 4%", "Renal artery 1%", "Inferior mesenteric artery 52%"],
    stem: "The arterial supply to the pancreas is mainly derived from which of the following:",
    options: ["Gastric artery", "Splenic artery", "Hepatic artery", "Renal artery", "Inferior mesenteric artery"],
    correctOption: 1,
    explanation: "The pancreatic arterial supply includes branches of the splenic artery, common hepatic artery, and superior mesenteric artery. The splenic artery provides the principal supply to the body and tail.",
    learningNote: "The splenic artery runs along the superior border of the pancreas and supplies the body and tail through pancreatic branches.",
    highYieldNote: "Pancreatic arterial supply is shared, but splenic arterial branches are the key supply for the body and tail.",
    mnemonic: "🧠 Pancreatic tail points to the spleen, so think splenic artery.",
    externalSource: "https://www.ncbi.nlm.nih.gov/books/NBK532912/",
    externalFinding: "The pancreas receives branches from the splenic, superior mesenteric, and common hepatic arteries; the body and tail receive splenic arterial branches.",
  },
];

const source = await readFile(bankPath, "utf8");
const prefix = "export const ocrDraftQuestions: OcrDraftQuestion[] = ";
const start = source.indexOf(prefix);
const arrayStart = start + prefix.length;
const end = source.indexOf("];", arrayStart);
if (start < 0 || end < 0) throw new Error("OCR draft export not found");
const drafts = JSON.parse(source.slice(arrayStart, end + 1));
const byId = new Map(drafts.map((draft) => [draft.id, draft]));
const applied = [];

for (const item of validated) {
  const draft = byId.get(item.id);
  if (!draft) throw new Error(`Missing expected draft ${item.id}`);
  if (draft.sourcePage !== item.sourcePage) throw new Error(`Source-page drift for ${item.id}`);
  if (JSON.stringify(draft.options) !== JSON.stringify(item.expectedOptions)) throw new Error(`Option drift for ${item.id}; refusing to apply correction.`);
  if (!['ocr_draft', 'needs_review'].includes(draft.status)) throw new Error(`Unexpected review state for ${item.id}`);

  const before = { stem: draft.stem, options: draft.options, correctOption: draft.correctOption, status: draft.status, askable: draft.askable, warnings: draft.warnings };
  draft.stem = item.stem;
  draft.options = item.options;
  draft.correctOption = item.correctOption;
  draft.explanation = item.explanation;
  draft.learningNote = item.learningNote;
  draft.highYieldNote = item.highYieldNote;
  draft.mnemonic = item.mnemonic;
  draft.status = 'ocr_draft';
  draft.askable = true;
  draft.warnings = ['Source page and external anatomy reference reviewed; remains an unapproved OCR draft.'];
  applied.push({ id: item.id, sourcePage: item.sourcePage, before, after: { stem: draft.stem, options: draft.options, correctOption: draft.correctOption, status: draft.status, askable: draft.askable, highYieldNote: draft.highYieldNote, mnemonic: draft.mnemonic }, evidence: { externalSource: item.externalSource, externalFinding: item.externalFinding } });
}

await writeFile(bankPath, `${source.slice(0, arrayStart)}${JSON.stringify(drafts)}${source.slice(end + 1)}`);
await mkdir(auditDir, { recursive: true });
await writeFile(path.join(auditDir, "applied-anatomy-batch-01.json"), `${JSON.stringify({ generatedAt: new Date().toISOString(), applied, unresolved: ["anatomy-anatomy-all-pdf-p0006-q0002", "anatomy-anatomy-all-pdf-p0009-q0003"], automaticApproval: false }, null, 2)}\n`);
console.log(JSON.stringify({ applied: applied.map((item) => item.id), unresolvedCount: 2, automaticApproval: false }, null, 2));
