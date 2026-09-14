/**
 * Adds structured recall aids only to Anatomy Batch 01 records that already
 * have a source-page confirmation, external anatomy evidence, and existing
 * source-supported high-yield note and mnemonic. No status is promoted here.
 */
import { readFile, writeFile, mkdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const bankPath = path.join(root, "client", "src", "lib", "ocrDraftSections.ts");
const auditDir = path.join(root, "docs", "audit");
const reviewedWarning = "Source page and external anatomy reference reviewed; remains an unapproved OCR draft.";

const aids = [
  {
    id: "anatomy-anatomy-all-pdf-p0001-q0001",
    highYieldNote: "Femoral nerve roots are L2-L4. In the femoral triangle, remember the nerve is lateral to the femoral artery and vein.",
    mnemonic: "🧠 Femoral = L2-L4: count 2, 3, 4 before the knee can extend.",
    memoryAid: { coreFact: "Femoral nerve roots are L2-L4.", mnemonic: "Count 2, 3, 4 before knee extension.", emojiCues: ["🦵", "2️⃣3️⃣4️⃣"], cueLabel: "A leg and the sequence two, three, four cue femoral roots.", sourceLabel: "NCBI Bookshelf: Femoral Nerve", sourceUrl: "https://www.ncbi.nlm.nih.gov/books/NBK556065/" },
  },
  {
    id: "anatomy-anatomy-all-pdf-p0013-q0004",
    highYieldNote: "In a sagittal pelvic relation, the prostate is anterior to the rectum and inferior to the bladder.",
    mnemonic: "🧠 PROstate is BEFORE the rectum: prostate in front, rectum behind.",
    memoryAid: { coreFact: "The prostate lies anterior to the rectum and inferior to the bladder.", mnemonic: "PROstate is before the rectum.", emojiCues: ["➡️", "📍"], cueLabel: "A forward arrow and map pin cue the prostate’s anterior relation.", sourceLabel: "NCBI Bookshelf: Rectum", sourceUrl: "https://www.ncbi.nlm.nih.gov/books/NBK537245/" },
  },
  {
    id: "anatomy-anatomy-all-pdf-p0017-q0005",
    highYieldNote: "Do not confuse pelvic splanchnic nerves with sacral splanchnic nerves: pelvic splanchnics are parasympathetic and arise from S2-S4.",
    mnemonic: "🧠 Pelvic splanchnics: S2, S3, S4 keep the pelvis parasympathetic.",
    memoryAid: { coreFact: "Pelvic splanchnic nerves are parasympathetic and arise from S2-S4.", mnemonic: "S2, S3, S4 keep the pelvis parasympathetic.", emojiCues: ["🧠", "2️⃣3️⃣4️⃣"], cueLabel: "A brain and the sequence two, three, four cue pelvic parasympathetics.", sourceLabel: "NCBI Bookshelf: Splanchnic Nerves", sourceUrl: "https://www.ncbi.nlm.nih.gov/books/NBK560504/" },
  },
  {
    id: "anatomy-anatomy-all-pdf-p0022-q0006",
    highYieldNote: "The ureteric openings form the upper corners of the trigone at the bladder base; the urethral opening is the lower corner.",
    mnemonic: "🔺 Bladder trigone: two ureters at the top corners, urethra at the bottom.",
    memoryAid: { coreFact: "The trigone contains the ureteric openings at its upper corners and the urethral opening at its lower corner.", mnemonic: "Two ureters top the trigone; urethra completes the base.", emojiCues: ["🔺", "2️⃣"], cueLabel: "A triangle and two cue the two upper ureteric corners.", sourceLabel: "NCBI Bookshelf: Physiology, Bladder", sourceUrl: "https://www.ncbi.nlm.nih.gov/books/NBK538533/" },
  },
  {
    id: "anatomy-anatomy-all-pdf-p0027-q0007",
    highYieldNote: "The rectum is not intraperitoneal throughout. Its lower third lacks peritoneal covering, and it is the most posterior pelvic viscus.",
    mnemonic: "🧠 RECTUM = Rear-most pelvic viscus.",
    memoryAid: { coreFact: "The rectum is the most posterior visceral organ in the pelvic cavity.", mnemonic: "RECTUM = rear-most pelvic viscus.", emojiCues: ["⬅️", "📍"], cueLabel: "A rear-facing arrow and map pin cue the posterior pelvic position.", sourceLabel: "NCBI Bookshelf: Rectum", sourceUrl: "https://www.ncbi.nlm.nih.gov/books/NBK537245/" },
  },
  {
    id: "anatomy-anatomy-all-pdf-p0032-q0008",
    highYieldNote: "Uterine visceral pain fibres travel with sympathetic pathways to T10-L1. This differs from pelvic splanchnic parasympathetic outflow at S2-S4.",
    mnemonic: "🧠 Uterus = T10 to L1: remember “ten to one.”",
    memoryAid: { coreFact: "Uterine visceral afferent pain fibres travel to T10-L1.", mnemonic: "Uterus: ten to one.", emojiCues: ["🤰", "🔟1️⃣"], cueLabel: "A pregnant person and ten-to-one sequence cue uterine afferents.", sourceLabel: "Origoni et al.: Neurobiological Mechanisms of Pelvic Pain", sourceUrl: "https://pmc.ncbi.nlm.nih.gov/articles/PMC4119661/" },
  },
  {
    id: "anatomy-anatomy-all-pdf-p0036-q0009",
    highYieldNote: "Match the wall to its layer: posterior inguinal canal wall = transversalis fascia, with medial conjoint-tendon reinforcement.",
    mnemonic: "🧠 The posterior wall starts with T: Transversalis fascia at the back.",
    memoryAid: { coreFact: "The posterior wall of the inguinal canal is formed by transversalis fascia, with medial conjoint-tendon reinforcement.", mnemonic: "The posterior wall starts with T: transversalis fascia.", emojiCues: ["⬅️", "🔤"], cueLabel: "A back arrow and letter cue the posterior wall’s transversalis fascia.", sourceLabel: "NCBI Bookshelf: Inguinal Region", sourceUrl: "https://www.ncbi.nlm.nih.gov/books/NBK470204/" },
  },
  {
    id: "anatomy-anatomy-all-pdf-p0040-q0010",
    highYieldNote: "Pancreatic arterial supply is shared, but splenic arterial branches are the key supply for the body and tail.",
    mnemonic: "🧠 Pancreatic tail points to the spleen, so think splenic artery.",
    memoryAid: { coreFact: "Splenic arterial branches supply the pancreatic body and tail.", mnemonic: "Pancreatic tail points to the spleen.", emojiCues: ["➡️", "🟣"], cueLabel: "A directional arrow and purple marker cue the pancreatic tail toward the spleen.", sourceLabel: "NCBI Bookshelf: Pancreas", sourceUrl: "https://www.ncbi.nlm.nih.gov/books/NBK532912/" },
  },
];

const source = await readFile(bankPath, "utf8");
const prefix = "export const ocrDraftQuestions: OcrDraftQuestion[] = ";
const start = source.indexOf(prefix);
const arrayStart = start + prefix.length;
const end = source.indexOf("];", arrayStart);
if (start < 0 || end < 0) throw new Error("OCR draft export not found");
const drafts = JSON.parse(source.slice(arrayStart, end + 1));
const byId = new Map(drafts.map((draft) => [draft.id, draft]));
const applied = [];

for (const item of aids) {
  const draft = byId.get(item.id);
  if (!draft) throw new Error(`Missing expected draft ${item.id}`);
  if (draft.status !== "ocr_draft" || !draft.askable) throw new Error(`Unexpected draft state for ${item.id}`);
  if (!draft.warnings?.includes(reviewedWarning)) throw new Error(`Missing source-review warning for ${item.id}`);
  if (draft.highYieldNote !== item.highYieldNote || draft.mnemonic !== item.mnemonic) throw new Error(`Learning-aid drift for ${item.id}`);
  draft.memoryAid = item.memoryAid;
  applied.push({ id: item.id, sourcePage: draft.sourcePage, status: draft.status, memoryAid: item.memoryAid });
}

await writeFile(bankPath, `${source.slice(0, arrayStart)}${JSON.stringify(drafts)}${source.slice(end + 1)}`);
await mkdir(auditDir, { recursive: true });
await writeFile(path.join(auditDir, "anatomy-batch-01-memory-aids.json"), `${JSON.stringify({ generatedAt: new Date().toISOString(), applied, automaticApproval: false, unresolved: ["anatomy-anatomy-all-pdf-p0006-q0002", "anatomy-anatomy-all-pdf-p0009-q0003"] }, null, 2)}\n`);
console.log(JSON.stringify({ applied: applied.map((item) => item.id), preservedDraftStatus: true, unresolvedCount: 2 }, null, 2));
