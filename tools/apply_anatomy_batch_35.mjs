import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const bankPath = path.join(root, "client", "src", "lib", "ocrDraftSections.ts");
const snapshotPath = path.join(root, "docs", "audit", "anatomy-all-pdf-batch-35-ocr-records.json");
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
    "anatomy-anatomy-all-pdf-p1105-q0107",
    1105,
    "A 29 year patient presents to ED complaining of a painless lump in his scrotum. Imaging shows a tumour affecting the scrotum but sparing the testis. Where would the lymph from this area of pathology drain to initially:",
    ["Deep inguinal nodes Internal iliac nodes 1%", "Lumbar nodes Qrmnenncmeme"],
    "A 29 year patient presents to ED complaining of a painless lump in his scrotum. Imaging shows a tumour affecting the scrotum but sparing the testis. Where would the lymph from this area of pathology drain to initially:",
    ["Deep inguinal nodes", "Superficial inguinal nodes", "Internal iliac nodes", "Lumbar nodes", "Inferior mesenteric lymph nodes"],
    1,
    "Lymph from the scrotal wall drains initially to superficial inguinal nodes, unlike testicular lymph, which drains to lumbar (para-aortic) nodes.",
    "Scrotum superficial; testis travels to lumbar.",
    aid("The scrotal wall drains first to superficial inguinal nodes, whereas the testes drain to lumbar nodes.", "Scrotum superficial; testis travels to lumbar.", ["🩲", "🧭"], "NCBI Bookshelf: Scrotal Masses", "https://www.ncbi.nlm.nih.gov/books/NBK549893/"),
    "https://www.ncbi.nlm.nih.gov/books/NBK549893/",
    "NCBI distinguishes superficial-inguinal drainage of the scrotal wall from lumbar drainage of scrotal contents."
  ),
  restore(
    "anatomy-anatomy-all-pdf-p1108-q0108",
    1108,
    "The roof of the inguinal canal is formed primarily by which of the following structures:",
    ["Transversus abdominis and internal oblique muscles", "External oblique muscle", "External oblique aponeurosis", "Transversalis fascia", "Rectus abdominis muscle"],
    "The roof of the inguinal canal is formed primarily by which of the following structures:",
    ["Transversus abdominis and internal oblique muscles", "External oblique muscle", "External oblique aponeurosis", "Transversalis fascia", "Rectus abdominis muscle"],
    0,
    "Arching fibres of transversus abdominis and internal oblique form the roof of the inguinal canal.",
    "Roof: transverse plus internal oblique arches.",
    aid("The inguinal-canal roof is formed by the arching fibres of transversus abdominis and internal oblique.", "Roof: transverse plus internal oblique arches.", ["🏠", "🧵"], "NCBI Bookshelf: Inguinal Canal", "https://www.ncbi.nlm.nih.gov/books/NBK470204/"),
    "https://www.ncbi.nlm.nih.gov/books/NBK470204/",
    "NCBI describes the canal roof as arching fibres of internal oblique and transversus abdominis."
  ),
  restore(
    "anatomy-anatomy-all-pdf-p1109-q0109",
    1109,
    "ww The abdominal aorta begins at which vertebral level:",
    ["™ 4% (v 112 70% E a]", "L2 2%"],
    "The abdominal aorta begins at which vertebral level:",
    ["T10", "T11", "T12", "L1", "L2"],
    2,
    "The descending thoracic aorta becomes the abdominal aorta as it passes through the aortic hiatus at T12.",
    "Aortic hiatus at T12 starts the abdominal aorta.",
    aid("The abdominal aorta begins at the aortic hiatus at the T12 level.", "Aortic hiatus at T12 starts the abdominal aorta.", ["🩸", "1️⃣2️⃣"], "NCBI Bookshelf: Aortic Hiatus", "https://www.ncbi.nlm.nih.gov/books/NBK532972/"),
    "https://www.ncbi.nlm.nih.gov/books/NBK532972/",
    "NCBI places the aortic hiatus at T12 where the descending aorta continues as the abdominal aorta."
  ),
  restore(
    "anatomy-anatomy-all-pdf-p1116-q0112",
    1116,
    "Which of the following structures does NOT pass through the inguinal canal:",
    ["Genital branch of genitofemoral nerve 4%", "llioinguinal nerve 5%", "Spermatic cord 2%", "Round ligament 6%", "Inferior epigastric artery"],
    "Which of the following structures does NOT pass through the inguinal canal:",
    ["Genital branch of genitofemoral nerve", "Ilioinguinal nerve", "Spermatic cord", "Round ligament", "Inferior epigastric artery"],
    4,
    "The inguinal canal transmits the spermatic cord or round ligament, ilioinguinal nerve, and genital branch of the genitofemoral nerve; the inferior epigastric artery does not enter it.",
    "Canal carries cord, round ligament, and nerves, not epigastric artery.",
    aid("The inferior epigastric artery lies at the deep-ring margin and does not pass through the inguinal canal.", "Canal carries cord, round ligament, and nerves, not epigastric artery.", ["🚇", "🚫"], "NCBI Bookshelf: Inguinal Canal", "https://www.ncbi.nlm.nih.gov/books/NBK470204/"),
    "https://www.ncbi.nlm.nih.gov/books/NBK470204/",
    "NCBI lists canal contents and locates the inferior epigastric vessels at the deep-ring margin rather than within the canal."
  ),
  restore(
    "anatomy-anatomy-all-pdf-p1120-q0113",
    1120,
    "ww The superficial inguinal ring is an ‘opening’ in which of the following structures:",
    ["External oblique aponeurosis", "Internal oblique aponeurosis 5%", "Transversus abdominis aponeurosis 5%", "Rectus abdominis aponeurosis 2%", "Transversalis fascia 1%"],
    "The superficial inguinal ring is an 'opening' in which of the following structures:",
    ["External oblique aponeurosis", "Internal oblique aponeurosis", "Transversus abdominis aponeurosis", "Rectus abdominis aponeurosis", "Transversalis fascia"],
    0,
    "The superficial inguinal ring is the triangular terminal opening in the external oblique aponeurosis.",
    "Superficial ring equals external oblique opening.",
    aid("The superficial inguinal ring is a triangular opening in the external oblique aponeurosis.", "Superficial ring equals external oblique opening.", ["🔺", "🚪"], "NCBI Bookshelf: Inguinal Canal", "https://www.ncbi.nlm.nih.gov/books/NBK470204/"),
    "https://www.ncbi.nlm.nih.gov/books/NBK470204/",
    "NCBI describes the superficial inguinal ring as the terminal triangular opening in external oblique aponeurosis."
  ),
  restore(
    "anatomy-anatomy-all-pdf-p1121-q0114",
    1121,
    "ww The sacrum articulates with which of the following structures:",
    ["Pubis of the pelvic bone 4%", "Ischium of the pelvic bone 19% () ium of the pelvic bone 69%", "Ischial tuberosity 4%", "Pubic ramus 4%"],
    "The sacrum articulates with which of the following structures:",
    ["Pubis of the pelvic bone", "Ischium of the pelvic bone", "Ilium of the pelvic bone", "Ischial tuberosity", "Pubic ramus"],
    2,
    "The sacrum articulates bilaterally with the ilia at the sacroiliac joints.",
    "Sacrum plus ilium forms the SI joint.",
    aid("The sacral alae articulate with the ilia bilaterally at the sacroiliac joints.", "Sacrum plus ilium forms the SI joint.", ["🦴", "↔️"], "NCBI Bookshelf: Sacral Vertebrae", "https://www.ncbi.nlm.nih.gov/books/NBK551653/"),
    "https://www.ncbi.nlm.nih.gov/books/NBK551653/",
    "NCBI states that the sacral alae articulate bilaterally with the ilia at sacroiliac joints."
  ),
  restore(
    "anatomy-anatomy-all-pdf-p1125-q0115",
    1125,
    "Which of the following best describes the relationship of the bladder and prostate gland:",
    ["The prostate gland lies anterosuperior to the bladder.", "The prostate gland lies posterosuperior to the bladder.", "The prostate gland lies superior to the bladder. (x) e prostate gland lies posteroinferior to the bladder. 23%"],
    "Which of the following best describes the relationship of the bladder and prostate gland:",
    ["The prostate gland lies anterosuperior to the bladder.", "The prostate gland lies posterosuperior to the bladder.", "The prostate gland lies superior to the bladder.", "The prostate gland lies inferior to the bladder.", "The prostate gland lies posteroinferior to the bladder."],
    3,
    "The prostate lies immediately inferior to the urinary bladder and surrounds the proximal urethra.",
    "Prostate sits below the bladder.",
    aid("The prostate lies directly inferior to the bladder and surrounds the proximal urethra.", "Prostate sits below the bladder.", ["⬇️", "💧"], "NCBI Bookshelf: Prostate", "https://www.ncbi.nlm.nih.gov/books/NBK540987/"),
    "https://www.ncbi.nlm.nih.gov/books/NBK540987/",
    "NCBI directly places the prostate inferior to the bladder in the lesser pelvis."
  ),
];

