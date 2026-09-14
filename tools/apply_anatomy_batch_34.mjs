import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const bankPath = path.join(root, "client", "src", "lib", "ocrDraftSections.ts");
const snapshotPath = path.join(root, "docs", "audit", "anatomy-all-pdf-batch-34-ocr-records.json");
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
    "anatomy-anatomy-all-pdf-p1067-q0097",
    1067,
    "ww The inferior vena cava is formed from the union of the two common iliac veins at which of the following vertebral levels:",
    ["u 48%", "L3 6%", "L4 25%"],
    "The inferior vena cava is formed from the union of the two common iliac veins at which of the following vertebral levels:",
    ["L1", "L2", "L3", "L4", "L5"],
    4,
    "The inferior vena cava is formed by the union of the common iliac veins, usually at L5 just to the right of the midline.",
    "Iliac veins meet at L5.",
    aid("The inferior vena cava begins where the common iliac veins unite at L5.", "Iliac veins meet at L5.", ["🩸", "5️⃣"], "NCBI Bookshelf: Inferior Vena Cava", "https://www.ncbi.nlm.nih.gov/books/NBK482353/"),
    "https://www.ncbi.nlm.nih.gov/books/NBK482353/",
    "NCBI describes the inferior vena cava as the union of the common iliac veins at L5."
  ),
  restore(
    "anatomy-anatomy-all-pdf-p1076-q0099",
    1076,
    "Ld Within the pelvic cavity in women, the ureter is crossed anteriorly by which of the following structures:",
    ["Ovarian artery 8%", "Internal iliac artery 7%", "Round ligament 16%", "Uterine artery", "Inferior hypogastric artery 2%"],
    "Within the pelvic cavity in women, the ureter is crossed anteriorly by which of the following structures:",
    ["Ovarian artery", "Internal iliac artery", "Round ligament", "Uterine artery", "Inferior hypogastric artery"],
    3,
    "In the female pelvis, the uterine artery passes anterior to the distal ureter near the cervix.",
    "Uterine artery over ureter.",
    aid("The uterine artery crosses anterior to the distal ureter in the female pelvis.", "Uterine artery over ureter.", ["🌉", "💧"], "NCBI Bookshelf: Uterine Arteries", "https://www.ncbi.nlm.nih.gov/books/NBK482267/"),
    "https://www.ncbi.nlm.nih.gov/books/NBK482267/",
    "NCBI states that the uterine artery passes anterior to the distal ureter."
  ),
  restore(
    "anatomy-anatomy-all-pdf-p1079-q0100",
    1079,
    "The ovaries are supplied by the ovarian arteries, branches of which of the following:",
    ["Abdominal aorta", "Internal iliac artery 21% (x) uperior mesenteric artery 3%", "Coeliac trunk 2%", "Inferior mesenteric artery"],
    "The ovaries are supplied by the ovarian arteries, branches of which of the following:",
    ["Abdominal aorta", "Internal iliac artery", "Superior mesenteric artery", "Coeliac trunk", "Inferior mesenteric artery"],
    0,
    "The paired ovarian arteries arise directly from the abdominal aorta, usually below the renal arteries near L2.",
    "Ovarian arteries come straight from the aorta.",
    aid("Ovarian arteries are paired direct branches of the abdominal aorta, usually near L2.", "Ovarian arteries come straight from the aorta.", ["🩸", "2️⃣"], "NCBI Bookshelf: Ovary", "https://www.ncbi.nlm.nih.gov/books/NBK545187/"),
    "https://www.ncbi.nlm.nih.gov/books/NBK545187/",
    "NCBI identifies the ovarian artery as a paired direct branch of the abdominal aorta."
  ),
  restore(
    "anatomy-anatomy-all-pdf-p1082-q0101",
    1082,
    "Ad A55 year old woman presents to ED complaining of severe colicky loin to groin pain. Imaging shows renal calculi. At which of the following locations is the calculus likely to lodge: (x) Where the ureter is crossed by the uterine artery 13%",
    ["Where the ureter is crossed by the vas deferens 5%", "Where the ureter crosses the common iliac vessels", "At the level the inferior mesenteric artery arises from the abdominal aorta 4%", "Approximately 5 cm superior to the pelvic brim 14%"],
    "A 55 year old woman presents to ED complaining of severe colicky loin to groin pain. Imaging shows renal calculi. At which of the following locations is the calculus likely to lodge:",
    ["Where the ureter is crossed by the uterine artery", "Where the ureter is crossed by the vas deferens", "Where the ureter crosses the common iliac vessels", "At the level the inferior mesenteric artery arises from the abdominal aorta", "Approximately 5 cm superior to the pelvic brim"],
    2,
    "Ureteric stones commonly lodge at the ureteropelvic junction, pelvic brim, and ureterovesical junction; the ureter crosses the iliac vessels at the pelvic brim.",
    "UPJ, pelvic brim, UVJ: three stone stops.",
    aid("The pelvic brim where the ureter crosses the iliac vessels is a common ureteric-stone impaction site.", "UPJ, pelvic brim, UVJ: three stone stops.", ["🪨", "📍"], "NCBI Bookshelf: Ureterolithiasis", "https://www.ncbi.nlm.nih.gov/books/NBK560674/"),
    "https://www.ncbi.nlm.nih.gov/books/NBK560674/",
    "NCBI identifies the pelvic brim, along with UPJ and UVJ, as a common ureteric-stone impaction site."
  ),
  restore(
    "anatomy-anatomy-all-pdf-p1083-q0102",
    1083,
    "ww A 49 year old man presents to ED with a few months history of abdominal pain, weight loss and jaundice. Imaging shows a tumour in the uncinate process of the pancreas. Which of the following structures is most likely compressed by this tumour:",
    ["Cystic duct 19%", "Superior mesenteric artery", "Portal vein 16%", "Splenic artery 6%"],
    "A 49 year old man presents to ED with a few months history of abdominal pain, weight loss and jaundice. Imaging shows a tumour in the uncinate process of the pancreas. Which of the following structures is most likely compressed by this tumour:",
    ["Cystic duct", "Main pancreatic duct", "Superior mesenteric artery", "Portal vein", "Splenic artery"],
    2,
    "The uncinate process lies posterior to the superior mesenteric artery and vessels, so a tumour there can involve the superior mesenteric artery.",
    "Uncinate sits behind the SMA.",
    aid("The pancreatic uncinate process lies posterior to the superior mesenteric artery and vessels.", "Uncinate sits behind the SMA.", ["🌀", "🩸"], "NCBI Bookshelf: Superior Mesenteric Artery", "https://www.ncbi.nlm.nih.gov/books/NBK519560/"),
    "https://www.ncbi.nlm.nih.gov/books/NBK519560/",
    "NCBI places the uncinate process posterior to the superior mesenteric artery."
  ),
  restore(
    "anatomy-anatomy-all-pdf-p1088-q0103",
    1088,
    "ww Posteriorly the spleen lies in the region of which of the following:",
    ["Ribs 7 and 8 2%", "Ribs 8 - 10 5%", "Ribs 9 - 11", "Ribs 10 - 12 56%", "Below the costal margin 2%"],
    "Posteriorly the spleen lies in the region of which of the following:",
    ["Ribs 7 and 8", "Ribs 8 - 10", "Ribs 9 - 11", "Ribs 10 - 12", "Below the costal margin"],
    2,
    "The spleen occupies the left hypochondrium and typically spans ribs 9 to 11.",
    "Spleen spans nine through eleven.",
    aid("The spleen typically spans the ninth through eleventh ribs in the left hypochondrium.", "Spleen spans nine through eleven.", ["🫀", "9️⃣", "1️⃣1️⃣"], "NCBI Bookshelf: Spleen", "https://www.ncbi.nlm.nih.gov/books/NBK482235/"),
    "https://www.ncbi.nlm.nih.gov/books/NBK482235/",
    "NCBI describes the spleen as typically spanning ribs 9 through 11."
  ),
  restore(
    "anatomy-anatomy-all-pdf-p1092-q0104",
    1092,
    "A 65 year old man presents to ED complaining of abdominal pain, jaundice and weight loss. Imaging shows a tumour of the head of the pancreas. Which of the following structures is most likely compressed by this tumour:",
    ["Common hepatic duct", "Left hepatic duct 3%", "Cystic duct 6%", "Accessory pancreatic duct 6%"],
    "A 65 year old man presents to ED complaining of abdominal pain, jaundice and weight loss. Imaging shows a tumour of the head of the pancreas. Which of the following structures is most likely compressed by this tumour:",
    ["Common hepatic duct", "Left hepatic duct", "Cystic duct", "Accessory pancreatic duct", "Common bile duct"],
    4,
    "A pancreatic-head tumour commonly causes jaundice by obstructing the distal common bile duct.",
    "Pancreatic head blocks the common bile duct.",
    aid("Pancreatic-head tumours commonly obstruct the distal common bile duct and cause obstructive jaundice.", "Pancreatic head blocks the common bile duct.", ["🟡", "🚧"], "NCBI Bookshelf: Pancreatic Cancer", "https://www.ncbi.nlm.nih.gov/books/NBK518996/"),
    "https://www.ncbi.nlm.nih.gov/books/NBK518996/",
    "NCBI identifies common-bile-duct obstruction from pancreatic-head tumour as a usual cause of painless jaundice."
  ),
  restore(
    "anatomy-anatomy-all-pdf-p1095-q0105",
    1095,
    "The iliohypogastric nerve supplies skin over which of the following regions:",
    ["Posterolateral gluteal region", "Medial thigh 12%", "Lateral thigh 4%", "Posteromedial gluteal region 17%"],
    "The iliohypogastric nerve supplies skin over which of the following regions:",
    ["Posterolateral gluteal region", "Medial thigh", "Lateral thigh", "Posteromedial gluteal region", "Upper anterior thigh"],
    0,
    "The iliohypogastric nerve gives a lateral cutaneous branch to the posterolateral gluteal skin and contributes sensory fibres to the pubic region.",
    "Iliohypogastric reaches the posterolateral gluteal skin.",
    aid("The iliohypogastric nerve supplies posterolateral gluteal skin through its lateral cutaneous branch.", "Iliohypogastric reaches the posterolateral gluteal skin.", ["📍", "🍑"], "NCBI Bookshelf: Lumbar Plexus", "https://www.ncbi.nlm.nih.gov/books/NBK545137/"),
    "https://www.ncbi.nlm.nih.gov/books/NBK545137/",
    "NCBI identifies lateral gluteal sensory input from iliohypogastric nerve; peer-reviewed anatomy specifies posterior gluteal skin."
  ),
  restore(
    "anatomy-anatomy-all-pdf-p1100-q0106",
    1100,
    "wy? Which of the following nerves transmits the parasympathetic supply to the stomach: (x) Greater thoracic splanchnic nerves 6%",
    ["Lesser thoracic splanchnic nerves 8%", "Lumbar splanchnic nerves 5%", "Pelvic splanchnic nerves 2%"],
    "Which of the following nerves transmits the parasympathetic supply to the stomach:",
    ["Greater thoracic splanchnic nerves", "Lesser thoracic splanchnic nerves", "Lumbar splanchnic nerves", "Pelvic splanchnic nerves", "Vagus nerves"],
    4,
    "The vagus nerve supplies the stomach’s parasympathetic innervation through anterior and posterior vagal fibres.",
    "Vagus gives the stomach its parasympathetic supply.",
    aid("The vagus nerves provide parasympathetic innervation to the stomach through anterior and posterior vagal fibres.", "Vagus gives the stomach its parasympathetic supply.", ["🧠", "🍽️"], "NCBI Bookshelf: Stomach", "https://www.ncbi.nlm.nih.gov/books/NBK482334/"),
    "https://www.ncbi.nlm.nih.gov/books/NBK482334/",
    "NCBI identifies anterior and posterior vagal fibres as the stomach’s parasympathetic supply."
  ),
];

