/** Guarded Anatomy Batch 09 restoration; this script never approves OCR records. */
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
    id: "anatomy-anatomy-all-pdf-p0340-q0084", page: 340,
    expectedStem: "The stomach lies anterior to all of the following structures EXCEPT for the:", expectedOptions: ["Pancreas", "Transverse mesocolon", "Spleen"],
    stem: "The stomach lies anterior to all of the following structures except which?",
    options: ["Pancreas", "Transverse mesocolon", "Spleen", "Left lobe of the liver", "Left colic flexure"], correctOption: 3,
    explanation: "The left hepatic lobe lies anterior to the stomach. The pancreas, spleen, transverse mesocolon, left kidney, and left suprarenal gland are posterior stomach relations across the lesser sac.",
    learningNote: "Left hepatic lobe lies anterior to the stomach; pancreas and transverse mesocolon are posterior relations.",
    highYieldNote: "Stomach: left hepatic lobe anterior; pancreas and transverse mesocolon posterior.",
    mnemonic: "🫀➡️🍽️ Liver lies in front of stomach.",
    memoryAid: aid("The left hepatic lobe lies anterior to the stomach, while pancreas and transverse mesocolon are posterior relations.", "Liver lies in front of stomach.", ["🫀", "➡️", "🍽️"], "Trace liver to stomach for the anterior relation.", "NCBI Bookshelf: Stomach", "https://www.ncbi.nlm.nih.gov/books/NBK482334/"),
    sourceUrl: "https://www.ncbi.nlm.nih.gov/books/NBK482334/", finding: "The left hepatic lobe is anterior to the stomach."
  },
  {
    id: "anatomy-anatomy-all-pdf-p0350-q0086", page: 350,
    expectedStem: "Which of the following structures is NOT retroperitoneal: (x) Abdominal oesophagus 9%", expectedOptions: ["Adrenal glands", "Ascending colon", "Descending colon"],
    stem: "Which structure is not retroperitoneal?",
    options: ["Abdominal oesophagus", "Adrenal glands", "Ascending colon", "Descending colon", "Proximal duodenum"], correctOption: 4,
    explanation: "The duodenum is retroperitoneal except for its first segment. Therefore the proximal first segment is the non-retroperitoneal option in this list.",
    learningNote: "Duodenum is retroperitoneal except for the first segment.",
    highYieldNote: "Duodenum: first segment exception; remainder is retroperitoneal.",
    mnemonic: "1️⃣ Duodenal first is free; the rest is fixed.",
    memoryAid: aid("The first duodenal segment is the exception to the duodenum's retroperitoneal position.", "Duodenal first is free; the rest is fixed.", ["1️⃣", "🔓"], "One and unlocked cue the first-segment exception.", "NCBI Bookshelf: Duodenum", "https://www.ncbi.nlm.nih.gov/books/NBK482390/"),
    sourceUrl: "https://www.ncbi.nlm.nih.gov/books/NBK482390/", finding: "Except for its first segment, the duodenum is retroperitoneal."
  },
  {
    id: "anatomy-anatomy-all-pdf-p0357-q0088", page: 357,
    expectedStem: "ww In men, the external urethral sphincter surrounds which of the following structures:", expectedOptions: ["Preprostatic urethra 8%", "Membranous urethra", "Spongy urethra 16%", "External urethral orifice 13%"],
    stem: "In men, the external urethral sphincter surrounds which structure?",
    options: ["Preprostatic urethra", "Prostatic urethra", "Membranous urethra", "Spongy urethra", "External urethral orifice"], correctOption: 2,
    explanation: "The male external urethral sphincter is located at the same level as the membranous urethra. It is striated muscle under voluntary control.",
    learningNote: "External urethral sphincter sits at the membranous urethra.",
    highYieldNote: "Male external urethral sphincter: membranous-urethral level, voluntary striated muscle.",
    mnemonic: "🧱 Membranous = muscular control point.",
    memoryAid: aid("In males, the external urethral sphincter is at the membranous-urethral level.", "Membranous is the muscular control point.", ["🧱", "🚽"], "A muscular barrier cues the membranous urethra.", "NCBI Bookshelf: Sphincter Urethrae", "https://www.ncbi.nlm.nih.gov/books/NBK482438/"),
    sourceUrl: "https://www.ncbi.nlm.nih.gov/books/NBK482438/", finding: "The male external urethral sphincter is at the same level as the membranous urethra."
  },
  {
    id: "anatomy-anatomy-all-pdf-p0365-q0090", page: 365,
    expectedStem: "A 29 year old rugby player presents to ED complaining of left flank pain. Imaging shows a fracture of the angle of the twelfth rib on the left side. Which of the following organs, based on surface anatomy, is most at risk for injury:", expectedOptions: ["Spleen", "Pancreas", "Stomach"],
    stem: "A player has a fracture at the angle of the left twelfth rib. Which organ is most at risk based on surface anatomy?",
    options: ["Spleen", "Left kidney", "Pancreas", "Stomach", "Transverse colon"], correctOption: 1,
    explanation: "The kidneys occupy T12-L3 and their upper poles are often crossed by the twelfth rib. The left kidney lies slightly higher than the right, making it the source-marked surface-anatomy answer.",
    learningNote: "Kidneys span T12-L3; the left lies higher and its upper pole relates to rib 12.",
    highYieldNote: "Twelfth-rib flank trauma: consider kidney injury; the left kidney lies higher.",
    mnemonic: "1️⃣2️⃣🫘 Rib twelve guards the kidney.",
    memoryAid: aid("Kidneys lie between T12 and L3; their upper poles are often crossed by the twelfth rib, and the left kidney is higher.", "Rib twelve guards the kidney.", ["1️⃣", "2️⃣", "🫘"], "Twelve and kidney cue the lower-rib relation.", "NCBI Bookshelf: Kidneys", "https://www.ncbi.nlm.nih.gov/books/NBK482385/"),
    sourceUrl: "https://www.ncbi.nlm.nih.gov/books/NBK482385/", finding: "Kidneys span T12-L3, upper poles are frequently crossed by rib 12, and the left lies higher."
  },
  {
    id: "anatomy-anatomy-all-pdf-p0367-q0092", page: 367,
    expectedStem: "A 65 year old woman presents to ED complaining of fever, right upper quadrant pain, and jaundice. Imaging shows an obstructing gallstone. Which of the following structures is most likely obstructed by the gallstone:", expectedOptions: ["Pancreatic duct", "Cystic duct", "Left hepatic duct (x) Right hepatic duct 1%"],
    stem: "A woman has fever, right-upper-quadrant pain, jaundice, and an obstructing gallstone. Which structure is most likely obstructed?",
    options: ["Pancreatic duct", "Cystic duct", "Left hepatic duct", "Common bile duct", "Right hepatic duct"], correctOption: 3,
    explanation: "Gallstones in the common bile duct obstruct bile flow and can cause pain, jaundice, and cholangitis. The common hepatic and cystic ducts unite to form the common bile duct.",
    learningNote: "Common-bile-duct stones can cause jaundice and cholangitis.",
    highYieldNote: "Gallstone + fever + RUQ pain + jaundice: common-bile-duct obstruction until proven otherwise.",
    mnemonic: "🪨➡️🟢 CBD block turns bile back.",
    memoryAid: aid("A gallstone obstructing the common bile duct impairs bile flow and can cause pain, jaundice, and cholangitis.", "CBD block turns bile back.", ["🪨", "🟢", "🚫"], "Stone, bile, and block cue common-bile-duct obstruction.", "NCBI Bookshelf: Biliary Obstruction", "https://www.ncbi.nlm.nih.gov/books/NBK539698/"),
    sourceUrl: "https://www.ncbi.nlm.nih.gov/books/NBK539698/", finding: "Gallstones causing common-bile-duct obstruction manifest with pain and jaundice."
  },
  {
    id: "anatomy-anatomy-all-pdf-p0370-q0093", page: 370,
    expectedStem: "ww The deep inguinal ring is an ‘opening’ in which of the following structures:", expectedOptions: ["External oblique aponeurosis 10%", "Internal oblique aponeurosis 7%", "Transversus abdominis aponeurosis 1%", "Rectus abdominis aponeurosis 2%", "Transversalis fascia"],
    stem: "The deep inguinal ring is an opening in which structure?",
    options: ["External oblique aponeurosis", "Internal oblique aponeurosis", "Transversus abdominis aponeurosis", "Rectus abdominis aponeurosis", "Transversalis fascia"], correctOption: 4,
    explanation: "The deep inguinal ring is formed by transversalis fascia and marks the beginning of the inguinal canal.",
    learningNote: "Deep inguinal ring = opening in transversalis fascia.",
    highYieldNote: "Deep ring begins the inguinal canal in transversalis fascia.",
    mnemonic: "🔎 Deep ring digs through transversalis fascia.",
    memoryAid: aid("The deep inguinal ring is formed by transversalis fascia at the beginning of the inguinal canal.", "Deep ring digs through transversalis fascia.", ["🔎", "🧵"], "A deep opening through a fascial sheet cues transversalis fascia.", "NCBI Bookshelf: Inguinal Region", "https://www.ncbi.nlm.nih.gov/books/NBK470204/"),
    sourceUrl: "https://www.ncbi.nlm.nih.gov/books/NBK470204/", finding: "The deep inguinal ring is formed by transversalis fascia."
  }
];

