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
    { subject: "Anatomy", canonicalMarkdown: "folder__Anatomy-All.md", questionCount: 2408 },
    { subject: "Evidence-based medicine", canonicalMarkdown: "folder__EBM-All.md", questionCount: 133 },
    { subject: "Microbiology", canonicalMarkdown: "folder__Microbiology-All.md", questionCount: 291 },
    { subject: "Pathology", canonicalMarkdown: "folder__Pathology-All.md", questionCount: 257 },
    { subject: "Pharmacology", canonicalMarkdown: "folder__Pharmacology-All.md", questionCount: 503 },
    { subject: "Physiology", canonicalMarkdown: "folder__Physiology-All.md", questionCount: 858 },
  ],
  questionCount: 5233,
  askableCount: 4100,
  statusCounts: { ocr_draft: 0, needs_review: 0, needs_image: 0 },
  sectionCount: 0,
  needsImageCount: 0,
} as const;

export const ocrSectionManifest: OcrSection[] = [
  { subject: "Anatomy", topic: "Anatomy · General", questionCount: 2408, askableCount: 2300, needsReviewCount: 108, needsImageCount: 0, path: "folder__Anatomy-All.md" },
  { subject: "Evidence-based medicine", topic: "EBM · General", questionCount: 133, askableCount: 120, needsReviewCount: 13, needsImageCount: 0, path: "folder__EBM-All.md" },
  { subject: "Microbiology", topic: "Microbiology · General", questionCount: 291, askableCount: 250, needsReviewCount: 41, needsImageCount: 0, path: "folder__Microbiology-All.md" },
  { subject: "Pathology", topic: "Pathology · General", questionCount: 257, askableCount: 230, needsReviewCount: 27, needsImageCount: 0, path: "folder__Pathology-All.md" },
  { subject: "Pharmacology", topic: "Pharmacology · General", questionCount: 503, askableCount: 450, needsReviewCount: 53, needsImageCount: 0, path: "folder__Pharmacology-All.md" },
  { subject: "Physiology", topic: "Physiology · General", questionCount: 858, askableCount: 750, needsReviewCount: 108, needsImageCount: 0, path: "folder__Physiology-All.md" },
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
