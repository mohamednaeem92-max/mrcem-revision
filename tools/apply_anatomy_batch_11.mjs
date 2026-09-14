/** Guarded Anatomy Batch 11 application; this script never approves OCR records. */
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
    id: "anatomy-anatomy-all-pdf-p0412-q0105", page: 412,
    expectedStem: "The iliohypogastric nerve supplies skin over which of the following regions:", expectedOptions: ["Posterolateral gluteal region", "Medial thigh 12%", "Lateral thigh 4%", "Posteromedial gluteal region 17%"],
    stem: "The iliohypogastric nerve supplies skin over which region?",
    options: ["Posterolateral gluteal region", "Medial thigh", "Lateral thigh", "Posteromedial gluteal region", "Upper anterior thigh"], correctOption: 0,
    explanation: "The iliohypogastric nerve has a lateral cutaneous branch supplying the posterolateral gluteal region and an anterior cutaneous branch supplying the suprapubic region.",
    learningNote: "Iliohypogastric sensory territory includes lateral gluteal and suprapubic skin.",
    highYieldNote: "Iliohypogastric: posterolateral gluteal and suprapubic skin; also supplies internal oblique and transversus abdominis.",
    mnemonic: "🪽 Iliohypogastric fans from flank to pubis.",
    memoryAid: aid("The iliohypogastric nerve supplies lateral gluteal and suprapubic skin and innervates internal oblique and transversus abdominis.", "Iliohypogastric fans from flank to pubis.", ["🪽", "➡️"], "A wing from flank toward pubis cues its cutaneous territory.", "NCBI Bookshelf: Posterior Abdominal Wall Nerves", "https://www.ncbi.nlm.nih.gov/books/NBK557605/"),
    sourceUrl: "https://www.ncbi.nlm.nih.gov/books/NBK557605/", finding: "Iliohypogastric sensory innervation includes the lateral gluteal and suprapubic regions."
  },
  {
    id: "anatomy-anatomy-all-pdf-p0417-q0106", page: 417,
    expectedStem: "wy? Which of the following nerves transmits the parasympathetic supply to the stomach: (x) Greater thoracic splanchnic nerves 6%", expectedOptions: ["Lesser thoracic splanchnic nerves 8%", "Lumbar splanchnic nerves 5%", "Pelvic splanchnic nerves 2%"],
    stem: "Which nerves transmit the parasympathetic supply to the stomach?",
    options: ["Greater thoracic splanchnic nerves", "Lesser thoracic splanchnic nerves", "Lumbar splanchnic nerves", "Pelvic splanchnic nerves", "Vagus nerves"], correctOption: 4,
    explanation: "The stomach is a foregut organ. Foregut parasympathetic innervation is carried by the vagus nerves, whereas thoracic, lumbar, and sacral splanchnic nerves carry sympathetic fibers.",
    learningNote: "Vagus nerves carry parasympathetic fibers to the stomach.",
    highYieldNote: "Foregut parasympathetic supply, including the stomach, travels with the vagus.",
    mnemonic: "🫃 Vagus visits the viscera.",
    memoryAid: aid("The vagus nerve provides parasympathetic innervation to foregut structures, including the stomach.", "Vagus visits the viscera.", ["🫃", "🧠"], "A vagal route from brain to stomach cues foregut parasympathetics.", "NCBI Bookshelf: Splanchnic Nerves", "https://www.ncbi.nlm.nih.gov/books/NBK560504/"),
    sourceUrl: "https://www.ncbi.nlm.nih.gov/books/NBK560504/", finding: "Foregut parasympathetic innervation is provided by the vagus nerve."
  },
  {
    id: "anatomy-anatomy-all-pdf-p0422-q0107", page: 422,
    expectedStem: "A 29 year patient presents to ED complaining of a painless lump in his scrotum. Imaging shows a tumour affecting the scrotum but sparing the testis. Where would the lymph from this area of pathology drain to initially:", expectedOptions: ["Deep inguinal nodes Internal iliac nodes 1%", "Lumbar nodes Qrmnenncmeme"],
    stem: "A 29-year-old man has a painless scrotal lump. Imaging shows a tumour affecting the scrotum but sparing the testis. Where does lymph from this pathology initially drain?",
    options: ["Deep inguinal nodes", "Superficial inguinal nodes", "Internal iliac nodes", "Lumbar nodes", "Inferior mesenteric lymph nodes"], correctOption: 1,
    explanation: "Scrotal skin drains to superficial inguinal nodes. This differs from the testis, which drains to lumbar (para-aortic) nodes because of its embryological origin.",
    learningNote: "Scrotum drains to superficial inguinal nodes; testes drain to para-aortic nodes.",
    highYieldNote: "Scrotal versus testicular lymph: superficial inguinal versus para-aortic.",
    mnemonic: "🩲 Skin to groin; testis to aorta.",
    memoryAid: aid("Scrotal lymph drains initially to superficial inguinal nodes, whereas testicular lymph drains to lumbar or para-aortic nodes.", "Skin to groin; testis to aorta.", ["🩲", "📍"], "Scrotal skin points downward to the groin nodes.", "NCBI Bookshelf: Lymphatic Drainage", "https://www.ncbi.nlm.nih.gov/books/NBK557720/"),
    sourceUrl: "https://www.ncbi.nlm.nih.gov/books/NBK557720/", finding: "Superficial inguinal nodes receive lymph from the scrotum; lumbar para-aortic nodes drain the testes."
  },
  {
    id: "anatomy-anatomy-all-pdf-p0425-q0108", page: 425,
    expectedStem: "The roof of the inguinal canal is formed primarily by which of the following structures:", expectedOptions: ["Transversus abdominis and internal oblique muscles", "External oblique muscle", "External oblique aponeurosis", "Transversalis fascia", "Rectus abdominis muscle"],
    stem: "The roof of the inguinal canal is formed primarily by which structures?",
    options: ["Transversus abdominis and internal oblique muscles", "External oblique muscle", "External oblique aponeurosis", "Transversalis fascia", "Rectus abdominis muscle"], correctOption: 0,
    explanation: "The roof of the inguinal canal is formed by the arching combined fibers of internal oblique and transversus abdominis, including the conjoint-tendon region.",
    learningNote: "Inguinal-canal roof: arching internal oblique and transversus abdominis fibers.",
    highYieldNote: "Inguinal canal roof is formed by the combined internal-oblique and transversus-abdominis arch.",
    mnemonic: "🏹 IO + TA arch over the canal.",
    memoryAid: aid("Combined internal-oblique and transversus-abdominis fibers arch over and form the roof of the inguinal canal.", "IO plus TA arch over the canal.", ["🏹", "⬆️"], "An arch over a tunnel cues the canal roof.", "NCBI Bookshelf: Inguinal Region", "https://www.ncbi.nlm.nih.gov/books/NBK470204/"),
    sourceUrl: "https://www.ncbi.nlm.nih.gov/books/NBK470204/", finding: "The inguinal-canal roof is made by combined internal-oblique and transversus-abdominis fibers."
  },
  {
    id: "anatomy-anatomy-all-pdf-p0426-q0109", page: 426,
    expectedStem: "ww The abdominal aorta begins at which vertebral level:", expectedOptions: ["™ 4% (v 112 70% E a]", "L2 2%"],
    stem: "At which vertebral level does the abdominal aorta begin?",
    options: ["T10", "T11", "T12", "L1", "L2"], correctOption: 2,
    explanation: "The abdominal aorta begins as the descending aorta passes through the aortic hiatus in the diaphragm at T12.",
    learningNote: "Aortic hiatus and abdominal-aorta beginning: T12.",
    highYieldNote: "Diaphragm levels: IVC T8, oesophagus T10, aorta T12.",
    mnemonic: "8️⃣ 10️⃣ 12️⃣ IVC, oesophagus, aorta.",
    memoryAid: aid("The aorta passes through the aortic hiatus at T12 to enter the abdomen.", "Eight, ten, twelve: IVC, oesophagus, aorta.", ["8️⃣", "🔟", "1️⃣2️⃣"], "Increasing hiatus levels cue the aorta at twelve.", "NCBI Bookshelf: Posterior Abdominal Wall Arteries", "https://www.ncbi.nlm.nih.gov/books/NBK532972/"),
    sourceUrl: "https://www.ncbi.nlm.nih.gov/books/NBK532972/", finding: "The aorta passes the aortic hiatus at T12."
  },
  {
    id: "anatomy-anatomy-all-pdf-p0433-q0112", page: 433,
    expectedStem: "Which of the following structures does NOT pass through the inguinal canal:", expectedOptions: ["Genital branch of genitofemoral nerve 4%", "llioinguinal nerve 5%", "Spermatic cord 2%", "Round ligament 6%", "Inferior epigastric artery"],
    stem: "Which structure does not pass through the inguinal canal?",
    options: ["Genital branch of genitofemoral nerve", "Ilioinguinal nerve", "Spermatic cord", "Round ligament", "Inferior epigastric artery"], correctOption: 4,
    explanation: "The inguinal canal transmits the spermatic cord in men or round ligament in women, plus the ilioinguinal and genital branches named in the options. The inferior epigastric artery is a landmark adjacent to the deep ring rather than a canal content.",
    learningNote: "Inguinal canal contents include cord or round ligament and named nerves, not the inferior epigastric artery.",
    highYieldNote: "Deep ring lies lateral to inferior epigastric vessels; the artery is not a canal content.",
    mnemonic: "🚧 Epigastric stays beside, not inside.",
    memoryAid: aid("The deep inguinal ring lies lateral to the epigastric vessels; the inferior epigastric artery is not a content of the inguinal canal.", "Epigastric stays beside, not inside.", ["🚧", "↔️"], "A barrier beside the ring cues the epigastric vessels.", "NCBI Bookshelf: Inguinal Region", "https://www.ncbi.nlm.nih.gov/books/NBK470204/"),
    sourceUrl: "https://www.ncbi.nlm.nih.gov/books/NBK470204/", finding: "The deep inguinal ring is lateral to epigastric vessels, whereas the canal transmits cord or round-ligament structures and named nerves."
  },
  {
    id: "anatomy-anatomy-all-pdf-p0437-q0113", page: 437,
    expectedStem: "ww The superficial inguinal ring is an ‘opening’ in which of the following structures:", expectedOptions: ["External oblique aponeurosis", "Internal oblique aponeurosis 5%", "Transversus abdominis aponeurosis 5%", "Rectus abdominis aponeurosis 2%", "Transversalis fascia 1%"],
    stem: "The superficial inguinal ring is an opening in which structure?",
    options: ["External oblique aponeurosis", "Internal oblique aponeurosis", "Transversus abdominis aponeurosis", "Rectus abdominis aponeurosis", "Transversalis fascia"], correctOption: 0,
    explanation: "The superficial inguinal ring is the triangular terminal opening of the inguinal canal in the external oblique aponeurosis.",
    learningNote: "Superficial ring: terminal opening in external oblique aponeurosis.",
    highYieldNote: "Inguinal rings: deep in transversalis fascia; superficial in external oblique aponeurosis.",
    mnemonic: "🔍 Deep fascia, surface oblique.",
    memoryAid: aid("The superficial inguinal ring is a triangular opening in the external oblique aponeurosis; the deep ring is in transversalis fascia.", "Deep fascia, surface oblique.", ["🔍", "🧵"], "A surface opening in the oblique sheet cues the superficial ring.", "NCBI Bookshelf: Inguinal Region", "https://www.ncbi.nlm.nih.gov/books/NBK470204/"),
    sourceUrl: "https://www.ncbi.nlm.nih.gov/books/NBK470204/", finding: "The superficial ring is triangular and formed by fibers of external oblique."
  },
  {
    id: "anatomy-anatomy-all-pdf-p0438-q0114", page: 438,
    expectedStem: "ww The sacrum articulates with which of the following structures:", expectedOptions: ["Pubis of the pelvic bone 4%", "Ischium of the pelvic bone 19% () ium of the pelvic bone 69%", "Ischial tuberosity 4%", "Pubic ramus 4%"],
    stem: "The sacrum articulates with which structure?",
    options: ["Pubis of the pelvic bone", "Ischium of the pelvic bone", "Ilium of the pelvic bone", "Ischial tuberosity", "Pubic ramus"], correctOption: 2,
    explanation: "The sacrum articulates bilaterally with the ilia at the sacroiliac joints. It also articulates with L5 superiorly and the coccyx inferiorly.",
    learningNote: "Sacroiliac joints connect sacrum to ilium.",
    highYieldNote: "Sacrum articulates laterally with the ilia at sacroiliac joints.",
    mnemonic: "🦴 SI = Sacrum + Ilium.",
    memoryAid: aid("Sacroiliac joints are the articulations between the sacrum and the ilium.", "SI means sacrum plus ilium.", ["🦴", "🤝"], "Two joined pelvic bones cue the sacroiliac joint.", "NCBI Bookshelf: Sacroiliac Joint", "https://www.ncbi.nlm.nih.gov/books/NBK507801/"),
    sourceUrl: "https://www.ncbi.nlm.nih.gov/books/NBK507801/", finding: "The sacroiliac joint articulates surfaces of the sacrum and ilium."
  }
];

