import { describe, expect, it } from "vitest";
import { blueprintCoverageFor, buildPrimaryMockPlan, PRIMARY_MOCK_DURATION_SECONDS } from "./mockExam";
import type { Question } from "./questionBank";

function item(id: string, category: Question["primaryBlueprintCategory"] = "Anatomy", needsReview = false): Question {
  return { id, source: "source.pdf", sourcePage: 1, subject: "Anatomy", topic: "Applied anatomy", stem: id, options: ["A", "B"], correctOption: 0, explanation: "Explanation", learningNote: "Note", tags: ["tag"], needsReview, primaryBlueprintCategory: category };
}

describe("buildPrimaryMockPlan", () => {
  it("uses a stable no-repeat shuffle for a supplied seed", () => {
    const source = Array.from({ length: 12 }, (_, index) => item(`question-${index}`));
    const first = buildPrimaryMockPlan(source, 42);
    const second = buildPrimaryMockPlan(source, 42);
    expect(first.questionIds).toEqual(second.questionIds);
    expect(new Set(first.questionIds).size).toBe(12);
    expect(first.mode).toBe("partial");
    expect(first.durationSeconds).toBe(12 * 60);
  });

  it("excludes unreviewed OCR questions from mock selection", () => {
    const plan = buildPrimaryMockPlan([item("approved"), item("draft", "Anatomy", true)], 7);
    expect(plan.questionIds).toEqual(["approved"]);
  });

  it("excludes explicit OCR status markers even when needsReview is false", () => {
    const plan = buildPrimaryMockPlan([
      item("approved"),
      { ...item("ocr-status"), needsReview: false, isOcrDraft: false, ocrStatus: "ocr_draft" },
      { ...item("visual"), needsReview: false, needsImage: true },
    ], 7);
    expect(plan.questionIds).toEqual(["approved"]);
  });

  it("uses the full official duration only when 180 approved questions are available", () => {
    const source = Array.from({ length: 180 }, (_, index) => item(`question-${index}`));
    const plan = buildPrimaryMockPlan(source, 2);
    expect(plan.mode).toBe("full");
    expect(plan.questionIds).toHaveLength(180);
    expect(plan.durationSeconds).toBe(PRIMARY_MOCK_DURATION_SECONDS);
  });

  it("matches the official category targets when every tagged category is available", () => {
    const blueprintBank = [
      ...Array.from({ length: 60 }, (_, index) => item(`anatomy-${index}`, "Anatomy")),
      ...Array.from({ length: 60 }, (_, index) => item(`physiology-${index}`, "Physiology")),
      ...Array.from({ length: 24 }, (_, index) => item(`pharmacology-${index}`, "Pharmacology")),
      ...Array.from({ length: 17 }, (_, index) => item(`microbiology-${index}`, "Microbiology")),
      ...Array.from({ length: 9 }, (_, index) => item(`pathology-${index}`, "Pathology")),
      ...Array.from({ length: 10 }, (_, index) => item(`ebm-${index}`, "Evidence-based medicine")),
    ];
    const coverage = buildPrimaryMockPlan(blueprintBank, 19).blueprintCoverage ?? [];
    expect(Object.fromEntries(coverage.map((item) => [item.category, item.selected]))).toEqual({ Anatomy: 60, Physiology: 60, Pharmacology: 24, Microbiology: 17, Pathology: 9, "Evidence-based medicine": 10 });
  });

  it("fills unavailable official categories from available tagged categories and reports the coverage gap", () => {
    const source = [...Array.from({ length: 4 }, (_, index) => item(`ebm-${index}`, "Evidence-based medicine")), ...Array.from({ length: 2 }, (_, index) => item(`anatomy-${index}`, "Anatomy"))];
    const plan = buildPrimaryMockPlan(source, 11);
    expect(plan.questionIds).toHaveLength(6);
    expect(plan.blueprintCoverage?.find((item) => item.category === "Evidence-based medicine")?.selected).toBe(4);
    expect(plan.blueprintCoverage?.find((item) => item.category === "Physiology")?.selected).toBe(0);
    expect(blueprintCoverageFor(source).find((item) => item.category === "Anatomy")?.available).toBe(2);
  });
});
