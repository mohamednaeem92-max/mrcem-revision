/** Guarded Anatomy Batch 04 restoration; no record is approved by this script. */
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const bankPath = path.join(root, "client", "src", "lib", "ocrDraftSections.ts");
const auditDir = path.join(root, "docs", "audit");
const reviewedWarning = "Source page and external anatomy reference reviewed; remains an unapproved OCR draft.";

const restorations = [
  {
    id: "anatomy-anatomy-all-pdf-p0137-q0034", page: 137,
    expectedStem: "iv e) ww The flat anterior abdominal wall muscles are comprised of which of the following muscles: (x) The external and internal oblique muscles 2%",
    expectedOptions: ["The external, internal and innermost oblique muscles 2%", "The external oblique, internal oblique and rectus abdominis muscles 21%", "The external oblique, internal oblique and transversus abdominis muscles", "The rectus abdominis and transversus abdominis muscles 1%"],
    stem: "The flat anterior abdominal wall muscles are comprised of which muscles?",
    options: ["The external and internal oblique muscles", "The external, internal and innermost oblique muscles", "The external oblique, internal oblique and rectus abdominis muscles", "The external oblique, internal oblique and transversus abdominis muscles", "The rectus abdominis and transversus abdominis muscles"],
    correctOption: 3,
    explanation: "The flat anterolateral abdominal muscles are external oblique, internal oblique, and transversus abdominis. Rectus abdominis is a vertical abdominal-wall muscle.",
    learningNote: "From superficial to deep, the flat lateral abdominal-wall muscles are external oblique, internal oblique, and transversus abdominis.",
    highYieldNote: "Three flat abdominal-wall muscles: external oblique, internal oblique, transversus abdominis.",
    mnemonic: "🧱 Flat wall layers: external oblique, internal oblique, transversus abdominis.",
    memoryAid: { coreFact: "External oblique, internal oblique, and transversus abdominis are the flat anterolateral abdominal muscles.", mnemonic: "Flat wall layers: external oblique, internal oblique, transversus abdominis.", emojiCues: ["🧱", "3️⃣"], cueLabel: "A wall and three cue the three flat abdominal muscle layers.", sourceLabel: "NCBI Bookshelf: Abdominal Wall", sourceUrl: "https://www.ncbi.nlm.nih.gov/books/NBK551649/" },
    sourceUrl: "https://www.ncbi.nlm.nih.gov/books/NBK551649/", finding: "External oblique, internal oblique, and transversus abdominis are anterolateral abdominal-wall muscles."
  },
  {
    id: "anatomy-anatomy-all-pdf-p0140-q0035", page: 140,
    expectedStem: "A 45 year old overweight patient presents to ED complaining of fever and severe right upper quadrant pain. The pain radiates to her right shoulder tip. Murphy's sign is positive and you diagnose acute cholecystitis. Which of the following nerves is responsible for the pain referred to the shoulder tip:",
    expectedOptions: ["Vagus nerve 53%", "Greater thoracic splanchnic nerve 4% (x) Intercostal nerves 2%", "Lesser thoracic splanchnic nerve 1%"],
    stem: "A 45-year-old patient presents to the ED with fever and severe right upper-quadrant pain radiating to the right shoulder tip. Murphy's sign is positive and acute cholecystitis is diagnosed. Which nerve mediates the referred shoulder-tip pain?",
    options: ["Vagus nerve", "Phrenic nerve", "Greater thoracic splanchnic nerve", "Intercostal nerves", "Lesser thoracic splanchnic nerve"],
    correctOption: 1,
    explanation: "Gallbladder inflammation can irritate diaphragmatic peritoneum. Afferents travelling with the right phrenic nerve can refer pain to the right shoulder tip.",
    learningNote: "Right shoulder-tip pain in biliary inflammation is a diaphragmatic-peritoneal referral pattern through the right phrenic nerve.",
    highYieldNote: "Right shoulder-tip referral in cholecystitis: diaphragmatic irritation via the right phrenic nerve.",
    mnemonic: "🫁➡️🧍 Phrenic diaphragm irritation can refer to the shoulder.",
    memoryAid: { coreFact: "Diaphragmatic peritoneal irritation in cholecystitis may refer pain to the right shoulder via the right phrenic nerve.", mnemonic: "Phrenic diaphragm irritation can refer to the shoulder.", emojiCues: ["🫁", "➡️", "🧍"], cueLabel: "A diaphragm, arrow, and shoulder cue the phrenic referral pathway.", sourceLabel: "NCBI Bookshelf: Gallbladder", sourceUrl: "https://www.ncbi.nlm.nih.gov/books/NBK459288/" },
    sourceUrl: "https://www.ncbi.nlm.nih.gov/books/NBK459288/", finding: "Diaphragmatic peritoneal irritation refers pain to the right shoulder through the right phrenic nerve."
  },
  {
    id: "anatomy-anatomy-all-pdf-p0143-q0036", page: 143,
    expectedStem: "The pre-aortic lymph nodes receive lymph from all of the following structures EXCEPT for the:",
    expectedOptions: ["Pancreas", "Spleen", "Sigmoid colon"],
    stem: "The pre-aortic lymph nodes receive lymph from all of the following structures EXCEPT the:",
    options: ["Kidneys", "Pancreas", "Spleen", "Sigmoid colon", "Appendix"],
    correctOption: 0,
    explanation: "The kidneys drain to lumbar (para-aortic) lymph nodes. Pre-aortic nodes drain abdominal gastrointestinal structures and associated organs such as the spleen and pancreas.",
    learningNote: "Distinguish renal para-aortic drainage from pre-aortic drainage of abdominal gastrointestinal structures.",
    highYieldNote: "Kidneys drain to lumbar (para-aortic), not pre-aortic, lymph nodes.",
    mnemonic: "🫘⬅️ Para-aortic: kidneys sit by the aorta.",
    memoryAid: { coreFact: "Kidneys drain to lumbar (para-aortic) lymph nodes rather than pre-aortic nodes.", mnemonic: "Para-aortic: kidneys sit by the aorta.", emojiCues: ["🫘", "⬅️"], cueLabel: "A kidney and leftward aortic relation cue para-aortic renal drainage.", sourceLabel: "NCBI Bookshelf: Lymphatic Drainage", sourceUrl: "https://www.ncbi.nlm.nih.gov/books/NBK557720/" },
    sourceUrl: "https://www.ncbi.nlm.nih.gov/books/NBK557720/", finding: "Para-aortic nodes drain kidneys, while pre-aortic nodes drain gastrointestinal structures, spleen, and pancreas."
  },
  {
    id: "anatomy-anatomy-all-pdf-p0146-q0037", page: 146,
    expectedStem: "The quadrate and caudate lobes of the liver are separated by which of the following structures:",
    expectedOptions: ["Ligamentum venosum", "Gallbladder", "Inferior vena cava"],
    stem: "The quadrate and caudate lobes of the liver are separated by which structure?",
    options: ["Ligamentum venosum", "Ligamentum teres", "Gallbladder", "Inferior vena cava", "Porta hepatis"],
    correctOption: 4,
    explanation: "The porta hepatis lies between the quadrate lobe anteriorly and the caudate lobe posteriorly, so it separates these lobes on the visceral surface.",
    learningNote: "On the visceral liver surface, quadrate is anterior and caudate is posterior to the porta hepatis.",
    highYieldNote: "Porta hepatis separates the caudate (posterior) and quadrate (anterior) lobes.",
    mnemonic: "🚪 Porta = liver doorway between caudate and quadrate.",
    memoryAid: { coreFact: "The porta hepatis lies between the quadrate and caudate lobes of the liver.", mnemonic: "Porta is the liver doorway between caudate and quadrate.", emojiCues: ["🚪", "🫀"], cueLabel: "A door and liver cue the porta hepatis relation.", sourceLabel: "NCBI Bookshelf: Liver", sourceUrl: "https://www.ncbi.nlm.nih.gov/books/NBK500014/" },
    sourceUrl: "https://www.ncbi.nlm.nih.gov/books/NBK500014/", finding: "The caudate lobe is posterior and the quadrate lobe anterior to the porta hepatis."
  },
  {
    id: "anatomy-anatomy-all-pdf-p0153-q0038", page: 153,
    expectedStem: "The superficial inguinal ring is located at which of the following sites:",
    expectedOptions: ["Just superior to the midpoint of the inguinal ligament (x) Superior to a point midway between the anterior superior iliac spine and the pubic symphysis 13%", "Superior to a point midway between the anterior superior iliac spine and the pubic tubercle", "Immediately lateral to the inferior epigastric vessels"],
    stem: "The superficial inguinal ring is located at which site?",
    options: ["Just superior to the midpoint of the inguinal ligament", "Superior to a point midway between the anterior superior iliac spine and the pubic symphysis", "Superior to a point midway between the anterior superior iliac spine and the pubic tubercle", "Just superior to the pubic tubercle", "Immediately lateral to the inferior epigastric vessels"],
    correctOption: 3,
    explanation: "The superficial inguinal ring is an opening in the external-oblique aponeurosis situated just superior to the pubic tubercle.",
    learningNote: "Use the pubic tubercle as the surface landmark for the superficial inguinal ring.",
    highYieldNote: "Superficial inguinal ring: just superior to the pubic tubercle.",
    mnemonic: "⬆️ Pubic tubercle: the superficial ring sits just above.",
    memoryAid: { coreFact: "The superficial inguinal ring lies just superior to the pubic tubercle.", mnemonic: "The superficial ring sits just above the pubic tubercle.", emojiCues: ["⬆️", "⭕"], cueLabel: "An upward arrow and ring cue the superficial ring above the pubic tubercle.", sourceLabel: "NCBI Bookshelf: Inguinal Region", sourceUrl: "https://www.ncbi.nlm.nih.gov/books/NBK470204/" },
    sourceUrl: "https://www.ncbi.nlm.nih.gov/books/NBK470204/", finding: "The superficial inguinal ring is located just superior to the pubic tubercle."
  },
  {
    id: "anatomy-anatomy-all-pdf-p0161-q0040", page: 161,
    expectedStem: "ww The anterior abdominal wall muscles are innervated by:",
    expectedOptions: ["The anterior rami of L1 - L3 6%", "The anterior rami of T7 - T12 and L1", "The anterior rami of T12 and L1 - L4 15%", "The phrenic nerve 1%", "The anterior rami of T7 - T10 6%"],
    stem: "The anterior abdominal-wall muscles are innervated by which nerves?",
    options: ["The anterior rami of L1-L3", "The anterior rami of T7-T12 and L1", "The anterior rami of T12 and L1-L4", "The phrenic nerve", "The anterior rami of T7-T10"],
    correctOption: 1,
    explanation: "The anterior abdominal wall receives primary sensory and motor innervation from anterior rami T7-T12. L1 contributes through the ilioinguinal and iliohypogastric nerve pathway.",
    learningNote: "T7-T12 are the primary segmental nerves of the anterior abdominal wall; L1 contributes to its inferior region through ilioinguinal and iliohypogastric nerves.",
    highYieldNote: "Anterior abdominal wall: anterior rami T7-T12, with L1 contribution through ilioinguinal/iliohypogastric nerves.",
    mnemonic: "7️⃣➡️1️⃣2️⃣ + 1️⃣: thoracoabdominal nerves plus L1.",
    memoryAid: { coreFact: "Anterior abdominal-wall innervation is primarily from anterior rami T7-T12, with L1 contribution via ilioinguinal and iliohypogastric nerves.", mnemonic: "T7-T12 plus L1 covers the anterior abdominal wall.", emojiCues: ["7️⃣", "1️⃣2️⃣", "1️⃣"], cueLabel: "The T7, T12, and L1 sequence cues segmental abdominal-wall innervation.", sourceLabel: "NCBI Bookshelf: Anterolateral Abdominal Wall", sourceUrl: "https://www.ncbi.nlm.nih.gov/books/NBK525975/" },
    sourceUrl: "https://www.ncbi.nlm.nih.gov/books/NBK525975/", finding: "Anterior rami T7-T12 provide primary motor and sensory supply; T12 and L1 contribute to the ilioinguinal/iliohypogastric trunk."
  },
  {
    id: "anatomy-anatomy-all-pdf-p0164-q0041", page: 164,
    expectedStem: "Regarding the appendix, which of the following statements is CORRECT:",
    expectedOptions: ["The appendix has a highly variable attachment site to the caecum.", "The appendix is a retroperitoneal structure. (x) The surface projection of the base of the appendix is called Murphy's point. 71%", "The subcaecal position is the most common position of the appendix."],
    stem: "Regarding the appendix, which statement is correct?",
    options: ["The psoas sign may be positive in retrocaecal appendicitis.", "The appendix has a highly variable attachment site to the caecum.", "The appendix is a retroperitoneal structure.", "The surface projection of the base of the appendix is called Murphy's point.", "The subcaecal position is the most common position of the appendix."],
    correctOption: 0,
    explanation: "A retrocaecal appendix can irritate the psoas muscle and produce a positive psoas sign. The appendix base is located by following the taeniae coli to their convergence.",
    learningNote: "A retrocaecal appendix lies near psoas, which explains the psoas sign when the muscle is stretched.",
    highYieldNote: "Retrocaecal appendicitis can give a positive psoas sign through psoas irritation.",
    mnemonic: "🦵 Retrocaecal appendix can irritate psoas during hip extension.",
    memoryAid: { coreFact: "A retrocaecal appendix can cause a positive psoas sign through psoas irritation.", mnemonic: "Retrocaecal appendix can irritate psoas during hip extension.", emojiCues: ["🦵", "📍"], cueLabel: "A hip and location pin cue psoas irritation from a retrocaecal appendix.", sourceLabel: "NCBI Bookshelf: Appendix", sourceUrl: "https://www.ncbi.nlm.nih.gov/books/NBK459205/" },
    sourceUrl: "https://www.ncbi.nlm.nih.gov/books/NBK459205/", finding: "A retrocaecal appendix may produce a positive psoas sign from psoas irritation."
  },
  {
    id: "anatomy-anatomy-all-pdf-p0167-q0042", page: 167,
    expectedStem: "Ld The arterial supply to the colon is derived predominantly from which of the following:",
    expectedOptions: ["Lumbar arteries 1%", "Superior and inferior mesenteric arteries", "Renal artery 0%", "Common iliac artery 1%"],
    stem: "The arterial supply to the colon is derived predominantly from which arteries?",
    options: ["Coeliac trunk", "Lumbar arteries", "Superior and inferior mesenteric arteries", "Renal artery", "Common iliac artery"],
    correctOption: 2,
    explanation: "The large intestine receives arterial supply from the superior mesenteric artery and inferior mesenteric artery.",
    learningNote: "SMA supplies the proximal large intestine; IMA supplies the distal large intestine.",
    highYieldNote: "Colon blood supply is predominantly from the SMA and IMA.",
    mnemonic: "⬆️⬇️ Mesenteric pair: SMA then IMA supplies the colon.",
    memoryAid: { coreFact: "The large intestine receives arterial supply from the superior and inferior mesenteric arteries.", mnemonic: "SMA then IMA supplies the colon.", emojiCues: ["⬆️", "⬇️", "🩸"], cueLabel: "Up, down, and blood cue the superior and inferior mesenteric arterial pair.", sourceLabel: "NCBI Bookshelf: Large Intestine", sourceUrl: "https://www.ncbi.nlm.nih.gov/books/NBK470577/" },
    sourceUrl: "https://www.ncbi.nlm.nih.gov/books/NBK470577/", finding: "The large intestine receives arterial supply from the superior mesenteric artery and inferior mesenteric artery."
  },
  {
    id: "anatomy-anatomy-all-pdf-p0172-q0043", page: 172,
    expectedStem: "Which of the following is a retroperitoneal structure: Sigmoid colon 1% lleum 2% Liver 1%",
    expectedOptions: [],
    stem: "Which of the following is a retroperitoneal structure?",
    options: ["Sigmoid colon", "Second part of duodenum", "Ileum", "Liver", "Spleen"],
    correctOption: 1,
    explanation: "The duodenum beyond its proximal first part is retroperitoneal. Therefore, the second part of the duodenum is a retroperitoneal structure.",
    learningNote: "The proximal first part of the duodenum is intraperitoneal; the remaining duodenum is retroperitoneal.",
    highYieldNote: "Second part of the duodenum is retroperitoneal; most of the duodenum after the proximal first part is retroperitoneal.",
    mnemonic: "2️⃣ Duodenum: after the proximal first part, it is retroperitoneal.",
    memoryAid: { coreFact: "The second part of the duodenum is retroperitoneal; the duodenum beyond the proximal first part is retroperitoneal.", mnemonic: "After the proximal first part, duodenum is retroperitoneal.", emojiCues: ["2️⃣", "🔙"], cueLabel: "Two and a back arrow cue the second part behind the peritoneum.", sourceLabel: "NCBI Bookshelf: Duodenum", sourceUrl: "https://www.ncbi.nlm.nih.gov/books/NBK482390/" },
    sourceUrl: "https://www.ncbi.nlm.nih.gov/books/NBK482390/", finding: "The duodenum beyond the first part is retroperitoneal."
  }
];

