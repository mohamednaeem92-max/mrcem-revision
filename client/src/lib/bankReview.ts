/**
 * Bank sign-off review: deterministic queue, solo decisions, approved export.
 * Decisions persist in localStorage (offline-first) and export to the same
 * reviewed-question JSON shape the Source library import already accepts.
 */
import type { OcrDraftQuestion } from "./ocrDraftSections";
import type { Question } from "./questionBank";

export const BANK_REVIEW_STORE_KEY = "meridian-bank-review-v1";

export const REVIEW_SUBJECT_ORDER = [
  "Anatomy",
  "Physiology",
  "Pharmacology",
  "Microbiology",
  "Pathology",
  "Evidence-based medicine",
] as const;

const SUBJECT_RANK = new Map<string, number>(REVIEW_SUBJECT_ORDER.map((subject, rank) => [subject, rank]));

export type BankReviewDecisionValue = "approved" | "needs_image" | "rejected";

export type BankReviewCorrections = {
  stem?: string;
  options?: string[];
  correctOption?: number | null;
  explanation?: string;
  learningNote?: string;
  topic?: string;
  tags?: string[];
};

export type BankReviewDecision = {
  questionId: string;
  decision: BankReviewDecisionValue;
  reason?: string;
  corrected: BankReviewCorrections;
  reviewedAt: string;
};

export type BankReviewDecisionMap = Record<string, BankReviewDecision>;

/** Deterministic solo queue: subject (Anatomy first) -> sourcePage -> sourceQuestionNumber -> id. */
export function orderDraftsForReview(drafts: OcrDraftQuestion[]): OcrDraftQuestion[] {
  return [...drafts].sort((a, b) => {
    const subjectRank = (SUBJECT_RANK.get(a.subject) ?? 99) - (SUBJECT_RANK.get(b.subject) ?? 99);
    if (subjectRank !== 0) return subjectRank;
    if (a.sourcePage !== b.sourcePage) return a.sourcePage - b.sourcePage;
    if (a.sourceQuestionNumber !== b.sourceQuestionNumber) return a.sourceQuestionNumber - b.sourceQuestionNumber;
    return a.id.localeCompare(b.id);
  });
}

export type ReviewDraftView = {
  stem: string;
  options: string[];
  correctOption: number | null;
  explanation: string;
  learningNote: string;
  topic: string;
  tags: string[];
  subject: string;
  sourcePage: number;
};

/** Overlay unsaved reviewer edits onto the stored draft for display and validation. */
export function draftViewWithCorrections(draft: OcrDraftQuestion, corrected: BankReviewCorrections): ReviewDraftView {
  return {
    stem: corrected.stem ?? draft.stem,
    options: corrected.options ?? draft.options,
    correctOption: corrected.correctOption !== undefined ? corrected.correctOption : draft.correctOption,
    explanation: corrected.explanation ?? draft.explanation,
    learningNote: corrected.learningNote ?? draft.learningNote,
    topic: corrected.topic ?? draft.topic,
    tags: corrected.tags ?? draft.tags,
    subject: draft.subject,
    sourcePage: draft.sourcePage,
  };
}

/**
 * Approval gate mirroring tools/extract_mrcem_pdf.py prepare-import rules:
 * non-empty source page, subject, topic, stem, >= 2 usable options, a valid
 * zero-based correctOption, explanation, learning note, and tag list.
 */
export function approvalBlockers(view: ReviewDraftView): string[] {
  const blockers: string[] = [];
  if (!view.subject.trim()) blockers.push("Subject is missing.");
  if (!view.topic.trim()) blockers.push("Topic is missing.");
  if (!view.stem.trim()) blockers.push("Stem is empty.");
  if (!Number.isInteger(view.sourcePage) || view.sourcePage <= 0) blockers.push("Source page must be a positive number.");
  const usableOptions = view.options.filter((option) => option.trim().length > 0);
  if (usableOptions.length < 2) blockers.push("At least two non-empty options are required.");
  if (!Number.isInteger(view.correctOption) || (view.correctOption as number) < 0 || (view.correctOption as number) >= view.options.length) {
    blockers.push("Correct answer must be a valid option (A-E).");
  } else if (!view.options[view.correctOption as number].trim()) {
    blockers.push("Correct answer points at an empty option.");
  }
  if (!view.explanation.trim()) blockers.push("Explanation is empty.");
  if (!view.learningNote.trim()) blockers.push("Learning note is empty.");
  if (!view.tags.length || !view.tags.every((tag) => tag.trim().length > 0)) blockers.push("At least one tag is required.");
  return blockers;
}

