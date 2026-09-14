import type { Question } from "./questionBank";

/**
 * Trusted local review accepts any structurally complete source record. OCR and
 * unresolved-review markers remain visible in the interface, but they do not
 * block the user's private review workflow.
 */
export function isRevisionEligible(question: Question): boolean {
  return Boolean(
    question.id.trim()
    && question.source.trim()
    && Number.isInteger(question.sourcePage)
    && question.sourcePage > 0
    && question.subject.trim()
    && question.topic.trim()
    && question.stem.trim()
    && question.options.length >= 2
    && question.options.every((option) => option.trim()),
  );
}

export function eligibleQuestionBank(questions: Question[]): Question[] {
  return questions.filter(isRevisionEligible);
}

export type EligibilityRestriction = "needs_review" | "ocr_draft" | "needs_image" | "ocr_status" | "no_answer_key" | "missing_blueprint";

export function eligibilityRestrictions(question: Question): EligibilityRestriction[] {
  const restrictions: EligibilityRestriction[] = [];
  if (question.needsReview) restrictions.push("needs_review");
  if (question.isOcrDraft) restrictions.push("ocr_draft");
  if (question.needsImage) restrictions.push("needs_image");
  if (question.ocrStatus !== undefined) restrictions.push("ocr_status");
  if (!Number.isInteger(question.correctOption)) restrictions.push("no_answer_key");
  if (!question.primaryBlueprintCategory) restrictions.push("missing_blueprint");
  return restrictions;
}

/** Timed RCEM Primary mocks remain fail-closed: complete key, blueprint, no OCR restrictions. */
export function isMockEligible(question: Question): boolean {
  return isRevisionEligible(question)
    && Number.isInteger(question.correctOption)
    && Boolean(question.primaryBlueprintCategory)
    && !question.needsReview
    && question.isOcrDraft !== true
    && question.ocrStatus === undefined
    && question.needsImage !== true;
}
