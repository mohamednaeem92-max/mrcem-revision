/** Guarded Anatomy Batch 05 restoration; no record is approved by this script. */
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const bankPath = path.join(root, "client", "src", "lib", "ocrDraftSections.ts");
const auditDir = path.join(root, "docs", "audit");
const reviewedWarning = "Source page and external anatomy reference reviewed; remains an unapproved OCR draft.";

const restorations = [
  {
    id: "anatomy-anatomy-all-pdf-p0175-q0044", page: 175,
    expectedStem: "A 65 year old man presents to ED complaining of abdominal pain and weight loss. Imaging shows a tumour anterior to the inferior vena cava. Which of the following structures is most likely to be compressed by this tumour:",
    expectedOptions: ["Cisterna chyli 6%", "Third part of the duodenum", "Right kidney 54% (x) Ascending colon 2%", "Right sympathetic trunk 4%"],
    stem: "A 65-year-old man presents to the ED with abdominal pain and weight loss. Imaging shows a tumour anterior to the inferior vena cava. Which listed structure is most likely to be compressed?",
    options: ["Cisterna chyli", "Third part of the duodenum", "Right kidney", "Ascending colon", "Right sympathetic trunk"],
    correctOption: 1,
    explanation: "The third part of the duodenum crosses anterior to the inferior vena cava and aorta. It is the source-marked structure lying anterior to the inferior vena cava.",
    learningNote: "The horizontal third duodenal part passes anterior to the inferior vena cava and aorta.",
    highYieldNote: "Third part of duodenum: anterior to both the aorta and inferior vena cava.",
    mnemonic: "➡️ 3rd duodenum crosses in front of the aorta and IVC.",
    memoryAid: { coreFact: "The third part of the duodenum passes anterior to the aorta and inferior vena cava.", mnemonic: "Third duodenum crosses in front of the aorta and IVC.", emojiCues: ["3️⃣", "➡️", "🫀"], cueLabel: "Three and a forward arrow cue the third duodenal part anterior to the great vessels.", sourceLabel: "NCBI Bookshelf: Duodenum", sourceUrl: "https://www.ncbi.nlm.nih.gov/books/NBK482390/" },
    sourceUrl: "https://www.ncbi.nlm.nih.gov/books/NBK482390/", finding: "The third duodenal segment courses anterior to the aorta and inferior vena cava."
  },
  {
    id: "anatomy-anatomy-all-pdf-p0179-q0045", page: 179,
    expectedStem: "ww The ilioinguinal nerve innervates which of the following muscles:",
    expectedOptions: ["Internal and external oblique muscles 9%", "Internal oblique and transversus abdominis muscles", "Transversus abdominis and rectus abdominis muscles 8%", "Psoas major and minor muscles 10%", "Quadratus lumborum 5%"],
    stem: "The ilioinguinal nerve innervates which muscles?",
    options: ["Internal and external oblique muscles", "Internal oblique and transversus abdominis muscles", "Transversus abdominis and rectus abdominis muscles", "Psoas major and minor muscles", "Quadratus lumborum"],
    correctOption: 1,
    explanation: "The ilioinguinal nerve gives motor innervation to internal oblique and transversus abdominis. It also has sensory distribution in the upper anteromedial thigh and external genital region.",
    learningNote: "Ilioinguinal motor branches supply internal oblique and transversus abdominis.",
    highYieldNote: "Ilioinguinal nerve: internal oblique plus transversus abdominis.",
    mnemonic: "🧱 Ilioinguinal supplies the two deep lower wall layers: internal oblique and transversus.",
    memoryAid: { coreFact: "The ilioinguinal nerve supplies internal oblique and transversus abdominis muscles.", mnemonic: "Ilioinguinal supplies the two deep lower wall layers: internal oblique and transversus.", emojiCues: ["🧱", "2️⃣"], cueLabel: "A wall and two cue the internal oblique and transversus pair.", sourceLabel: "NCBI Bookshelf: Ilioinguinal Neuralgia", sourceUrl: "https://www.ncbi.nlm.nih.gov/books/NBK538256/" },
    sourceUrl: "https://www.ncbi.nlm.nih.gov/books/NBK538256/", finding: "The ilioinguinal nerve gives motor innervation to transversus abdominis and internal oblique muscles."
  },
  {
    id: "anatomy-anatomy-all-pdf-p0183-q0046", page: 183,
    expectedStem: "ww The gallbladder is located on which of the following aspects of the liver:",
    expectedOptions: ["Right lobe", "Left lobe 4%", "Quadrate lobe 7% CJ", "Diaphragmatic surface 4%"],
    stem: "The gallbladder is located on which aspect of the liver?",
    options: ["Right lobe", "Left lobe", "Quadrate lobe", "Caudate lobe", "Diaphragmatic surface"],
    correctOption: 0,
    explanation: "The source marks the right lobe as the best response. Anatomically, the gallbladder attaches on the visceral liver surface in a fossa between hepatic segments IV and V.",
    learningNote: "Use the precise fossa relation: gallbladder on the visceral liver surface between segments IV and V.",
    highYieldNote: "Gallbladder fossa: visceral liver surface between segments IV and V.",
    mnemonic: "🟩 IV-V fossa: gallbladder sits on the visceral liver surface.",
    memoryAid: { coreFact: "The gallbladder attaches to the visceral surface of the liver in a fossa between hepatic segments IV and V.", mnemonic: "IV-V fossa: gallbladder sits on the visceral liver surface.", emojiCues: ["4️⃣", "5️⃣", "🟩"], cueLabel: "Four, five, and a green square cue the segments-IV/V gallbladder fossa.", sourceLabel: "NCBI Bookshelf: Gallbladder", sourceUrl: "https://www.ncbi.nlm.nih.gov/books/NBK459288/" },
    sourceUrl: "https://www.ncbi.nlm.nih.gov/books/NBK459288/", finding: "The gallbladder attaches to the visceral liver surface in a fossa between hepatic segments IV and V."
  },
  {
    id: "anatomy-anatomy-all-pdf-p0186-q0047", page: 186,
    expectedStem: "wv Control of bile and pancreatic fluid entering the duodenum is regulated by the:",
    expectedOptions: ["Ampulla of Vater", "Major duodenal papilla 3%", "External biliary sphincter 2%", "Internal biliary sphincter 0%", "Sphincter of Oddi"],
    stem: "Control of bile and pancreatic fluid entering the duodenum is regulated by which structure?",
    options: ["Ampulla of Vater", "Major duodenal papilla", "External biliary sphincter", "Internal biliary sphincter", "Sphincter of Oddi"],
    correctOption: 4,
    explanation: "The sphincter of Oddi surrounds the hepatopancreatic ampulla. It regulates bile and pancreatic-secretory flow into the duodenum and prevents reflux of duodenal contents.",
    learningNote: "The ampulla and papilla are anatomical landmarks; the sphincter of Oddi is the flow-regulating smooth muscle.",
    highYieldNote: "Sphincter of Oddi regulates biliary and pancreatic flow into the duodenum.",
    mnemonic: "🚪 Oddi is the pancreaticobiliary flow gate.",
    memoryAid: { coreFact: "The sphincter of Oddi regulates the flow of bile and pancreatic secretions into the duodenum.", mnemonic: "Oddi is the pancreaticobiliary flow gate.", emojiCues: ["🚪", "🟡", "💧"], cueLabel: "A gate, bile, and fluid cue sphincter-controlled pancreaticobiliary flow.", sourceLabel: "NCBI Bookshelf: Gallbladder", sourceUrl: "https://www.ncbi.nlm.nih.gov/books/NBK459288/" },
    sourceUrl: "https://www.ncbi.nlm.nih.gov/books/NBK459288/", finding: "The sphincter of Oddi regulates bile and pancreatic-secretory flow into the duodenum and prevents reflux."
  },
  {
    id: "anatomy-anatomy-all-pdf-p0194-q0049", page: 194,
    expectedStem: "The infracolic compartment is divided into right and left spaces by which of the following structures:",
    expectedOptions: ["Jejunum", "lleum", "Sigmoid mesocolon"],
    stem: "The infracolic compartment is divided into right and left spaces by which structure?",
    options: ["Jejunum", "Ileum", "Mesentery", "Transverse mesocolon", "Sigmoid mesocolon"],
    correctOption: 2,
    explanation: "The root of the small-bowel mesentery divides the infracolic compartment into right and left infracolic spaces. The transverse mesocolon separates the supracolic and infracolic compartments.",
    learningNote: "Transverse mesocolon divides supra- from infracolic; small-bowel mesentery divides the infracolic space into right and left.",
    highYieldNote: "Root of small-bowel mesentery divides the infracolic compartment into right and left spaces.",
    mnemonic: "↔️ Mesentery splits the infracolic compartment into right and left.",
    memoryAid: { coreFact: "The root of the small-bowel mesentery divides the infracolic compartment into right and left spaces.", mnemonic: "Mesentery splits the infracolic compartment into right and left.", emojiCues: ["↔️", "🧵"], cueLabel: "A two-way arrow and thread cue the mesenteric division into two spaces.", sourceLabel: "Sharma et al.: Infracolic and Pelvic Compartment", sourceUrl: "https://europepmc.org/articles/PMC6590000" },
    sourceUrl: "https://europepmc.org/articles/PMC6590000", finding: "The root of the small-bowel mesentery divides the infracolic compartment into right and left infracolic spaces."
  },
  {
    id: "anatomy-anatomy-all-pdf-p0198-q0050", page: 198,
    expectedStem: "The stomach receives its blood supply primarily from which of the following arteries:",
    expectedOptions: ["Inferior mesenteric artery Renal artery 0%", "Suprarenal artery"],
    stem: "The stomach receives its blood supply primarily from which artery?",
    options: ["Superior mesenteric artery", "Inferior mesenteric artery", "Coeliac trunk", "Renal artery", "Suprarenal artery"],
    correctOption: 2,
    explanation: "The stomach receives arterial branches from the coeliac trunk: left gastric, splenic, and common hepatic branches contribute to its regional supply.",
    learningNote: "Gastric supply is regional but comes through the coeliac trunk and its branches.",
    highYieldNote: "Stomach arterial supply: coeliac trunk via left gastric, splenic, and common hepatic branches.",
    mnemonic: "🌿 Coeliac trunk branches feed the stomach.",
    memoryAid: { coreFact: "The stomach receives arterial supply through the coeliac trunk and its left gastric, splenic, and common hepatic branches.", mnemonic: "Coeliac trunk branches feed the stomach.", emojiCues: ["🌿", "🫀", "🩸"], cueLabel: "A branch, stomach, and blood cue coeliac gastric supply.", sourceLabel: "NCBI Bookshelf: Celiac Trunk", sourceUrl: "https://www.ncbi.nlm.nih.gov/books/NBK459241/" },
    sourceUrl: "https://www.ncbi.nlm.nih.gov/books/NBK459241/", finding: "The coeliac trunk provides primary supply to foregut organs including the stomach through left gastric, splenic, and common hepatic branches."
  },
  {
    id: "anatomy-anatomy-all-pdf-p0203-q0051", page: 203,
    expectedStem: "Visceral afferent fibres from the ascending colon and proximal transverse colon travel to which of the following spinal cord segments:",
    expectedOptions: ["T6-18", "T8- 110 N%", "110 - T11", "Lie 58% (x) L3-L4 2%"],
    stem: "Visceral afferent fibres from the ascending colon and proximal transverse colon travel to which spinal cord segments?",
    options: ["T6-T8", "T8-T10", "T10-T11", "L1-L2", "L3-L4"],
    correctOption: 2,
    explanation: "The source marks T10-T11. Lesser splanchnic nerves arise from T10-T11 and their fibers reach midgut perivascular plexuses, supporting the source's midgut association.",
    learningNote: "For this source's ascending/proximal-transverse colon association, retain the lesser-splanchnic T10-T11 pathway.",
    highYieldNote: "Lesser splanchnic nerves arise from T10-T11 and reach midgut perivascular plexuses.",
    mnemonic: "🔟1️⃣1️⃣ Lesser splanchnic: T10-T11 for this midgut association.",
    memoryAid: { coreFact: "Lesser splanchnic nerves arise from T10-T11 and reach midgut perivascular plexuses.", mnemonic: "Lesser splanchnic: T10-T11 for this midgut association.", emojiCues: ["🔟", "1️⃣1️⃣", "🌿"], cueLabel: "Ten, eleven, and a branch cue the lesser-splanchnic midgut association.", sourceLabel: "NCBI Bookshelf: Splanchnic Nerves", sourceUrl: "https://www.ncbi.nlm.nih.gov/books/NBK560504/" },
    sourceUrl: "https://www.ncbi.nlm.nih.gov/books/NBK560504/", finding: "Lesser splanchnic nerves arise from T10-T11 and reach midgut perivascular plexuses."
  },
  {
    id: "anatomy-anatomy-all-pdf-p0208-q0052", page: 208,
    expectedStem: "The lateral cutaneous nerve of the thigh is formed from the anterior rami of:",
    expectedOptions: ["u", "LI-L2 a", "L2", "L3-L4"],
    stem: "The lateral cutaneous nerve of the thigh is formed from which anterior rami?",
    options: ["L1", "L1-L2", "L2", "L2-L3", "L3-L4"],
    correctOption: 3,
    explanation: "The lateral femoral cutaneous nerve typically arises from the dorsal divisions of L2 and L3 ventral rami. It is a purely sensory nerve to the anterolateral and lateral thigh.",
    learningNote: "Lateral femoral cutaneous nerve: L2-L3, sensory to the anterolateral thigh.",
    highYieldNote: "Lateral femoral cutaneous nerve: L2-L3, purely sensory.",
    mnemonic: "2️⃣3️⃣ Lateral thigh sensation is L2-L3.",
    memoryAid: { coreFact: "The lateral femoral cutaneous nerve typically arises from L2 and L3 ventral rami and is purely sensory.", mnemonic: "Lateral thigh sensation is L2-L3.", emojiCues: ["2️⃣", "3️⃣", "🦵"], cueLabel: "Two, three, and a leg cue L2-L3 sensory supply to the lateral thigh.", sourceLabel: "NCBI Bookshelf: Lateral Femoral Cutaneous Nerve", sourceUrl: "https://www.ncbi.nlm.nih.gov/books/NBK532301/" },
    sourceUrl: "https://www.ncbi.nlm.nih.gov/books/NBK532301/", finding: "The lateral femoral cutaneous nerve typically arises from dorsal divisions of L2 and L3 ventral rami."
  },
  {
    id: "anatomy-anatomy-all-pdf-p0212-q0053", page: 212,
    expectedStem: "ww Regarding the large intestine, which of the following parts is not described correctly:",
    expectedOptions: ["Caecum - Intraperitoneal", "Ascending colon - Retroperitoneal 6%", "Transverse colon - Intraperitoneal 5%", "Descending colon - Retroperitoneal 3%", "Sigmoid colon - Retroperitoneal"],
    stem: "Regarding the large intestine, which statement is not described correctly?",
    options: ["Caecum - Intraperitoneal", "Ascending colon - Retroperitoneal", "Transverse colon - Intraperitoneal", "Descending colon - Retroperitoneal", "Sigmoid colon - Retroperitoneal"],
    correctOption: 4,
    explanation: "The sigmoid colon is intraperitoneal. The ascending and descending colon are retroperitoneal, while the caecum and transverse colon are intraperitoneal.",
    learningNote: "Sigmoid and transverse colon are intraperitoneal; ascending and descending colon are retroperitoneal.",
    highYieldNote: "Sigmoid colon is intraperitoneal, so 'sigmoid colon - retroperitoneal' is the incorrect statement.",
    mnemonic: "〰️ Sigmoid swings free: intraperitoneal.",
    memoryAid: { coreFact: "The sigmoid colon is intraperitoneal; the ascending and descending colon are retroperitoneal.", mnemonic: "Sigmoid swings free: intraperitoneal.", emojiCues: ["〰️", "🧵"], cueLabel: "A sigmoid curve and free thread cue the intraperitoneal sigmoid colon.", sourceLabel: "NCBI Bookshelf: Large Intestine", sourceUrl: "https://www.ncbi.nlm.nih.gov/books/NBK470577/" },
    sourceUrl: "https://www.ncbi.nlm.nih.gov/books/NBK470577/", finding: "The caecum and transverse and sigmoid colon are intraperitoneal; ascending and descending colon are retroperitoneal."
  }
];

