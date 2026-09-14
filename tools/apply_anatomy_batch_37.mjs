import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const bankPath = path.join(root, "client", "src", "lib", "ocrDraftSections.ts");
const snapshotPath = path.join(root, "docs", "audit", "anatomy-all-pdf-batch-37-ocr-records.json");
const auditDir = path.join(root, "docs", "audit");
const reviewedWarning = "Source page and external anatomy reference reviewed; remains an unapproved OCR draft.";

const aid = (coreFact, mnemonic, emojiCues, sourceLabel, sourceUrl) => ({
  coreFact,
  mnemonic,
  emojiCues,
  cueLabel: "Source-confirmed anatomy fact",
  sourceLabel,
  sourceUrl,
});

const restore = (id, page, expectedStem, expectedOptions, stem, options, correctOption, fact, mnemonic, memoryAid, sourceUrl, finding) => ({
  id,
  page,
  expectedStem,
  expectedOptions,
  stem,
  options,
  correctOption,
  fact,
  mnemonic,
  memoryAid,
  sourceUrl,
  finding,
});

const restorations = [
  restore(
    "anatomy-anatomy-all-pdf-p1176-q0128",
    1176,
    "ww The third part of the duodenum lies at which of the following vertebral levels:",
    ["T12", "u 5%", "L4"],
    "The third part of the duodenum lies at which of the following vertebral levels:",
    ["T12", "L1", "L2", "L3", "L4"],
    3,
    "The third, horizontal part of the duodenum lies at the L3 vertebral level and passes from right to left anterior to the aorta and inferior vena cava.",
    "D3 is horizontal at L3.",
    aid("The third, horizontal part of the duodenum is at L3.", "D3 is horizontal at L3.", ["3️⃣", "↔️"], "NCBI Bookshelf: Duodenal Trauma", "https://www.ncbi.nlm.nih.gov/books/NBK585130/"),
    "https://www.ncbi.nlm.nih.gov/books/NBK585130/",
    "NCBI states that the third portion of the duodenum is the horizontal part at the L3 vertebral level."
  ),
  restore(
    "anatomy-anatomy-all-pdf-p1180-q0129",
    1180,
    "ww The lumbar plexus forms within which of the following muscles:",
    ["Rectus abdominis 4%", "Pyramidalis 3%", "lliacus 5%", "Quadratus lumborum 7%"],
    "The lumbar plexus forms within which of the following muscles:",
    ["Rectus abdominis", "Pyramidalis", "Psoas major", "Iliacus", "Quadratus lumborum"],
    2,
    "The lumbar plexus embeds in the posterior aspect of psoas major before its branches emerge around the muscle.",
    "Lumbar plexus hides in psoas major.",
    aid("The lumbar plexus is embedded in the posterior aspect of psoas major.", "Lumbar plexus hides in psoas major.", ["🧶", "💪"], "NCBI Bookshelf: Lumbar Plexus", "https://www.ncbi.nlm.nih.gov/books/NBK545137/"),
    "https://www.ncbi.nlm.nih.gov/books/NBK545137/",
    "NCBI states that the lumbar plexus embeds itself in the posterior aspect of psoas major."
  ),
  restore(
    "anatomy-anatomy-all-pdf-p1181-q0130",
    1181,
    "ww The ejaculatory ducts open into which of the following structures:",
    ["Prostate 3%", "Preprostatic urethra 10%", "Prostatic urethra", "Spongy urethra 3%"],
    "The ejaculatory ducts open into which of the following structures:",
    ["Prostate", "Preprostatic urethra", "Prostatic urethra", "Membranous urethra", "Spongy urethra"],
    2,
    "The paired ejaculatory ducts open into the prostatic urethra at the verumontanum, on either side of the prostatic utricle.",
    "Ejaculation enters the prostatic urethra.",
    aid("Ejaculatory ducts open into the prostatic urethra at the verumontanum.", "Ejaculation enters the prostatic urethra.", ["➡️", "🧪"], "NCBI Bookshelf: Seminal Vesicle", "https://www.ncbi.nlm.nih.gov/books/NBK499854/"),
    "https://www.ncbi.nlm.nih.gov/books/NBK499854/",
    "NCBI states that the ejaculatory ducts open into the prostatic urethra at the verumontanum."
  ),
  restore(
    "anatomy-anatomy-all-pdf-p1188-q0132",
    1188,
    "w The pancreas occupies which of the following abdominal regions:",
    ["Left hypochondrium and left flank 1%", "Left hypochondrium 2%", "Left hypochondrium and epigastrium", "Epigastrium and umbilicus"],
    "The pancreas occupies which of the following abdominal regions:",
    ["Left hypochondrium and left flank", "Left hypochondrium", "Right hypochondrium and epigastrium", "Left hypochondrium and epigastrium", "Epigastrium and umbilicus"],
    3,
    "The pancreas occupies the epigastric and left hypochondriac regions as it extends transversely from the duodenum toward the spleen.",
    "Pancreas spans epigastrium to left hypochondrium.",
    aid("The pancreas is listed in both the epigastric and left hypochondriac regions.", "Pancreas spans epigastrium to left hypochondrium.", ["↔️", "🟨"], "NCBI Bookshelf: Abdomen", "https://www.ncbi.nlm.nih.gov/books/NBK553104/"),
    "https://www.ncbi.nlm.nih.gov/books/NBK553104/",
    "NCBI’s nine-region account lists the pancreas in both the epigastrium and left hypochondrium."
  ),
  restore(
    "anatomy-anatomy-all-pdf-p1194-q0134",
    1194,
    "The second part of the duodenum extends between which of the following vertebral levels:",
    ["112-11", "L1-L2", "a2 = L2"],
    "The second part of the duodenum extends between which of the following vertebral levels:",
    ["T12 - L1", "L1 - L3", "L1 - L2", "T12 - L2", "L2 - L3"],
    1,
    "The second, descending part of the duodenum extends from the superior duodenal flexure at L1 to the inferior duodenal flexure at L3.",
    "D2 descends from L1 to L3.",
    aid("The second, descending part of the duodenum extends from L1 to L3.", "D2 descends from L1 to L3.", ["2️⃣", "⬇️"], "PMC: Duodenum Review", "https://pmc.ncbi.nlm.nih.gov/articles/PMC7315055/"),
    "https://pmc.ncbi.nlm.nih.gov/articles/PMC7315055/",
    "A peer-reviewed radiology review states that the second part extends from the superior flexure at L1 to the inferior flexure at L3."
  ),
  restore(
    "anatomy-anatomy-all-pdf-p1195-q0135",
    1195,
    "ww Visceral afferent fibres from the testes usually travel to which of the following spinal cord levels: (v 10-14 40%",
    ["9-112", "11-13 17%", "L2-L4 14%"],
    "Visceral afferent fibres from the testes usually travel to which of the following spinal cord levels:",
    ["T10 - L1", "T9 - T12", "L1 - L3", "L2 - L4", "S3, S4"],
    0,
    "Testicular autonomic innervation is predominantly sympathetic from T10 to L1, while a smaller parasympathetic contribution arises from S2 to S4; the source's “usually” wording reflects the predominant T10-L1 pathway.",
    "Testes usually trace back to T10-L1.",
    aid("Testicular autonomic innervation is predominantly sympathetic from T10 to L1, with smaller parasympathetic input from S2 to S4.", "Testes usually trace back to T10-L1.", ["🔟", "1️⃣"], "PMC: Chronic Scrotal Pain Anatomy Review", "https://pmc.ncbi.nlm.nih.gov/articles/PMC5503924/"),
    "https://pmc.ncbi.nlm.nih.gov/articles/PMC5503924/",
    "A peer-reviewed review reports that 90% of testicular autonomic innervation is sympathetic from T10-L1, with the remainder parasympathetic from S2-S4."
  ),
  restore(
    "anatomy-anatomy-all-pdf-p1197-q0137",
    1197,
    "ww Regarding the relations of the uterus, which of the following statements is INCORRECT:",
    ["The vagina is inferior to the uterus. 6%", "The broad ligament is lateral to the uterus. 4%", "The vesicouterine pouch is anterior to the uterus. 12%", "The pouch of Douglas is anterior to the uterus. (x) The small intestine is superior to the uterus. 4%"],
    "Regarding the relations of the uterus, which of the following statements is INCORRECT:",
    ["The vagina is inferior to the uterus.", "The broad ligament is lateral to the uterus.", "The vesicouterine pouch is anterior to the uterus.", "The pouch of Douglas is anterior to the uterus.", "The small intestine is superior to the uterus."],
    3,
    "The uterus is anterior to the rectum and posterior to the bladder; therefore the rectouterine pouch of Douglas lies posterior to the uterus, making the statement that it is anterior incorrect.",
    "Douglas is posterior to the uterus.",
    aid("The pouch of Douglas is the rectouterine pouch posterior to the uterus and anterior to the rectum.", "Douglas is posterior to the uterus.", ["⬅️", "↩️"], "NCBI Bookshelf: Uterus", "https://www.ncbi.nlm.nih.gov/books/NBK470297/"),
    "https://www.ncbi.nlm.nih.gov/books/NBK470297/",
    "NCBI states that the uterus lies anterior to the rectum, corroborating that the rectouterine pouch of Douglas is posterior rather than anterior to the uterus."
  ),
];