const restrictions = [
  {
    id: "anatomy-anatomy-all-pdf-p1112-q0110",
    page: 1112,
    expectedStem: "The rectus sheath encloses all of the following structures except the:",
    expectedOptions: ["Lower thoracic intercostal nerves", "Superior epigastric artery", "Inferior epigastric artery"],
    stem: "The rectus sheath encloses all of the following structures except the:",
    options: ["Transversus abdominis muscle", "Pyramidalis muscle", "Lower thoracic intercostal nerves", "Superior epigastric artery", "Inferior epigastric artery"],
    warning: "Source page reviewed, but current anatomy evidence documents transversus abdominis muscle within the rectus sheath near the costal margin; the stem's absolute exclusion is not safely inferred.",
    sourceUrl: "https://www.ncbi.nlm.nih.gov/books/NBK537153/",
    finding: "NCBI records a study finding transversus abdominis muscle within the rectus sheath near the costal margin, so the absolute exclusion wording is not stable."
  },
  {
    id: "anatomy-anatomy-all-pdf-p1115-q0111",
    page: 1115,
    expectedStem: "Ad The iliohypogastric nerve is formed from the anterior rami of:",
    expectedOptions: ["11-12 18% c a", "ets i"],
    stem: "The iliohypogastric nerve is formed from the anterior rami of:",
    options: ["L1", "L1 - L2", "L2", "L2 - L3", "L4"],
    warning: "Source page reviewed, but NCBI and systematic-review evidence document T12 contributions and variable iliohypogastric roots; the unqualified L1-only key is not safely inferred.",
    sourceUrl: "https://www.ncbi.nlm.nih.gov/books/NBK545137/",
    finding: "NCBI describes the iliohypogastric nerve as T12-L1, and a systematic review documents substantial variation, including T12-L1 origins."
  },
  {
    id: "anatomy-anatomy-all-pdf-p1129-q0116",
    page: 1129,
    expectedStem: "ww The body of the pancreas lies at which of the following vertebral levels:",
    expectedOptions: ["™ 7%", "L2 26%"],
    stem: "The body of the pancreas lies at which of the following vertebral levels:",
    options: ["T11", "T12", "L1", "L2", "L3"],
    warning: "Source page reviewed, but current references place the pancreas across L1-L2 and its body over L2; the displayed singular L1 body-level key is not safely inferred.",
    sourceUrl: "https://www.ncbi.nlm.nih.gov/books/NBK532912/",
    finding: "Current NCBI material places the pancreas across L1-L2 and specifically describes the body as passing over L2, conflicting with the singular L1 formulation."
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
  path.join(auditDir, "applied-anatomy-batch-35.json"),
  `${JSON.stringify({ generatedAt: new Date().toISOString(), applied, restricted, automaticApproval: false, mockEligibility: "No restored OCR draft is mock eligible." }, null, 2)}\n`
);
console.log(JSON.stringify({ restored: applied.length, restricted: restricted.length, automaticApproval: false }, null, 2));
