import { describe, expect, it } from "vitest";
import type { Question } from "./questionBank";
import { eligibleQuestionBank, eligibilityRestrictions, isMockEligible, isRevisionEligible } from "./questionEligibility";

function question(overrides: Partial<Question> = {}): Question {
  return {
    id: "verified-1",
    source: "source.pdf",
    sourcePage: 12,
    subject: "Anatomy",
    topic: "Applied anatomy",
    stem: "Which structure is described?",
    options: ["A", "B", "C"],
    correctOption: 0,
    explanation: "The first option is correct.",
    learningNote: "Remember the relationship.",
    tags: ["anatomy"],
    primaryBlueprintCategory: "Anatomy",
    primaryBlueprintSubcategory: "Applied anatomy",
    ...overrides,
  };
}

describe("verified question eligibility", () => {
  it("accepts a complete bundled or reviewed record", () => {
    expect(isRevisionEligible(question())).toBe(true);
    expect(eligibilityRestrictions(question())).toEqual([]);
  });

  it("rejects every explicit OCR or unresolved-review marker", () => {
    const restricted = [
      question({ needsReview: true }),
      question({ isOcrDraft: true }),
      question({ ocrStatus: "ocr_draft" }),
      question({ ocrStatus: "needs_review" }),
      question({ ocrStatus: "needs_image" }),
      question({ needsImage: true }),
    ];

    restricted.forEach((item) => expect(isRevisionEligible(item)).toBe(false));
    expect(eligibilityRestrictions(question({ needsReview: true, isOcrDraft: true, ocrStatus: "needs_review", needsImage: true }))).toEqual([
      "needs_review",
      "ocr_draft",
      "needs_image",
      "ocr_status",
    ]);
  });

  it("filters a mixed bank before it reaches active study", () => {
    const eligible = question();
    const draft = question({ id: "draft", needsReview: true, isOcrDraft: true, ocrStatus: "ocr_draft" });
    expect(eligibleQuestionBank([eligible, draft])).toEqual([eligible]);
  });

  it("requires Primary blueprint metadata for mock eligibility", () => {
    expect(isMockEligible(question())).toBe(true);
    expect(isMockEligible(question({ primaryBlueprintCategory: undefined }))).toBe(false);
    expect(isMockEligible(question({ needsReview: true }))).toBe(false);
  });
});