const restrictions = [
  {
    id: "anatomy-anatomy-all-pdf-p0157-q0039", page: 157,
    expectedStem: "The abdominal aorta lies posterior to which of the following parts of the duodenum:",
    expectedOptions: ["First part", "First and second parts", "Second and third parts"],
    warning: "Source page reviewed, but authoritative anatomy directly verifies the third part anterior to the aorta and describes the fourth part as ascending to its left. The source-marked combined answer remains unresolved and excluded from answer learning."
  }
];

function parseDrafts(source) {
  const prefix = "export const ocrDraftQuestions: OcrDraftQuestion[] = ";
  const start = source.indexOf(prefix); const arrayStart = start + prefix.length; const end = source.indexOf("];", arrayStart);
  if (start < 0 || end < 0) throw new Error("OCR draft export not found");
  return { prefix, start, arrayStart, end, drafts: JSON.parse(source.slice(arrayStart, end + 1)) };
}

function assertSnapshot(draft, item) {
  if (!draft || draft.sourcePage !== item.page) throw new Error(`Source-page drift for ${item.id}`);
  if (draft.stem !== item.expectedStem || JSON.stringify(draft.options) !== JSON.stringify(item.expectedOptions)) {
    throw new Error(`OCR drift for ${item.id}; refusing update.`);
  }
  if (!["ocr_draft", "needs_review"].includes(draft.status)) throw new Error(`Unexpected status for ${item.id}`);
}

