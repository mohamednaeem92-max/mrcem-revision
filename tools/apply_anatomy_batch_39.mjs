import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const bankPath = path.join(root, "client", "src", "lib", "ocrDraftSections.ts");
const snapshotPath = path.join(root, "docs", "audit", "anatomy-all-pdf-batch-39-ocr-records.json");
const auditDir = path.join(root, "docs", "audit");
const reviewedWarning = "Source page and external anatomy reference reviewed; remains an unapproved OCR draft.";
const memoryAid = (coreFact, mnemonic, emojiCues, sourceLabel, sourceUrl) => ({ coreFact, mnemonic, emojiCues, cueLabel: "Source-confirmed anatomy fact", sourceLabel, sourceUrl });

const restorations = [
  {
    id: "anatomy-anatomy-all-pdf-p1229-q0148", page: 1229,
    expectedStem: "The renal arteries arise from the abdominal aorta at which of the following vertebral levels:",
    expectedOptions: ["TH/T12", "T12/l1 oon", "L3/L4"],
    stem: "The renal arteries arise from the abdominal aorta at which of the following vertebral levels:",
    options: ["T11/T12", "T12/L1", "L1/L2", "L2/L3", "L3/L4"], correctOption: 2,
    fact: "The renal arteries typically arise from the lateral abdominal aorta at the L1/L2 intervertebral disc, just inferior to the superior mesenteric artery.", mnemonic: "Renal arteries: L1/L2 launch.",
    aid: memoryAid("Renal arteries usually arise at the L1/L2 intervertebral disc.", "Renal arteries: L1/L2 launch.", ["1️⃣", "2️⃣"], "NCBI Bookshelf: Renal Artery", "https://www.ncbi.nlm.nih.gov/books/NBK459158/"),
    sourceUrl: "https://www.ncbi.nlm.nih.gov/books/NBK459158/", finding: "NCBI states that renal arteries typically arise from the abdominal aorta at the L1/L2 intervertebral disk."
  },
  {
    id: "anatomy-anatomy-all-pdf-p1233-q0150", page: 1233,
    expectedStem: "ww The fourth part of the duodenum terminates at which of the following vertebral levels:",
    expectedOptions: ["12 3%", "u 9%", "BS: 13%", "L4 4%"],
    stem: "The fourth part of the duodenum terminates at which of the following vertebral levels:",
    options: ["T12", "L1", "L2", "L3", "L4"], correctOption: 2,
    fact: "The ascending fourth part of the duodenum passes upward to L2, where it ends at the duodenojejunal flexure.", mnemonic: "D4 rises to L2, then joins jejunum.",
    aid: memoryAid("The fourth part of the duodenum ascends to L2 and ends at the duodenojejunal flexure.", "D4 rises to L2, then joins jejunum.", ["4️⃣", "⬆️"], "PMC: Duodenal anatomy review", "https://pmc.ncbi.nlm.nih.gov/articles/PMC7315055/"),
    sourceUrl: "https://pmc.ncbi.nlm.nih.gov/articles/PMC7315055/", finding: "A peer-reviewed review states that the fourth duodenal part passes upward to L2 and ends at the duodenojejunal flexure."
  },
  {
    id: "anatomy-anatomy-all-pdf-p1234-q0151", page: 1234,
    expectedStem: "ww The linea alba is formed from which of the following:",
    expectedOptions: ["The aponeuroses of the three flat anterior abdominal muscles", "The free edge of the external oblique aponeurosis 4%", "The tendinous intersection of the rectus abdominis muscle 57%", "The thoracolumbar fascia 0%", "The tendon of the pyramidalis muscle 0%"],
    stem: "The linea alba is formed from which of the following:",
    options: ["The aponeuroses of the three flat anterior abdominal muscles", "The free edge of the external oblique aponeurosis", "The tendinous intersection of the rectus abdominis muscle", "The thoracolumbar fascia", "The tendon of the pyramidalis muscle"], correctOption: 0,
    fact: "The combined aponeuroses of external oblique, internal oblique, and transversus abdominis fuse in the midline to form the linea alba.", mnemonic: "Three flat layers meet as the linea alba.",
    aid: memoryAid("External oblique, internal oblique, and transversus abdominis aponeuroses fuse at the midline to form the linea alba.", "Three flat layers meet as the linea alba.", ["3️⃣", "🤝"], "NCBI Bookshelf: Abdominal Wall", "https://www.ncbi.nlm.nih.gov/books/NBK551649/"),
    sourceUrl: "https://www.ncbi.nlm.nih.gov/books/NBK551649/", finding: "NCBI states that the combined aponeuroses of the three flat muscles fuse in the midline to form the linea alba."
  },
  {
    id: "anatomy-anatomy-all-pdf-p1235-q0152", page: 1235,
    expectedStem: "ww The kidneys extend between which of the following vertebral levels:",
    expectedOptions: ["19-112 os", "12-1", "RIES 9%", "m2-13", "2 = L5 3%"],
    stem: "The kidneys extend between which of the following vertebral levels:",
    options: ["T9 - T12", "T12 - L1", "L1 - L3", "T12 - L3", "L2 - L5"], correctOption: 3,
    fact: "The paired kidneys are retroperitoneal and normally occupy the vertebral range from T12 to L3; the right kidney is usually slightly lower.", mnemonic: "Kidneys span T12 to L3.",
    aid: memoryAid("Kidneys are normally positioned between T12 and L3, with the right kidney slightly lower than the left.", "Kidneys span T12 to L3.", ["🫘", "📏"], "NCBI Bookshelf: Kidneys", "https://www.ncbi.nlm.nih.gov/books/NBK482385/"),
    sourceUrl: "https://www.ncbi.nlm.nih.gov/books/NBK482385/", finding: "NCBI states that kidneys are located between T12 and L3 vertebrae."
  },
  {
    id: "anatomy-anatomy-all-pdf-p1236-q0153", page: 1236,
    expectedStem: "ww Regarding the external oblique muscle, which of the following statements is INCORRECT:",
    expectedOptions: ["It is the largest and most superficial of the anterior abdominal muscles. 3%", "Its aponeurosis forms the linea alba at the midline. 7%", "It originates from the xiphoid process. (x) It inserts into the lateral lip of the iliac crest. 9%", "The lower free border of the external oblique aponeurosis forms the inguinal ligament. 56%"],
    stem: "Regarding the external oblique muscle, which of the following statements is INCORRECT:",
    options: ["It is the largest and most superficial of the anterior abdominal muscles.", "Its aponeurosis forms the linea alba at the midline.", "It originates from the xiphoid process.", "It inserts into the lateral lip of the iliac crest.", "The lower free border of the external oblique aponeurosis forms the inguinal ligament."], correctOption: 2,
    fact: "External-oblique fibres arise from ribs 5–12, run inferomedially, and form an aponeurosis whose inferior border forms the inguinal ligament; therefore xiphoid origin is incorrect.", mnemonic: "External oblique starts at ribs 5–12, not xiphoid.",
    aid: memoryAid("External-oblique fibres arise from ribs 5–12, so a xiphoid-process origin is incorrect.", "External oblique starts at ribs 5–12, not xiphoid.", ["🦴", "❌"], "NCBI Bookshelf: Abdominal Wall", "https://www.ncbi.nlm.nih.gov/books/NBK551649/"),
    sourceUrl: "https://www.ncbi.nlm.nih.gov/books/NBK551649/", finding: "NCBI states that external-oblique fibres arise from the fifth through twelfth ribs."
  },
  {
    id: "anatomy-anatomy-all-pdf-p1237-q0154", page: 1237,
    expectedStem: "The greater sac of the peritoneal cavity is divided into two compartments by which of the following structures:",
    expectedOptions: ["Liver", "Stomach", "Duodenum"],
    stem: "The greater sac of the peritoneal cavity is divided into two compartments by which of the following structures:",
    options: ["Liver", "Stomach", "Transverse mesocolon", "Duodenum", "Mesentery"], correctOption: 2,
    fact: "The transverse mesocolon divides the peritoneal cavity into supramesocolic and inframesocolic compartments.", mnemonic: "Transverse mesocolon makes the above-and-below divide.",
    aid: memoryAid("The transverse mesocolon divides the peritoneal cavity into supramesocolic and inframesocolic compartments.", "Transverse mesocolon makes the above-and-below divide.", ["↔️", "✂️"], "PMC: Peritoneal cavity anatomy", "https://pmc.ncbi.nlm.nih.gov/articles/PMC4584112/"),
    sourceUrl: "https://pmc.ncbi.nlm.nih.gov/articles/PMC4584112/", finding: "A peer-reviewed review states that the transverse mesocolon divides the peritoneal cavity into supramesocolic and inframesocolic compartments."
  },
  {
    id: "anatomy-anatomy-all-pdf-p1238-q0155", page: 1238,
    expectedStem: "ww The jejunum predominantly occupies which region of the abdomen:",
    expectedOptions: ["Left upper quadrant", "Right upper quadrant 56%", "Right lower quadrant 6%", "Suprapubic region 4%"],
    stem: "The jejunum predominantly occupies which region of the abdomen:",
    options: ["Left upper quadrant", "Right upper quadrant", "Left lower quadrant", "Right lower quadrant", "Suprapubic region"], correctOption: 0,
    fact: "The jejunum is located mainly in the left upper quadrant, whereas the ileum is mainly in the right lower quadrant.", mnemonic: "Jejunum keeps left and high.",
    aid: memoryAid("The jejunum is located mainly in the left upper quadrant.", "Jejunum keeps left and high.", ["⬅️", "⬆️"], "NCBI Bookshelf: Physiology, Small Bowel", "https://www.ncbi.nlm.nih.gov/books/NBK532263/"),
    sourceUrl: "https://www.ncbi.nlm.nih.gov/books/NBK532263/", finding: "NCBI states that the jejunum is located mainly in the left upper quadrant."
  },
  {
    id: "anatomy-anatomy-all-pdf-p1239-q0156", page: 1239,
    expectedStem: "The right kidney is related anteriorly to all of the following structures EXCEPT for the:",
    expectedOptions: ["Right adrenal gland 19%", "Liver 5%", "Second part of the duodenum 9%", "Hepatic flexure 6%"],
    stem: "The right kidney is related anteriorly to all of the following structures EXCEPT for the:",
    options: ["Right adrenal gland", "Liver", "Second part of the duodenum", "Hepatic flexure", "Pancreas"], correctOption: 4,
    fact: "The right kidney relates to the right adrenal gland, liver, second part of the duodenum, hepatic flexure, and small intestine; pancreatic tail relates to the left kidney, so pancreas is the exception.", mnemonic: "Pancreas points left kidney, not right.",
    aid: memoryAid("The pancreas is not an anterior relation of the right kidney; the pancreatic tail may relate to the left kidney.", "Pancreas points left kidney, not right.", ["⬅️", "🫘"], "NCBI Bookshelf: Kidneys", "https://www.ncbi.nlm.nih.gov/books/NBK482385/"),
    sourceUrl: "https://www.ncbi.nlm.nih.gov/books/NBK482385/", finding: "NCBI describes pancreatic tail relation to the left kidney and lists liver, duodenum, colon, and small intestine as right-kidney relations."
  }
];

