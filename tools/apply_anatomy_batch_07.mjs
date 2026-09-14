/** Guarded Anatomy Batch 07 restoration; no record is approved by this script. */
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const bankPath = path.join(root, "client", "src", "lib", "ocrDraftSections.ts");
const auditDir = path.join(root, "docs", "audit");
const reviewedWarning = "Source page and external anatomy reference reviewed; remains an unapproved OCR draft.";

function aid(coreFact, mnemonic, emojiCues, cueLabel, sourceLabel, sourceUrl) {
  return { coreFact, mnemonic, emojiCues, cueLabel, sourceLabel, sourceUrl };
}

const restorations = [
  {
    id: "anatomy-anatomy-all-pdf-p0262-q0064", page: 262,
    expectedStem: "we A311 year old man is brought to ED following a road traffic accident in which he was wearing his seatbelt. Imaging shows a fracture of the left ninth and tenth rib with intra-abdominal bleeding. Which of the following organs is most likely injured:",
    expectedOptions: ["Liver 2%", "Pancreas 0% (v’) Spleen 94%", "Left kidney 3%", "Left colic flexure 1%"],
    stem: "An adult man has left ninth- and tenth-rib fractures after a road-traffic collision with intra-abdominal bleeding. Which organ is most likely injured?",
    options: ["Liver", "Pancreas", "Spleen", "Left kidney", "Left colic flexure"], correctOption: 2,
    explanation: "The spleen lies in the left hypochondrium, typically spanning ribs 9 to 11. Blunt trauma or fracture fragments from the left lower ribs can injure the highly vascular spleen and cause intra-abdominal haemorrhage.",
    learningNote: "Left lower-rib trauma with haemoperitoneum should raise concern for splenic injury.",
    highYieldNote: "Spleen: left hypochondrium, protected by ribs 9-11, and vulnerable in left lower-rib trauma.",
    mnemonic: "9️⃣🔟🩸 Left 9-10 ribs, think spleen bleed.",
    memoryAid: aid("The spleen spans left ribs 9 to 11, and left lower-rib trauma can cause splenic haemorrhage.", "Left 9-10 ribs, think spleen bleed.", ["9️⃣", "🔟", "🩸"], "Rib numbers and blood cue a splenic injury after left lower-rib trauma.", "NCBI Bookshelf: Spleen", "https://www.ncbi.nlm.nih.gov/books/NBK482235/"),
    sourceUrl: "https://www.ncbi.nlm.nih.gov/books/NBK482235/", finding: "The spleen typically spans ribs 9-11 and left rib fracture can precipitate splenic injury."
  },
  {
    id: "anatomy-anatomy-all-pdf-p0266-q0065", page: 266,
    expectedStem: "Regarding the internal oblique muscle, which of the following statements is CORRECT:",
    expectedOptions: ["The lower free border of the internal oblique aponeurosis forms the inguinal ligament. 8%", "The internal oblique lies deep to the transversus abdominis muscle. 5% (x) its fibres run in a inferomedial direction. Ws", "It originates from the medial third of the inguinal ligament. 5%", "It inserts onto the lower 3 - 4 ribs and the pubic crest."],
    stem: "Regarding the internal oblique muscle, which statement is correct?",
    options: ["The lower free border of the internal-oblique aponeurosis forms the inguinal ligament.", "The internal oblique lies deep to transversus abdominis.", "Its fibres run inferomedially.", "It originates from the medial third of the inguinal ligament.", "It inserts onto the lower 3-4 ribs and the pubic crest."], correctOption: 4,
    explanation: "Internal oblique is the middle anterolateral abdominal-wall layer. Its fibres run superomedially, opposite to external oblique, and it inserts on the lower ribs and pubic tubercle/crest.",
    learningNote: "Internal oblique runs superomedially and contributes to the lower ribs and pubic crest.",
    highYieldNote: "Internal oblique: middle layer; fibres run superomedially; insertion includes lower ribs and pubic crest.",
    mnemonic: "↗️ Internal oblique climbs up and in to ribs and pubis.",
    memoryAid: aid("Internal-oblique fibres run superomedially and insert on lower ribs and the pubic region.", "Internal oblique climbs up and in to ribs and pubis.", ["↗️", "🦴"], "An upward-inward arrow and bone cue the fibre direction and bony insertion.", "NCBI Bookshelf: Anterolateral Abdominal Wall", "https://www.ncbi.nlm.nih.gov/books/NBK525975/"),
    sourceUrl: "https://www.ncbi.nlm.nih.gov/books/NBK525975/", finding: "Internal oblique courses superomedially and inserts on lower-rib cartilage and pubic tubercle."
  },
  {
    id: "anatomy-anatomy-all-pdf-p0269-q0066", page: 269,
    expectedStem: "ww A 21 year old man presents to ED complaining of a scrotal lump. Imaging demonstrates a testicular tumour. The lymphatic drainage of the testis is to which of the following:",
    expectedOptions: ["Internal iliac nodes 53%", "External iliac nodes 1%", "Superficial inguinal nodes 5%", "Deep inguinal nodes", "Para-aortic nodes"],
    stem: "A man has a testicular tumour. To which lymph nodes does the testis primarily drain?",
    options: ["Internal iliac nodes", "External iliac nodes", "Superficial inguinal nodes", "Deep inguinal nodes", "Para-aortic nodes"], correctOption: 4,
    explanation: "Testicular lymphatics follow the gonadal vessels to para-aortic (lumbar) nodes. This differs from scrotal skin, which drains to superficial inguinal nodes.",
    learningNote: "Testis drains to para-aortic nodes; scrotum drains to superficial inguinal nodes.",
    highYieldNote: "Testis → para-aortic nodes. Scrotum → superficial inguinal nodes.",
    mnemonic: "🫘⬆️ Testis follows vessels up to para-aortic nodes.",
    memoryAid: aid("Testicular lymphatics drain to lumbar para-aortic nodes, unlike scrotal lymphatics which drain to superficial inguinal nodes.", "Testis follows vessels up to para-aortic nodes.", ["🫘", "⬆️"], "A testis-shaped bean and upward arrow cue ascent with gonadal vessels.", "NCBI Bookshelf: Lymphatic Drainage", "https://www.ncbi.nlm.nih.gov/books/NBK557720/"),
    sourceUrl: "https://www.ncbi.nlm.nih.gov/books/NBK557720/", finding: "Para-aortic nodes drain the testes, whereas superficial inguinal nodes drain the scrotum."
  },
  {
    id: "anatomy-anatomy-all-pdf-p0272-q0067", page: 272,
    expectedStem: "ww The ilioinguinal nerve is formed from the anterior rami of:",
    expectedOptions: ["u", "{4 =L2 61%", "L2 1% SE", "L4 1%"],
    stem: "The ilioinguinal nerve is formed from the anterior ramus of which spinal nerve?",
    options: ["L1", "L1-L2", "L2", "L2-L3", "L4"], correctOption: 0,
    explanation: "The ilioinguinal nerve is an L1 branch. It supplies the upper medial thigh and external genital region, and may contribute motor fibres to internal oblique and transversus abdominis.",
    learningNote: "Ilioinguinal nerve is an L1 branch with upper-medial-thigh and genital sensory distribution.",
    highYieldNote: "Ilioinguinal nerve = L1; sensory supply includes upper medial thigh and external genital area.",
    mnemonic: "1️⃣ Ilioinguinal starts at L1.",
    memoryAid: aid("The ilioinguinal nerve is a branch of L1.", "Ilioinguinal starts at L1.", ["1️⃣", "🧠"], "One and a nerve cue the L1 origin.", "NCBI Bookshelf: Inguinal Region", "https://www.ncbi.nlm.nih.gov/books/NBK470204/"),
    sourceUrl: "https://www.ncbi.nlm.nih.gov/books/NBK470204/", finding: "The ilioinguinal nerve is a branch of L1."
  },
  {
    id: "anatomy-anatomy-all-pdf-p0277-q0068", page: 277,
    expectedStem: "w The retroduodenal region of the common bile duct:",
    expectedOptions: ["lies left of the gastroduodenal artery. 3% (x) lies posterior to the portal vein. 4%", "lies posterior to the first part of the duodenum", "empties directly into the major duodenal papilla. 4%", "lies posterior to the second part of the duodenum. 62%"],
    stem: "The retroduodenal part of the common bile duct has which relation?",
    options: ["It lies left of the gastroduodenal artery.", "It lies posterior to the portal vein.", "It lies posterior to the first part of the duodenum.", "It empties directly into the major duodenal papilla.", "It lies posterior to the second part of the duodenum."], correctOption: 2,
    explanation: "The retroduodenal common bile duct passes behind the superior (first) part of the duodenum. It lies right of the gastroduodenal artery and anterior to the portal vein.",
    learningNote: "Retroduodenal CBD: posterior to first duodenum, right of GDA, anterior to portal vein.",
    highYieldNote: "Retroduodenal CBD passes behind D1 and in front of the portal vein.",
    mnemonic: "⬅️ D1 hides the CBD behind it.",
    memoryAid: aid("The retroduodenal common bile duct passes behind the first duodenum and anterior to the portal vein.", "D1 hides the CBD behind it.", ["⬅️", "🟡"], "A backward arrow and yellow bile cue the CBD behind D1.", "Babu and Sharma: Biliary Tract Anatomy", "https://pmc.ncbi.nlm.nih.gov/articles/PMC4244820/"),
    sourceUrl: "https://pmc.ncbi.nlm.nih.gov/articles/PMC4244820/", finding: "The retroduodenal CBD passes behind the superior duodenum, right of the GDA and anterior to portal vein."
  },
  {
    id: "anatomy-anatomy-all-pdf-p0280-q0069", page: 280,
    expectedStem: "ww Which of the following structures is NOT retroperitoneal:",
    expectedOptions: ["Rectum 6%", "Ureters 4%", "Tail of pancreas", "Kidneys 1%"],
    stem: "Which listed structure is not retroperitoneal?",
    options: ["Rectum", "Inferior vena cava", "Ureters", "Tail of pancreas", "Kidneys"], correctOption: 3,
    explanation: "The pancreatic tail enters the peritoneum near the splenic hilum and is the intraperitoneal pancreatic segment. The kidneys, ureters, and inferior vena cava are retroperitoneal.",
    learningNote: "Pancreatic tail enters the peritoneum near the splenic hilum.",
    highYieldNote: "Pancreas: tail is intraperitoneal near the splenic hilum; the rest is mainly retroperitoneal.",
    mnemonic: "🧵 Tail threads into the peritoneum by the spleen.",
    memoryAid: aid("The pancreatic tail enters the peritoneum near the splenic hilum.", "Tail threads into the peritoneum by the spleen.", ["🧵", "🟣"], "A thread and purple spleen cue the pancreatic-tail relation.", "NCBI Bookshelf: Embryology, Pancreas", "https://www.ncbi.nlm.nih.gov/books/NBK545243/"),
    sourceUrl: "https://www.ncbi.nlm.nih.gov/books/NBK545243/", finding: "The pancreatic tail enters the peritoneum near the splenic hilum and is intraperitoneal."
  },
  {
    id: "anatomy-anatomy-all-pdf-p0292-q0072", page: 292,
    expectedStem: "A 26 year old woman is brought to ED following a road traffic accident. Focussed assessment for sonography in trauma (FAST) on the supine patient demonstrates free intraperitoneal fluid. Which of the following spaces is most likely to be affected:",
    expectedOptions: ["Vesicouterine recess", "Left paracolic gutter", "Subphrenic recess"],
    stem: "A supine patient has free intraperitoneal fluid on FAST after trauma. Which listed space is most likely involved?",
    options: ["Hepatorenal recess", "Vesicouterine recess", "Rectouterine recess", "Left paracolic gutter", "Subphrenic recess"], correctOption: 0,
    explanation: "The hepatorenal recess, also called Morison's pouch, lies between the right liver lobe and right kidney. It is a dependent right-upper-quadrant space assessed during eFAST and is a common site for free intraperitoneal fluid.",
    learningNote: "Morison's pouch is the right hepatorenal recess assessed in the eFAST right-upper-quadrant view.",
    highYieldNote: "FAST: assess Morison's pouch, the right hepatorenal recess between liver and kidney.",
    mnemonic: "🫀↔️🫘 FAST looks liver-to-right-kidney.",
    memoryAid: aid("Morison's pouch is the dependent right hepatorenal recess between the liver and right kidney, assessed in eFAST.", "FAST looks liver-to-right-kidney.", ["🫀", "↔️", "🫘"], "Liver, arrow, and kidney cue the hepatorenal FAST window.", "Kaur et al.: Morrison's Pouch Anatomy", "https://pmc.ncbi.nlm.nih.gov/articles/PMC9968550/"),
    sourceUrl: "https://pmc.ncbi.nlm.nih.gov/articles/PMC9968550/", finding: "Morison's pouch is the dependent hepatorenal space assessed in the eFAST right-upper-quadrant view."
  },
  {
    id: "anatomy-anatomy-all-pdf-p0296-q0073", page: 296,
    expectedStem: "A 21 year old female presents to ED complaining of acute severe pelvic pain. She reports she has not had a period for 6 weeks which is not normal for her. A urine pregnancy test is positive. Which of the following is the most common site of an ectopic pregnancy:",
    expectedOptions: ["Cervix (x) The mesentery 1%", "Vagina", "Ovaries"],
    stem: "A woman with acute pelvic pain, amenorrhoea, and a positive pregnancy test is suspected to have an ectopic pregnancy. What is the most common site?",
    options: ["Cervix", "Uterine tubes", "Mesentery", "Vagina", "Ovaries"], correctOption: 1,
    explanation: "Most ectopic pregnancies occur in a uterine tube, most commonly in its ampulla. The uterine tube is therefore the best source-listed answer.",
    learningNote: "Ectopic pregnancy is most often tubal, especially ampullary.",
    highYieldNote: "Most ectopic pregnancies occur in the ampulla of a uterine tube.",
    mnemonic: "🌀 Tube ampulla is the common ectopic stop.",
    memoryAid: aid("The ampulla of the uterine tube is the most common site of ectopic pregnancy.", "Tube ampulla is the common ectopic stop.", ["🌀", "🧬"], "A spiral tube and embryo cue an ampullary tubal ectopic pregnancy.", "NCBI Bookshelf: Fallopian Tube", "https://www.ncbi.nlm.nih.gov/books/NBK547660/"),
    sourceUrl: "https://www.ncbi.nlm.nih.gov/books/NBK547660/", finding: "The ampulla of the uterine tube is the most common ectopic-pregnancy site."
  }
];