const source = await readFile(bankPath, "utf8");
const parsed = parseDrafts(source);
const byId = new Map(parsed.drafts.map((item) => [item.id, item]));
const applied = [], restricted = [];

for (const item of restorations) {
  const draft = byId.get(item.id);
  assertSnapshot(draft, item);
  const before = { stem: draft.stem, options: draft.options, correctOption: draft.correctOption, status: draft.status, askable: draft.askable };
  Object.assign(draft, {
    stem: item.stem, options: item.options, correctOption: item.correctOption, explanation: item.explanation,
    learningNote: item.learningNote, highYieldNote: item.highYieldNote, mnemonic: item.mnemonic, memoryAid: item.memoryAid,
    status: "ocr_draft", askable: true, warnings: [reviewedWarning]
  });
  applied.push({ id: item.id, sourcePage: item.page, before, after: { stem: draft.stem, options: draft.options, correctOption: draft.correctOption, status: draft.status, askable: draft.askable }, evidence: { externalSource: item.sourceUrl, externalFinding: item.finding } });
}

for (const item of restrictions) {
  const draft = byId.get(item.id);
  assertSnapshot(draft, item);
  const before = { status: draft.status, askable: draft.askable, warnings: draft.warnings ?? [], highYieldNote: draft.highYieldNote, mnemonic: draft.mnemonic, memoryAid: draft.memoryAid };
  Object.assign(draft, { status: "needs_review", askable: false, highYieldNote: undefined, mnemonic: undefined, memoryAid: undefined, warnings: [...new Set([...(draft.warnings ?? []), item.warning])] });
  restricted.push({ id: item.id, sourcePage: item.page, before, after: { status: draft.status, askable: draft.askable, warnings: draft.warnings } });
}

await writeFile(bankPath, `${source.slice(0, parsed.arrayStart)}${JSON.stringify(parsed.drafts)}${source.slice(parsed.end + 1)}`);
await mkdir(auditDir, { recursive: true });
await writeFile(path.join(auditDir, "applied-anatomy-batch-04.json"), `${JSON.stringify({ generatedAt: new Date().toISOString(), applied, restricted, automaticApproval: false, mockEligibility: "No restored OCR draft is mock eligible." }, null, 2)}\n`);
console.log(JSON.stringify({ restored: applied.map((row) => row.id), restricted: restricted.map((row) => row.id), automaticApproval: false }, null, 2));
