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
    id: "anatomy-anatomy-all-pdf-p0593-q0178", page: 593,
    expectedStem: "ww A 29 year old patient, with a known ovarian cyst presents to ED complaining of worsening pelvic pain and pain in the medial thigh region. Irritation of which of the following structures is responsible for the pain in the medial thigh region:", expectedOptions: ["Genitofemoral nerve 28%", "Obturator nerve", "Pudendal nerve 4%", "Sacral plexus 3%", "Ovarian plexus 3%"],
    stem: "A 29-year-old patient with a known ovarian cyst has worsening pelvic pain and medial thigh pain. Irritation of which structure is responsible for the medial thigh pain?", options: ["Genitofemoral nerve", "Obturator nerve", "Pudendal nerve", "Sacral plexus", "Ovarian plexus"], correctOption: 1,
    explanation: "The obturator nerve provides sensory innervation to the medial upper thigh. Pelvic irritation or compression involving this nerve can therefore present as medial thigh pain.",
    learningNote: "Obturator nerve irritation may cause medial upper-thigh pain.", highYieldNote: "The obturator nerve supplies sensation to the medial upper thigh, so its pelvic irritation can produce medial thigh pain.", mnemonic: "🦵 OBTURATOR points to the inner thigh.",
    memoryAid: aid("The obturator nerve supplies the medial upper thigh and can produce medial thigh pain when irritated in the pelvis.", "OBTURATOR points to the inner thigh.", ["🦵", "↔️"], "Thigh and inward-arrow cues retain the medial-thigh sensory territory.", "NCBI Bookshelf: Obturator Nerve", "https://www.ncbi.nlm.nih.gov/books/NBK551640/"),
    sourceUrl: "https://www.ncbi.nlm.nih.gov/books/NBK551640/", finding: "NCBI identifies obturator sensory innervation of the medial upper thigh and reports medial-thigh pain with pelvic obturator compression or entrapment."
  },
  {
    id: "anatomy-anatomy-all-pdf-p0596-q0179", page: 596,
    expectedStem: "ww Which of the following areas of the prostate gland is most commonly involved in carcinomatous transformation:", expectedOptions: ["Central zone 6%", "Peripheral zone", "Anterior fibromuscular stroma 1%", "Isthmus 52%"],
    stem: "Which region of the prostate is most commonly involved in carcinomatous transformation?", options: ["Transitional zone", "Central zone", "Peripheral zone", "Anterior fibromuscular stroma", "Isthmus"], correctOption: 2,
    explanation: "Most prostatic carcinomas develop in the peripheral zone. In contrast, benign prostatic hyperplasia tends to involve the transitional zone.",
    learningNote: "Prostate carcinoma most often arises in the peripheral zone.", highYieldNote: "Most prostatic carcinomas develop in the peripheral zone.", mnemonic: "📍 PZ is the prostate cancer zone.",
    memoryAid: aid("Most prostatic carcinomas arise in the peripheral zone.", "PZ is the prostate cancer zone.", ["📍", "🧬"], "Location pin and cell cues connect peripheral zone with carcinoma.", "NCBI Bookshelf: Prostate", "https://www.ncbi.nlm.nih.gov/books/NBK540987/"),
    sourceUrl: "https://www.ncbi.nlm.nih.gov/books/NBK540987/", finding: "NCBI states that most prostatic carcinomas, reported as 75%, develop in the peripheral zone."
  },
  {
    id: "anatomy-anatomy-all-pdf-p0600-q0180", page: 600,
    expectedStem: "ww Which of the following is NOT an anatomical feature that prevents against gastric reflux:", expectedOptions: ["The diaphragmatic pinchcock effect on the oesophagus 4%", "Intra-abdominal pressure which maintains the oesophagus in a state of collapse when empty 15%", "The angle of His formed at the junction of the oesophagus and gastric fundus 6%", "Gastric mucosal rosette-like folds at the gastro-oesophageal junction 10%", "The striated lower oesophageal sphincter muscle"],
    stem: "Which is not an anatomical feature that prevents gastro-oesophageal reflux?", options: ["Diaphragmatic pinchcock effect on the oesophagus", "Intra-abdominal pressure maintaining the empty oesophagus in collapse", "Angle of His at the junction of oesophagus and gastric fundus", "Gastric mucosal rosette-like folds at the gastro-oesophageal junction", "Striated lower oesophageal sphincter muscle"], correctOption: 4,
    explanation: "The lower oesophageal sphincter is an intrinsic high-pressure zone of smooth muscle, not a distinct striated sphincter. Its smooth-muscle tone contributes to the anti-reflux barrier.",
    learningNote: "Lower oesophageal sphincter: smooth muscle, not striated muscle.", highYieldNote: "The intrinsic lower oesophageal sphincter consists of smooth muscle, so a striated lower sphincter is not an anti-reflux feature.", mnemonic: "🧵 LES stays smooth, not striped.",
    memoryAid: aid("The intrinsic lower oesophageal sphincter consists of smooth muscle rather than striated muscle.", "LES stays smooth, not striped.", ["🧵", "🚫"], "Smooth-thread and exclusion cues distinguish smooth from striated muscle.", "NCBI Bookshelf: Lower Esophageal Sphincter", "https://www.ncbi.nlm.nih.gov/books/NBK557452/"),
    sourceUrl: "https://www.ncbi.nlm.nih.gov/books/NBK557452/", finding: "NCBI states that the intrinsic lower oesophageal sphincter consists of smooth muscle."
  },
  {
    id: "anatomy-anatomy-all-pdf-p0601-q0001", page: 601,
    expectedStem: "A70 year old undergoes radical prostatectomy for prostate cancer. Postoperatively he complains of urinary incontinence due to paralysis of the external urethral sphincter. Which of the following nerves was most likely injured during surgery:", expectedOptions: ["Genitofemoral nerve 14%", "Pudendal nerve", "Coccygeal nerve 2% ee", "lliohypogastric nerve 4%"],
    stem: "A 70-year-old man develops urinary incontinence from paralysis of the external urethral sphincter after radical prostatectomy. Which nerve was most likely injured?", options: ["Genitofemoral nerve", "Pudendal nerve", "Coccygeal nerve", "Ilioinguinal nerve", "Iliohypogastric nerve"], correctOption: 1,
    explanation: "The external urethral sphincter is voluntary striated muscle innervated by the pudendal nerve, which arises from S2–S4.",
    learningNote: "Pudendal nerve, S2–S4, innervates the external urethral sphincter.", highYieldNote: "The pudendal nerve from S2–S4 innervates the voluntary external urethral sphincter.", mnemonic: "🚽 PUDendal helps you hold urine.",
    memoryAid: aid("The pudendal nerve from S2–S4 innervates the voluntary external urethral sphincter.", "PUDendal helps you hold urine.", ["🚽", "2️⃣"], "Toilet and S2–S4 cue reinforce pudendal sphincter control.", "NCBI Bookshelf: Sphincter Urethrae", "https://www.ncbi.nlm.nih.gov/books/NBK482438/"),
    sourceUrl: "https://www.ncbi.nlm.nih.gov/books/NBK482438/", finding: "NCBI states that the pudendal nerve from S2–S4 innervates the external urethral sphincter."
  },
  {
    id: "anatomy-anatomy-all-pdf-p0603-q0003", page: 603,
    expectedStem: "The iliohypogastric nerve is formed from the anterior rami of:", expectedOptions: ["et 4885 Ec a", "L4 1%"],
    stem: "The iliohypogastric nerve is usually formed from the anterior ramus of which spinal nerve?", options: ["L1", "L1–L2", "L2", "L2–L3", "L4"], correctOption: 0,
    explanation: "The iliohypogastric nerve usually derives from L1. Anatomical variation, including an occasional T12 contribution, is documented, but L1 is the standard and best source option.",
    learningNote: "Iliohypogastric nerve usually arises from L1; a T12 contribution can occur.", highYieldNote: "The iliohypogastric nerve usually derives from L1, with occasional T12 contribution reported.", mnemonic: "1️⃣ I-H begins at L1.",
    memoryAid: aid("The iliohypogastric nerve usually arises from L1, though occasional T12 contribution occurs.", "I-H begins at L1.", ["1️⃣", "⚠️"], "One and variation-alert cues retain the usual origin while avoiding an absolute claim.", "Manolakos et al.: Iliohypogastric Nerve Variations", "https://pmc.ncbi.nlm.nih.gov/articles/PMC9186473/"),
    sourceUrl: "https://pmc.ncbi.nlm.nih.gov/articles/PMC9186473/", finding: "A systematic review identifies L1 as the usual origin, reported in 62.5% to 96.5% of specimens, with occasional T12 contribution."
  },
  {
    id: "anatomy-anatomy-all-pdf-p0604-q0004", page: 604,
    expectedStem: "Which of the following best describes the regions of the abdomen that the liver normally occupies:", expectedOptions: ["Left hypochondrium and epigastric region 1%", "Right hypochondrium and right flank 6%", "Right hypochondrium and umbilical region", "Right hypochondrium, epigastric region and left hypochondrium"],
    stem: "Which abdominal regions does the liver normally occupy?", options: ["Left hypochondrium and epigastric region", "Right hypochondrium and right flank", "Right hypochondrium and umbilical region", "Right hypochondrium, epigastric region, and left hypochondrium", "Right hypochondrium, epigastric region, and umbilicus"], correctOption: 3,
    explanation: "The liver lies in the upper abdomen, occupying the right hypochondrium and epigastrium and extending into the left hypochondrium.",
    learningNote: "Liver spans right hypochondrium, epigastrium, and left hypochondrium.", highYieldNote: "The liver normally occupies the right hypochondrium, epigastrium, and left hypochondrium.", mnemonic: "➡️ EPI sits between right and left liver regions.",
    memoryAid: aid("The liver spans the right hypochondrium, epigastrium, and left hypochondrium.", "EPI sits between right and left liver regions.", ["➡️", "⬅️"], "Opposing arrows cue the liver's upper-abdominal span across the epigastrium.", "Chaudhari et al.: Morphological Study of Human Liver", "https://pmc.ncbi.nlm.nih.gov/articles/PMC5535334/"),
    sourceUrl: "https://pmc.ncbi.nlm.nih.gov/articles/PMC5535334/", finding: "A peer-reviewed anatomical study directly reports liver location in right hypochondrium, epigastrium, and left hypochondrium."
  },
  {
    id: "anatomy-anatomy-all-pdf-p0610-q0007", page: 610,
    expectedStem: "w Which of the following lies immediately medial to the second part of the duodenum:", expectedOptions: ["Transverse colon 2%", "Spleen 1%", "Right kidney 3%", "Head of the pancreas", "Stomach 3%"],
    stem: "Which structure lies immediately medial to the second part of the duodenum?", options: ["Transverse colon", "Spleen", "Right kidney", "Head of the pancreas", "Stomach"], correctOption: 3,
    explanation: "The pancreatic head occupies the C-shaped concavity of the duodenum. The descending second part lies lateral to the pancreatic head.",
    learningNote: "D2 lies lateral to the pancreatic head.", highYieldNote: "The head of the pancreas lies immediately medial to the descending second part of the duodenum.", mnemonic: "🌀 D2 curves around the pancreatic head.",
    memoryAid: aid("The pancreatic head occupies the duodenal C-shaped concavity, medial to the descending second part.", "D2 curves around the pancreatic head.", ["🌀", "🫚"], "Curve and gland cues retain the duodenum–pancreatic-head relation.", "NCBI Bookshelf: Duodenum", "https://www.ncbi.nlm.nih.gov/books/NBK482390/"),
    sourceUrl: "https://www.ncbi.nlm.nih.gov/books/NBK482390/", finding: "NCBI describes the pancreatic head in the C-shaped concavity of the descending duodenum."
  },
  {
    id: "anatomy-anatomy-all-pdf-p0611-q0008", page: 611,
    expectedStem: "A 64 year old man with known liver cirrhosis secondary to chronic alcohol abuse presents to ED vomiting profuse bright red blood. Endoscopy demonstrates ruptured oesophageal varices. Which of the following veins forms a portosystemic anastomosis with caval veins to form the varices:", expectedOptions: ["Right gastric vein 10%", "Splenic vein 6%", "Left gastric vein", "Left gastro-omental vein 2%"],
    stem: "A man with cirrhosis has ruptured oesophageal varices. Which vein forms a portosystemic anastomosis with caval-system veins to form these varices?", options: ["Right gastric vein", "Splenic vein", "Left gastric vein", "Left hepatic vein", "Left gastro-omental vein"], correctOption: 2,
    explanation: "The left gastric vein, a portal tributary, anastomoses with oesophageal veins that drain to the azygos system. Portal hypertension can dilate this gastro-oesophageal collateral pathway into varices.",
    learningNote: "Left gastric vein connects portal flow to oesophageal–azygos systemic drainage.", highYieldNote: "The left gastric vein anastomoses with oesophageal veins that drain to the azygos system, forming a portosystemic site for varices.", mnemonic: "⬅️🍽️ Left gastric climbs to oesophageal varices.",
    memoryAid: aid("The left gastric vein anastomoses with oesophageal veins draining to the azygos system.", "Left gastric climbs to oesophageal varices.", ["⬅️", "🍽️"], "Left-arrow and stomach cues retain the left-gastric portal collateral.", "Sharma and Rameshbabu: Portal Collaterals", "https://europepmc.org/articles/PMC3940321"),
    sourceUrl: "https://europepmc.org/articles/PMC3940321", finding: "A peer-reviewed review states that the left gastric vein anastomoses with oesophageal veins, which drain into the azygos vein."
  }
];

