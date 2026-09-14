import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const bankPath = path.join(root, "client", "src", "lib", "ocrDraftSections.ts");
const auditDir = path.join(root, "docs", "audit");
const reviewedWarning = "Source page and external anatomy reference reviewed; remains an unapproved OCR draft.";
const aid = (coreFact, mnemonic, emojiCues, cueLabel, sourceLabel, sourceUrl) => ({ coreFact, mnemonic, emojiCues, cueLabel, sourceLabel, sourceUrl });
const r = (id, page, expectedStem, expectedOptions, stem, options, correctOption, explanation, learningNote, highYieldNote, mnemonic, memoryAid, sourceUrl, finding) => ({ id, page, expectedStem, expectedOptions, stem, options, correctOption, explanation, learningNote, highYieldNote, mnemonic, memoryAid, sourceUrl, finding });

const restorations = [
  r("anatomy-anatomy-all-pdf-p0666-q0049", 666, "A75 year old man presents to ED complaining of abdominal pain radiating to his back, anorexia and weight loss. Imaging shows a large tumour of the neck of the pancreas. Which of the following structures is most likely compressed by the tumour:", ["Inferior mesenteric artery", "First part of the duodenum", "Ureter", "Coeliac trunk"], "A 75-year-old man presents to the ED with abdominal pain radiating to his back, anorexia, and weight loss. Imaging shows a large tumour of the neck of the pancreas. Which structure is most likely compressed?", ["Inferior mesenteric artery", "Portal vein", "First part of the duodenum", "Ureter", "Coeliac trunk"], 1, "The portal vein forms posterior to the neck of the pancreas. A tumour at the pancreatic neck can therefore compress the portal vein.", "Portal vein lies posterior to the neck of the pancreas.", "The portal vein lies behind the pancreatic neck.", "🩸 PANCREATIC NECK sits in front of the portal vein.", aid("The portal vein forms posterior to the neck of the pancreas.", "Pancreatic neck in front, portal vein behind.", ["🩸", "⬅️", "➡️"], "Front-and-behind cues retain the pancreatic-neck relation.", "PMC: Portal vein anatomy review", "https://pmc.ncbi.nlm.nih.gov/articles/PMC6428891/"), "https://pmc.ncbi.nlm.nih.gov/articles/PMC6428891/", "A peer-reviewed anatomy review places portal-vein formation posterior to the pancreatic neck."),
  r("anatomy-anatomy-all-pdf-p0668-q0051", 668, "ww The iliacus muscle is innervated by which of the following:", ["lliohypogastric nerve Bevin", "Genitofemoral nerve 2%", "Anterior rami of L1- L3 54%"], "The iliacus muscle is innervated by which of the following?", ["Iliohypogastric nerve", "Ilioinguinal nerve", "Genitofemoral nerve", "Femoral nerve", "Anterior rami of L1-L3"], 3, "The femoral nerve supplies iliacus. In contrast, psoas major receives direct branches from the L2-L4 ventral rami.", "Iliacus is supplied by the femoral nerve.", "Femoral nerve supplies iliacus; direct L2-L4 rami supply psoas major.", "🦵 ILIACUS flexes with the FEMORAL nerve.", aid("The femoral nerve supplies the iliacus muscle.", "Iliacus flexes with femoral.", ["🦵", "⚡"], "Hip-flexor and nerve cues retain iliacus innervation.", "NCBI Bookshelf: Femoral Nerve", "https://www.ncbi.nlm.nih.gov/books/NBK556065/"), "https://www.ncbi.nlm.nih.gov/books/NBK556065/", "NCBI states that the femoral nerve supplies iliacus."),
  r("anatomy-anatomy-all-pdf-p0669-q0052", 669, "ww The inferior vena cava is formed from the union of the two common iliac veins at which of the following vertebral levels:", ["u 48%", "IES) 6%", "L4 25%"], "The inferior vena cava is formed from the union of the two common iliac veins at which vertebral level?", ["L1", "L2", "L3", "L4", "L5"], 4, "The right and left common iliac veins unite to form the inferior vena cava, usually at the L5 vertebral level, just right of the midline.", "Common iliac veins unite at L5 to form the IVC.", "IVC = common iliac confluence at L5.", "🩸 IVC begins at L5: iliac Veins Converge.", aid("The IVC forms from the common iliac veins at L5.", "Iliac Veins Converge at L5.", ["🩸", "5️⃣"], "Confluence and L5 cues retain IVC formation.", "NCBI Bookshelf: Inferior Vena Cava", "https://www.ncbi.nlm.nih.gov/books/NBK482353/"), "https://www.ncbi.nlm.nih.gov/books/NBK482353/", "NCBI identifies the common-iliac confluence at the L5 level."),
  r("anatomy-anatomy-all-pdf-p0670-q0053", 670, "ww Which of the following structures does NOT pass through the inguinal canal:", ["Genital branch of genitofemoral nerve", "llioinguinal nerve 5%", "Spermatic cord 2%", "Round ligament 6%", "Inferior epigastric artery"], "Which structure does NOT pass through the inguinal canal?", ["Genital branch of genitofemoral nerve", "Ilioinguinal nerve", "Spermatic cord", "Round ligament", "Inferior epigastric artery"], 4, "The inguinal canal transmits the spermatic cord in males or round ligament in females, plus the ilioinguinal nerve and genital branch of the genitofemoral nerve. The inferior epigastric artery does not pass through it.", "Inferior epigastric artery is not an inguinal-canal content.", "Canal contents are cord or round ligament plus the ilioinguinal and genital nerves.", "🚪 Canal carries CORD, ROUND ligament, and NERVES, not epigastric artery.", aid("The inferior epigastric artery does not pass through the inguinal canal.", "Cord, round ligament, nerves: no epigastric artery.", ["🚪", "🧵", "⚡"], "Passage, cord, and nerve cues retain the canal contents.", "NCBI Bookshelf: Inguinal Region", "https://www.ncbi.nlm.nih.gov/books/NBK470204/"), "https://www.ncbi.nlm.nih.gov/books/NBK470204/", "NCBI identifies the canal’s transmitted cord, round ligament, and nerve contents and places the deep ring lateral to epigastric vessels."),
  r("anatomy-anatomy-all-pdf-p0671-q0054", 671, "w The spleen occupies which of the following abdominal regions:", ["Right hypochondrium", "Left hypochondrium", "Epigastrium 1%", "Left hypochondrium and epigastrium 10%", "Left hypochondrium and left flank \"1%"], "The spleen occupies which abdominal region?", ["Right hypochondrium", "Left hypochondrium", "Epigastrium", "Left hypochondrium and epigastrium", "Left hypochondrium and left flank"], 1, "The spleen lies in the left hypochondriac region, between the diaphragm and gastric fundus, deep to ribs 9 to 11.", "Spleen lies in the left hypochondrium.", "The spleen is a left-hypochondrial organ.", "🩸 SPLEEN stays LEFT under ribs 9-11.", aid("The spleen lies in the left hypochondriac region.", "Spleen stays left under ribs.", ["🩸", "⬅️", "🦴"], "Spleen, left-direction, and rib cues retain the region.", "NCBI Bookshelf: Spleen", "https://www.ncbi.nlm.nih.gov/books/NBK482235/"), "https://www.ncbi.nlm.nih.gov/books/NBK482235/", "NCBI locates the spleen in the left hypochondriac region."),
  r("anatomy-anatomy-all-pdf-p0672-q0055", 672, "The ejaculatory duct is formed by the union of which of the following structures:", ["Ductus deferens and the prostatic urethra 4%", "Ductus deferens and the epididymis 3%", "Ductus deferens and prostatic ducts 171%", "Ductus deferens and duct from the seminal vesicle", "Prostatic ducts and duct from seminal vesicle 48%"], "The ejaculatory duct is formed by the union of which structures?", ["Ductus deferens and the prostatic urethra", "Ductus deferens and the epididymis", "Ductus deferens and prostatic ducts", "Ductus deferens and duct from the seminal vesicle", "Prostatic ducts and duct from seminal vesicle"], 3, "Each ejaculatory duct forms where the duct of a seminal vesicle joins the ampulla of the ductus deferens, then opens into the prostatic urethra.", "Ejaculatory duct = ductus deferens plus seminal-vesicle duct.", "Seminal-vesicle duct joins ductus deferens to form the ejaculatory duct.", "💧 SEMINAL + DEFERENS = EJACULATORY duct.", aid("The ejaculatory duct forms from the ductus deferens and seminal-vesicle duct.", "Seminal plus deferens equals ejaculatory.", ["💧", "➕"], "Fluid and addition cues retain ejaculatory-duct formation.", "NCBI Bookshelf: Seminal Vesicle", "https://www.ncbi.nlm.nih.gov/books/NBK499854/"), "https://www.ncbi.nlm.nih.gov/books/NBK499854/", "NCBI describes seminal-vesicle duct convergence with the vas-deferens ampulla to form the ejaculatory duct."),
  r("anatomy-anatomy-all-pdf-p0673-q0056", 673, "ww Regarding the female urethra, which of the following statements is CORRECT:", ["The urethra is longer in women than it is in men. 1%", "The urethra begins at the apex of the bladder. 10%", "The urethra opens in the vestibule that lies between the labia minora.", "The inferior aspect of the urethra is bound to the posterior surface of the vagina. 4%", "The internal urethral sphincter surrounds the urethra as it passes through the pelvic floor. 13%"], "Regarding the female urethra, which statement is correct?", ["The urethra is longer in women than it is in men.", "The urethra begins at the apex of the bladder.", "The urethra opens in the vestibule that lies between the labia minora.", "The inferior aspect of the urethra is bound to the posterior surface of the vagina.", "The internal urethral sphincter surrounds the urethra as it passes through the pelvic floor."], 2, "The female urethra opens within the vulvar vestibule, posterior to the clitoris and anterior to the vaginal opening. The vestibule lies between the labia minora.", "Female urethra opens in the vestibule between labia minora.", "Urethra opens in the vestibule: posterior to clitoris and anterior to vagina.", "🚪 URETHRA opens in the VESTIBULE between the minora.", aid("The female urethra opens in the vulvar vestibule between the labia minora.", "Urethra opens in the vestibule.", ["🚪", "⬇️", "♀️"], "Opening, location, and female-anatomy cues retain the relation.", "NCBI Bookshelf: Female External Genitalia", "https://www.ncbi.nlm.nih.gov/books/NBK547703/"), "https://www.ncbi.nlm.nih.gov/books/NBK547703/", "NCBI describes the vestibule between the labia minora and the female urethral opening within it."),
  r("anatomy-anatomy-all-pdf-p0674-q0057", 674, "The arterial supply of the duodenum is primarily derived from which of the following:", ["Superior mesenteric and inferior mesenteric artery 7%", "Inferior mesenteric artery 1%", "Left gastric artery and splenic artery 13%", "Left gastric and superior mesenteric artery 13%", "Gastroduodenal and superior mesenteric artery"], "The arterial supply of the duodenum is primarily derived from which arteries?", ["Superior mesenteric and inferior mesenteric artery", "Inferior mesenteric artery", "Left gastric artery and splenic artery", "Left gastric and superior mesenteric artery", "Gastroduodenal and superior mesenteric artery"], 4, "The proximal duodenum receives gastroduodenal-artery branches, including the superior pancreaticoduodenal artery. The distal duodenum receives SMA branches, primarily the inferior pancreaticoduodenal artery.", "Duodenal supply joins gastroduodenal and SMA pancreaticoduodenal branches.", "Duodenum straddles foregut and midgut supply: gastroduodenal plus SMA.", "🔄 DUODENUM gets GDA above and SMA below.", aid("Duodenum has gastroduodenal and superior-mesenteric arterial supply.", "GDA above, SMA below.", ["🔄", "⬆️", "⬇️"], "Upper-and-lower supply cues retain the two arterial sources.", "NCBI Bookshelf: Duodenum", "https://www.ncbi.nlm.nih.gov/books/NBK482390/"), "https://www.ncbi.nlm.nih.gov/books/NBK482390/", "NCBI assigns proximal supply to gastroduodenal branches and distal supply to SMA branches."),
  r("anatomy-anatomy-all-pdf-p0675-q0058", 675, "The union of the common bile duct and the pancreatic duct forms which of the following: Cystic duct (x) Hepatic duct Sphincter of Oddi Major papilla", ["Ampulla of Vater"], "The union of the common bile duct and the pancreatic duct forms which structure?", ["Cystic duct", "Hepatic duct", "Sphincter of Oddi", "Major papilla", "Ampulla of Vater"], 4, "The common bile duct and pancreatic duct meet at the hepatopancreatic ampulla, also called the ampulla of Vater. This opens at the major duodenal papilla.", "Ampulla of Vater is the common-bile-duct and pancreatic-duct confluence.", "Ampulla of Vater is the duct confluence; the major papilla is its duodenal opening.", "🔀 BILE + PANCREATIC ducts meet at the AMPULLA.", aid("Ampulla of Vater is the common-bile-duct and pancreatic-duct confluence.", "Bile plus pancreas meet at the ampulla.", ["🔀", "🟢", "🟡"], "Confluence and duct-fluid cues retain the ampulla.", "NCBI Bookshelf: Biliary Ducts", "https://www.ncbi.nlm.nih.gov/books/NBK459246/"), "https://www.ncbi.nlm.nih.gov/books/NBK459246/", "NCBI defines the hepatopancreatic ampulla as the common-bile-duct and pancreatic-duct confluence.")
];

