/**
 * Clinical Field Notes style: source-aware OCR draft bank.
 * Questions are loaded from /ocr-questions.json at runtime to avoid
 * bloating the JS bundle. The service worker caches the JSON for offline use.
 */
import type { MemoryAid } from "./questionBank";

export type OcrDraftStatus = "ocr_draft" | "needs_review" | "needs_image";

export type OcrDraftQuestion = {
  id: string;
  subject: string;
  topic: string;
  stem: string;
  options: string[];
  correctOption: number | null;
  explanation: string;
  learningNote: string;
  highYieldNote?: string;
  mnemonic?: string;
  memoryAid?: MemoryAid;
  tags: string[];
  status: OcrDraftStatus;
  askable: boolean;
  needsImage: boolean;
  warnings: string[];
  source: { markdownFile: string; sourceFile: string; driveId: string | null; sourceLink: string | null };
  sourcePage: number;
  sourceQuestionNumber: number;
};

export type OcrSection = {
  subject: string;
  topic: string;
  questionCount: number;
  askableCount: number;
  needsReviewCount: number;
  needsImageCount: number;
  path: string;
};

export const ocrDraftReport = {
  generatedAt: new Date().toISOString(),
  canonicalSourceReports: [
    { subject: "Anatomy", canonicalMarkdown: "folder__Anatomy-All.md", questionCount: 2830 },
    { subject: "Evidence-based medicine", canonicalMarkdown: "folder__EBM-All.md", questionCount: 146 },
    { subject: "Microbiology", canonicalMarkdown: "folder__Microbiology-All.md", questionCount: 325 },
    { subject: "Pathology", canonicalMarkdown: "folder__Pathology-All.md", questionCount: 295 },
    { subject: "Pharmacology", canonicalMarkdown: "folder__Pharmacology-All.md", questionCount: 674 },
    { subject: "Physiology", canonicalMarkdown: "folder__Physiology-All.md", questionCount: 963 },
  ],
  questionCount: 5233,
  askableCount: 2621,
  statusCounts: { ocr_draft: 2579, needs_review: 2545, needs_image: 109 },
  sectionCount: 0,
  needsImageCount: 0,
} as const;

export const ocrSectionManifest: OcrSection[] = [
  { subject: "Anatomy", topic: "Anatomy · General", questionCount: 2830, askableCount: 1429, needsReviewCount: 1368, needsImageCount: 54, path: "folder__Anatomy-All.md" },
  { subject: "Evidence-based medicine", topic: "EBM · General", questionCount: 146, askableCount: 51, needsReviewCount: 90, needsImageCount: 6, path: "folder__EBM-All.md" },
  { subject: "Microbiology", topic: "Microbiology · General", questionCount: 325, askableCount: 157, needsReviewCount: 155, needsImageCount: 16, path: "folder__Microbiology-All.md" },
  { subject: "Pathology", topic: "Pathology · General", questionCount: 295, askableCount: 142, needsReviewCount: 152, needsImageCount: 1, path: "folder__Pathology-All.md" },
  { subject: "Pharmacology", topic: "Pharmacology · General", questionCount: 674, askableCount: 283, needsReviewCount: 382, needsImageCount: 10, path: "folder__Pharmacology-All.md" },
  { subject: "Physiology", topic: "Physiology · General", questionCount: 963, askableCount: 559, needsReviewCount: 398, needsImageCount: 23, path: "folder__Physiology-All.md" },
];

let _cachedQuestions: OcrDraftQuestion[] | null = null;

export function clearOcrCache(): void {
  _cachedQuestions = null;
}

export async function loadOcrDraftQuestions(): Promise<OcrDraftQuestion[]> {
  if (_cachedQuestions) return _cachedQuestions;
  const res = await fetch(`${import.meta.env.BASE_URL}ocr-questions.json`);
  if (!res.ok) throw new Error(`Could not load the local question bank (${res.status})`);
  const parsed = (await res.json()) as OcrDraftQuestion[];
  if (!Array.isArray(parsed)) throw new Error("Question bank file is not a JSON array");
  _cachedQuestions = parsed;
  return _cachedQuestions;
}
