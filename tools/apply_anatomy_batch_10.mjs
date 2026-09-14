/** Guarded Anatomy Batch 10 restoration; this script never approves OCR records. */
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
    id: "anatomy-anatomy-all-pdf-p0377-q0095", page: 377,
    expectedStem: "Pain in the jejunum and ileum is typically referred to which of the following regions:", expectedOptions: ["Flank 5", "Epigastrium 1%", "Left upper quadrant 8%", "Right lower quadrant 9%", "Umbilical region"],
    stem: "Pain from the jejunum and ileum is typically referred to which region?",
    options: ["Flank", "Epigastrium", "Left upper quadrant", "Right lower quadrant", "Umbilical region"], correctOption: 4,
    explanation: "Jejunum and ileum are midgut structures. Visceral pain from the midgut is classically referred to the umbilical region.",
    learningNote: "Midgut visceral pain refers to the umbilical region.",
    highYieldNote: "Pain map: foregut to epigastrium, midgut to umbilicus, hindgut to the pubic region.",
    mnemonic: "🌀 Midgut meets the umbilicus.",
    memoryAid: aid("Jejunum and ileum are midgut structures, so their visceral pain is referred to the umbilical region.", "Midgut meets the umbilicus.", ["🌀", "⭕"], "The midgut spiral points to the umbilicus.", "NCBI Bookshelf: Abdomen", "https://www.ncbi.nlm.nih.gov/books/NBK553104/"),
    sourceUrl: "https://www.ncbi.nlm.nih.gov/books/NBK553104/", finding: "Midgut pain is referred to the umbilicus."
  },
  {
    id: "anatomy-anatomy-all-pdf-p0380-q0096", page: 380,
    expectedStem: "The psoas major muscle is innervated by which of the following:", expectedOptions: ["lliohypogastric nerve", "Femoral nerve 7h", "Anterior rami of L2 - L4"],
    stem: "The psoas major muscle is innervated by which of the following?",
    options: ["Iliohypogastric nerve", "Ilioinguinal nerve", "Anterior rami of L1-L3", "Femoral nerve", "Anterior rami of L2-L4"], correctOption: 2,
    explanation: "Psoas major receives innervation from short collateral branches of the lumbar plexus arising from L1-L3. The femoral nerve supplies iliacus rather than psoas major.",
    learningNote: "Psoas major: direct lumbar-plexus branches from L1-L3.",
    highYieldNote: "Iliopsoas split: psoas major L1-L3; iliacus femoral nerve L2-L4.",
    mnemonic: "1️⃣2️⃣3️⃣ Psoas counts L1 to L3.",
    memoryAid: aid("Short collateral branches of the lumbar plexus L1-L3 innervate psoas major; the femoral nerve innervates iliacus.", "Psoas counts L1 to L3.", ["1️⃣", "2️⃣", "3️⃣"], "Count three lumbar roots for psoas major.", "NCBI Bookshelf: Iliopsoas Muscle", "https://www.ncbi.nlm.nih.gov/books/NBK531508/"),
    sourceUrl: "https://www.ncbi.nlm.nih.gov/books/NBK531508/", finding: "Short collateral branches L1-L3 innervate psoas major."
  },
  {
    id: "anatomy-anatomy-all-pdf-p0384-q0097", page: 384,
    expectedStem: "ww The inferior vena cava is formed from the union of the two common iliac veins at which of the following vertebral levels:", expectedOptions: ["u 48%", "L3 6%", "L4 25%"],
    stem: "At which vertebral level is the inferior vena cava formed by union of the common iliac veins?",
    options: ["L1", "L2", "L3", "L4", "L5"], correctOption: 4,
    explanation: "The right and left common iliac veins unite to form the inferior vena cava, usually at the L5 vertebral level.",
    learningNote: "IVC begins at L5 where the common iliac veins unite.",
    highYieldNote: "IVC formation: right and left common iliac veins unite at L5.",
    mnemonic: "5️⃣ Iliac five makes the IVC arrive.",
    memoryAid: aid("The inferior vena cava is formed by union of the right and left common iliac veins at L5.", "Iliac five makes the IVC arrive.", ["5️⃣", "🫀"], "Five marks the iliac-vein confluence.", "NCBI Bookshelf: Inferior Vena Cava", "https://www.ncbi.nlm.nih.gov/books/NBK482353/"),
    sourceUrl: "https://www.ncbi.nlm.nih.gov/books/NBK482353/", finding: "The common iliac veins form the IVC at L5."
  },
  {
    id: "anatomy-anatomy-all-pdf-p0388-q0098", page: 388,
    expectedStem: "A patient with known inflammatory bowel disease presents to ED complaining of severe abdominal pain and diarrhoea. Imaging shows a flare up primarily affecting the rectum. Which of the following nerves is most likely responsible for transmission of pain from the rectum:", expectedOptions: ["Lumbar splanchnic nerves", "Sacral splanchnic nerves", "Vagus nerves Pudendal nerves 59%"],
    stem: "A patient has an inflammatory-bowel-disease flare affecting the rectum. Which nerves are most likely responsible for visceral pain transmission from the rectum?",
    options: ["Pelvic splanchnic nerves", "Lumbar splanchnic nerves", "Sacral splanchnic nerves", "Vagus nerves", "Pudendal nerves"], correctOption: 0,
    explanation: "Pelvic splanchnic nerves from S2-S4 carry parasympathetic and visceral-afferent fibers that supply the rectum. Pudendal nerves provide somatic supply to the anal canal below the pectinate line.",
    learningNote: "Pelvic splanchnic nerves S2-S4 carry visceral afferents from the rectum.",
    highYieldNote: "Rectal visceral afferents: pelvic splanchnic nerves, S2-S4.",
    mnemonic: "🩻 S2-4 sends pelvic signals.",
    memoryAid: aid("Pelvic splanchnic nerves from S2-S4 carry visceral-afferent sensory fibers supplying the rectum.", "S2-4 sends pelvic signals.", ["🩻", "2️⃣", "4️⃣"], "Sacral roots two to four cue pelvic splanchnic nerves.", "NCBI Bookshelf: Splanchnic Nerves", "https://www.ncbi.nlm.nih.gov/books/NBK560504/"),
    sourceUrl: "https://www.ncbi.nlm.nih.gov/books/NBK560504/", finding: "Pelvic splanchnic nerves carry visceral afferents supplying the rectum."
  },
  {
    id: "anatomy-anatomy-all-pdf-p0393-q0099", page: 393,
    expectedStem: "Ld Within the pelvic cavity in women, the ureter is crossed anteriorly by which of the following structures:", expectedOptions: ["Ovarian artery 8%", "Internal iliac artery 7%", "Round ligament 16%", "Uterine artery", "Inferior hypogastric artery 2%"],
    stem: "Within the female pelvic cavity, the ureter is crossed anteriorly by which structure?",
    options: ["Ovarian artery", "Internal iliac artery", "Round ligament", "Uterine artery", "Inferior hypogastric artery"], correctOption: 3,
    explanation: "The uterine artery passes anterior to the distal ureter near the cervix. This relationship is commonly remembered as water under the bridge.",
    learningNote: "Uterine artery crosses anterior to the distal ureter.",
    highYieldNote: "Female ureter: uterine artery passes anteriorly near the cervix.",
    mnemonic: "💧 Under the bridge: ureter under uterine artery.",
    memoryAid: aid("The uterine artery passes anterior to the distal ureter in the female pelvis.", "Water runs under the uterine-artery bridge.", ["💧", "🌉"], "Water under a bridge cues ureter beneath uterine artery.", "NCBI Bookshelf: Uterine Arteries", "https://www.ncbi.nlm.nih.gov/books/NBK482267/"),
    sourceUrl: "https://www.ncbi.nlm.nih.gov/books/NBK482267/", finding: "The uterine artery passes anterior to the distal ureter."
  },
  {
    id: "anatomy-anatomy-all-pdf-p0396-q0100", page: 396,
    expectedStem: "The ovaries are supplied by the ovarian arteries, branches of which of the following:", expectedOptions: ["Abdominal aorta", "Internal iliac artery 21% (x) uperior mesenteric artery 3%", "Coeliac trunk 2%", "Inferior mesenteric artery"],
    stem: "The ovaries are supplied by ovarian arteries, which are branches of which vessel?",
    options: ["Abdominal aorta", "Internal iliac artery", "Superior mesenteric artery", "Coeliac trunk", "Inferior mesenteric artery"], correctOption: 0,
    explanation: "The ovarian arteries are direct branches of the abdominal aorta. They anastomose with ascending branches of the uterine arteries.",
    learningNote: "Ovarian arteries are direct branches of the abdominal aorta.",
    highYieldNote: "Ovary: direct aortic ovarian artery plus uterine-artery anastomosis.",
    mnemonic: "🅰️ Aortic artery goes to the ovary.",
    memoryAid: aid("The ovarian artery is a direct branch of the abdominal aorta and anastomoses with the uterine artery.", "Aortic artery goes to the ovary.", ["🅰️", "🥚"], "A for aorta points to the ovarian artery.", "NCBI Bookshelf: Uterine Arteries", "https://www.ncbi.nlm.nih.gov/books/NBK482267/"),
    sourceUrl: "https://www.ncbi.nlm.nih.gov/books/NBK482267/", finding: "The ovarian artery is a direct branch of the abdominal aorta."
  },
  {
    id: "anatomy-anatomy-all-pdf-p0399-q0101", page: 399,
    expectedStem: "Ad A55 year old woman presents to ED complaining of severe colicky loin to groin pain. Imaging shows renal calculi. At which of the following locations is the calculus likely to lodge: (x) Where the ureter is crossed by the uterine artery 13%", expectedOptions: ["Where the ureter is crossed by the vas deferens 5%", "Where the ureter crosses the common iliac vessels", "At the level the inferior mesenteric artery arises from the abdominal aorta 4%", "Approximately 5 cm superior to the pelvic brim 14%"],
    stem: "A 55-year-old woman has severe colicky loin-to-groin pain and renal calculi. At which location is a calculus likely to lodge?",
    options: ["Where the ureter is crossed by the uterine artery", "Where the ureter is crossed by the vas deferens", "Where the ureter crosses the common iliac vessels", "At the level the inferior mesenteric artery arises from the abdominal aorta", "Approximately 5 cm superior to the pelvic brim"], correctOption: 2,
    explanation: "Ureteric calculi commonly lodge at the ureteropelvic junction, the pelvic brim where the ureter crosses the iliac vessels, and the ureterovesical junction. The source-marked option is the pelvic-brim crossing.",
    learningNote: "Ureteric stone sites: UPJ, pelvic-brim iliac-vessel crossing, UVJ.",
    highYieldNote: "Ureteric calculus checkpoints: UPJ, iliac-vessel crossing at pelvic brim, UVJ.",
    mnemonic: "🪨 3 stops: UPJ, iliacs, UVJ.",
    memoryAid: aid("The ureter crosses the iliac vessels at the pelvic brim, a fixed angulation where stones may lodge.", "Three stops: UPJ, iliacs, UVJ.", ["🪨", "3️⃣", "🚧"], "Three stone checkpoints include the iliac-vessel crossing.", "NCBI Bookshelf: Ureter", "https://www.ncbi.nlm.nih.gov/books/NBK532980/"),
    sourceUrl: "https://www.ncbi.nlm.nih.gov/books/NBK532980/", finding: "At the pelvic brim, the ureter crosses the iliac vessels and forms a clinically important stone-passage site."
  },
  {
    id: "anatomy-anatomy-all-pdf-p0400-q0102", page: 400,
    expectedStem: "ww A 49 year old man presents to ED with a few months history of abdominal pain, weight loss and jaundice. Imaging shows a tumour in the uncinate process of the pancreas. Which of the following structures is most likely compressed by this tumour:", expectedOptions: ["Cystic duct 19%", "Superior mesenteric artery", "Portal vein 16%", "Splenic artery 6%"],
    stem: "A 49-year-old man has abdominal pain, weight loss, and jaundice. Imaging shows a tumour in the pancreatic uncinate process. Which structure is most likely compressed?",
    options: ["Cystic duct", "Main pancreatic duct", "Superior mesenteric artery", "Portal vein", "Splenic artery"], correctOption: 2,
    explanation: "The uncinate process is the caudal part of the pancreatic head that hooks posteriorly to the superior mesenteric vessels. Among the listed options, the superior mesenteric artery is the intended adjacent structure.",
    learningNote: "Uncinate process lies dorsal to the superior mesenteric vessels.",
    highYieldNote: "Uncinate process: posterior relation to the superior mesenteric vessels.",
    mnemonic: "🪝 Uncinate hooks behind SMA/SMV.",
    memoryAid: aid("The pancreatic uncinate process lies dorsal to and hooks posteriorly around the superior mesenteric vessels.", "Uncinate hooks behind SMA and SMV.", ["🪝", "🩸"], "A hook behind mesenteric vessels cues the uncinate process.", "PMC: Pancreatic Uncinate Process CT Anatomy", "https://pmc.ncbi.nlm.nih.gov/articles/PMC7522846/"),
    sourceUrl: "https://pmc.ncbi.nlm.nih.gov/articles/PMC7522846/", finding: "The uncinate process is dorsal to the SMA and hooks posteriorly to superior mesenteric vessels."
  },
  {
    id: "anatomy-anatomy-all-pdf-p0405-q0103", page: 405,
    expectedStem: "ww Posteriorly the spleen lies in the region of which of the following:", expectedOptions: ["Ribs 7 and 8 2%", "Ribs 8 - 10 5%", "Ribs 9 - 11", "Ribs 10 - 12 56%", "Below the costal margin 2%"],
    stem: "Posteriorly, the spleen lies in the region of which ribs?",
    options: ["Ribs 7 and 8", "Ribs 8-10", "Ribs 9-11", "Ribs 10-12", "Below the costal margin"], correctOption: 2,
    explanation: "The spleen lies in the left hypochondriac region, typically spanning the ninth to eleventh ribs and usually remaining under the left costal margin.",
    learningNote: "Spleen spans the left 9th to 11th ribs.",
    highYieldNote: "Spleen surface anatomy: left hypochondrium, ribs 9-11.",
    mnemonic: "9️⃣🔟1️⃣1️⃣ Spleen sits at nine to eleven.",
    memoryAid: aid("The spleen is positioned in the left hypochondriac region, typically between the ninth and eleventh ribs.", "Spleen sits at nine to eleven.", ["9️⃣", "🔟", "1️⃣1️⃣"], "Count ribs nine through eleven for the spleen.", "NCBI Bookshelf: Spleen", "https://www.ncbi.nlm.nih.gov/books/NBK482235/"),
    sourceUrl: "https://www.ncbi.nlm.nih.gov/books/NBK482235/", finding: "The spleen typically spans the ninth to eleventh ribs."
  },
  {
    id: "anatomy-anatomy-all-pdf-p0409-q0104", page: 409,
    expectedStem: "A 65 year old man presents to ED complaining of abdominal pain, jaundice and weight loss. Imaging shows a tumour of the head of the pancreas. Which of the following structures is most likely compressed by this tumour:", expectedOptions: ["Common hepatic duct", "Left hepatic duct 3%", "Cystic duct 6%", "Accessory pancreatic duct 6%"],
    stem: "A 65-year-old man has abdominal pain, jaundice, and weight loss. Imaging shows a tumour of the pancreatic head. Which structure is most likely compressed?",
    options: ["Common hepatic duct", "Left hepatic duct", "Cystic duct", "Accessory pancreatic duct", "Common bile duct"], correctOption: 4,
    explanation: "The bile duct lies in a groove on the posterosuperior surface of the pancreatic head or may be embedded in the gland. A pancreatic-head mass can therefore obstruct the common bile duct and cause jaundice.",
    learningNote: "Common bile duct runs in a groove on the pancreatic head.",
    highYieldNote: "Pancreatic-head mass can compress the common bile duct and cause jaundice.",
    mnemonic: "🟡 Head mass blocks the bile duct.",
    memoryAid: aid("The bile duct lies in a groove on the posterosuperior surface of the pancreatic head, making it vulnerable to obstruction by a head mass.", "Head mass blocks the bile duct.", ["🟡", "🚫"], "Jaundice and a blocked bile route cue pancreatic-head obstruction.", "NCBI Bookshelf: Pancreas", "https://www.ncbi.nlm.nih.gov/books/NBK532912/"),
    sourceUrl: "https://www.ncbi.nlm.nih.gov/books/NBK532912/", finding: "The bile duct lies in a groove on the posterosuperior surface of the pancreatic head."
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
  const before = { stem: draft.stem, options: draft.options, correctOption: draft.correctOption, status: draft.status, askable: draft.askable };
  Object.assign(draft, { stem: item.stem, options: item.options, correctOption: item.correctOption, explanation: item.explanation, learningNote: item.learningNote, highYieldNote: item.highYieldNote, mnemonic: item.mnemonic, memoryAid: item.memoryAid, status: "ocr_draft", askable: true, warnings: [reviewedWarning] });
  applied.push({ id: item.id, sourcePage: item.page, before, after: { stem: draft.stem, options: draft.options, correctOption: draft.correctOption, status: draft.status, askable: draft.askable }, evidence: { externalSource: item.sourceUrl, externalFinding: item.finding } });
}

await writeFile(bankPath, `${source.slice(0, parsed.arrayStart)}${JSON.stringify(parsed.drafts)}${source.slice(parsed.end + 1)}`);
await mkdir(auditDir, { recursive: true });
await writeFile(path.join(auditDir, "applied-anatomy-batch-10.json"), `${JSON.stringify({ generatedAt: new Date().toISOString(), applied, restricted: [], automaticApproval: false, mockEligibility: "No restored OCR draft is mock eligible." }, null, 2)}\n`);
console.log(JSON.stringify({ restored: applied.map((row) => row.id), restricted: [], automaticApproval: false }, null, 2));