const restriction = {
  id: "anatomy-anatomy-all-pdf-p0667-q0050",
  page: 667,
  expectedStem: "ww The termination of the abdominal aorta can be visualised on the anterior abdominal wall by a point:",
  expectedOptions: ["About 2.5 cm above the umbilicus 26%", "About 2.5 cm below the umbilicus", "Halfway between the xiphisternum and the umbilicus 3%", "Halfway between the umbilicus and the pubic symphysis 8%", "About 2.5 cm above the deep inguinal ring %"],
  stem: "The termination of the abdominal aorta can be visualised on the anterior abdominal wall by which point?",
  options: ["About 2.5 cm above the umbilicus", "About 2.5 cm below the umbilicus", "Halfway between the xiphisternum and the umbilicus", "Halfway between the umbilicus and the pubic symphysis", "About 2.5 cm above the deep inguinal ring"],
  warning: "Source page reviewed, but the exact aortic-bifurcation surface measurement is not sufficiently corroborated by the evidence reviewed.",
  sourceUrl: "https://pmc.ncbi.nlm.nih.gov/articles/PMC3924739/",
  finding: "CT-based studies report substantial variation in aortic-bifurcation position relative to the umbilicus, so the source's fixed 2.5-cm surface landmark is not restored."
};

function parse(source) {
  const prefix = "export const ocrDraftQuestions: OcrDraftQuestion[] = ";
  const start = source.indexOf(prefix);
  const arrayStart = start + prefix.length;
  const end = source.indexOf("];", arrayStart);
  if (start < 0 || end < 0) throw new Error("OCR draft export not found");
  return { arrayStart, end, drafts: JSON.parse(source.slice(arrayStart, end + 1)) };
}

