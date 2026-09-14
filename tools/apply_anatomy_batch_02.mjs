/**
 * Guarded Anatomy Batch 02 OCR restoration.
 * Restores only source-page and externally supported records, retains OCR-draft
 * status, and restricts source-confirmed but medically unresolved records.
 */
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const bankPath = path.join(root, "client", "src", "lib", "ocrDraftSections.ts");
const auditDir = path.join(root, "docs", "audit");
const reviewedWarning = "Source page and external anatomy reference reviewed; remains an unapproved OCR draft.";

const restorations = [
  {
    id: "anatomy-anatomy-all-pdf-p0048-q0012", sourcePage: 48,
    expectedStem: "w The kidneys are related posteriorly to all of the following structures EXCEPT for the:",
    expectedOptions: ["Diaphragm 10%", "Psoas major muscle 4%", "Quadratus lumborum muscle 4%", "lliacus muscle"],
    stem: "The kidneys are related posteriorly to all of the following structures EXCEPT for:",
    options: ["Diaphragm", "Psoas major muscle", "Quadratus lumborum muscle", "Transversus abdominis muscle", "Iliacus muscle"], correctOption: 4,
    explanation: "Posterior renal relations include the diaphragm superiorly and, inferiorly, psoas major, quadratus lumborum, and transversus abdominis. Iliacus is not a posterior relation of the kidneys.",
    learningNote: "The renal posterior relations are described from medial to lateral as psoas major, quadratus lumborum, and transversus abdominis; the diaphragm lies superiorly.",
    highYieldNote: "The lower poles of the kidneys lie anterior to psoas and lateral to quadratus lumborum; iliacus is not a posterior renal relation.",
    mnemonic: "🧭 Kidney back: P-Q-T, then exclude Iliacus.",
    memoryAid: { coreFact: "Iliacus is not a posterior relation of the kidneys.", mnemonic: "Kidney back: P-Q-T, then exclude Iliacus.", emojiCues: ["🔙", "🚫"], cueLabel: "A back arrow and prohibition sign cue the posterior-relation exception.", sourceLabel: "NCBI Bookshelf: Kidneys", sourceUrl: "https://www.ncbi.nlm.nih.gov/books/NBK482385/" },
    externalSource: "https://www.ncbi.nlm.nih.gov/books/NBK482385/", externalFinding: "The lower renal poles are anterior to psoas and lateral to quadratus lumborum."
  },
  {
    id: "anatomy-anatomy-all-pdf-p0054-q0013", sourcePage: 54,
    expectedStem: "Which of the following lies immediately medial to the second part of the duodenum:",
    expectedOptions: ["Transverse colon", "Spleen (x) Right kidney 3%", "Stomach"],
    stem: "Which of the following lies immediately medial to the second part of the duodenum?",
    options: ["Transverse colon", "Spleen", "Right kidney", "Head of the pancreas", "Stomach"], correctOption: 3,
    explanation: "The head of the pancreas occupies the C-shaped concavity of the second part of the duodenum. The descending duodenum lies lateral to the pancreatic head.",
    learningNote: "The descending duodenum lies anterior to the right kidney and IVC, and lateral to the head of the pancreas.",
    highYieldNote: "The pancreatic head sits medial to the second part of the duodenum within its C-shaped concavity.",
    mnemonic: "🧩 Duodenal C hugs the pancreatic head.",
    memoryAid: { coreFact: "The head of the pancreas lies medial to the second part of the duodenum.", mnemonic: "Duodenal C hugs the pancreatic head.", emojiCues: ["🇨", "🧩"], cueLabel: "A C shape and puzzle piece cue the duodenum around the pancreatic head.", sourceLabel: "NCBI Bookshelf: Duodenum", sourceUrl: "https://www.ncbi.nlm.nih.gov/books/NBK482390/" },
    externalSource: "https://www.ncbi.nlm.nih.gov/books/NBK482390/", externalFinding: "The pancreatic head occupies the C-shaped concavity of the descending duodenum."
  },
  {
    id: "anatomy-anatomy-all-pdf-p0058-q0014", sourcePage: 58,
    expectedStem: "A72 year old man presents to ED with severe abdominal pain and diarrhoea. Imaging shows occlusion of the inferior mesenteric artery. Which of the following structures is most likely affected:",
    expectedOptions: ["Ascending and descending colon", "Ascending and transverse colon", "Caecum and transverse colon"],
    stem: "A 72-year-old man presents to the emergency department with severe abdominal pain and diarrhoea. Imaging shows occlusion of the inferior mesenteric artery. Which structures are most likely affected?",
    options: ["Ascending and descending colon", "Ascending and transverse colon", "Caecum and transverse colon", "Descending and sigmoid colon", "Caecum and ileum"], correctOption: 3,
    explanation: "The inferior mesenteric artery supplies hindgut structures. Its left colic and sigmoid branches perfuse the descending and sigmoid colon.",
    learningNote: "At the left colic flexure, arterial supply transitions from the superior mesenteric to the inferior mesenteric artery territory.",
    highYieldNote: "IMA branches perfuse the descending and sigmoid colon; the left colic and sigmoid arteries are key branches.",
    mnemonic: "⬅️ IMA = left colon and sigmoid.",
    memoryAid: { coreFact: "The IMA supplies the descending and sigmoid colon through left colic and sigmoid branches.", mnemonic: "IMA = left colon and sigmoid.", emojiCues: ["⬅️", "〰️"], cueLabel: "A left arrow and sigmoid curve cue IMA territory.", sourceLabel: "NCBI Bookshelf: Large Intestine", sourceUrl: "https://www.ncbi.nlm.nih.gov/books/NBK470577/" },
    externalSource: "https://www.ncbi.nlm.nih.gov/books/NBK470577/", externalFinding: "The descending and sigmoid colon are perfused by left colic and sigmoid IMA branches."
  },
  {
    id: "anatomy-anatomy-all-pdf-p0063-q0015", sourcePage: 63,
    expectedStem: "ww The psoas major muscle attaches distally to which of the following: (x) Pubic tubercle 2%",
    expectedOptions: ["Greater trochanter of the femur 1%", "Lesser trochanter of the femur", "lliac crest 13%", "Anterior superior iliac spine 4%"],
    stem: "The psoas major muscle attaches distally to which of the following?",
    options: ["Pubic tubercle", "Greater trochanter of the femur", "Lesser trochanter of the femur", "Iliac crest", "Anterior superior iliac spine"], correctOption: 2,
    explanation: "Psoas major joins iliacus to form iliopsoas. Their common tendon attaches to the lesser trochanter of the femur.",
    learningNote: "Psoas major descends over the pelvic brim into the anterior thigh and inserts through the iliopsoas tendon at the lesser trochanter.",
    highYieldNote: "Psoas major and iliacus share an iliopsoas tendon at the lesser trochanter.",
    mnemonic: "🦴 Psoas goes to the Lesser trochanter.",
    memoryAid: { coreFact: "Psoas major inserts at the lesser trochanter through the iliopsoas tendon.", mnemonic: "Psoas goes to the Lesser trochanter.", emojiCues: ["🦴", "⬇️"], cueLabel: "A bone and downward arrow cue the distal lesser-trochanter attachment.", sourceLabel: "NCBI Bookshelf: Psoas Major", sourceUrl: "https://www.ncbi.nlm.nih.gov/books/NBK535418/" },
    externalSource: "https://www.ncbi.nlm.nih.gov/books/NBK535418/", externalFinding: "The iliopsoas common tendon attaches to the lesser trochanter."
  },
  {
    id: "anatomy-anatomy-all-pdf-p0075-q0018", sourcePage: 75,
    expectedStem: "ww McBurney's point, the surface projection of the base of the appendix is located at which of the following sites:",
    expectedOptions: ["At the junction of the lateral and middle one-thirds of a line extending from the anterior superior iliac spine to the umbilicus. (x) At the midpoint of a line extending from the anterior superior iliac spine to the umbilicus. 9% At the junction of the medial and middle one-thirds of a line extending from the anterior 14% superior iliac spine to the umbilicus. At the midpoint of a line extending from the anterior superior iliac spine to the pubic 6% symphysis.", "At the midpoint of a line extending from the anterior superior iliac spine to the pubic tubercle. 2%"],
    stem: "McBurney's point, the traditional surface projection of the appendiceal base, is located at which site?",
    options: ["Junction of the lateral and middle thirds of the ASIS-to-umbilicus line", "Midpoint of the ASIS-to-umbilicus line", "Junction of the medial and middle thirds of the ASIS-to-umbilicus line", "Midpoint of the ASIS-to-pubic-symphysis line", "Midpoint of the ASIS-to-pubic-tubercle line"], correctOption: 0,
    explanation: "McBurney's point is the traditional surface landmark at the junction of the lateral and middle thirds of the line between the right ASIS and umbilicus. Actual appendiceal-base position is variable.",
    learningNote: "Use McBurney's point as a traditional surface landmark, not as a claim that every appendiceal base lies at that exact point.",
    highYieldNote: "McBurney's point is the lateral/middle-third junction of the right ASIS-to-umbilicus line; the appendix position itself varies.",
    mnemonic: "📍 One third from ASIS toward the umbilicus.",
    memoryAid: { coreFact: "McBurney's point is the lateral/middle-third junction of the right ASIS-to-umbilicus line.", mnemonic: "One third from ASIS toward the umbilicus.", emojiCues: ["📍", "1️⃣3️⃣"], cueLabel: "A map pin and one-third sequence cue McBurney’s surface landmark.", sourceLabel: "PubMed: Ramsden et al., Clinical Radiology", sourceUrl: "https://pubmed.ncbi.nlm.nih.gov/8435952/" },
    externalSource: "https://pubmed.ncbi.nlm.nih.gov/8435952/", externalFinding: "The recognised McBurney point is the junction of lateral and middle thirds of the umbilicus-to-right-ASIS line."
  },
  {
    id: "anatomy-anatomy-all-pdf-p0085-q0020", sourcePage: 85,
    expectedStem: "The genitofemoral nerve innervates which of the following muscles: External anal sphincter 5%",
    expectedOptions: ["Bulbospongiosus muscle (x) Superficial transverse perineal muscle 6%", "Deep transverse perineal muscle"],
    stem: "The genitofemoral nerve innervates which of the following muscles?",
    options: ["External anal sphincter", "Male cremaster muscle", "Bulbospongiosus muscle", "Superficial transverse perineal muscle", "Deep transverse perineal muscle"], correctOption: 1,
    explanation: "The genital branch of the genitofemoral nerve enters the inguinal canal. In men, it supplies the cremaster and scrotal skin.",
    learningNote: "The genitofemoral nerve arises from L1–L2; its genital branch supplies the male cremaster muscle.",
    highYieldNote: "Genital branch of genitofemoral nerve: male cremaster muscle and scrotal skin.",
    mnemonic: "🧵 Genito-femoral enters the canal for cremaster.",
    memoryAid: { coreFact: "In men, the genital branch of the genitofemoral nerve supplies the cremaster.", mnemonic: "Genito-femoral enters the canal for cremaster.", emojiCues: ["🧵", "⬇️"], cueLabel: "A cord and downward arrow cue the genital branch entering the inguinal canal.", sourceLabel: "NCBI Bookshelf: Genitofemoral Nerve", sourceUrl: "https://www.ncbi.nlm.nih.gov/books/NBK430733/" },
    externalSource: "https://www.ncbi.nlm.nih.gov/books/NBK430733/", externalFinding: "In men, the genital branch supplies the scrotal skin and cremaster."
  },
  {
    id: "anatomy-anatomy-all-pdf-p0089-q0021", sourcePage: 89,
    expectedStem: "ww The floor of the inguinal canal is formed primarily by which of the following structures:",
    expectedOptions: ["Transversalis fascia 14%", "Medial one-half of the inguinal ligament", "Lateral one-half of the inguinal ligament 8%", "Psoas major muscle 3%"],
    stem: "The floor of the inguinal canal is formed primarily by which of the following structures?",
    options: ["Transversalis fascia", "Medial one-half of the inguinal ligament", "Lateral one-half of the inguinal ligament", "Psoas major muscle", "Pectineus muscle"], correctOption: 1,
    explanation: "The floor of the inguinal canal is formed by the medial one-half of the inguinal ligament and reinforced medially by the lacunar ligament.",
    learningNote: "The inguinal canal lies above the medial half of the inguinal ligament; this ligament forms its floor.",
    highYieldNote: "Inguinal canal floor = medial half of the inguinal ligament, with medial lacunar-ligament reinforcement.",
    mnemonic: "🧱 Inguinal floor: medial ligament makes the base.",
    memoryAid: { coreFact: "The medial half of the inguinal ligament forms the inguinal canal floor.", mnemonic: "Medial ligament makes the base.", emojiCues: ["🧱", "⬇️"], cueLabel: "A brick and downward arrow cue the inguinal floor.", sourceLabel: "NCBI Bookshelf: Inguinal Region", sourceUrl: "https://www.ncbi.nlm.nih.gov/books/NBK470204/" },
    externalSource: "https://www.ncbi.nlm.nih.gov/books/NBK470204/", externalFinding: "The inguinal ligament forms the floor of the inguinal canal."
  },
];