const restrictions = [
  {
    id: "anatomy-anatomy-all-pdf-p1230-q0149", page: 1230,
    expectedStem: "ww Pain from the ureters is usually referred to dermatomes supplied by:",
    expectedOptions: ["T10 - 112", "™m-12", "LIES: 57%", "L2-L4 4%", "T5-19 bs"],
    stem: "Pain from the ureters is usually referred to dermatomes supplied by:",
    options: ["T10 - T12", "T11 - L2", "L1 - L3", "L2 - L4", "T5 - T9"],
    warning: "Source page reviewed, but an authoritative source gives ureteric referred pain as T12-L2 rather than the source's exact T11-L2 range; no answer is inferred.", sourceUrl: "https://www.ncbi.nlm.nih.gov/books/NBK532980/",
    finding: "NCBI states that ureteral pain typically refers to T12-L2 dermatomes."
  },
  {
    id: "anatomy-anatomy-all-pdf-p1240-q0157", page: 1240,
    expectedStem: "The ureters enter the bladder and end at the level of which of the following landmarks: CMe",
    expectedOptions: ["Pubic tubercle", "Anterior superior iliac spine 14%", "Inguinal ligament 4%", "lliac crest 8%"],
    stem: "The ureters enter the bladder and end at the level of which of the following landmarks:",
    options: ["Pubic symphysis", "Pubic tubercle", "Anterior superior iliac spine", "Inguinal ligament", "Iliac crest"],
    warning: "Source page reviewed, but authoritative anatomy confirms posterolateral entry through the trigone and does not corroborate the source's exact pubic-tubercle surface landmark; no answer is inferred.", sourceUrl: "https://www.ncbi.nlm.nih.gov/books/NBK532980/",
    finding: "NCBI states that ureters enter the bladder posterolaterally via the trigone and lack reliable anatomical landmarks beyond physiologic constrictions."
  }
];

