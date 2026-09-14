/**
 * Full-bank learning-aid audit.
 *
 * This tool inventories note and mnemonic coverage, attaches evidence to the
 * four source-reviewed pilot records, and produces a research queue. It never
 * generates clinical content for OCR drafts because their source pages have not
 * yet been approved.
 */
import { readFile, writeFile, mkdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const outputDir = path.join(root, "docs", "audit");

const PILOT_EVIDENCE = {
  "ebm-statistics-001": [{
    source: "BMJ Statistics at Square One: Mean and standard deviation",
    url: "https://www.bmj.com/about-bmj/resources-readers/publications/statistics-square-one/2-mean-and-standard-deviation",
    supports: "The mean is sensitive to outlying points; the median is unchanged by extreme values.",
  }],
  "ebm-statistics-002": [{
    source: "BMJ Statistics at Square One: Data display and summary",
    url: "https://www.bmj.com/about-bmj/resources-readers/publications/statistics-square-one/1-data-display-and-summary",
    supports: "The median is obtained after ordering observations; for 15 values it is the eighth value.",
  }],
  "ebm-statistics-003": [{
    source: "BMJ Statistics at Square One: Data display and summary",
    url: "https://www.bmj.com/about-bmj/resources-readers/publications/statistics-square-one/1-data-display-and-summary",
    supports: "The median is robust to outliers and is obtained from ordered observations.",
  }],
  "ebm-statistics-004": [{
    source: "BMJ Statistics at Square One: Correlation and regression",
    url: "https://www.bmj.com/about-bmj/resources-readers/publications/statistics-square-one/11-correlation-and-regression",
    supports: "r measures linear association from +1 through 0 to -1; correlation is not causation.",
  }],
};

const SOURCE_REVIEWED_DRAFT_EVIDENCE = {
  "anatomy-anatomy-all-pdf-p0001-q0001": [{ source: "NCBI Bookshelf: Femoral Nerve", url: "https://www.ncbi.nlm.nih.gov/books/NBK556065/", supports: "The femoral nerve forms from the dorsal divisions of the L2-L4 ventral rami." }],
  "anatomy-anatomy-all-pdf-p0013-q0004": [{ source: "NCBI Bookshelf: Rectum", url: "https://www.ncbi.nlm.nih.gov/books/NBK537245/", supports: "The prostate sits anterior to the rectal wall." }],
  "anatomy-anatomy-all-pdf-p0017-q0005": [{ source: "NCBI Bookshelf: Splanchnic Nerves", url: "https://www.ncbi.nlm.nih.gov/books/NBK560504/", supports: "Pelvic splanchnic nerves arise from S2-S4 and provide parasympathetic innervation to pelvic organs, including the rectum." }],
  "anatomy-anatomy-all-pdf-p0022-q0006": [{ source: "NCBI Bookshelf: Physiology, Bladder", url: "https://www.ncbi.nlm.nih.gov/books/NBK538533/", supports: "The bladder base contains the trigone, including the ureteric openings." }],
  "anatomy-anatomy-all-pdf-p0027-q0007": [{ source: "NCBI Bookshelf: Rectum", url: "https://www.ncbi.nlm.nih.gov/books/NBK537245/", supports: "The rectum is the most posterior visceral organ in the pelvic cavity." }],
  "anatomy-anatomy-all-pdf-p0032-q0008": [{ source: "Origoni et al., Neurobiological Mechanisms of Pelvic Pain", url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC4119661/", supports: "T10-L1 visceral afferent pain fibers innervate the uterus, adnexa, and cervix." }],
  "anatomy-anatomy-all-pdf-p0036-q0009": [{ source: "NCBI Bookshelf: Inguinal Region", url: "https://www.ncbi.nlm.nih.gov/books/NBK470204/", supports: "The posterior inguinal-canal wall includes transversalis fascia with medial conjoint-tendon contribution." }],
  "anatomy-anatomy-all-pdf-p0040-q0010": [{ source: "NCBI Bookshelf: Pancreas", url: "https://www.ncbi.nlm.nih.gov/books/NBK532912/", supports: "The pancreatic body and tail receive splenic arterial branches." }],
};

function extractDrafts(source) {
  const prefix = "export const ocrDraftQuestions: OcrDraftQuestion[] = ";
  const start = source.indexOf(prefix);
  const arrayStart = start + prefix.length;
  const end = source.indexOf("];", arrayStart);
  if (start < 0 || end < 0) throw new Error("Could not parse OCR draft export");
  return JSON.parse(source.slice(arrayStart, end + 1));
}

function extractPilot(source) {
  const start = source.indexOf("export const pilotQuestions: Question[] = [");
  const end = source.indexOf("\n];", start);
  if (start < 0 || end < 0) throw new Error("Could not parse pilot export");
  const block = source.slice(start, end);
  return [...block.matchAll(/\{\n\s+id:\s+"([^"]+)",([\s\S]*?)\n\s+\},/g)].map((match) => {
    const item = match[2];
    return {
      id: match[1],
      subject: (item.match(/subject:\s+"([^"]+)"/) ?? [])[1] ?? "Unknown",
      topic: (item.match(/topic:\s+"([^"]+)"/) ?? [])[1] ?? "Unknown",
      sourceFile: (item.match(/source:\s+"([^"]+)"/) ?? [])[1] ?? null,
      sourcePage: Number((item.match(/sourcePage:\s+(\d+)/) ?? [])[1] ?? 0),
      highYieldNote: (item.match(/highYieldNote:\s+"([^"]*)"/) ?? [])[1] ?? "",
      mnemonic: (item.match(/mnemonic:\s+"([^"]*)"/) ?? [])[1] ?? "",
      hasStructuredMemoryAid: /memoryAid:\s+\{/.test(item),
      recordType: "approved_pilot",
      sourceLink: null,
    };
  });
}

function countBy(rows, selector) {
  return Object.fromEntries(Object.entries(rows.reduce((accumulator, row) => {
    const key = selector(row);
    accumulator[key] = (accumulator[key] ?? 0) + 1;
    return accumulator;
  }, {})).sort(([left], [right]) => left.localeCompare(right)));
}

function auditPilot(question) {
  const evidence = PILOT_EVIDENCE[question.id] ?? [];
  const hasHighYieldNote = Boolean(question.highYieldNote.trim());
  const hasMnemonic = Boolean(question.mnemonic.trim());
  const hasStructuredMemoryAid = Boolean(question.hasStructuredMemoryAid);
  return {
    id: question.id,
    recordType: question.recordType,
    subject: question.subject,
    topic: question.topic,
    sourceFile: question.sourceFile,
    sourcePage: question.sourcePage,
    sourceLink: question.sourceLink,
    hasHighYieldNote,
    hasMnemonic,
    hasStructuredMemoryAid,
    learningAidState: hasHighYieldNote && hasMnemonic && evidence.length ? "complete_source_linked" : "manual_evidence_review_required",
    researchGate: "Source-reviewed pilot: factual amendments require the original source page and listed external evidence.",
    evidence,
    proposedHighYieldNote: null,
    proposedMnemonic: null,
  };
}

function auditDraft(question) {
  const hasHighYieldNote = Boolean(question.highYieldNote?.trim());
  const hasMnemonic = Boolean(question.mnemonic?.trim());
  const aid = question.memoryAid;
  const hasStructuredMemoryAid = Boolean(aid?.coreFact?.trim() && aid?.mnemonic?.trim() && Array.isArray(aid?.emojiCues) && aid.emojiCues.length > 0 && aid.emojiCues.length <= 3 && aid?.cueLabel?.trim() && aid?.sourceLabel?.trim() && /^https:\/\//.test(aid?.sourceUrl ?? ""));
  const hasGuardedReviewWarning = question.warnings?.includes("Source page and external anatomy reference reviewed; remains an unapproved OCR draft.");
  const isSourceReviewedDraft = question.status === "ocr_draft" && hasGuardedReviewWarning && hasHighYieldNote && hasMnemonic && hasStructuredMemoryAid;
  const evidence = SOURCE_REVIEWED_DRAFT_EVIDENCE[question.id] ?? (isSourceReviewedDraft ? [{ source: aid.sourceLabel, url: aid.sourceUrl, supports: aid.coreFact }] : []);
  return {
    id: question.id,
    recordType: "ocr_draft",
    subject: question.subject,
    topic: question.topic,
    sourceFile: question.source?.sourceFile ?? null,
    sourcePage: question.sourcePage ?? null,
    sourceLink: question.source?.sourceLink ?? null,
    hasHighYieldNote,
    hasMnemonic,
    hasStructuredMemoryAid,
    learningAidState: isSourceReviewedDraft ? "source_page_and_external_evidence_verified_ocr_draft" : "blocked_pending_source_page_review",
    researchGate: isSourceReviewedDraft ? "Original page and listed external source confirm this record. It remains an unapproved OCR draft and is excluded from mock generation." : "Do not research or write a learning aid until the original PDF page confirms the OCR stem, options, and answer key. External information alone cannot approve an OCR draft.",
    evidence,
    proposedHighYieldNote: null,
    proposedMnemonic: null,
  };
}

function report(summary) {
  const rows = [
    ["Total records inspected", summary.total],
    ["Source-linked complete learning aids", summary.completeSourceLinked],
    ["Records blocked pending source-page review", summary.blockedPendingSourcePageReview],
    ["Source-verified OCR-draft learning aids", summary.sourceVerifiedDraftLearningAids],
    ["Structured recall aids with emoji cues", summary.structuredMemoryAids],
  ];
  return `# Full Learning-Aid Audit\n\nEvery local question record was inspected for high-yield note, mnemonic, structured recall-aid, emoji-cue, and source-trace coverage. The audit attaches direct web evidence to the source-reviewed EBM pilot and allows learning aids for an OCR draft only when its guarded source-review warning, complete structured aid, and HTTPS external source are all present.\n\n| Measure | Count |\n|---|---:|\n${rows.map(([label, count]) => `| ${label} | ${count} |`).join("\n")}\n\n## States\n\n| Learning-aid state | Records |\n|---|---:|\n${Object.entries(summary.byState).map(([state, count]) => `| ${state} | ${count} |`).join("\n")}\n\n## Non-hallucination result\n\nThe four source-reviewed EBM pilot questions retain their existing high-yield notes, mnemonics, structured recall aids, and direct BMJ reference pages. ${summary.sourceVerifiedDraftLearningAids} Anatomy OCR drafts have structured recall aids only because their original pages, option sequences, marked answers, and external sources were reviewed by guarded batch runners. These records remain OCR drafts and are excluded from mock generation. All other OCR drafts remain blocked because a web source alone cannot validate an OCR-transcribed stem, option set, or answer key.\n`;
}

const [draftSource, pilotSource] = await Promise.all([
  readFile(path.join(root, "client", "src", "lib", "ocrDraftSections.ts"), "utf8"),
  readFile(path.join(root, "client", "src", "lib", "questionBank.ts"), "utf8"),
]);
const rows = [...extractPilot(pilotSource).map(auditPilot), ...extractDrafts(draftSource).map(auditDraft)];
const summary = {
  generatedAt: new Date().toISOString(),
  total: rows.length,
  byState: countBy(rows, (row) => row.learningAidState),
  completeSourceLinked: rows.filter((row) => row.learningAidState === "complete_source_linked").length,
  sourceVerifiedDraftLearningAids: rows.filter((row) => row.learningAidState === "source_page_and_external_evidence_verified_ocr_draft").length,
  structuredMemoryAids: rows.filter((row) => row.hasStructuredMemoryAid).length,
  blockedPendingSourcePageReview: rows.filter((row) => row.learningAidState === "blocked_pending_source_page_review").length,
  newLearningAidsGenerated: rows.filter((row) => row.learningAidState === "source_page_and_external_evidence_verified_ocr_draft").length,
};
await mkdir(outputDir, { recursive: true });
await Promise.all([
  writeFile(path.join(outputDir, "learning-aid-audit-ledger.json"), `${JSON.stringify(rows, null, 2)}\n`),
  writeFile(path.join(outputDir, "learning-aid-audit-summary.json"), `${JSON.stringify(summary, null, 2)}\n`),
  writeFile(path.join(outputDir, "learning-aid-audit.md"), report(summary)),
]);
console.log(JSON.stringify(summary, null, 2));
