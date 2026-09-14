import { describe, expect, it } from "vitest";
import type { Question } from "./questionBank";
import { filterStudyBank, hasAnswerKey, isMissedAttempt, isStudyQuality, shuffleQuestions, topicShortName } from "./studySession";

function question(overrides: Partial<Question> = {}): Question {
  return {
    id: "q1",
    source: "Anatomy-All.pdf",
    sourcePage: 1,
    subject: "Anatomy",
    topic: "Anatomy · Abdomen",
    stem: "Which structure lies anterior to the rectum?",
    options: ["Bladder", "Prostate", "Sacrum", "Coccyx", "Ilium"],
    correctOption: 1,
    explanation: "The prostate lies anterior to the rectum.",
    learningNote: "Rectal examination palpates the prostate anteriorly.",
    tags: ["abdomen"],
    ...overrides,
  };
}

describe("study session filters", () => {
  it("treats a complete OCR draft with a key as studyable", () => {
    const draft = question({ isOcrDraft: true, ocrStatus: "ocr_draft", needsReview: true });
    expect(isStudyQuality(draft)).toBe(true);
    expect(hasAnswerKey(draft)).toBe(true);
    expect(filterStudyBank([draft], { mode: "keyed" })).toEqual([draft]);
  });

  it("keeps missing keys in the ungraded lane rather than the keyed lane", () => {
    const ungraded = question({ id: "open", correctOption: null, isOcrDraft: true, ocrStatus: "needs_review" });
    expect(hasAnswerKey(ungraded)).toBe(false);
    expect(filterStudyBank([ungraded], { mode: "keyed" })).toEqual([]);
    expect(filterStudyBank([ungraded], { mode: "ungraded" })).toEqual([ungraded]);
    expect(filterStudyBank([ungraded], { mode: "all" })).toEqual([ungraded]);
  });

  it("drops collapsed OCR option lists", () => {
    const broken = question({
      id: "broken",
      options: ["A very long collapsed option ".repeat(40), "B"],
      correctOption: 1,
    });
    expect(isStudyQuality(broken)).toBe(false);
  });

  it("does not treat ungraded reviews as missed answers", () => {
    const ungraded = question({ correctOption: null });
    expect(isMissedAttempt(ungraded, { attempts: 2, correct: 0 })).toBe(false);
    expect(isMissedAttempt(question(), { attempts: 2, correct: 1 })).toBe(true);
  });

  it("shortens section titles and shuffles deterministically", () => {
    expect(topicShortName("Anatomy · Abdomen", "Anatomy")).toBe("Abdomen");
    const ids = shuffleQuestions(["a", "b", "c", "d"], 19);
    expect(shuffleQuestions(["a", "b", "c", "d"], 19)).toEqual(ids);
    expect(new Set(ids).size).toBe(4);
  });
});
