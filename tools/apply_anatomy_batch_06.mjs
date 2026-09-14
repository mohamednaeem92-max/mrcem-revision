/** Guarded Anatomy Batch 06 restoration; no record is approved by this script. */
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
    id: "anatomy-anatomy-all-pdf-p0217-q0054", page: 217,
    expectedStem: "The ilioinguinal nerve supplies skin over which of the following regions:",
    expectedOptions: ["Posterolateral gluteal region", "Lateral thigh", "Posteromedial gluteal region (x) Posterior thigh 2%"],
    stem: "The ilioinguinal nerve supplies skin over which region?",
    options: ["Posterolateral gluteal region", "Upper medial thigh", "Lateral thigh", "Posteromedial gluteal region", "Posterior thigh"],
    correctOption: 1,
    explanation: "The ilioinguinal nerve supplies sensory innervation to the upper anteromedial thigh and external genital region. The source-marked upper medial thigh is the best option.",
    learningNote: "Ilioinguinal sensory distribution includes the upper anteromedial thigh and external genital region.",
    highYieldNote: "Ilioinguinal nerve: upper anteromedial thigh plus external genital skin.",
    mnemonic: "⬆️🦵 Ilioinguinal reaches the upper medial thigh.",
    memoryAid: aid("The ilioinguinal nerve supplies upper anteromedial-thigh and external genital skin.", "Ilioinguinal reaches the upper medial thigh.", ["⬆️", "🦵"], "An upward arrow and thigh cue the upper-medial thigh distribution.", "NCBI Bookshelf: Ilioinguinal Neuralgia", "https://www.ncbi.nlm.nih.gov/books/NBK538256/"),
    sourceUrl: "https://www.ncbi.nlm.nih.gov/books/NBK538256/", finding: "The ilioinguinal nerve provides sensory innervation to the upper anteromedial thigh and external genital region."
  },
  {
    id: "anatomy-anatomy-all-pdf-p0221-q0055", page: 221,
    expectedStem: "Which of the following parts of the pancreas is intraperitoneal:",
    expectedOptions: ["Head 12%", "Neck", "Body", "Uncinate process 4%"],
    stem: "Which part of the pancreas is intraperitoneal?",
    options: ["Head", "Neck", "Body", "Uncinate process", "Tail"],
    correctOption: 4,
    explanation: "Most of the pancreas is retroperitoneal. The tail extends in the splenorenal ligament and is the only intraperitoneal part.",
    learningNote: "Pancreatic tail lies in the splenorenal ligament and is the intraperitoneal part.",
    highYieldNote: "Pancreas: tail is the only intraperitoneal part; the rest is primarily retroperitoneal.",
    mnemonic: "🧵 Pancreatic tail rides in the splenorenal ligament.",
    memoryAid: aid("The pancreatic tail extends in the splenorenal ligament and is the only intraperitoneal pancreatic part.", "Pancreatic tail rides in the splenorenal ligament.", ["🧵", "🌿"], "A thread and branch cue the tail travelling in the splenorenal ligament.", "Mihoc et al.: Pancreatic Morphology", "https://www.mdpi.com/2227-9059/12/11/2627"),
    sourceUrl: "https://www.mdpi.com/2227-9059/12/11/2627", finding: "The pancreatic tail in the splenorenal/lienorenal ligament is the only intraperitoneal part."
  },
  {
    id: "anatomy-anatomy-all-pdf-p0226-q0056", page: 226,
    expectedStem: "A patient is brought to ED following abdominal trauma. Your consultant performs a FAST scan in the department and identifies fluid in Morison's pouch. Where is Morison's pouch located: (x) Left perihepatic space 4%",
    expectedOptions: ["Left subphrenic space", "Right subphrenic space 14%", "Right subhepatic space", "Left infracolic space 2%"],
    stem: "A patient undergoes FAST after abdominal trauma and fluid is seen in Morison's pouch. Where is Morison's pouch located?",
    options: ["Left perihepatic space", "Left subphrenic space", "Right subphrenic space", "Right subhepatic space", "Left infracolic space"],
    correctOption: 3,
    explanation: "Morison's pouch, also called the hepatorenal pouch, is the right subhepatic space between the right liver lobe and the upper pole of the right kidney.",
    learningNote: "Morison's pouch is the right subhepatic, hepatorenal recess used in FAST assessment.",
    highYieldNote: "Morison's pouch = right subhepatic/hepatorenal space between liver and right kidney.",
    mnemonic: "🫀↔️🫘 Liver-to-right-kidney space: Morison's pouch.",
    memoryAid: aid("Morison's pouch is the right subhepatic hepatorenal space between the liver and right kidney.", "Liver-to-right-kidney space: Morison's pouch.", ["🫀", "↔️", "🫘"], "Liver, arrow, and kidney cue the hepatorenal recess.", "Kaur et al.: Morrison's Pouch Anatomy", "https://pmc.ncbi.nlm.nih.gov/articles/PMC9968550/"),
    sourceUrl: "https://pmc.ncbi.nlm.nih.gov/articles/PMC9968550/", finding: "Morrison's pouch is the right subhepatic hepatorenal space between the right liver lobe and right kidney."
  },
  {
    id: "anatomy-anatomy-all-pdf-p0230-q0057", page: 230,
    expectedStem: "The termination of the abdominal aorta can be visualised on the anterior abdominal wall by a point:",
    expectedOptions: ["About 2.5 cm above the umbilicus", "Halfway between the xiphisternum and the umbilicus", "Halfway between the umbilicus and the pubic symphysis", "About 2.5 cm above the deep inguinal ring"],
    stem: "The bifurcation of the abdominal aorta is conventionally projected at which anterior-abdominal-wall point?",
    options: ["About 2.5 cm above the umbilicus", "About 2.5 cm below the umbilicus", "Halfway between the xiphisternum and the umbilicus", "Halfway between the umbilicus and the pubic symphysis", "About 2.5 cm above the deep inguinal ring"],
    correctOption: 1,
    explanation: "The source's conventional surface-anatomy answer is approximately 2.5 cm below the umbilicus. Imaging studies show that the exact relation to the umbilicus varies between individuals.",
    learningNote: "Use the source's below-umbilicus approximation for this item, but do not treat it as an individual patient measurement.",
    highYieldNote: "Aortic bifurcation is conventionally just below the umbilicus, with meaningful anatomical variation.",
    mnemonic: "⬇️⚓ Aortic split: below the umbilical anchor, but variable.",
    memoryAid: aid("The aortic bifurcation is conventionally projected just below the umbilicus, though the exact position varies.", "Aortic split: below the umbilical anchor, but variable.", ["⬇️", "⚓"], "A downward arrow and anchor cue a conventional below-umbilicus projection.", "Jeong et al.: Umbilicus-to-Aortic-Bifurcation Distance", "https://pmc.ncbi.nlm.nih.gov/articles/PMC3924739/"),
    sourceUrl: "https://pmc.ncbi.nlm.nih.gov/articles/PMC3924739/", finding: "The aortic bifurcation is traditionally described below the umbilicus, but CT data show wide individual variation."
  },
  {
    id: "anatomy-anatomy-all-pdf-p0233-q0058", page: 233,
    expectedStem: "ww The superior pole of the right kidney reaches as high as which of the following: @",
    expectedOptions: ["Rib 9 5%", "Rib 10 1%", "Rib 11 58%", "rib 12"],
    stem: "The superior pole of the right kidney reaches as high as which rib?",
    options: ["Rib 8", "Rib 9", "Rib 10", "Rib 11", "Rib 12"],
    correctOption: 4,
    explanation: "The right kidney lies slightly lower than the left because of the liver. Its upper pole is frequently crossed by the 12th rib.",
    learningNote: "Right kidney is lower than left; upper poles are commonly related to the 12th rib.",
    highYieldNote: "Right kidney is lower than left and reaches rib 12 superiorly.",
    mnemonic: "1️⃣2️⃣ Right kidney meets the 12th rib.",
    memoryAid: aid("The right kidney is lower than the left, and its upper pole is frequently crossed by the 12th rib.", "Right kidney meets the 12th rib.", ["1️⃣2️⃣", "🫘"], "Twelve and a kidney cue the superior right-kidney rib relation.", "NCBI Bookshelf: Kidneys", "https://www.ncbi.nlm.nih.gov/books/NBK482385/"),
    sourceUrl: "https://www.ncbi.nlm.nih.gov/books/NBK482385/", finding: "The right kidney lies slightly lower than the left and upper renal poles are frequently crossed by the 12th rib."
  },
  {
    id: "anatomy-anatomy-all-pdf-p0239-q0059", page: 239,
    expectedStem: "bd Regarding the ureters, which of the following statements is CORRECT:",
    expectedOptions: ["The bladder drains into the ureters. 1%", "The ureters are continuously superiorly with the renal medulla. 6%", "The ureters descend on the medial aspect of the psoas major muscles.", "The ureters are intraperitoneal structures. 55%", "The left ureter lies in close proximity to the appendix. 2%"],
    stem: "Regarding the ureters, which statement is correct?",
    options: ["The bladder drains into the ureters.", "The ureters are continuous superiorly with the renal medulla.", "The ureters descend on the medial aspect of the psoas major muscles.", "The ureters are intraperitoneal structures.", "The left ureter lies in close proximity to the appendix."],
    correctOption: 2,
    explanation: "Ureters arise at the ureteropelvic junction and travel retroperitoneally, passing anterior to psoas major. The right, not left, ureter is near the caecum and appendix.",
    learningNote: "Ureters are retroperitoneal, run over psoas major, and the right ureter is the one near the appendix.",
    highYieldNote: "Ureters: retroperitoneal, anterior to psoas major; right ureter near caecum and appendix.",
    mnemonic: "➡️🫘 Right ureter runs over psoas and near the appendix.",
    memoryAid: aid("Ureters travel retroperitoneally anterior to psoas major; the right ureter is near the caecum and appendix.", "Right ureter runs over psoas and near the appendix.", ["➡️", "🫘", "🟢"], "Arrow, kidney, and appendix cue the right-sided ureter relation.", "NCBI Bookshelf: Ureter", "https://www.ncbi.nlm.nih.gov/books/NBK532980/"),
    sourceUrl: "https://www.ncbi.nlm.nih.gov/books/NBK532980/", finding: "Ureters are retroperitoneal, pass anterior to psoas, and the right ureter lies near the caecum and appendix."
  },
  {
    id: "anatomy-anatomy-all-pdf-p0242-q0060", page: 242,
    expectedStem: "ww The renal pelvis is continuous with which of the following structures:",
    expectedOptions: ["The minor calyx 54%", "The renal pyramid 2%", "The major calyx 9%", "The renal sinus 1% (v’) The ureter 3496"],
    stem: "The renal pelvis is continuous with which structure?",
    options: ["The minor calyx", "The renal pyramid", "The major calyx", "The renal sinus", "The ureter"],
    correctOption: 4,
    explanation: "Minor calyces unite as major calyces, and major calyces form the renal pelvis. The renal pelvis is the funnel-shaped transition to the proximal ureter.",
    learningNote: "Collecting pathway: minor calyx to major calyx to renal pelvis to ureter.",
    highYieldNote: "Renal pelvis is the funnel-shaped transition from major calyces to proximal ureter.",
    mnemonic: "🔻 Minor → major → pelvis → ureter.",
    memoryAid: aid("Major calyces form the renal pelvis, which transitions into the proximal ureter.", "Minor → major → pelvis → ureter.", ["🔻", "➡️"], "A funnel and arrow cue the collecting-system sequence to ureter.", "NCBI Bookshelf: Kidneys", "https://www.ncbi.nlm.nih.gov/books/NBK482385/"),
    sourceUrl: "https://www.ncbi.nlm.nih.gov/books/NBK482385/", finding: "Major calyces unite as the renal pelvis, a funnel-shaped transition to the proximal ureter."
  },
  {
    id: "anatomy-anatomy-all-pdf-p0253-q0062", page: 253,
    expectedStem: "ww The right and left hepatic arteries are derived from which of the following blood vessels:",
    expectedOptions: ["Directly from the aorta 6%", "From the coeliac trunk", "From the superior mesenteric artery 7%", "From the inferior mesenteric artery", "From the gastrosplenic artery 4%"],
    stem: "In usual anatomy, the right and left hepatic arteries are derived from which vessel?",
    options: ["Directly from the aorta", "From the coeliac trunk", "From the superior mesenteric artery", "From the inferior mesenteric artery", "From the gastrosplenic artery"],
    correctOption: 1,
    explanation: "In usual anatomy, the proper hepatic artery arises through the coeliac trunk and gives right and left hepatic branches. Hepatic arterial variants are recognised.",
    learningNote: "Usual hepatic arterial route: coeliac trunk to common hepatic artery to proper hepatic artery to right and left branches.",
    highYieldNote: "Usual hepatic artery pathway: coeliac trunk → common hepatic → proper hepatic → right and left branches.",
    mnemonic: "🌿 Coeliac trunk branches into the hepatic tree.",
    memoryAid: aid("In usual anatomy, the proper hepatic artery arises through the coeliac trunk and divides into right and left hepatic branches.", "Coeliac trunk branches into the hepatic tree.", ["🌿", "🫀"], "A branching tree and liver cue the usual coeliac hepatic route.", "NCBI Bookshelf: Liver", "https://www.ncbi.nlm.nih.gov/books/NBK500014/"),
    sourceUrl: "https://www.ncbi.nlm.nih.gov/books/NBK500014/", finding: "The proper hepatic artery is a branch of the coeliac trunk; hepatic arterial variants occur."
  },
  {
    id: "anatomy-anatomy-all-pdf-p0259-q0063", page: 259,
    expectedStem: "A 23 year old patient is brought to ED following a road traffic accident. CT imaging demonstrates retroperitoneal injury. Which of the following organs is most likely affected:",
    expectedOptions: ["Appendix Sigmoid colon 6%", "Tail of the pancreas"],
    stem: "A 23-year-old patient is brought to the ED after a road-traffic collision. CT shows retroperitoneal injury. Which listed organ is most likely affected?",
    options: ["Ascending colon", "Spleen", "Appendix", "Sigmoid colon", "Tail of the pancreas"],
    correctOption: 0,
    explanation: "The ascending colon is retroperitoneal. The appendix and sigmoid colon are intraperitoneal, and the pancreatic tail lies in the splenorenal ligament.",
    learningNote: "Ascending and descending colon are retroperitoneal; transverse and sigmoid colon are intraperitoneal.",
    highYieldNote: "Ascending colon is retroperitoneal; sigmoid colon is intraperitoneal.",
    mnemonic: "⬆️ Colon ascends against the posterior wall: retroperitoneal.",
    memoryAid: aid("The ascending colon is retroperitoneal, whereas the appendix and sigmoid colon are intraperitoneal.", "Colon ascends against the posterior wall: retroperitoneal.", ["⬆️", "🧱"], "An upward arrow and wall cue the posteriorly fixed ascending colon.", "NCBI Bookshelf: Large Intestine", "https://www.ncbi.nlm.nih.gov/books/NBK470577/"),
    sourceUrl: "https://www.ncbi.nlm.nih.gov/books/NBK470577/", finding: "The ascending colon is retroperitoneal; appendix and sigmoid colon are intraperitoneal."
  }
];

