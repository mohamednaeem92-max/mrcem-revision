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
    id: "anatomy-anatomy-all-pdf-p0575-q0167", page: 575,
    expectedStem: "Abdomen The sacrospinous ligament spans between which of the following structures:", expectedOptions: ["The anterior superior iliac spine to the sacrum and coccyx (x) jac spine to the sacrum and coccyx 20%", "The ischial tuberosity to the sacrum and coccyx \"1%", "The pubic arch to the sacrum and coccyx"],
    stem: "The sacrospinous ligament spans between which structures?", options: ["Anterior superior iliac spine and sacrum/coccyx", "Posterior superior iliac spine and sacrum/coccyx", "Ischial tuberosity and sacrum/coccyx", "Ischial spine and sacrum/coccyx", "Pubic arch and sacrum/coccyx"], correctOption: 3,
    explanation: "The sacrospinous ligament is a triangular pelvic ligament with a broad attachment to the lower sacrum and upper coccyx that narrows to attach to the ischial spine.",
    learningNote: "Sacrospinous ligament: sacrum/coccyx to ischial spine.", highYieldNote: "The sacrospinous ligament runs from the lower sacrum and upper coccyx to the ischial spine.", mnemonic: "📌 SacroSPINOUS ends at the ischial SPINE.",
    memoryAid: aid("Sacrospinous ligament spans lower sacrum and upper coccyx to the ischial spine.", "SacroSPINOUS ends at the ischial SPINE.", ["📌", "🦴"], "Pin and bone cues link sacral origin to ischial-spine attachment.", "NCBI Bookshelf: Pelvic Ligaments", "https://www.ncbi.nlm.nih.gov/sites/books/NBK493215/"),
    sourceUrl: "https://www.ncbi.nlm.nih.gov/sites/books/NBK493215/", finding: "NCBI describes a lower sacral and upper coccygeal base that narrows to attach to the ischial spine."
  },
  {
    id: "anatomy-anatomy-all-pdf-p0579-q0169", page: 579,
    expectedStem: "Which of the following best describes the location of the omental bursa:", expectedOptions: ["Inferior to the transverse mesocolon", "To the right of the oblique attachment of the mesentery", "Posterior to the pancreas", "Anterior to the stomach and liver"],
    stem: "Which statement best describes the location of the omental bursa?", options: ["Inferior to the transverse mesocolon", "To the right of the oblique attachment of the mesentery", "Posterior to the stomach and liver", "Posterior to the pancreas", "Anterior to the stomach and liver"], correctOption: 2,
    explanation: "The omental bursa, or lesser sac, lies posterior to the stomach and liver and anterior to the pancreas. It communicates with the greater sac through the epiploic foramen.",
    learningNote: "Lesser sac sits behind stomach and liver, in front of pancreas.", highYieldNote: "The omental bursa is posterior to the stomach and liver and anterior to the pancreas.", mnemonic: "👜 Lesser sac: behind STOMACH, before PANCREAS.",
    memoryAid: aid("The omental bursa lies posterior to stomach and liver, and anterior to pancreas.", "Lesser sac: behind stomach, before pancreas.", ["👜", "↔️"], "Bag and direction arrows cue the lesser sac's anterior-posterior relations.", "NCBI Bookshelf: Foramen of Winslow", "https://www.ncbi.nlm.nih.gov/books/NBK482186/"),
    sourceUrl: "https://www.ncbi.nlm.nih.gov/books/NBK482186/", finding: "NCBI identifies the lesser sac as the space posterior to the stomach; direct source-page review confirms its anterior pancreatic relation."
  },
  {
    id: "anatomy-anatomy-all-pdf-p0580-q0170", page: 580,
    expectedStem: "The abdominal aorta terminates as which of the following:", expectedOptions: ["Internal and external iliac arteries 13%", "External iliac and femoral artery 2%", "Right and left common iliac arteries", "Superior and inferior epigastric arteries", "Internal iliac and femoral artery 2%"],
    stem: "The abdominal aorta terminates as which arteries?", options: ["Internal and external iliac arteries", "External iliac and femoral artery", "Right and left common iliac arteries", "Superior and inferior epigastric arteries", "Internal iliac and femoral artery"], correctOption: 2,
    explanation: "The abdominal aorta ends at its iliac bifurcation, where it divides into the right and left common iliac arteries.",
    learningNote: "Abdominal aorta ends as paired common iliac arteries.", highYieldNote: "At its terminal bifurcation, the abdominal aorta divides into right and left common iliac arteries.", mnemonic: "🔀 Aorta splits into two COMMON iliacs.",
    memoryAid: aid("Abdominal aorta terminates by dividing into right and left common iliac arteries.", "Aorta splits into two COMMON iliacs.", ["🔀", "🩸"], "Split and vessel cues retain the terminal bifurcation.", "NCBI Bookshelf: Aorta", "https://www.ncbi.nlm.nih.gov/books/NBK537319/"),
    sourceUrl: "https://www.ncbi.nlm.nih.gov/books/NBK537319/", finding: "NCBI states that the abdominal aorta terminates by bifurcating into common iliac arteries."
  },
  {
    id: "anatomy-anatomy-all-pdf-p0581-q0171", page: 581,
    expectedStem: "The genitofemoral nerve supplies skin over which of the following regions:", expectedOptions: ["Posterolateral gluteal region 4%", "Lateral thigh 1%", "Upper medial thigh 25%", "Upper anterior thigh", "Posteromedial gluteal region 71%"],
    stem: "The genitofemoral nerve supplies skin over which region?", options: ["Posterolateral gluteal region", "Lateral thigh", "Upper medial thigh", "Upper anterior thigh", "Posteromedial gluteal region"], correctOption: 3,
    explanation: "The femoral branch of the genitofemoral nerve supplies skin of the upper anterior thigh. Its genital branch supplies external genital skin and, in males, the cremaster muscle.",
    learningNote: "Genitofemoral femoral branch: upper anterior thigh skin.", highYieldNote: "The femoral branch of the genitofemoral nerve supplies the upper anterior thigh.", mnemonic: "🦵 GenitoFEMORAL reaches the upper FRONT thigh.",
    memoryAid: aid("The femoral branch of genitofemoral nerve supplies upper anterior thigh skin.", "GenitoFEMORAL reaches the upper FRONT thigh.", ["🦵", "⬆️"], "Thigh and upward arrows cue the small upper anterior territory.", "NCBI Bookshelf: Genitofemoral Nerve", "https://www.ncbi.nlm.nih.gov/books/NBK430733/"),
    sourceUrl: "https://www.ncbi.nlm.nih.gov/books/NBK430733/", finding: "NCBI describes femoral-branch sensory supply to the thigh's upper anterior skin."
  },
  {
    id: "anatomy-anatomy-all-pdf-p0583-q0173", page: 583,
    expectedStem: "wy The iliohypogastric nerve innervates which of the following muscles:", expectedOptions: ["External and internal oblique muscles 10%", "Internal oblique and transversus abdominis muscles", "Transversus abdominis and rectus abdominus muscles 1%", "Psoas major and iliacus", "Quadratus lumborum 7h"],
    stem: "The iliohypogastric nerve innervates which muscles?", options: ["External and internal oblique muscles", "Internal oblique and transversus abdominis muscles", "Transversus abdominis and rectus abdominis muscles", "Psoas major and iliacus", "Quadratus lumborum"], correctOption: 1,
    explanation: "The iliohypogastric nerve arises from L1 and provides motor innervation to internal oblique and transversus abdominis. It also has cutaneous branches to the suprapubic and posterolateral gluteal regions.",
    learningNote: "Iliohypogastric motor supply: internal oblique plus transversus abdominis.", highYieldNote: "Iliohypogastric nerve supplies internal oblique and transversus abdominis.", mnemonic: "🧱 I-H supports the INNER abdominal wall.",
    memoryAid: aid("Iliohypogastric nerve supplies internal oblique and transversus abdominis.", "I-H supports the INNER abdominal wall.", ["🧱", "↔️"], "Wall and transverse arrows cue the two abdominal-wall muscles.", "NCBI Bookshelf: Posterior Abdominal Wall Nerves", "https://www.ncbi.nlm.nih.gov/books/NBK557605/"),
    sourceUrl: "https://www.ncbi.nlm.nih.gov/books/NBK557605/", finding: "NCBI explicitly lists internal oblique and transversus abdominis as iliohypogastric motor targets."
  },
  {
    id: "anatomy-anatomy-all-pdf-p0584-q0174", page: 584,
    expectedStem: "ww Regarding the rectus abdominis muscle, which of the following statements is INCORRECT:", expectedOptions: ["It originates from the pubic crest, pubic tubercle and pubic symphysis. 8%", "It inserts onto the costal cartilages of ribs 5 - 7 and to the xiphoid process. 12% (x) It is separated in the midline by the linea alba. 6%", "The free lower border of its aponeurosis forms the inguinal ligament.", "It is intersected along it length by tendinous intersections. 7%"],
    stem: "Regarding rectus abdominis, which statement is incorrect?", options: ["It originates from the pubic crest, pubic tubercle, and pubic symphysis.", "It inserts onto the costal cartilages of ribs 5–7 and the xiphoid process.", "It is separated in the midline by the linea alba.", "The free lower border of its aponeurosis forms the inguinal ligament.", "It is intersected along its length by tendinous intersections."], correctOption: 3,
    explanation: "The incorrect statement assigns formation of the inguinal ligament to rectus abdominis. The inguinal ligament is the thickened inferior border of the external oblique aponeurosis.",
    learningNote: "Inguinal ligament comes from external oblique aponeurosis, not rectus abdominis.", highYieldNote: "The inguinal ligament is formed from the inferior border of the external oblique aponeurosis, not rectus abdominis.", mnemonic: "🚫 Rectus does not make the groin ligament.",
    memoryAid: aid("Inguinal ligament is a thickened inferior part of external oblique aponeurosis, not rectus abdominis.", "Rectus does not make the groin ligament.", ["🚫", "🏹"], "Exclusion and groin cues distinguish rectus from external oblique.", "NCBI Bookshelf: Inguinal Region", "https://www.ncbi.nlm.nih.gov/sites/books/NBK470204/"),
    sourceUrl: "https://www.ncbi.nlm.nih.gov/sites/books/NBK470204/", finding: "NCBI identifies the inguinal ligament as a thickened inferior portion of the external oblique aponeurosis."
  },
  {
    id: "anatomy-anatomy-all-pdf-p0585-q0175", page: 585,
    expectedStem: "ww A50 year old man complains of lumps in his groin and is found to have painless superficial inguinal lymphadenopathy. Lymph node biopsy demonstrates malignant cells, which of the following sites is most likely the primary source of carcinoma:", expectedOptions: ["Prostate 13%", "Bladder ae", "Anal canal", "Sigmoid colon 3%"],
    stem: "A 50-year-old man has painless superficial inguinal lymphadenopathy containing malignant cells. Which site is the most likely primary source of carcinoma?", options: ["Prostate", "Bladder", "Anal canal", "Testes", "Sigmoid colon"], correctOption: 2,
    explanation: "Lymph from the anal canal below the pectinate line drains to superficial inguinal nodes. This makes anal canal the supported answer among the source options.",
    learningNote: "Below pectinate line, anal canal drains to superficial inguinal nodes.", highYieldNote: "The anal canal below the pectinate line drains to superficial inguinal lymph nodes.", mnemonic: "⬇️ Below pectinate goes to GROIN.",
    memoryAid: aid("Anal canal below the pectinate line drains to superficial inguinal lymph nodes.", "Below pectinate goes to groin.", ["⬇️", "📍"], "Downward line and groin pin cue below-line drainage.", "NCBI Bookshelf: Inguinal Lymph Node", "https://www.ncbi.nlm.nih.gov/books/NBK557639/"),
    sourceUrl: "https://www.ncbi.nlm.nih.gov/books/NBK557639/", finding: "NCBI states that superficial inguinal nodes drain the anal canal below the pectinate line."
  },
  {
    id: "anatomy-anatomy-all-pdf-p0586-q0176", page: 586,
    expectedStem: "ww Regarding the female urethra, which of the following statements is CORRECT:", expectedOptions: ["The urethra is longer in women than it is in men. 1%", "The urethra begins at the apex of the bladder. 10%", "The urethra opens in the vestibule that lies between the labia minora.", "The inferior aspect of the urethra is bound to the posterior surface of the vagina. 4%", "The internal urethral sphincter surrounds the urethra as it passes through the pelvic floor. 13%"],
    stem: "Regarding the female urethra, which statement is correct?", options: ["The urethra is longer in women than in men.", "The urethra begins at the apex of the bladder.", "The urethra opens in the vestibule between the labia minora.", "The inferior aspect of the urethra is bound to the posterior surface of the vagina.", "The internal urethral sphincter surrounds the urethra as it passes through the pelvic floor."], correctOption: 2,
    explanation: "The female urethra opens in the vulvar vestibule between the labia minora, posterior to the clitoris and anterior to the vaginal opening.",
    learningNote: "Female urethral opening: vulvar vestibule between labia minora.", highYieldNote: "The female urethra opens in the vulvar vestibule between the labia minora.", mnemonic: "🚪 Urethra opens in the vestibule.",
    memoryAid: aid("Female urethral opening lies in the vulvar vestibule between the labia minora.", "Urethra opens in the vestibule.", ["🚪", "📍"], "Door and location-pin cues fix the external opening.", "NCBI Bookshelf: Female External Genitalia", "https://www.ncbi.nlm.nih.gov/books/NBK547703/"),
    sourceUrl: "https://www.ncbi.nlm.nih.gov/books/NBK547703/", finding: "NCBI identifies the vestibule as the space between labia minora and states that the female urethra opens within it."
  }
];

