import { describe, expect, it } from "vitest";
import {
  approvalBlockers,
  buildApprovedExport,
  draftToReviewedQuestion,
  draftViewWithCorrections,
  orderDraftsForReview,
  summarizeProgress,
} from "./bankReview";
import type { OcrDraftQuestion as Draft } from "./ocrDraftSections";

function draft(overrides: Partial<Draft> = {}): Draft {
  return {
    id: "ana-001",
    subject: "Anatomy",
    topic: "Anatomy · General",
    stem: "Which structure passes through the foramen?",
    options: ["Artery", "Vein", "Nerve", "Duct", "Ligament"],
    correctOption: 0,
    explanation: "The artery passes through.",
    learningNote: "Remember the foramen contents.",
    tags: ["anatomy"],
    status: "needs_review",
    askable: false,
    needsImage: false,
    warnings: [],
    source: { markdownFile: "folder__Anatomy-All.md", sourceFile: "Anatomy-All.pdf", driveId: null, sourceLink: null },
    sourcePage: 4,
    sourceQuestionNumber: 2,
    ...overrides,
  } as Draft;
}

describe("review queue ordering", () => {
  it("orders Anatomy before Physiology, then page, number, id", () => {
    const ordered = orderDraftsForReview([
      draft({ id: "phy-001", subject: "Physiology", sourcePage: 1, sourceQuestionNumber: 1 }),
      draft({ id: "ana-002", sourcePage: 9, sourceQuestionNumber: 1 }),
      draft({ id: "ana-001", sourcePage: 4, sourceQuestionNumber: 2 }),
    ]);
    expect(ordered.map((item) => item.id)).toEqual(["ana-001", "ana-002", "phy-001"]);
  });
});

describe("approval gate", () => {
  it("accepts a complete record", () => {
    expect(approvalBlockers(draftViewWithCorrections(draft(), {}))).toEqual([]);
  });

  it("blocks empty stem, bad key, and missing learning note", () => {
    const view = draftViewWithCorrections(draft(), { stem: "  ", correctOption: 9, learningNote: "" });
    const blockers = approvalBlockers(view);
    expect(blockers).toContain("Stem is empty.");
    expect(blockers).toContain("Correct answer must be a valid option (A-E).");
    expect(blockers).toContain("Learning note is empty.");
  });

  it("uses reviewer corrections in the view", () => {
    const view = draftViewWithCorrections(draft({ stem: "Old" }), { stem: "New" });
    expect(view.stem).toBe("New");
  });
});

describe("approved export", () => {
  it("exports only valid approved decisions in reviewed-import shape", () => {
    const drafts = [draft(), draft({ id: "ana-002", explanation: "" })];
    const exported = buildApprovedExport(drafts, {
      "ana-001": { questionId: "ana-001", decision: "approved", corrected: {}, reviewedAt: "2026-01-01T00:00:00.000Z" },
      "ana-002": { questionId: "ana-002", decision: "approved", corrected: {}, reviewedAt: "2026-01-01T00:00:00.000Z" },
    });
    expect(exported.map((item) => item.id)).toEqual(["ana-001"]);
    expect(exported[0].source).toBe("Anatomy-All.pdf");
    expect(exported[0].isOcrDraft).toBeUndefined();
  });

  it("maps corrections into the exported question", () => {
    const exported = draftToReviewedQuestion(draft(), { correctOption: 2, topic: "Head and neck" });
    expect(exported.correctOption).toBe(2);
    expect(exported.topic).toBe("Head and neck");
  });
});

describe("progress summary", () => {
  it("counts decisions per subject", () => {
    const drafts = [draft(), draft({ id: "phy-001", subject: "Physiology" })];
    const summary = summarizeProgress(drafts, {
      "ana-001": { questionId: "ana-001", decision: "approved", corrected: {}, reviewedAt: "" },
    });
    expect(summary).toMatchObject({ total: 2, approved: 1, remaining: 1 });
    expect(summary.perSubject["Anatomy"]).toMatchObject({ total: 1, approved: 1, remaining: 0 });
    expect(summary.perSubject["Physiology"]).toMatchObject({ total: 1, approved: 0, remaining: 1 });
  });
});
