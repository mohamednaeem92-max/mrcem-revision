/**
 * Clinical Field Notes: source-linked recall aids remain separate from mock
 * eligibility. Private revision may use complete aids on trusted local OCR records.
 */
import type { MemoryAid, Question } from "./questionBank";
import { isRevisionEligible } from "./questionEligibility";

export function hasCompleteMemoryAid(aid: MemoryAid | undefined): aid is MemoryAid {
  return Boolean(
    aid
    && aid.coreFact.trim()
    && aid.mnemonic.trim()
    && aid.emojiCues.length > 0
    && aid.emojiCues.length <= 3
    && aid.emojiCues.every((cue) => cue.trim())
    && aid.cueLabel.trim()
    && aid.sourceLabel.trim()
    && /^https:\/\//.test(aid.sourceUrl),
  );
}

export function isMemoryRecallEligible(question: Question): boolean {
  return isRevisionEligible(question) && hasCompleteMemoryAid(question.memoryAid);
}

export function memoryAidEligibleQuestions(questions: Question[]): Question[] {
  return questions.filter(isMemoryRecallEligible);
}