const restrictions = [
  {
    id: "anatomy-anatomy-all-pdf-p1183-q0131",
    page: 1183,
    expectedStem: "Which of the following best describes the regions of the abdomen that the stomach occupies: @",
    expectedOptions: ["Left hypochondrium", "Epigastric, umbilical and left hypochondriac regions", "Epigastric region and left hypochondrium", "Epigastric and right and left hypochondriac regions"],
    stem: "Which of the following best describes the regions of the abdomen that the stomach occupies:",
    options: ["Epigastric region", "Left hypochondrium", "Epigastric, umbilical and left hypochondriac regions", "Epigastric region and left hypochondrium", "Epigastric and right and left hypochondriac regions"],
    warning: "Source page reviewed, but authoritative regional anatomy references do not directly corroborate the source's exact inclusion of the umbilical region; the three-region formulation is not safely inferred.",
    sourceUrl: "https://www.ncbi.nlm.nih.gov/books/NBK553104/",
    finding: "NCBI places the stomach in the epigastrium and upper central/left abdomen but does not directly support the exact epigastric-umbilical-left-hypochondriac formulation."
  },
  {
    id: "anatomy-anatomy-all-pdf-p1189-q0133",
    page: 1189,
    expectedStem: "ww Visceral afferent fibres from the descending and sigmoid colon travel to which of the following spinal cord segments:",
    expectedOptions: ["16-18 a", "T8- 110 oe (vi 12 41%", "L3-L4"],
    stem: "Visceral afferent fibres from the descending and sigmoid colon travel to which of the following spinal cord segments:",
    options: ["T6 - T8", "T8 - T10", "T10 - T12", "L1 - L2", "L3 - L4"],
    warning: "Source page reviewed, but authoritative evidence documents both sympathetic and pelvic parasympathetic visceral-afferent pathways to the descending and sigmoid colon; the unqualified L1-L2 formulation is not safely inferred.",
    sourceUrl: "https://www.ncbi.nlm.nih.gov/books/NBK560504/",
    finding: "NCBI documents separate sympathetic and pelvic splanchnic pathways, including S2-S4 pelvic splanchnic innervation to the descending and sigmoid colon, so the stem does not identify a unique pathway."
  },
  {
    id: "anatomy-anatomy-all-pdf-p1196-q0136",
    page: 1196,
    expectedStem: "ww The rectovesical fascia is located at which of the following sites:",
    expectedOptions: ["Between the ampulla of the rectum and the sacrum 1%", "Between the fundus of the bladder and the ampulla of the rectum (x) Between the rectum and the posterior fornix and cervix 4%", "Between the rectum and the seminal vesicle 9%", "Between the sigmoid colon and the rectum 3%"],
    stem: "The rectovesical fascia is located at which of the following sites:",
    options: ["Between the ampulla of the rectum and the sacrum", "Between the fundus of the bladder and the ampulla of the rectum", "Between the rectum and the posterior fornix and cervix", "Between the rectum and the seminal vesicle", "Between the sigmoid colon and the rectum"],
    warning: "Source page reviewed, but current references describe the rectovesical pouch and a fascial plane between the rectum, prostate, and seminal vesicles without directly corroborating the source's rectovesical-fascia name and exact fundus-to-ampulla formulation.",
    sourceUrl: "https://www.ncbi.nlm.nih.gov/books/NBK537245/",
    finding: "NCBI documents the rectovesical pouch and an anterior fascial plane between rectum, prostate, and seminal vesicles, but does not directly verify the source's named fascia and exact location."
  },
];