const restrictions = [
  {
    id: "anatomy-anatomy-all-pdf-p0345-q0085", page: 345,
    expectedStem: "Ld Which of the following parts of the male urethra passes through the urogenital diaphragm:", expectedOptions: ["Preprostatic urethra 10%", "Prostatic urethra 9%", "Membranous urethra", "Spongy urethra 6% (x) Urethral crest 2%"],
    stem: "Which part of the male urethra passes through the urogenital diaphragm?", options: ["Preprostatic urethra", "Prostatic urethra", "Membranous urethra", "Spongy urethra", "Urethral crest"],
    explanation: "The source marks the membranous urethra. Evidence reviewed for the male urethral sphincter confirms its membranous-urethral level but not this exact urogenital-diaphragm formulation, so the record remains excluded from answer learning.",
    warning: "Source page reviewed, but the exact source urogenital-diaphragm formulation was not directly corroborated by an authoritative external source. This record remains excluded from answer learning."
  },
  {
    id: "anatomy-anatomy-all-pdf-p0353-q0087", page: 353,
    expectedStem: "The lumbar plexus is formed predominantly from the anterior rami of:", expectedOptions: ["L2-L3", "L1-L2", "Ee L5"],
    stem: "The lumbar plexus is formed predominantly from the anterior rami of which roots?", options: ["L2-L3", "L1-L5", "L1-L4", "L1-L2", "L2-L5"],
    explanation: "The source marks L1-L4. The reviewed lumbar-plexus reference describes a broader T12-L5 distribution but does not directly corroborate the source's exact L1-L4 formulation, so the record remains excluded from answer learning.",
    warning: "Source page reviewed, but the exact source-marked L1-L4 lumbar-plexus formulation was not directly corroborated by an authoritative external source. This record remains excluded from answer learning."
  },
  {
    id: "anatomy-anatomy-all-pdf-p0361-q0089", page: 361,
    expectedStem: "A 65 year old lady complains of faecal incontinence. Dysfunction of which of the following structures is most likely a contributing factor to her symptoms:", expectedOptions: ["Pectineus muscle", "lliococcygeus muscle Sporeserimnde", "Coccygeus muscle"],
    stem: "A 65-year-old woman has faecal incontinence. Dysfunction of which structure is most likely to contribute?", options: ["Pectineus muscle", "Puborectalis muscle", "Iliococcygeus muscle", "Transverse perineal muscles", "Coccygeus muscle"],
    explanation: "The source marks puborectalis. Reviewed evidence establishes its role in permitting faecal passage through relaxation but does not directly establish the source's specific clinical inference, so the record remains excluded from answer learning.",
    warning: "Source page reviewed, but the source's exact puborectalis-incontinence clinical inference was not directly corroborated by an authoritative external source. This record remains excluded from answer learning."
  },
  {
    id: "anatomy-anatomy-all-pdf-p0374-q0094", page: 374,
    expectedStem: "ww The ureters arise at which of the following vertebral levels:", expectedOptions: ["T10 2%", "™ oo", "m2 55%", "at ”"],
    stem: "At which vertebral level do the ureters arise?", options: ["T10", "T11", "T12", "L1", "L2"],
    explanation: "The source marks L1. The renal pelvis is the superior end of the ureter, but the reviewed external source does not directly establish this exact vertebral level, so the record remains excluded from answer learning.",
    warning: "Source page reviewed, but the exact source-marked L1 ureter-origin level was not directly corroborated by an authoritative external source. This record remains excluded from answer learning."
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
await writeFile(path.join(auditDir, "applied-anatomy-batch-09.json"), `${JSON.stringify({ generatedAt: new Date().toISOString(), applied, restricted, automaticApproval: false, mockEligibility: "No restored OCR draft is mock eligible." }, null, 2)}\n`);
console.log(JSON.stringify({ restored: applied.map((row) => row.id), restricted: restricted.map((row) => row.id), automaticApproval: false }, null, 2));
