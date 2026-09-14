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
    id: "anatomy-anatomy-all-pdf-p0484-q0126", page: 484,
    expectedStem: "ww The sigmoid colon extends as low as which of the following vertebral levels:", expectedOptions: ["L5 1%", "s1 18%", "s2 18%"],
    stem: "The sigmoid colon extends as low as which vertebral level?", options: ["L4", "L5", "S1", "S2", "S3"], correctOption: 4,
    explanation: "The sigmoid colon becomes continuous with the rectum at the level of S3. The rectum then follows the sacrococcygeal curve to the anal canal.",
    learningNote: "Rectosigmoid junction: S3.", highYieldNote: "Sigmoid colon becomes rectum at S3.", mnemonic: "3️⃣ Sigmoid turns to rectum at S3.",
    memoryAid: aid("The sigmoid colon becomes continuous with the rectum at S3.", "Sigmoid turns to rectum at S3.", ["3️⃣", "↪️"], "A turn at three cues the rectosigmoid junction.", "NCBI Bookshelf: Large Intestine", "https://www.ncbi.nlm.nih.gov/books/NBK470577/"),
    sourceUrl: "https://www.ncbi.nlm.nih.gov/books/NBK470577/", finding: "The sigmoid colon becomes the rectum at S3."
  },
  {
    id: "anatomy-anatomy-all-pdf-p0489-q0127", page: 489,
    expectedStem: "ww The mesentery connects which of the following structures to the posterior abdominal wall:", expectedOptions: ["Transverse colon 62%", "Stomach 3%", "Jejunum and ileum", "Duodenum 5%"],
    stem: "The mesentery connects which structures to the posterior abdominal wall?", options: ["Transverse colon", "Stomach", "Jejunum and ileum", "Duodenum", "Liver"], correctOption: 2,
    explanation: "The mesentery is a double fold of peritoneum that anchors the jejunum and ileum to the posterior abdominal wall and transmits their vessels, nerves, and lymphatics.",
    learningNote: "Mesentery anchors jejunum and ileum.", highYieldNote: "Mesentery is the peritoneal anchor of jejunum and ileum to posterior abdominal wall.", mnemonic: "🪢 JI is tied back by mesentery.",
    memoryAid: aid("Mesentery anchors the jejunum and ileum to the posterior abdominal wall.", "JI is tied back by mesentery.", ["🪢", "↩️"], "A tether to the back cues mesenteric attachment.", "NCBI Bookshelf: Small Intestine", "https://www.ncbi.nlm.nih.gov/books/NBK459366/"),
    sourceUrl: "https://www.ncbi.nlm.nih.gov/books/NBK459366/", finding: "Mesentery anchors jejunum and ileum to posterior abdominal wall."
  },
  {
    id: "anatomy-anatomy-all-pdf-p0493-q0128", page: 493,
    expectedStem: "ww The third part of the duodenum lies at which of the following vertebral levels:", expectedOptions: ["T12", "u 5%", "L4"],
    stem: "At which vertebral level does the third part of the duodenum lie?", options: ["T12", "L1", "L2", "L3", "L4"], correctOption: 3,
    explanation: "The horizontal third part of the duodenum crosses the posterior abdominal wall at L3. It passes anterior to the aorta and inferior vena cava and posterior to the superior mesenteric vessels.",
    learningNote: "Third duodenum: horizontal at L3.", highYieldNote: "Third part of duodenum crosses at L3, between SMA anteriorly and aorta/IVC posteriorly.", mnemonic: "3️⃣rd part at L3.",
    memoryAid: aid("The third, horizontal part of the duodenum lies at L3.", "Third part at L3.", ["3️⃣", "➡️"], "The matching threes cue horizontal duodenum at L3.", "NCBI Bookshelf: Small Intestine", "https://www.ncbi.nlm.nih.gov/books/NBK459366/"),
    sourceUrl: "https://www.ncbi.nlm.nih.gov/books/NBK459366/", finding: "The duodenum descends to L3; its third part is horizontal."
  },
  {
    id: "anatomy-anatomy-all-pdf-p0497-q0129", page: 497,
    expectedStem: "ww The lumbar plexus forms within which of the following muscles:", expectedOptions: ["Rectus abdominis 4%", "Pyramidalis 3%", "lliacus 5%", "Quadratus lumborum 7%"],
    stem: "The lumbar plexus forms within which muscle?", options: ["Rectus abdominis", "Pyramidalis", "Psoas major", "Iliacus", "Quadratus lumborum"], correctOption: 2,
    explanation: "The lumbar plexus forms from ventral rami of L1-L4 within psoas major. Its branches emerge around or traverse the psoas on the posterior abdominal wall.",
    learningNote: "Lumbar plexus: within psoas major.", highYieldNote: "Lumbar plexus forms within psoas major from L1-L4 ventral rami.", mnemonic: "💪 Psoas houses the lumbar plexus.",
    memoryAid: aid("The lumbar plexus forms within psoas major from L1-L4 ventral rami.", "Psoas houses the lumbar plexus.", ["💪", "⚡"], "A muscle enclosing nerves cues psoas major.", "NCBI Bookshelf: Posterior Abdominal Wall Nerves", "https://www.ncbi.nlm.nih.gov/books/NBK557605/"),
    sourceUrl: "https://www.ncbi.nlm.nih.gov/books/NBK557605/", finding: "Lumbar-plexus branches traverse or emerge from psoas major."
  },
  {
    id: "anatomy-anatomy-all-pdf-p0498-q0130", page: 498,
    expectedStem: "ww The ejaculatory ducts open into which of the following structures:", expectedOptions: ["Prostate 3%", "Preprostatic urethra 10%", "Prostatic urethra", "Spongy urethra 3%"],
    stem: "The ejaculatory ducts open into which structure?", options: ["Prostate", "Preprostatic urethra", "Prostatic urethra", "Membranous urethra", "Spongy urethra"], correctOption: 2,
    explanation: "Each ejaculatory duct is formed by union of the ductus deferens with the seminal-vesicle duct. The paired ducts open into the prostatic urethra at the verumontanum.",
    learningNote: "Ejaculatory ducts open into prostatic urethra.", highYieldNote: "Ejaculatory ducts enter the prostate and empty into prostatic urethra.", mnemonic: "🎯 Eject into prostate's urethra.",
    memoryAid: aid("The paired ejaculatory ducts open into the prostatic urethra at the verumontanum.", "Eject into prostate's urethra.", ["🎯", "➡️"], "A target inside the prostate cues the duct outlet.", "NCBI Bookshelf: Male Genitourinary Tract", "https://www.ncbi.nlm.nih.gov/books/NBK562291/"),
    sourceUrl: "https://www.ncbi.nlm.nih.gov/books/NBK562291/", finding: "Ejaculatory ducts empty into the prostatic urethra."
  },
  {
    id: "anatomy-anatomy-all-pdf-p0505-q0132", page: 505,
    expectedStem: "w The pancreas occupies which of the following abdominal regions:", expectedOptions: ["Left hypochondrium and left flank 1%", "Left hypochondrium 2%", "Left hypochondrium and epigastrium", "Epigastrium and umbilicus"],
    stem: "The pancreas occupies which abdominal regions?", options: ["Left hypochondrium and left flank", "Left hypochondrium", "Right hypochondrium and epigastrium", "Left hypochondrium and epigastrium", "Epigastrium and umbilicus"], correctOption: 3,
    explanation: "The pancreas extends from the duodenum to the spleen and lies in the epigastric and left hypochondriac regions. Its head and body are retroperitoneal.",
    learningNote: "Pancreas: epigastrium plus left hypochondrium.", highYieldNote: "Pancreas spans epigastric and left hypochondriac regions from duodenum toward spleen.", mnemonic: "⬅️ Pancreas stretches left from epigastrium.",
    memoryAid: aid("The pancreas lies in the epigastric and left hypochondriac regions.", "Pancreas stretches left from epigastrium.", ["⬅️", "🧩"], "A pancreatic piece stretching left cues the two regions.", "NCBI Bookshelf: Abdomen", "https://www.ncbi.nlm.nih.gov/books/NBK553104/"),
    sourceUrl: "https://www.ncbi.nlm.nih.gov/books/NBK553104/", finding: "The nine-region scheme lists pancreas in epigastrium and left hypochondrium."
  },
  {
    id: "anatomy-anatomy-all-pdf-p0511-q0134", page: 511,
    expectedStem: "The second part of the duodenum extends between which of the following vertebral levels:", expectedOptions: ["112-11", "L1-L2", "a2 = L2"],
    stem: "Between which vertebral levels does the second part of the duodenum extend?", options: ["T12-L1", "L1-L3", "L1-L2", "T12-L2", "L2-L3"], correctOption: 1,
    explanation: "The descending second part of the duodenum lies to the right of the midline and runs from about L1 to L3. The major duodenal papilla lies on its posteromedial wall.",
    learningNote: "Second duodenum: descends L1 to L3.", highYieldNote: "Descending second part of duodenum runs from L1 to L3 on the right of midline.", mnemonic: "⬇️ Second part descends L1→L3.",
    memoryAid: aid("The second, descending part of the duodenum extends from L1 to L3.", "Second part descends L1 to L3.", ["⬇️", "1️⃣", "3️⃣"], "Downward motion from one to three cues the descending segment.", "NCBI Bookshelf: Small Intestine", "https://www.ncbi.nlm.nih.gov/books/NBK459366/"),
    sourceUrl: "https://www.ncbi.nlm.nih.gov/books/NBK459366/", finding: "The duodenum runs from L1 down to L3."
  },
  {
    id: "anatomy-anatomy-all-pdf-p0512-q0135", page: 512,
    expectedStem: "ww Visceral afferent fibres from the testes usually travel to which of the following spinal cord levels: (v 10-14 40%", expectedOptions: ["9-112", "11-13 17%", "L2-L4 14%"],
    stem: "Visceral afferent fibres from the testes usually travel to which spinal cord levels?", options: ["T10-L1", "T9-T12", "L1-L3", "L2-L4", "S3-S4"], correctOption: 0,
    explanation: "The testes share their embryologic autonomic level with the kidneys. Most autonomic innervation is sympathetic from T10-L1, explaining referral of testicular pain to lower abdomen and groin.",
    learningNote: "Testicular visceral afferents: mainly T10-L1.", highYieldNote: "Testicular autonomic innervation is predominantly sympathetic from T10-L1.", mnemonic: "🔟➖1️⃣ Testis travels T10 to L1.",
    memoryAid: aid("Testicular autonomic innervation is predominantly sympathetic from T10-L1.", "Testis travels T10 to L1.", ["🔟", "1️⃣", "⬇️"], "A descent from T10 to L1 cues testicular levels.", "Patel 2017: Chronic Scrotal Pain Anatomy", "https://pmc.ncbi.nlm.nih.gov/articles/PMC5503924/"),
    sourceUrl: "https://pmc.ncbi.nlm.nih.gov/articles/PMC5503924/", finding: "Testicular autonomic innervation is 90% sympathetic from T10-L1."
  }
];