function parse(source) {
  const prefix = "export const ocrDraftQuestions: OcrDraftQuestion[] = ";
  const arrayStart = source.indexOf(prefix) + prefix.length;
  const end = source.indexOf("];", arrayStart);
  if (arrayStart < prefix.length || end < 0) throw new Error("OCR draft export not found");
  return { arrayStart, end, drafts: JSON.parse(source.slice(arrayStart, end + 1)) };
}

function snapshot(draft) {
  return {
    stem: draft.stem,
    options: draft.options,
    correctOption: draft.correctOption,
    status: draft.status,
    askable: draft.askable,
    needsImage: draft.needsImage,
    warnings: draft.warnings ?? [],
    memoryAid: draft.memoryAid ?? null,
  };
}

function guard(draft, original, item) {
  const optionsMatch = (value, expected) => JSON.stringify(value) === JSON.stringify(expected);
  if (
    !draft ||
    !original ||
    draft.id !== item.id ||
    original.id !== item.id ||
    draft.sourcePage !== item.page ||
    original.sourcePage !== item.page ||
    draft.stem !== item.expectedStem ||
    original.stem !== item.expectedStem ||
    !optionsMatch(draft.options, item.expectedOptions) ||
    !optionsMatch(original.options, item.expectedOptions)
  ) {
    throw new Error(`Immutable literal drift check failed: ${item.id}`);
  }
}