/** Same bank mapping as the study desk, with reviewer corrections applied. */
export function draftToReviewedQuestion(draft: OcrDraftQuestion, corrected: BankReviewCorrections = {}): Question {
  const view = draftViewWithCorrections(draft, corrected);
  return {
    id: draft.id,
    source: draft.source.sourceFile || draft.source.markdownFile || "unknown-source",
    sourcePage: view.sourcePage,
    subject: view.subject,
    topic: view.topic,
    stem: view.stem,
    options: view.options,
    correctOption: view.correctOption,
    explanation: view.explanation,
    learningNote: view.learningNote,
    highYieldNote: draft.highYieldNote,
    mnemonic: draft.mnemonic,
    memoryAid: draft.memoryAid,
    tags: view.tags,
    sourceMarkdown: draft.source.markdownFile,
    sourceLink: draft.source.sourceLink,
  };
}

export function loadReviewDecisions(): BankReviewDecisionMap {
  try {
    const saved = window.localStorage.getItem(BANK_REVIEW_STORE_KEY);
    if (!saved) return {};
    const parsed = JSON.parse(saved) as BankReviewDecisionMap;
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

export function saveReviewDecisions(decisions: BankReviewDecisionMap): void {
  window.localStorage.setItem(BANK_REVIEW_STORE_KEY, JSON.stringify(decisions));
}

export type ReviewProgress = {
  total: number;
  approved: number;
  needsImage: number;
  rejected: number;
  remaining: number;
  perSubject: Record<string, { total: number; approved: number; remaining: number }>;
};

export function summarizeProgress(drafts: OcrDraftQuestion[], decisions: BankReviewDecisionMap): ReviewProgress {
  const perSubject: ReviewProgress["perSubject"] = {};
  let approved = 0;
  let needsImage = 0;
  let rejected = 0;
  for (const draft of drafts) {
    const entry = (perSubject[draft.subject] ??= { total: 0, approved: 0, remaining: 0 });
    entry.total += 1;
    const decision = decisions[draft.id]?.decision;
    if (decision === "approved") {
      approved += 1;
      entry.approved += 1;
    } else if (decision === "needs_image") {
      needsImage += 1;
    } else if (decision === "rejected") {
      rejected += 1;
    }
  }
  for (const entry of Object.values(perSubject)) {
    entry.remaining = entry.total - entry.approved;
  }
  return { total: drafts.length, approved, needsImage, rejected, remaining: drafts.length - approved - needsImage - rejected, perSubject };
}

/** Approved export in the reviewed-import shape (array or { questions } both accepted). */
export function buildApprovedExport(drafts: OcrDraftQuestion[], decisions: BankReviewDecisionMap): Question[] {
  const byId = new Map(drafts.map((draft) => [draft.id, draft]));
  const exported: Question[] = [];
  for (const decision of Object.values(decisions)) {
    if (decision.decision !== "approved") continue;
    const draft = byId.get(decision.questionId);
    if (!draft) continue;
    const question = draftToReviewedQuestion(draft, decision.corrected);
    if (approvalBlockers(draftViewWithCorrections(draft, decision.corrected)).length > 0) continue;
    exported.push(question);
  }
  return exported.sort((a, b) => a.id.localeCompare(b.id));
}

export function downloadJson(filename: string, payload: unknown): void {
  const blob = new Blob([`${JSON.stringify(payload, null, 2)}\n`], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
}