const restrictions = [
  {
    id: "anatomy-anatomy-all-pdf-p0283-q0070", page: 283,
    expectedStem: "Which of the following structures is NOT a posterior relation of the transverse colon:",
    expectedOptions: ["Second part of duodenum", "Upper end of mesentery", "Duodenojejunal flexure"],
    stem: "Which structure is not a posterior relation of the transverse colon?",
    options: ["Second part of duodenum", "Head of pancreas", "Upper end of mesentery", "Duodenojejunal flexure", "Spleen"],
    explanation: "The source marks the spleen, but this exact relation set has not yet been directly corroborated by an authoritative external reference. The record remains excluded from answer learning.",
    warning: "Source page reviewed, but the exact full posterior-relation set for the transverse colon was not directly corroborated by an authoritative external source. This source-marked record remains excluded from answer learning."
  },
  {
    id: "anatomy-anatomy-all-pdf-p0288-q0071", page: 288,
    expectedStem: "ww In men, the internal urethral sphincter surrounds which of the following structures:",
    expectedOptions: ["Preprostatic urethra", "Membranous urethra 60%", "Spongy urethra 3%", "Distal ureter 1%"],
    stem: "In men, the internal urethral sphincter surrounds which structure?",
    options: ["Preprostatic urethra", "Prostatic urethra", "Membranous urethra", "Spongy urethra", "Distal ureter"],
    explanation: "The source marks preprostatic urethra. The direct external source confirms that the internal sphincter is at the bladder neck leading into the urethra, but does not explicitly establish this segment-specific phrasing. The record remains excluded from answer learning.",
    warning: "Source page reviewed, but the available authoritative source confirms the internal urethral sphincter at the bladder neck without directly corroborating the source's exact preprostatic-segment wording. This record remains excluded from answer learning."
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
await writeFile(path.join(auditDir, "applied-anatomy-batch-07.json"), `${JSON.stringify({ generatedAt: new Date().toISOString(), applied, restricted, automaticApproval: false, mockEligibility: "No restored OCR draft is mock eligible." }, null, 2)}\n`);
console.log(JSON.stringify({ restored: applied.map((row) => row.id), restricted: restricted.map((row) => row.id), automaticApproval: false }, null, 2));