const restrictions = [
  {
    id: "anatomy-anatomy-all-pdf-p0189-q0048", page: 189,
    expectedStem: "The blood supply to the pancreas is primarily from which of the following arteries:",
    expectedOptions: ["Left gastric artery", "Common hepatic artery", "Superior mesenteric artery Inferior mesenteric artery 1%"],
    warning: "Source page reviewed, but authoritative anatomy confirms multi-vessel pancreatic supply and does not establish the source's single-primary-artery wording for the whole pancreas. The record remains unresolved and excluded from answer learning."
  }
];

function parseDrafts(source) {
  const prefix = "export const ocrDraftQuestions: OcrDraftQuestion[] = ";
  const start = source.indexOf(prefix); const arrayStart = start + prefix.length; const end = source.indexOf("];", arrayStart);
  if (start < 0 || end < 0) throw new Error("OCR draft export not found");
  return { prefix, start, arrayStart, end, drafts: JSON.parse(source.slice(arrayStart, end + 1)) };
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
  Object.assign(draft, {
    stem: item.stem, options: item.options, correctOption: item.correctOption, explanation: item.explanation,
    learningNote: item.learningNote, highYieldNote: item.highYieldNote, mnemonic: item.mnemonic, memoryAid: item.memoryAid,
    status: "ocr_draft", askable: true, warnings: [reviewedWarning]
  });
  applied.push({ id: item.id, sourcePage: item.page, before, after: { stem: draft.stem, options: draft.options, correctOption: draft.correctOption, status: draft.status, askable: draft.askable }, evidence: { externalSource: item.sourceUrl, externalFinding: item.finding } });
}