const restrictions = [
  { id: "anatomy-anatomy-all-pdf-p0067-q0016", sourcePage: 67, warning: "Source page reviewed, but the stem is medically ambiguous: canonical portal triad components exclude both hepatic vein branches and vagal fibres. Remains unresolved and excluded from answer learning." },
  { id: "anatomy-anatomy-all-pdf-p0073-q0017", sourcePage: 73, warning: "Source page reviewed, but the stem confuses embryological derivation with anatomical continuity from the epididymal tail. Remains unresolved and excluded from answer learning." },
  { id: "anatomy-anatomy-all-pdf-p0078-q0019", sourcePage: 78, warning: "Source page reviewed, but exact external corroboration for the stated L3-L4 inferior-pole landmark has not been recorded. Remains unresolved pending an exact authoritative reference." },
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
const restricted = [];

for (const item of restorations) {
  const draft = byId.get(item.id);
  if (!draft) throw new Error(`Missing ${item.id}`);
  if (draft.sourcePage !== item.sourcePage) throw new Error(`Source-page drift for ${item.id}`);
  if (draft.stem !== item.expectedStem || JSON.stringify(draft.options) !== JSON.stringify(item.expectedOptions)) throw new Error(`OCR drift for ${item.id}; refusing restoration.`);
  if (!["ocr_draft", "needs_review"].includes(draft.status)) throw new Error(`Unexpected status for ${item.id}`);
  const before = { stem: draft.stem, options: draft.options, correctOption: draft.correctOption, status: draft.status, askable: draft.askable };
  Object.assign(draft, { stem: item.stem, options: item.options, correctOption: item.correctOption, explanation: item.explanation, learningNote: item.learningNote, highYieldNote: item.highYieldNote, mnemonic: item.mnemonic, memoryAid: item.memoryAid, status: "ocr_draft", askable: true, warnings: [reviewedWarning] });
  applied.push({ id: item.id, sourcePage: item.sourcePage, before, after: { stem: draft.stem, options: draft.options, correctOption: draft.correctOption, status: draft.status, askable: draft.askable }, evidence: { externalSource: item.externalSource, externalFinding: item.externalFinding } });
}

for (const item of restrictions) {
  const draft = byId.get(item.id);
  if (!draft) throw new Error(`Missing ${item.id}`);
  if (draft.sourcePage !== item.sourcePage) throw new Error(`Source-page drift for ${item.id}`);
  if (!["ocr_draft", "needs_review"].includes(draft.status)) throw new Error(`Unexpected status for ${item.id}`);
  const before = { status: draft.status, askable: draft.askable, warnings: draft.warnings ?? [] };
  draft.status = "needs_review";
  draft.askable = false;
  draft.warnings = [...new Set([...(draft.warnings ?? []), item.warning])];
  restricted.push({ id: item.id, sourcePage: item.sourcePage, before, after: { status: draft.status, askable: draft.askable, warnings: draft.warnings } });
}

await writeFile(bankPath, `${source.slice(0, arrayStart)}${JSON.stringify(drafts)}${source.slice(end + 1)}`);
await mkdir(auditDir, { recursive: true });
await writeFile(path.join(auditDir, "applied-anatomy-batch-02.json"), `${JSON.stringify({ generatedAt: new Date().toISOString(), applied, restricted, automaticApproval: false, mockEligibility: "No restored OCR draft is mock eligible." }, null, 2)}\n`);
console.log(JSON.stringify({ restored: applied.map((row) => row.id), restricted: restricted.map((row) => row.id), automaticApproval: false }, null, 2));