const parse = (source) => {
  const prefix = "export const ocrDraftQuestions: OcrDraftQuestion[] = ";
  const start = source.indexOf(prefix) + prefix.length;
  const end = source.indexOf("];", start);
  if (start < prefix.length || end < 0) throw new Error("OCR draft export not found");
  return { start, end, drafts: JSON.parse(source.slice(start, end + 1)) };
};
const snapshot = (draft) => ({ stem: draft.stem, options: draft.options, correctOption: draft.correctOption, status: draft.status, askable: draft.askable, needsImage: draft.needsImage, warnings: draft.warnings ?? [], explanation: draft.explanation ?? "", learningNote: draft.learningNote ?? "", highYieldNote: draft.highYieldNote ?? "", mnemonic: draft.mnemonic ?? "", memoryAid: draft.memoryAid ?? null });
const same = (left, right) => JSON.stringify(left) === JSON.stringify(right);
const guard = (live, original, item) => {
  if (!live || !original || live.id !== item.id || original.id !== item.id || live.sourcePage !== item.page || original.sourcePage !== item.page || live.stem !== item.expectedStem || original.stem !== item.expectedStem || !same(live.options, item.expectedOptions) || !same(original.options, item.expectedOptions)) throw new Error(`Immutable literal drift check failed: ${item.id}`);
};