const restrictions = [
  {
    id: "anatomy-anatomy-all-pdf-p0500-q0131", page: 500,
    expectedStem: "Which of the following best describes the regions of the abdomen that the stomach occupies: @", expectedOptions: ["Left hypochondrium", "Epigastric, umbilical and left hypochondriac regions", "Epigastric region and left hypochondrium", "Epigastric and right and left hypochondriac regions"],
    stem: "Which statement best describes the abdominal regions occupied by the stomach?", options: ["Epigastric region", "Left hypochondrium", "Epigastric, umbilical and left hypochondriac regions", "Epigastric region and left hypochondrium", "Epigastric and right and left hypochondriac regions"],
    explanation: "The original page marks a three-region formulation. The reviewed external source does not precisely corroborate that exact formulation, so this record remains excluded from answer learning.",
    warning: "Source page reviewed, but the exact three-region stomach formulation is not precisely corroborated by the reviewed external anatomy source. This record remains excluded from answer learning.",
    sourceUrl: "https://www.ncbi.nlm.nih.gov/books/NBK553104/", finding: "The reviewed nine-region source does not precisely support the full source formulation."
  },
  {
    id: "anatomy-anatomy-all-pdf-p0506-q0133", page: 506,
    expectedStem: "ww Visceral afferent fibres from the descending and sigmoid colon travel to which of the following spinal cord segments:", expectedOptions: ["16-18 a", "T8- 110 oe (vi 12 41%", "L3-L4"],
    stem: "Visceral afferent fibres from the descending and sigmoid colon travel to which spinal cord segments?", options: ["T6-T8", "T8-T10", "T10-T12", "L1-L2", "L3-L4"],
    explanation: "The original page marks L1-L2 and identifies lumbar splanchnic nerves. A reviewed external anatomy source instead identifies pelvic-splanchnic visceral afferents from descending and sigmoid colon, so the exact pathway and segment formulation remains excluded.",
    warning: "Source page reviewed, but the source-marked lumbar-splanchnic L1-L2 formulation conflicts with the reviewed external pathway description for descending and sigmoid-colon visceral afferents. This record remains excluded from answer learning.",
    sourceUrl: "https://www.ncbi.nlm.nih.gov/books/NBK560504/", finding: "Pelvic splanchnic nerves carry visceral afferents from descending and sigmoid colon."
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
  Object.assign(draft, { stem: item.stem, options: item.options, correctOption: null, explanation: item.explanation, learningNote: "", status: "needs_review", askable: false, highYieldNote: undefined, mnemonic: undefined, memoryAid: undefined, warnings: [...new Set([...(draft.warnings ?? []), item.warning])] });
  restricted.push({ id: item.id, sourcePage: item.page, before, after: { stem: draft.stem, options: draft.options, correctOption: draft.correctOption, status: draft.status, askable: draft.askable, warnings: draft.warnings }, evidence: { externalSource: item.sourceUrl, externalFinding: item.finding } });
}
await writeFile(bankPath, `${source.slice(0, parsed.arrayStart)}${JSON.stringify(parsed.drafts)}${source.slice(parsed.end + 1)}`);
await mkdir(auditDir, { recursive: true });
await writeFile(path.join(auditDir, "applied-anatomy-batch-13.json"), `${JSON.stringify({ generatedAt: new Date().toISOString(), applied, restricted, automaticApproval: false, mockEligibility: "No restored OCR draft is mock eligible." }, null, 2)}\n`);
console.log(JSON.stringify({ restored: applied.map((row) => row.id), restricted: restricted.map((row) => row.id), automaticApproval: false }, null, 2));