const restrictions = [
  {
    id: "anatomy-anatomy-all-pdf-p1071-q0098",
    page: 1071,
    expectedStem: "A patient with known inflammatory bowel disease presents to ED complaining of severe abdominal pain and diarrhoea. Imaging shows a flare up primarily affecting the rectum. Which of the following nerves is most likely responsible for transmission of pain from the rectum:",
    expectedOptions: ["Lumbar splanchnic nerves", "Sacral splanchnic nerves", "Vagus nerves Pudendal nerves 59%"],
    stem: "A patient with known inflammatory bowel disease presents to ED complaining of severe abdominal pain and diarrhoea. Imaging shows a flare up primarily affecting the rectum. Which of the following nerves is most likely responsible for transmission of pain from the rectum:",
    options: ["Pelvic splanchnic nerves", "Lumbar splanchnic nerves", "Sacral splanchnic nerves", "Vagus nerves", "Pudendal nerves"],
    warning: "Source page reviewed, but the generic rectal-pain stem does not localize the visceral-afferent pathway sufficiently to make the displayed pelvic-splanchnic key unique; no correct option is inferred.",
    sourceUrl: "https://www.ncbi.nlm.nih.gov/books/NBK560504/",
    finding: "Authoritative sources describe rectal visceral afferents through more than one splanchnic pathway depending on rectal region and context."
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
  path.join(auditDir, "applied-anatomy-batch-34.json"),
  `${JSON.stringify({ generatedAt: new Date().toISOString(), applied, restricted, automaticApproval: false, mockEligibility: "No restored OCR draft is mock eligible." }, null, 2)}\n`
);
console.log(JSON.stringify({ restored: applied.length, restricted: restricted.length, automaticApproval: false }, null, 2));