const restrictions = [
  {
    id: "anatomy-anatomy-all-pdf-p0248-q0061", page: 248,
    expectedStem: "A 65 year old man with known BPH, presents to ED in severe pain due to urinary retention. What is the location of the neural cell bodies responsible for pain sensation from the urinary bladder:",
    expectedOptions: ["Dorsal root ganglia of spinal cord levels L1- L4", "anglia inal cord levels S2, S3 and S4 Dorsal root ganglia of spinal cord levels T5 - T9 1%", "Dorsal root ganglia of spinal cord levels 110 - T12"],
    stem: "A 65-year-old man with BPH has severe pain from urinary retention. Where are the neural cell bodies responsible for urinary-bladder pain sensation located?",
    options: ["Dorsal root ganglia of spinal cord levels L1-L4", "Dorsal root ganglia of spinal cord levels S2, S3, and S4", "Dorsal root ganglia of spinal cord levels L4 and L5", "Dorsal root ganglia of spinal cord levels T5-T9", "Dorsal root ganglia of spinal cord levels T10-T12"],
    explanation: "The source marks S2-S4. However, human lower-urinary-tract afferents are described in both sacral S2-S4 and thoracolumbar T11-L2 dorsal-root ganglia, so this record remains excluded pending focused review.",
    warning: "Source page reviewed, but authoritative evidence identifies human lower-urinary-tract afferents in both S2-S4 and T11-L2 dorsal-root ganglia. The source's sole S2-S4 answer remains medically incomplete and excluded from answer learning."
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
  if (draft.stem !== item.expectedStem || JSON.stringify(draft.options) !== JSON.stringify(item.expectedOptions)) {
    throw new Error(`OCR drift for ${item.id}; refusing update.`);
  }
  if (!["ocr_draft", "needs_review"].includes(draft.status)) throw new Error(`Unexpected status for ${item.id}`);
}

const source = await readFile(bankPath, "utf8");
const parsed = parseDrafts(source);
const byId = new Map(parsed.drafts.map((item) => [item.id, item]));
const applied = [], restricted = [];

for (const item of restorations) {
  const draft = byId.get(item.id);
  assertSnapshot(draft, item);
  const before = { stem: draft.stem, options: draft.options, correctOption: draft.correctOption, status: draft.status, askable: draft.askable };
  Object.assign(draft, { stem: item.stem, options: item.options, correctOption: item.correctOption, explanation: item.explanation, learningNote: item.learningNote, highYieldNote: item.highYieldNote, mnemonic: item.mnemonic, memoryAid: item.memoryAid, status: "ocr_draft", askable: true, warnings: [reviewedWarning] });
  applied.push({ id: item.id, sourcePage: item.page, before, after: { stem: draft.stem, options: draft.options, correctOption: draft.correctOption, status: draft.status, askable: draft.askable }, evidence: { externalSource: item.sourceUrl, externalFinding: item.finding } });
}

for (const item of restrictions) {
  const draft = byId.get(item.id);
  assertSnapshot(draft, item);
  const before = { stem: draft.stem, options: draft.options, correctOption: draft.correctOption, status: draft.status, askable: draft.askable, warnings: draft.warnings ?? [], highYieldNote: draft.highYieldNote, mnemonic: draft.mnemonic, memoryAid: draft.memoryAid };
  Object.assign(draft, { stem: item.stem, options: item.options, correctOption: null, explanation: item.explanation, status: "needs_review", askable: false, highYieldNote: undefined, mnemonic: undefined, memoryAid: undefined, warnings: [...new Set([...(draft.warnings ?? []), item.warning])] });
  restricted.push({ id: item.id, sourcePage: item.page, before, after: { stem: draft.stem, options: draft.options, correctOption: draft.correctOption, status: draft.status, askable: draft.askable, warnings: draft.warnings } });
}

await writeFile(bankPath, `${source.slice(0, parsed.arrayStart)}${JSON.stringify(parsed.drafts)}${source.slice(parsed.end + 1)}`);
await mkdir(auditDir, { recursive: true });
await writeFile(path.join(auditDir, "applied-anatomy-batch-06.json"), `${JSON.stringify({ generatedAt: new Date().toISOString(), applied, restricted, automaticApproval: false, mockEligibility: "No restored OCR draft is mock eligible." }, null, 2)}\n`);
console.log(JSON.stringify({ restored: applied.map((row) => row.id), restricted: restricted.map((row) => row.id), automaticApproval: false }, null, 2));