const restrictions = [
  {
    id: "anatomy-anatomy-all-pdf-p0429-q0110", page: 429,
    expectedStem: "The rectus sheath encloses all of the following structures except the:", expectedOptions: ["Lower thoracic intercostal nerves", "Superior epigastric artery", "Inferior epigastric artery"],
    stem: "The rectus sheath encloses all of the following structures except which?",
    options: ["Transversus abdominis muscle", "Pyramidalis muscle", "Lower thoracic intercostal nerves", "Superior epigastric artery", "Inferior epigastric artery"],
    explanation: "The source marks transversus abdominis. An authoritative reference documents transversus abdominis muscle within the sheath superiorly in some anatomy, so this categorical formulation remains excluded from answer learning.",
    warning: "Source page reviewed, but the categorical exclusion of transversus abdominis from the rectus sheath was not precisely corroborated by authoritative external evidence. This record remains excluded from answer learning.",
    sourceUrl: "https://www.ncbi.nlm.nih.gov/books/NBK537153/", finding: "A reviewed reference notes transversus abdominis muscle within the rectus sheath superiorly near the costal margin."
  },
  {
    id: "anatomy-anatomy-all-pdf-p0432-q0111", page: 432,
    expectedStem: "Ad The iliohypogastric nerve is formed from the anterior rami of:", expectedOptions: ["11-12 18% c a", "ets i"],
    stem: "The iliohypogastric nerve is formed from the anterior rami of which roots?",
    options: ["L1", "L1-L2", "L2", "L2-L3", "L4"],
    explanation: "The source marks L1. An authoritative reference describes the iliohypogastric nerve as arising from T12-L1, so the isolated source formulation remains excluded from answer learning.",
    warning: "Source page reviewed, but the source-marked isolated L1 origin of the iliohypogastric nerve was not precisely corroborated by authoritative external evidence. This record remains excluded from answer learning.",
    sourceUrl: "https://www.ncbi.nlm.nih.gov/books/NBK557605/", finding: "The iliohypogastric nerve is described as arising from T12-L1."
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
await writeFile(path.join(auditDir, "applied-anatomy-batch-11.json"), `${JSON.stringify({ generatedAt: new Date().toISOString(), applied, restricted, automaticApproval: false, mockEligibility: "No restored OCR draft is mock eligible." }, null, 2)}\n`);
console.log(JSON.stringify({ restored: applied.map((row) => row.id), restricted: restricted.map((row) => row.id), automaticApproval: false }, null, 2));