function guard(draft, item) {
  if (!draft || draft.sourcePage !== item.page) throw new Error(`Source-page drift for ${item.id}`);
  if (draft.stem !== item.expectedStem || JSON.stringify(draft.options) !== JSON.stringify(item.expectedOptions)) throw new Error(`OCR drift for ${item.id}; refusing update.`);
}

function snapshot(draft) {
  return {
    stem: draft.stem,
    options: draft.options,
    correctOption: draft.correctOption,
    status: draft.status,
    askable: draft.askable,
    needsImage: draft.needsImage,
    warnings: draft.warnings ?? []
  };
}

const source = await readFile(bankPath, "utf8");
const parsed = parse(source);
const byId = new Map(parsed.drafts.map((draft) => [draft.id, draft]));
const applied = [];

for (const item of restorations) {
  const draft = byId.get(item.id);
  guard(draft, item);
  const before = snapshot(draft);
  Object.assign(draft, {
    stem: item.stem,
    options: item.options,
    correctOption: item.correctOption,
    explanation: item.explanation,
    learningNote: item.learningNote,
    highYieldNote: item.highYieldNote,
    mnemonic: item.mnemonic,
    memoryAid: item.memoryAid,
    status: "ocr_draft",
    askable: true,
    needsImage: false,
    warnings: [reviewedWarning]
  });
  applied.push({ id: item.id, sourcePage: item.page, before, after: snapshot(draft), evidence: { externalSource: item.sourceUrl, externalFinding: item.finding } });
}