for (const item of restrictions) {
  const draft = byId.get(item.id);
  assertSnapshot(draft, item);
  const before = { status: draft.status, askable: draft.askable, warnings: draft.warnings ?? [], highYieldNote: draft.highYieldNote, mnemonic: draft.mnemonic, memoryAid: draft.memoryAid };
  Object.assign(draft, { status: "needs_review", askable: false, highYieldNote: undefined, mnemonic: undefined, memoryAid: undefined, warnings: [...new Set([...(draft.warnings ?? []), item.warning])] });
  restricted.push({ id: item.id, sourcePage: item.page, before, after: { status: draft.status, askable: draft.askable, warnings: draft.warnings } });
}

await writeFile(bankPath, `${source.slice(0, parsed.arrayStart)}${JSON.stringify(parsed.drafts)}${source.slice(parsed.end + 1)}`);
await mkdir(auditDir, { recursive: true });
await writeFile(path.join(auditDir, "applied-anatomy-batch-05.json"), `${JSON.stringify({ generatedAt: new Date().toISOString(), applied, restricted, automaticApproval: false, mockEligibility: "No restored OCR draft is mock eligible." }, null, 2)}\n`);
console.log(JSON.stringify({ restored: applied.map((row) => row.id), restricted: restricted.map((row) => row.id), automaticApproval: false }, null, 2));
