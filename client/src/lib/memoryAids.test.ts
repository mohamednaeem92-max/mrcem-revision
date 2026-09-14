import { describe, expect, it } from "vitest";
import { hasCompleteMemoryAid, isMemoryRecallEligible } from "./memoryAids";
import type { Question } from "./questionBank";

const aid = { coreFact: "A source-supported fact.", mnemonic: "A short cue.", emojiCues: ["🧠"], cueLabel: "Brain cue.", sourceLabel: "Source", sourceUrl: "https://example.org/source" };
const question: Question = { id: "approved", source: "source.pdf", sourcePage: 1, subject: "Anatomy", topic: "Topic", stem: "Stem", options: ["A", "B"], correctOption: 0, explanation: "Explanation", learningNote: "Note", tags: ["tag"], primaryBlueprintCategory: "Anatomy", memoryAid: aid };

describe("source-linked memory aids", () => {
  it("requires concise cues and a secure source URL", () => {
    expect(hasCompleteMemoryAid(aid)).toBe(true);
    expect(hasCompleteMemoryAid({ ...aid, emojiCues: [] })).toBe(false);
    expect(hasCompleteMemoryAid({ ...aid, sourceUrl: "http://example.org" })).toBe(false);
  });

  it("allows verified records and rejects all OCR drafts", () => {
    expect(isMemoryRecallEligible(question)).toBe(true);
    expect(isMemoryRecallEligible({ ...question, id: "draft", needsReview: true, isOcrDraft: true, ocrStatus: "ocr_draft", ocrWarnings: ["Source page and external anatomy reference reviewed; remains an unapproved OCR draft."] })).toBe(false);
    expect(isMemoryRecallEligible({ ...question, id: "blocked", needsReview: true, isOcrDraft: true, ocrStatus: "needs_review", ocrWarnings: [] })).toBe(false);
  });
});