const source = await readFile(bankPath, "utf8");
const parsed = parse(source);
const immutable = JSON.parse(await readFile(snapshotPath, "utf8")).records;
const byId = new Map(parsed.drafts.map((draft) => [draft.id, draft]));
const originals = new Map(immutable.map((record) => [record.id, record]));
const applied = [];
const restricted = [];

for (const item of restorations) {
  const draft = byId.get(item.id);
  const original = originals.get(item.id);
  guard(draft, original, item);
  const before = snapshot(draft);
  Object.assign(draft, {
    stem: item.stem,
    options: item.options,
    correctOption: item.correctOption,
    explanation: item.fact,
    learningNote: item.fact,
    highYieldNote: item.fact,
    mnemonic: item.mnemonic,
    memoryAid: item.memoryAid,
    status: "ocr_draft",
    askable: true,
    needsImage: false,
    warnings: [reviewedWarning],
  });
  delete draft.approved;
  applied.push({
    id: item.id,
    sourcePage: item.page,
    before,
    after: snapshot(draft),
    evidence: { externalSource: item.sourceUrl, externalFinding: item.finding },
  });
}

for (const item of restrictions) {
  const draft = byId.get(item.id);
  const original = originals.get(item.id);
  guard(draft, original, item);
  const before = snapshot(draft);
  Object.assign(draft, {
    stem: item.stem,
    options: item.options,
    correctOption: null,
    explanation: item.finding,
    learningNote: "",
    highYieldNote: "",
    mnemonic: "",
    status: "needs_review",
    askable: false,
    needsImage: false,
    warnings: [item.warning],
  });
  delete draft.memoryAid;
  delete draft.approved;
  restricted.push({
    id: item.id,
    sourcePage: item.page,
    before,
    after: snapshot(draft),
    evidence: { externalSource: item.sourceUrl, externalFinding: item.finding },
  });
}

await writeFile(bankPath, `${source.slice(0, parsed.arrayStart)}${JSON.stringify(parsed.drafts)}${source.slice(parsed.end + 1)}`);
await mkdir(auditDir, { recursive: true });
await writeFile(
  path.join(auditDir, "applied-anatomy-batch-37.json"),
  `${JSON.stringify({ generatedAt: new Date().toISOString(), applied, restricted, automaticApproval: false, mockEligibility: "No restored OCR draft is mock eligible." }, null, 2)}\n`
);
console.log(JSON.stringify({ restored: applied.length, restricted: restricted.length, automaticApproval: false }, null, 2));
