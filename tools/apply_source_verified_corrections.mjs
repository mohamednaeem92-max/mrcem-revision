/**
 * Apply only corrections that have completed the source-page plus external
 * evidence gate. The OCR draft status is deliberately retained.
 */
import { readFile, writeFile, mkdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const bankPath = path.join(root, "client", "src", "lib", "ocrDraftSections.ts");
const auditDir = path.join(root, "docs", "audit");

const corrections = [
  {
    id: "evidence-based-medicine-ebm-all-pdf-p0144-q0088",
    expectedOptions: [
      "It is prospective.",
      "It is observational. (x) The usual outcome measure is the relative risk. 12%",
      "It is subject to loss to follow up bias.",
      "It is useful for rare diseases.",
    ],
    restoredOptions: [
      "It is prospective.",
      "It is observational.",
      "The usual outcome measure is the relative risk.",
      "It is subject to loss to follow up bias.",
      "It is useful for rare diseases.",
    ],
    correctOption: 4,
    evidence: {
      sourcePage: 144,
      sourceFinding: "The fifth displayed option is marked correct for the INCORRECT stem.",
      externalSource: "https://pmc.ncbi.nlm.nih.gov/articles/PMC2998589/",
      externalFinding: "Case-control studies are well suited to rare outcomes; cohort studies are particularly advantageous for rare exposures.",
    },
  },
  {
    id: "evidence-based-medicine-ebm-all-pdf-p0169-q0105",
    expectedOptions: ["0.5%", "2%", "25%", "50%"],
    restoredOptions: ["0.5%", "2%", "4%", "25%", "50%"],
    correctOption: 4,
    evidence: {
      sourcePage: 169,
      sourceFinding: "The fifth displayed option, 50%, is marked correct; the source table gives 20/1000 divided by 40/1000.",
      externalSource: "https://www.cochrane.org/authors/handbooks-and-manuals/handbook/current/chapter-06",
      externalFinding: "The Cochrane Handbook provides methods for calculating and interpreting effect measures.",
    },
  },
  {
    id: "evidence-based-medicine-ebm-all-pdf-p0171-q0105",
    expectedOptions: ["0.5%", "2%", "25%", "50%"],
    restoredOptions: ["0.5%", "2%", "4%", "25%", "50%"],
    correctOption: 4,
    evidence: {
      sourcePage: 171,
      sourceFinding: "Duplicate capture of question 105; the fifth displayed option, 50%, is marked correct.",
      externalSource: "https://www.cochrane.org/authors/handbooks-and-manuals/handbook/current/chapter-06",
      externalFinding: "The Cochrane Handbook provides methods for calculating and interpreting effect measures.",
    },
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
for (const correction of corrections) {
  const draft = byId.get(correction.id);
  if (!draft) throw new Error(`Missing expected draft ${correction.id}`);
  if (JSON.stringify(draft.options) !== JSON.stringify(correction.expectedOptions)) {
    throw new Error(`Option drift for ${correction.id}; refusing to apply a correction.`);
  }
  if (draft.status !== "ocr_draft") throw new Error(`Status drift for ${correction.id}; refusing to approve implicitly.`);
  const before = { options: draft.options, correctOption: draft.correctOption, status: draft.status, warnings: draft.warnings };
  draft.options = correction.restoredOptions;
  draft.correctOption = correction.correctOption;
  draft.warnings = [...new Set([...(draft.warnings ?? []), "Source-page verified option restoration; remains OCR draft pending full content review."])];
  applied.push({ id: correction.id, before, after: { options: draft.options, correctOption: draft.correctOption, status: draft.status, warnings: draft.warnings }, evidence: correction.evidence });
}

await writeFile(bankPath, `${source.slice(0, arrayStart)}${JSON.stringify(drafts)}${source.slice(end + 1)}`);
await mkdir(auditDir, { recursive: true });
await writeFile(path.join(auditDir, "applied-source-verified-corrections.json"), `${JSON.stringify({ generatedAt: new Date().toISOString(), applied, automaticApproval: false, newLearningAidsGenerated: 0 }, null, 2)}\n`);
console.log(JSON.stringify({ applied: applied.map((item) => item.id), automaticApproval: false, newLearningAidsGenerated: 0 }, null, 2));
