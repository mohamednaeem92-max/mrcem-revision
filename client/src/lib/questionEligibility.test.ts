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

describe("trusted local review eligibility", () => {
  it("accepts a complete bundled or reviewed record", () => {
    expect(isRevisionEligible(question())).toBe(true);
    expect(eligibilityRestrictions(question())).toEqual([]);
  });

  it("lets structurally complete OCR drafts into private revision", () => {
    const draft = question({
      id: "draft",
      needsReview: true,
      isOcrDraft: true,
      ocrStatus: "ocr_draft",
      needsImage: false,
    });
    expect(isRevisionEligible(draft)).toBe(true);
    expect(eligibleQuestionBank([question(), draft])).toHaveLength(2);
    expect(eligibilityRestrictions(draft)).toEqual(["needs_review", "ocr_draft", "ocr_status"]);
  });

  it("still allows ungraded records with no answer key", () => {
    const open = question({ correctOption: null });
    expect(isRevisionEligible(open)).toBe(true);
    expect(eligibilityRestrictions(open)).toContain("no_answer_key");
    expect(isMockEligible(open)).toBe(false);
  });

  it("rejects incomplete stems or option lists from revision", () => {
    expect(isRevisionEligible(question({ stem: "   " }))).toBe(false);
    expect(isRevisionEligible(question({ options: ["A"] }))).toBe(false);
  });

  it("keeps timed Primary mocks fail-closed", () => {
    expect(isMockEligible(question())).toBe(true);
    expect(isMockEligible(question({ primaryBlueprintCategory: undefined }))).toBe(false);
    expect(isMockEligible(question({ needsReview: true }))).toBe(false);
    expect(isMockEligible(question({ isOcrDraft: true }))).toBe(false);
    expect(isMockEligible(question({ ocrStatus: "ocr_draft" }))).toBe(false);
    expect(isMockEligible(question({ needsImage: true }))).toBe(false);
    expect(isMockEligible(question({ correctOption: null }))).toBe(false);
  });
});