const restrictedDraft = byId.get(restriction.id);
guard(restrictedDraft, restriction);
const restrictedBefore = snapshot(restrictedDraft);
Object.assign(restrictedDraft, {
  stem: restriction.stem,
  options: restriction.options,
  correctOption: null,
  explanation: "External evidence confirms aortic bifurcation at L4 but does not validate the source's fixed surface measurement relative to the umbilicus.",
  learningNote: "",
  highYieldNote: "",
  mnemonic: "",
  status: "needs_review",
  askable: false,
  needsImage: false,
  warnings: [restriction.warning]
});
delete restrictedDraft.memoryAid;
const restricted = [{ id: restriction.id, sourcePage: restriction.page, before: restrictedBefore, after: snapshot(restrictedDraft), evidence: { externalSource: restriction.sourceUrl, externalFinding: restriction.finding } }];

await writeFile(bankPath, `${source.slice(0, parsed.arrayStart)}${JSON.stringify(parsed.drafts)}${source.slice(parsed.end + 1)}`);
await mkdir(auditDir, { recursive: true });
await writeFile(path.join(auditDir, "applied-anatomy-batch-23.json"), `${JSON.stringify({ generatedAt: new Date().toISOString(), applied, restricted, automaticApproval: false, mockEligibility: "No restored OCR draft is mock eligible." }, null, 2)}\n`);
console.log(JSON.stringify({ restored: applied.map((row) => row.id), restricted: restricted.map((row) => row.id), automaticApproval: false }, null, 2));
