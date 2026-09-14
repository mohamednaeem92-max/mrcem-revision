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
    id: "anatomy-anatomy-all-pdf-p0556-q0156", page: 556,
    expectedStem: "The right kidney is related anteriorly to all of the following structures EXCEPT for the:", expectedOptions: ["Right adrenal gland 19%", "Liver 5%", "Second part of the duodenum 9%", "Hepatic flexure 6%"],
    stem: "The right kidney is related anteriorly to all of the following structures except which?", options: ["Right adrenal gland", "Liver", "Second part of the duodenum", "Hepatic flexure", "Pancreas"], correctOption: 4,
    explanation: "The anterior surface of the right kidney relates to the right adrenal gland, liver, second part of the duodenum, hepatic flexure, and small intestine. The pancreas is a left-sided renal relation, not an anterior relation of the right kidney.",
    learningNote: "Pancreas is not an anterior relation of the right kidney.", highYieldNote: "Right kidney anterior relations include adrenal gland, liver, D2, hepatic flexure, and small intestine, not pancreas.", mnemonic: "🫘 Right kidney: A-L-D-C-S, not pancreas.",
    memoryAid: aid("Right kidney anterior relations are adrenal gland, liver, D2, colic flexure, and small intestine; pancreas is excluded.", "Right kidney: A-L-D-C-S, not pancreas.", ["🫘", "🚫"], "Kidney and exclusion symbols cue the exception.", "NCBI Bookshelf: Kidney Anatomy", "https://www.ncbi.nlm.nih.gov/books/NBK482385/"),
    sourceUrl: "https://www.ncbi.nlm.nih.gov/books/NBK482385/", finding: "NCBI describes right renal relationships with liver, second duodenum and colonic structures, not pancreas."
  },
  {
    id: "anatomy-anatomy-all-pdf-p0558-q0158", page: 558,
    expectedStem: "ww The oesophagus passes through the diaphragm at which vertebral level:", expectedOptions: ["T8 6%", "19 2% () HO 86%", "™m 3%", "112 3%"],
    stem: "At which vertebral level does the oesophagus pass through the diaphragm?", options: ["T8", "T9", "T10", "T11", "T12"], correctOption: 2,
    explanation: "The oesophageal hiatus lies at T10. The adjacent major diaphragmatic opening levels are the caval opening at T8 and aortic hiatus at T12.",
    learningNote: "Oesophageal hiatus: T10.", highYieldNote: "The oesophageal hiatus is at T10.", mnemonic: "🔟 Oesophagus crosses at T10.",
    memoryAid: aid("Oesophagus crosses the diaphragm through the oesophageal hiatus at T10.", "Oesophagus crosses at T10.", ["🔟", "🫁"], "Ten and diaphragm cues fix the level.", "NCBI Bookshelf: Diaphragm Anatomy", "https://www.ncbi.nlm.nih.gov/books/NBK519558/"),
    sourceUrl: "https://www.ncbi.nlm.nih.gov/books/NBK519558/", finding: "NCBI places the oesophageal hiatus at T10."
  },
  {
    id: "anatomy-anatomy-all-pdf-p0561-q0159", page: 561,
    expectedStem: "ww A direct inguinal hernia is due to weakness in which of the following layers:", expectedOptions: ["External oblique aponeurosis 14%", "Transversalis fascia", "Internal oblique muscle 5%", "Lacunar ligament 1%"],
    stem: "A direct inguinal hernia is due to weakness in which layer?", options: ["External oblique aponeurosis", "Transversalis fascia", "Transversus abdominis muscle", "Internal oblique muscle", "Lacunar ligament"], correctOption: 1,
    explanation: "A direct inguinal hernia protrudes through a weakness of the posterior wall of the inguinal canal in Hesselbach triangle. The transversalis fascia forms the principal posterior wall.",
    learningNote: "Direct inguinal hernia: posterior wall, mainly transversalis fascia.", highYieldNote: "Direct hernia reflects posterior inguinal-wall weakness at Hesselbach triangle, chiefly involving transversalis fascia.", mnemonic: "⬅️ Direct = medial wall defect.",
    memoryAid: aid("Direct inguinal hernia passes through posterior-wall weakness in Hesselbach triangle, where transversalis fascia is key.", "Direct = medial wall defect.", ["⬅️", "🧱"], "Medial arrow and wall cue the direct defect.", "Medscape: Inguinal Region Anatomy", "https://emedicine.medscape.com/article/2075362-overview"),
    sourceUrl: "https://emedicine.medscape.com/article/2075362-overview", finding: "Posterior wall includes transversalis fascia; direct hernia arises from posterior-wall weakness in Hesselbach triangle."
  },
  {
    id: "anatomy-anatomy-all-pdf-p0563-q0160", page: 563,
    expectedStem: "ww The following structures are all found in the spermatic cord EXCEPT for the:", expectedOptions: ["Pampiniform plexus of veins 6%", "Cremasteric artery 5%", "Remnants of the processus vaginalis 6%", "Pudendal nerve", "Testicular artery 6%"],
    stem: "All of the following are found in the spermatic cord except which?", options: ["Pampiniform plexus of veins", "Cremasteric artery", "Remnants of processus vaginalis", "Pudendal nerve", "Testicular artery"], correctOption: 3,
    explanation: "The spermatic cord contains the ductus deferens, testicular and cremasteric arteries, pampiniform plexus, lymphatics, and the genital branch of the genitofemoral nerve. The pudendal nerve is not a cord component.",
    learningNote: "Pudendal nerve is not in the spermatic cord.", highYieldNote: "Spermatic cord contains genital genitofemoral branch, not pudendal nerve.", mnemonic: "🚫 Pudendal stays out of the cord.",
    memoryAid: aid("The pudendal nerve is not a spermatic-cord content; the genital branch of genitofemoral nerve is.", "Pudendal stays out of the cord.", ["🚫", "🧵"], "Exclusion and cord cues distinguish pudendal from genital genitofemoral supply.", "NCBI Bookshelf: Inguinal Canal", "https://www.ncbi.nlm.nih.gov/books/NBK470204/"),
    sourceUrl: "https://www.ncbi.nlm.nih.gov/books/NBK470204/", finding: "NCBI lists cord components and does not include pudendal nerve."
  },
  {
    id: "anatomy-anatomy-all-pdf-p0566-q0161", page: 566,
    expectedStem: "wy A565 year old woman presents to ED complaining of abdominal pain and profuse vomiting. Imaging shows part of the bowel is being compressed between the abdominal aorta and the superior mesenteric artery. Which part of the bowel is most likely being affected:", expectedOptions: ["First part of the duodenum 17% (/) Third part of the duodenum 48%", "lleum 4%", "Jejunum 7%"],
    stem: "A patient has abdominal pain and profuse vomiting from bowel compression between the abdominal aorta and superior mesenteric artery. Which bowel part is affected?", options: ["First part of the duodenum", "Second part of the duodenum", "Third part of the duodenum", "Ileum", "Jejunum"], correctOption: 2,
    explanation: "Superior mesenteric artery syndrome compresses the third part of the duodenum between the aorta posteriorly and the superior mesenteric artery anteriorly.",
    learningNote: "SMA syndrome compresses D3 between SMA and aorta.", highYieldNote: "Third duodenum lies between SMA anteriorly and aorta posteriorly, making it vulnerable to SMA syndrome.", mnemonic: "🥪 D3 is the aortomesenteric sandwich.",
    memoryAid: aid("SMA syndrome compresses D3 between SMA anteriorly and aorta posteriorly.", "D3 is the aortomesenteric sandwich.", ["🥪", "3️⃣"], "Sandwich and three cue the compressed duodenal part.", "NCBI Bookshelf: Superior Mesenteric Artery Syndrome", "https://www.ncbi.nlm.nih.gov/books/NBK482209/"),
    sourceUrl: "https://www.ncbi.nlm.nih.gov/books/NBK482209/", finding: "SMA syndrome compresses the third duodenal portion between SMA and aorta."
  },
  {
    id: "anatomy-anatomy-all-pdf-p0567-q0162", page: 567,
    expectedStem: "The inferior vena cava leaves the abdomen at which of the following vertebral levels:", expectedOptions: ["T6 16%", "T10 49%", "u 2%"],
    stem: "At which vertebral level does the inferior vena cava leave the abdomen?", options: ["T6", "T8", "T10", "T12", "L1"], correctOption: 1,
    explanation: "The inferior vena cava passes through the caval opening in the central tendon of the diaphragm at T8.",
    learningNote: "IVC passes through diaphragm at T8.", highYieldNote: "Caval hiatus at T8 transmits the inferior vena cava.", mnemonic: "8️⃣ IVC has its T8 gate.",
    memoryAid: aid("The IVC passes through the diaphragmatic caval opening at T8.", "IVC has its T8 gate.", ["8️⃣", "🩸"], "Eight and blood-vessel cues fix the caval hiatus.", "NCBI Bookshelf: Diaphragm Anatomy", "https://www.ncbi.nlm.nih.gov/books/NBK519558/"),
    sourceUrl: "https://www.ncbi.nlm.nih.gov/books/NBK519558/", finding: "NCBI places the caval opening and IVC passage at T8."
  },
  {
    id: "anatomy-anatomy-all-pdf-p0571-q0163", page: 571,
    expectedStem: "Abdomen A75 year old man presents to ED complaining of abdominal pain radiating to his back, anorexia and weight loss. Imaging shows a large tumour of the neck of the pancreas. Which of the following structures is most likely compressed by the tumour:", expectedOptions: ["Inferior mesenteric artery 7h", "Ureter", "Coeliac trunk 7h"],
    stem: "A large tumour of the pancreatic neck is most likely to compress which structure?", options: ["Inferior mesenteric artery", "Portal vein", "First part of the duodenum", "Ureter", "Coeliac trunk"], correctOption: 1,
    explanation: "The portal vein forms from the superior mesenteric and splenic veins posterior to the neck of the pancreas, so a pancreatic-neck mass can compress it.",
    learningNote: "Portal vein forms behind pancreatic neck.", highYieldNote: "Portal vein is formed posterior to the neck of pancreas by the SMV and splenic vein.", mnemonic: "🟣 Portal vein hides behind the neck.",
    memoryAid: aid("The portal vein forms behind the pancreatic neck from the SMV and splenic vein.", "Portal vein hides behind the neck.", ["🟣", "⬅️"], "Vein and behind-arrow cues the posterior relationship.", "Medscape: Pancreas Anatomy", "https://emedicine.medscape.com/article/1948885-overview"),
    sourceUrl: "https://emedicine.medscape.com/article/1948885-overview", finding: "Portal vein lies behind pancreatic neck and forms from SMV-splenic union there."
  },
  {
    id: "anatomy-anatomy-all-pdf-p0572-q0164", page: 572,
    expectedStem: "Abdomen The following structures are all found in the spermatic cord except for the:", expectedOptions: ["Ductus deferens Branch of the inferior vesical artery 16% Cremasteric vein 2% Branch of the genitofemoral nerve Th"],
    stem: "All of the following are found in the spermatic cord except which?", options: ["Ductus deferens", "Branch of the inferior vesical artery", "Cremasteric vein", "Branch of the genitofemoral nerve", "Inferior epigastric artery"], correctOption: 4,
    explanation: "Spermatic-cord structures include the ductus deferens, vascular supply, pampiniform vessels, lymphatics, and genital genitofemoral branch. The inferior epigastric artery is not a cord component.",
    learningNote: "Inferior epigastric artery is not in the spermatic cord.", highYieldNote: "Inferior epigastric artery is not a spermatic-cord content.", mnemonic: "🚫 Epigastric stays outside the cord.",
    memoryAid: aid("Inferior epigastric artery is not a component of the spermatic cord.", "Epigastric stays outside the cord.", ["🚫", "🧵"], "Exclusion and cord cues retain the non-content.", "Medscape: Inguinal Region Anatomy", "https://emedicine.medscape.com/article/2075362-overview"),
    sourceUrl: "https://emedicine.medscape.com/article/2075362-overview", finding: "Standard spermatic-cord list excludes the inferior epigastric artery."
  },
  {
    id: "anatomy-anatomy-all-pdf-p0573-q0165", page: 573,
    expectedStem: "Abdomen The quadratus |umborum muscle is innervated by which of the following:", expectedOptions: ["lliohypogastric nerve", "Anterior rami of L2 - L4", "Anterior rami of T9 - 712"],
    stem: "The quadratus lumborum muscle is innervated by which nerves?", options: ["Iliohypogastric nerve", "Ilioinguinal nerve", "Anterior rami of L2-L4", "Anterior rami of T9-T12", "Anterior rami of T12-L4"], correctOption: 4,
    explanation: "Quadratus lumborum receives innervation from anterior rami of T12-L4, including subcostal and lumbar contributions.",
    learningNote: "Quadratus lumborum: anterior rami T12-L4.", highYieldNote: "Quadratus lumborum is innervated by anterior rami from T12 through L4.", mnemonic: "1️⃣2️⃣ to L4 braces QL.",
    memoryAid: aid("Quadratus lumborum receives anterior rami from T12 through L4.", "T12 to L4 braces QL.", ["1️⃣2️⃣", "4️⃣"], "Start and finish numbers cue the nerve range.", "TeachMeAnatomy: Quadratus Lumborum", "https://teachmeanatomy.info/encyclopaedia/q/quadratus-lumborum/"),
    sourceUrl: "https://teachmeanatomy.info/encyclopaedia/q/quadratus-lumborum/", finding: "Quadratus lumborum innervation is anterior rami of T12-L4."
  }
];

