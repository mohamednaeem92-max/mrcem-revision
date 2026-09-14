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
    id: "anatomy-anatomy-all-pdf-p0537-q0146", page: 537,
    expectedStem: "Regarding the male urethra, which of the following statements is CORRECT:", expectedOptions: ["The membranous urethra is the widest part.", "The spongy urethra penetrates the urogenital diaphragm. 5%", "The internal urethral sphincter is associated with the prostatic urethra. 58%", "The prostatic urethra is the longest part. V) The spongy urethra (in the flaccid penis) bends twice in its course, first anteriorly and then 32%"],
    stem: "Regarding the male urethra, which statement is correct?", options: ["The membranous urethra is the widest part", "The spongy urethra penetrates the urogenital diaphragm", "The internal urethral sphincter is associated with the prostatic urethra", "The prostatic urethra is the longest part", "The spongy urethra in the flaccid penis bends twice, first anteriorly and then inferiorly"], correctOption: 4,
    explanation: "In an upright flaccid penis, the male urethra has an S-shaped double curvature. The prostatic part is widest, the spongy part is longest, the membranous part crosses the perineal membrane, and the internal sphincter relates to the bladder-neck/preprostatic segment.",
    learningNote: "Flaccid male urethra has an S-shaped double curve.", highYieldNote: "Spongy urethra is the longest segment; flaccid urethra has two bends.", mnemonic: "〰️ Flaccid urethra makes an S.",
    memoryAid: aid("In a flaccid penis, the male urethra has an S-shaped double curvature.", "Flaccid urethra makes an S.", ["〰️", "↪️"], "The wave line cues the flaccid S curve.", "Medscape: Male Urethra Anatomy", "https://emedicine.medscape.com/article/1972482-overview"),
    sourceUrl: "https://emedicine.medscape.com/article/1972482-overview", finding: "Male urethra forms an S curve in an upright flaccid position."
  },
  {
    id: "anatomy-anatomy-all-pdf-p0541-q0147", page: 541,
    expectedStem: "A patient presents following a fall. Imaging shows damage to the L1 nerve root. Which of the following muscles are most likely to be affected:", expectedOptions: ["Transversus abdominis and rectus abdominis muscles", "Gluteus medius and minimus muscles", "Transversus abdominis and internal oblique muscles", "Internal and external oblique muscles"],
    stem: "A patient has damage to the L1 nerve root. Which muscles are most likely to be affected?", options: ["Transversus abdominis and rectus abdominis", "Rectus abdominis and external oblique", "Gluteus medius and minimus", "Transversus abdominis and internal oblique", "Internal and external oblique"], correctOption: 3,
    explanation: "The ilioinguinal nerve has L1 contribution and supplies motor fibres to transversus abdominis and internal oblique. Therefore injury to L1 can affect both of these lower anterolateral abdominal-wall muscles.",
    learningNote: "L1 via ilioinguinal: internal oblique plus transversus abdominis.", highYieldNote: "Ilioinguinal nerve with L1 contribution supplies internal oblique and transversus abdominis.", mnemonic: "1️⃣ L1 links IO and TA.",
    memoryAid: aid("L1-associated ilioinguinal supply includes internal oblique and transversus abdominis.", "L1 links IO and TA.", ["1️⃣", "💪"], "One root connects the two lower abdominal-wall muscles.", "NCBI Bookshelf: Ilioinguinal Neuralgia", "https://www.ncbi.nlm.nih.gov/books/NBK538256/"),
    sourceUrl: "https://www.ncbi.nlm.nih.gov/books/NBK538256/", finding: "Ilioinguinal nerve with T12-L1 origin supplies transversus abdominis and internal oblique."
  },
  {
    id: "anatomy-anatomy-all-pdf-p0546-q0148", page: 546,
    expectedStem: "The renal arteries arise from the abdominal aorta at which of the following vertebral levels:", expectedOptions: ["TH/T12", "T12/l1 oon", "L3/L4"],
    stem: "At which vertebral level do the renal arteries typically arise from the abdominal aorta?", options: ["T11/T12", "T12/L1", "L1/L2", "L2/L3", "L3/L4"], correctOption: 2,
    explanation: "The renal arteries usually arise laterally from the abdominal aorta at the L1/L2 intervertebral disc, just inferior to the superior mesenteric artery.",
    learningNote: "Renal arteries: typical origin L1/L2.", highYieldNote: "Typical renal-artery origin is the L1/L2 intervertebral disc.", mnemonic: "🫘 Renals rise at L1–L2.",
    memoryAid: aid("Renal arteries usually arise from the lateral aorta at the L1/L2 disc.", "Renals rise at L1–L2.", ["🫘", "1️⃣", "2️⃣"], "Kidney and number cues fix the L1-L2 level.", "NCBI Bookshelf: Renal Artery", "https://www.ncbi.nlm.nih.gov/books/NBK459158/"),
    sourceUrl: "https://www.ncbi.nlm.nih.gov/books/NBK459158/", finding: "Renal arteries typically arise from the abdominal aorta at the L1/L2 intervertebral disc."
  },
  {
    id: "anatomy-anatomy-all-pdf-p0547-q0149", page: 547,
    expectedStem: "ww Pain from the ureters is usually referred to dermatomes supplied by:", expectedOptions: ["T10 - 112", "™m-12", "LIES: 57%", "L2-L4 4%", "T5-19 bs"],
    stem: "Pain from the ureters is usually referred to dermatomes supplied by which spinal segments?", options: ["T10–T12", "T11–L2", "L1–L3", "L2–L4", "T5–T9"], correctOption: 1,
    explanation: "Visceral afferents from the ureters travel with sympathetic pathways to spinal segments T11-L2. Ureteric distension can therefore produce the classic loin-to-groin pattern.",
    learningNote: "Ureteric pain refers T11-L2.", highYieldNote: "Ureteric visceral afferents enter T11-L2, producing loin-to-groin referral.", mnemonic: "↘️ T11–L2 tracks loin to groin.",
    memoryAid: aid("Ureteric visceral afferents refer pain to T11-L2 dermatomes.", "T11–L2 tracks loin to groin.", ["↘️", "⚡"], "A downward diagonal recalls referred pain moving toward the groin.", "NCBI Bookshelf: Kidneys", "https://www.ncbi.nlm.nih.gov/books/NBK482385/"),
    sourceUrl: "https://www.ncbi.nlm.nih.gov/books/NBK482385/", finding: "Visceral afferent pain pathways reach T11-L2 segments."
  },
  {
    id: "anatomy-anatomy-all-pdf-p0550-q0150", page: 550,
    expectedStem: "ww The fourth part of the duodenum terminates at which of the following vertebral levels:", expectedOptions: ["12 3%", "u 9%", "BS: 13%", "L4 4%"],
    stem: "At which vertebral level does the fourth part of the duodenum terminate?", options: ["T12", "L1", "L2", "L3", "L4"], correctOption: 2,
    explanation: "The ascending fourth part of the duodenum rises to the superior border of L2, where it turns at the duodenojejunal flexure to become jejunum.",
    learningNote: "Fourth duodenum ends at DJ flexure near L2.", highYieldNote: "Fourth duodenal part terminates at the duodenojejunal flexure at L2.", mnemonic: "2️⃣ D2 is descending; D4 finishes at L2.",
    memoryAid: aid("The fourth duodenum ascends to the L2 duodenojejunal flexure.", "D4 finishes at L2.", ["4️⃣", "2️⃣"], "The part number and vertebral number cue D4-to-L2.", "Medscape: Duodenal Anatomy", "https://emedicine.medscape.com/article/1898874-overview"),
    sourceUrl: "https://emedicine.medscape.com/article/1898874-overview", finding: "Fourth duodenal part reaches superior L2 and turns at the duodenojejunal flexure."
  },
  {
    id: "anatomy-anatomy-all-pdf-p0551-q0151", page: 551,
    expectedStem: "ww The linea alba is formed from which of the following:", expectedOptions: ["The aponeuroses of the three flat anterior abdominal muscles", "The free edge of the external oblique aponeurosis 4%", "The tendinous intersection of the rectus abdominis muscle 57%", "The thoracolumbar fascia 0%", "The tendon of the pyramidalis muscle 0%"],
    stem: "The linea alba is formed from which structure?", options: ["Aponeuroses of the three flat anterior abdominal muscles", "Free edge of external-oblique aponeurosis", "Tendinous intersection of rectus abdominis", "Thoracolumbar fascia", "Tendon of pyramidalis"], correctOption: 0,
    explanation: "At the midline, the aponeuroses of external oblique, internal oblique, and transversus abdominis interlace to form the linea alba.",
    learningNote: "Linea alba = three flat-muscle aponeuroses at midline.", highYieldNote: "External oblique, internal oblique, and transversus abdominis aponeuroses form linea alba.", mnemonic: "3️⃣ flat layers form one white line.",
    memoryAid: aid("Three flat abdominal-muscle aponeuroses meet in the midline to form linea alba.", "Three flat layers form one white line.", ["3️⃣", "⬜"], "Three and white line cue the fused aponeuroses.", "NCBI Bookshelf: Abdominal Wall", "https://www.ncbi.nlm.nih.gov/books/NBK551649/"),
    sourceUrl: "https://www.ncbi.nlm.nih.gov/books/NBK551649/", finding: "Combined aponeuroses of three flat muscles fuse in midline to form linea alba."
  },
  {
    id: "anatomy-anatomy-all-pdf-p0552-q0152", page: 552,
    expectedStem: "ww The kidneys extend between which of the following vertebral levels:", expectedOptions: ["19-112 os", "12-1", "RIES 9%", "m2-13", "2 = L5 3%"],
    stem: "Between which vertebral levels do the kidneys usually extend?", options: ["T9–T12", "T12–L1", "L1–L3", "T12–L3", "L2–L5"], correctOption: 3,
    explanation: "The kidneys are retroperitoneal organs normally positioned from T12 to L3, with the right kidney typically slightly lower because of the liver.",
    learningNote: "Kidneys usually span T12-L3.", highYieldNote: "Normal kidneys extend from T12 to L3; right lies slightly lower.", mnemonic: "🫘 T12 to L3: three vertebral levels for kidneys.",
    memoryAid: aid("Kidneys normally lie between T12 and L3, with the right slightly lower.", "T12 to L3: kidneys span three levels.", ["🫘", "⬇️"], "Kidney and downward cue retain T12-L3 and lower right side.", "NCBI Bookshelf: Kidneys", "https://www.ncbi.nlm.nih.gov/books/NBK482385/"),
    sourceUrl: "https://www.ncbi.nlm.nih.gov/books/NBK482385/", finding: "Kidneys are positioned between T12 and L3 vertebrae."
  },
  {
    id: "anatomy-anatomy-all-pdf-p0553-q0153", page: 553,
    expectedStem: "ww Regarding the external oblique muscle, which of the following statements is INCORRECT:", expectedOptions: ["It is the largest and most superficial of the anterior abdominal muscles. 3%", "Its aponeurosis forms the linea alba at the midline. 7%", "It originates from the xiphoid process. (x) It inserts into the lateral lip of the iliac crest. 9%", "The lower free border of the external oblique aponeurosis forms the inguinal ligament. 56%"],
    stem: "Regarding the external oblique muscle, which statement is incorrect?", options: ["It is the largest and most superficial anterior abdominal muscle", "Its aponeurosis contributes to the linea alba at the midline", "It originates from the xiphoid process", "It inserts into the lateral lip of the iliac crest", "Its lower free aponeurotic border forms the inguinal ligament"], correctOption: 2,
    explanation: "External oblique arises from ribs 5-12, not the xiphoid process. It is the most superficial anterolateral abdominal muscle, inserts in part into the lateral lip of the iliac crest, and its inferior border forms the inguinal ligament.",
    learningNote: "External oblique starts on lower eight ribs, not xiphoid.", highYieldNote: "External oblique arises from ribs 5-12 and forms the inguinal-ligament border inferiorly.", mnemonic: "🦴 Ribs 5–12, not xiphoid.",
    memoryAid: aid("External oblique arises from ribs 5-12; it does not arise from the xiphoid.", "Ribs 5–12, not xiphoid.", ["🦴", "5️⃣", "🔟"], "Rib and number cues distinguish the true origin.", "NCBI Bookshelf: Abdominal Wall", "https://www.ncbi.nlm.nih.gov/books/NBK551649/"),
    sourceUrl: "https://www.ncbi.nlm.nih.gov/books/NBK551649/", finding: "External oblique arises from ribs 5-12, is superficial, and its inferior border forms the inguinal ligament."
  },
  {
    id: "anatomy-anatomy-all-pdf-p0554-q0154", page: 554,
    expectedStem: "The greater sac of the peritoneal cavity is divided into two compartments by which of the following structures:", expectedOptions: ["Liver", "Stomach", "Duodenum"],
    stem: "Which structure divides the greater sac of the peritoneal cavity into two compartments?", options: ["Liver", "Stomach", "Transverse mesocolon", "Duodenum", "Mesentery"], correctOption: 2,
    explanation: "The transverse mesocolon divides the peritoneal cavity into supracolic and infracolic compartments. The infracolic compartment is then further divided by the root of the small-bowel mesentery.",
    learningNote: "Transverse mesocolon divides supracolic from infracolic compartments.", highYieldNote: "Transverse mesocolon divides peritoneal cavity into supracolic and infracolic compartments.", mnemonic: "↔️ Transverse mesocolon makes an upper and lower map.",
    memoryAid: aid("Transverse mesocolon divides the peritoneal cavity into supracolic and infracolic compartments.", "Transverse mesocolon makes an upper and lower map.", ["↔️", "⬆️", "⬇️"], "Across, up, and down cue the two compartments.", "PMC: Peritoneal Cavity Basic Concepts", "https://pmc.ncbi.nlm.nih.gov/articles/PMC4584112/"),
    sourceUrl: "https://pmc.ncbi.nlm.nih.gov/articles/PMC4584112/", finding: "Transverse mesocolon divides the peritoneal cavity into supramesocolic and inframesocolic compartments."
  },
  {
    id: "anatomy-anatomy-all-pdf-p0555-q0155", page: 555,
    expectedStem: "ww The jejunum predominantly occupies which region of the abdomen:", expectedOptions: ["Left upper quadrant", "Right upper quadrant 56%", "Right lower quadrant 6%", "Suprapubic region 4%"],
    stem: "The jejunum predominantly occupies which region of the abdomen?", options: ["Left upper quadrant", "Right upper quadrant", "Left lower quadrant", "Right lower quadrant", "Suprapubic region"], correctOption: 0,
    explanation: "The jejunum is mainly located in the left upper quadrant, whereas ileal loops more commonly occupy the right lower quadrant and pelvis.",
    learningNote: "Jejunum: mainly left upper quadrant.", highYieldNote: "Jejunum is predominantly in the left upper quadrant; ileum is more right-lower.", mnemonic: "⬅️ Jejunum leans left and high.",
    memoryAid: aid("Jejunum lies mainly in the left upper quadrant.", "Jejunum leans left and high.", ["⬅️", "⬆️"], "Left and up arrows cue the LUQ jejunum.", "NCBI Bookshelf: Physiology, Small Bowel", "https://www.ncbi.nlm.nih.gov/books/NBK532263/"),
    sourceUrl: "https://www.ncbi.nlm.nih.gov/books/NBK532263/", finding: "Jejunum is located mainly in the left upper quadrant."
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
const applied = [];
for (const item of restorations) {
  const draft = byId.get(item.id); assertSnapshot(draft, item);
  const before = { stem: draft.stem, options: draft.options, correctOption: draft.correctOption, status: draft.status, askable: draft.askable, warnings: draft.warnings ?? [] };
  Object.assign(draft, { stem: item.stem, options: item.options, correctOption: item.correctOption, explanation: item.explanation, learningNote: item.learningNote, highYieldNote: item.highYieldNote, mnemonic: item.mnemonic, memoryAid: item.memoryAid, status: "ocr_draft", askable: true, warnings: [reviewedWarning] });
  applied.push({ id: item.id, sourcePage: item.page, before, after: { stem: draft.stem, options: draft.options, correctOption: draft.correctOption, status: draft.status, askable: draft.askable, warnings: draft.warnings }, evidence: { externalSource: item.sourceUrl, externalFinding: item.finding } });
}
await writeFile(bankPath, `${source.slice(0, parsed.arrayStart)}${JSON.stringify(parsed.drafts)}${source.slice(parsed.end + 1)}`);
await mkdir(auditDir, { recursive: true });
await writeFile(path.join(auditDir, "applied-anatomy-batch-15.json"), `${JSON.stringify({ generatedAt: new Date().toISOString(), applied, restricted: [], automaticApproval: false, mockEligibility: "No restored OCR draft is mock eligible." }, null, 2)}\n`);
console.log(JSON.stringify({ restored: applied.map((row) => row.id), restricted: [], automaticApproval: false }, null, 2));