const source = await readFile(bankPath, "utf8");
const parsed = parse(source);
const originals = new Map(JSON.parse(await readFile(snapshotPath, "utf8")).records.map((record) => [record.id, record]));
const live = new Map(parsed.drafts.map((draft) => [draft.id, draft]));
const applied = [];
const restricted = [];

for (const item of restorations) {
  const draft = live.get(item.id); guard(draft, originals.get(item.id), item); const before = snapshot(draft);
  Object.assign(draft, { stem: item.stem, options: item.options, correctOption: item.correctOption, explanation: item.fact, learningNote: item.fact, highYieldNote: item.fact, mnemonic: item.mnemonic, memoryAid: item.aid, status: "ocr_draft", askable: true, needsImage: false, warnings: [reviewedWarning] });
  delete draft.approved;
  applied.push({ id: item.id, sourcePage: item.page, before, after: snapshot(draft), evidence: { externalSource: item.sourceUrl, externalFinding: item.finding } });
}
for (const item of restrictions) {
  const draft = live.get(item.id); guard(draft, originals.get(item.id), item); const before = snapshot(draft);
  Object.assign(draft, { stem: item.stem, options: item.options, correctOption: null, explanation: item.finding, learningNote: "", highYieldNote: "", mnemonic: "", status: "needs_review", askable: false, needsImage: false, warnings: [item.warning] });
  delete draft.memoryAid; delete draft.approved;
  restricted.push({ id: item.id, sourcePage: item.page, before, after: snapshot(draft), evidence: { externalSource: item.sourceUrl, externalFinding: item.finding } });
}

await writeFile(bankPath, `${source.slice(0, parsed.start)}${JSON.stringify(parsed.drafts)}${source.slice(parsed.end + 1)}`);
await mkdir(auditDir, { recursive: true });
await writeFile(path.join(auditDir, "applied-anatomy-batch-39.json"), `${JSON.stringify({ generatedAt: new Date().toISOString(), applied, restricted, automaticApproval: false, mockEligibility: "No restored OCR draft is mock eligible." }, null, 2)}\n`);
console.log(JSON.stringify({ restored: applied.length, restricted: restricted.length, automaticApproval: false }, null, 2));