const restrictions = [
  {
    id: "anatomy-anatomy-all-pdf-p0557-q0157", page: 557,
    expectedStem: "The ureters enter the bladder and end at the level of which of the following landmarks: CMe", expectedOptions: ["Pubic tubercle", "Anterior superior iliac spine 14%", "Inguinal ligament 4%", "lliac crest 8%"],
    stem: "The ureters enter the bladder and end at the level of which landmark?", options: ["Pubic symphysis", "Pubic tubercle", "Anterior superior iliac spine", "Inguinal ligament", "Iliac crest"],
    explanation: "The source page marks the pubic tubercle. External sources reviewed confirm oblique posterolateral ureteric entry at the trigone, but do not establish this exact surface-landmark wording; this record remains excluded.",
    warning: "Source page reviewed, but the exact pubic-tubercle landmark for ureteric bladder entry was not precisely corroborated by reviewed external evidence. This record remains excluded from answer learning.",
    sourceUrl: "https://www.ncbi.nlm.nih.gov/books/NBK532980/", finding: "NCBI confirms posterolateral trigonal ureteric entry but not the exact pubic-tubercle level."
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
  const before = { stem: draft.stem, options: draft.options, correctOption: draft.correctOption, status: draft.status, askable: draft.askable, warnings: draft.warnings ?? [] };
  Object.assign(draft, { stem: item.stem, options: item.options, correctOption: item.correctOption, explanation: item.explanation, learningNote: item.learningNote, highYieldNote: item.highYieldNote, mnemonic: item.mnemonic, memoryAid: item.memoryAid, status: "ocr_draft", askable: true, warnings: [reviewedWarning] });
  applied.push({ id: item.id, sourcePage: item.page, before, after: { stem: draft.stem, options: draft.options, correctOption: draft.correctOption, status: draft.status, askable: draft.askable, warnings: draft.warnings }, evidence: { externalSource: item.sourceUrl, externalFinding: item.finding } });
}
for (const item of restrictions) {
  const draft = byId.get(item.id); assertSnapshot(draft, item);
  const before = { stem: draft.stem, options: draft.options, correctOption: draft.correctOption, status: draft.status, askable: draft.askable, warnings: draft.warnings ?? [], highYieldNote: draft.highYieldNote, mnemonic: draft.mnemonic, memoryAid: draft.memoryAid };
  Object.assign(draft, { stem: item.stem, options: item.options, correctOption: null, explanation: item.explanation, learningNote: "", status: "needs_review", askable: false, highYieldNote: undefined, mnemonic: undefined, memoryAid: undefined, warnings: [item.warning] });
  restricted.push({ id: item.id, sourcePage: item.page, before, after: { stem: draft.stem, options: draft.options, correctOption: draft.correctOption, status: draft.status, askable: draft.askable, warnings: draft.warnings }, evidence: { externalSource: item.sourceUrl, externalFinding: item.finding } });
}
await writeFile(bankPath, `${source.slice(0, parsed.arrayStart)}${JSON.stringify(parsed.drafts)}${source.slice(parsed.end + 1)}`);
await mkdir(auditDir, { recursive: true });
await writeFile(path.join(auditDir, "applied-anatomy-batch-16.json"), `${JSON.stringify({ generatedAt: new Date().toISOString(), applied, restricted, automaticApproval: false, mockEligibility: "No restored OCR draft is mock eligible." }, null, 2)}\n`);
console.log(JSON.stringify({ restored: applied.map((row) => row.id), restricted: restricted.map((row) => row.id), automaticApproval: false }, null, 2));