const restrictions = [
  {
    id: "anatomy-anatomy-all-pdf-p0605-q0005", page: 605,
    expectedStem: "ww A patient with known inflammatory bowel disease presents to ED complaining of severe abdominal pain and diarrhoea. Imaging shows a flare up primarily affecting the rectum. Which of the following nerves is most likely responsible for transmission of pain from the rectum:", expectedOptions: ["Pelvic splanchnic nerves", "Lumbar splanchnic nerves", "Sacral splanchnic nerves 9%", "Vagus nerves 1%"],
    stem: "A patient with inflammatory bowel disease has severe abdominal pain and a rectal flare. Which nerves are most likely responsible for transmitting pain from the rectum?", options: ["Pelvic splanchnic nerves", "Lumbar splanchnic nerves", "Sacral splanchnic nerves", "Vagus nerves", "Pudendal nerves"],
    explanation: "The source page marks pelvic splanchnic nerves. However, colorectal sensory innervation includes both splanchnic and pelvic spinal afferent pathways, whose contributions vary by location and stimulus. The generic stem does not establish one uniquely correct option.",
    warning: "Source page reviewed, but generic rectal pain has multiple reviewed spinal-afferent pathways and the exact source key is not uniquely corroborated. This record remains excluded from answer learning.",
    sourceUrl: "https://doi.org/10.3389/fncel.2018.00467", finding: "A peer-reviewed review identifies both lumbar splanchnic and sacral pelvic afferent pathways to the colon and rectum, with differing contributions by location and stimulus."
  },
  {
    id: "anatomy-anatomy-all-pdf-p0606-q0006", page: 606,
    expectedStem: "ww A19 year old male is brought to ED having sustained a handlebar injury with blunt trauma to his upper abdomen whilst riding his scooter. Which of the following is the most commonly injured organ:", expectedOptions: ["Pancreas 8%", "Transverse colon 5%", "Spleen", "Duodenum", "Kidney 1%"],
    stem: "A 19-year-old man has a handlebar injury with blunt upper-abdominal trauma. Which organ is most commonly injured?", options: ["Pancreas", "Transverse colon", "Spleen", "Duodenum", "Kidney"],
    explanation: "The source page marks spleen. Although spleen and liver are common blunt-trauma solid-organ injuries generally, direct handlebar impact has a mechanism-specific pattern that can involve pancreas, bowel, mesentery, liver, and spleen. The stem does not establish a uniquely most common organ.",
    warning: "Source page reviewed, but the mechanism-specific handlebar-injury evidence does not establish the exact source key as a unique most-common organ. This record remains excluded from answer learning.",
    sourceUrl: "https://pmc.ncbi.nlm.nih.gov/articles/PMC10460239/", finding: "A peer-reviewed handlebar-trauma source identifies pancreas, small bowel, mesentery, liver, and spleen as likely targets of direct handlebar impact without proving spleen uniquely most common."
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
  if (!["ocr_draft", "needs_review", "needs_image"].includes(draft.status)) throw new Error(`Unexpected status for ${item.id}`);
}

const source = await readFile(bankPath, "utf8");
const parsed = parseDrafts(source);
const byId = new Map(parsed.drafts.map((item) => [item.id, item]));
const applied = [], restricted = [];
for (const item of restorations) {
  const draft = byId.get(item.id); assertSnapshot(draft, item);
  const before = { stem: draft.stem, options: draft.options, correctOption: draft.correctOption, status: draft.status, askable: draft.askable, warnings: draft.warnings ?? [] };
  Object.assign(draft, { stem: item.stem, options: item.options, correctOption: item.correctOption, explanation: item.explanation, learningNote: item.learningNote, highYieldNote: item.highYieldNote, mnemonic: item.mnemonic, memoryAid: item.memoryAid, status: "ocr_draft", askable: true, needsImage: false, warnings: [reviewedWarning] });
  applied.push({ id: item.id, sourcePage: item.page, before, after: { stem: draft.stem, options: draft.options, correctOption: draft.correctOption, status: draft.status, askable: draft.askable, warnings: draft.warnings }, evidence: { externalSource: item.sourceUrl, externalFinding: item.finding } });
}
for (const item of restrictions) {
  const draft = byId.get(item.id); assertSnapshot(draft, item);
  const before = { stem: draft.stem, options: draft.options, correctOption: draft.correctOption, status: draft.status, askable: draft.askable, warnings: draft.warnings ?? [], highYieldNote: draft.highYieldNote, mnemonic: draft.mnemonic, memoryAid: draft.memoryAid };
  Object.assign(draft, { stem: item.stem, options: item.options, correctOption: null, explanation: item.explanation, learningNote: "", status: "needs_review", askable: false, needsImage: false, highYieldNote: undefined, mnemonic: undefined, memoryAid: undefined, warnings: [item.warning] });
  restricted.push({ id: item.id, sourcePage: item.page, before, after: { stem: draft.stem, options: draft.options, correctOption: draft.correctOption, status: draft.status, askable: draft.askable, warnings: draft.warnings }, evidence: { externalSource: item.sourceUrl, externalFinding: item.finding } });
}
await writeFile(bankPath, `${source.slice(0, parsed.arrayStart)}${JSON.stringify(parsed.drafts)}${source.slice(parsed.end + 1)}`);
await mkdir(auditDir, { recursive: true });
await writeFile(path.join(auditDir, "applied-anatomy-batch-18.json"), `${JSON.stringify({ generatedAt: new Date().toISOString(), applied, restricted, automaticApproval: false, mockEligibility: "No restored OCR draft is mock eligible." }, null, 2)}\n`);
console.log(JSON.stringify({ restored: applied.map((row) => row.id), restricted: restricted.map((row) => row.id), automaticApproval: false }, null, 2));