const restrictions = [
  {
    id: "anatomy-anatomy-all-pdf-p0574-q0166", page: 574,
    expectedStem: "Abdomen Visceral afferent fibres from the pancreas travel to which of the following spinal cord levels:", expectedOptions: ["11-12", "T4-16 oe", "q0= 112 @)"],
    stem: "Visceral afferent fibres from the pancreas travel to which spinal cord levels?", options: ["T1–T2", "T4–T6", "T6–T10", "T10–T12", "T12–L2"],
    explanation: "The source page marks T6–T10, but external evidence distinguishes T6–T10 sympathetic innervation from an afferent-specific T6–L2 dorsal-root-ganglion range. This record remains excluded because the exact source key is not precisely corroborated.",
    warning: "Source page reviewed, but the exact pancreatic visceral-afferent segment range is not precisely corroborated by reviewed external evidence. This record remains excluded from answer learning.",
    sourceUrl: "https://doi.org/10.3389/fnana.2021.691777", finding: "A peer-reviewed review reports pancreatic sympathetic afferents arising from dorsal-root-ganglion neurons at T6–L2, conflicting with the source key's T6–T10-only range."
  },
  {
    id: "anatomy-anatomy-all-pdf-p0582-q0172", page: 582,
    expectedStem: "ww The lymph drainage of the anal canal above the pectinate line is initially to the:", expectedOptions: ["Internal iliac nodes", "External iliac nodes 5%", "Superficial inguinal nodes 9%", "Deep inguinal nodes 10%"],
    stem: "The lymphatic drainage of the anal canal above the pectinate line is initially to which nodes?", options: ["Internal iliac nodes", "External iliac nodes", "Superficial inguinal nodes", "Deep inguinal nodes", "Preaortic nodes"],
    explanation: "The source page marks internal iliac nodes. Reviewed NCBI references conflict between internal-iliac and inferior-mesenteric drainage for the superior anal canal, so this record remains excluded rather than assigning a learning key.",
    warning: "Source page reviewed, but the exact above-pectinate lymphatic-drainage formulation is unresolved across reviewed external anatomy references. This record remains excluded from answer learning.",
    sourceUrl: "https://www.ncbi.nlm.nih.gov/books/NBK554531/", finding: "One NCBI reference states above-pectinate drainage to inferior mesenteric nodes, while another states superior anal-canal drainage via internal iliac nodes."
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
  if (!["ocr_draft", "needs_review", "needs_image"].includes(draft.status)) throw new Error(`Unexpected status for ${item.id}`);
}

const source = await readFile(bankPath, "utf8");
const parsed = parseDrafts(source);
const byId = new Map(parsed.drafts.map((item) => [item.id, item]));
const applied = [], restricted = [];
for (const item of restorations) {
  const draft = byId.get(item.id); assertSnapshot(draft, item);
  const before = { stem: draft.stem, options: draft.options, correctOption: draft.correctOption, status: draft.status, askable: draft.askable, warnings: draft.warnings ?? [] };
  Object.assign(draft, { stem: item.stem, options: item.options, correctOption: item.correctOption, explanation: item.explanation, learningNote: item.learningNote, highYieldNote: item.highYieldNote, mnemonic: item.mnemonic, memoryAid: item.memoryAid, status: "ocr_draft", askable: true, needsImage: false, warnings: [reviewedWarning] });
  applied.push({ id: item.id, sourcePage: item.page, before, after: { stem: draft.stem, options: draft.options, correctOption: draft.correctOption, status: draft.status, askable: draft.askable, warnings: draft.warnings }, evidence: { externalSource: item.sourceUrl, externalFinding: item.finding } });
}
for (const item of restrictions) {
  const draft = byId.get(item.id); assertSnapshot(draft, item);
  const before = { stem: draft.stem, options: draft.options, correctOption: draft.correctOption, status: draft.status, askable: draft.askable, warnings: draft.warnings ?? [], highYieldNote: draft.highYieldNote, mnemonic: draft.mnemonic, memoryAid: draft.memoryAid };
  Object.assign(draft, { stem: item.stem, options: item.options, correctOption: null, explanation: item.explanation, learningNote: "", status: "needs_review", askable: false, needsImage: false, highYieldNote: undefined, mnemonic: undefined, memoryAid: undefined, warnings: [item.warning] });
  restricted.push({ id: item.id, sourcePage: item.page, before, after: { stem: draft.stem, options: draft.options, correctOption: draft.correctOption, status: draft.status, askable: draft.askable, warnings: draft.warnings }, evidence: { externalSource: item.sourceUrl, externalFinding: item.finding } });
}
await writeFile(bankPath, `${source.slice(0, parsed.arrayStart)}${JSON.stringify(parsed.drafts)}${source.slice(parsed.end + 1)}`);
await mkdir(auditDir, { recursive: true });
await writeFile(path.join(auditDir, "applied-anatomy-batch-17.json"), `${JSON.stringify({ generatedAt: new Date().toISOString(), applied, restricted, automaticApproval: false, mockEligibility: "No restored OCR draft is mock eligible." }, null, 2)}\n`);
console.log(JSON.stringify({ restored: applied.map((row) => row.id), restricted: restricted.map((row) => row.id), automaticApproval: false }, null, 2));
