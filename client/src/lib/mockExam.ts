import type { Question } from "./questionBank";
import { PRIMARY_BLUEPRINT, PRIMARY_BLUEPRINT_TARGET_TOTAL, PrimaryBlueprintCategory } from "./primaryBlueprint";
import { isMockEligible } from "./questionEligibility";

export const PRIMARY_MOCK_TARGET_QUESTIONS = 180;
export const PRIMARY_MOCK_DURATION_SECONDS = 3 * 60 * 60;

export type PrimaryMockPlan = {
  seed: number;
  questionIds: string[];
  targetQuestionCount: number;
  durationSeconds: number;
  mode: "full" | "partial";
  blueprintCoverage?: BlueprintCoverage[];
};

export type BlueprintCoverage = {
  category: PrimaryBlueprintCategory;
  target: number;
  available: number;
  selected: number;
};

function seededRandom(seed: number) {
  let value = seed >>> 0;
  return () => {
    value = (value * 1664525 + 1013904223) >>> 0;
    return value / 4294967296;
  };
}

export function approvedQuestionsForMock(questions: Question[]) {
  return questions.filter(isMockEligible);
}

export function blueprintCoverageFor(questions: Question[]): BlueprintCoverage[] {
  const approved = approvedQuestionsForMock(questions);
  return PRIMARY_BLUEPRINT.map(({ category, targetCount }) => ({ category, target: targetCount, available: approved.filter((question) => question.primaryBlueprintCategory === category).length, selected: 0 }));
}

function targetQuotas(questionCount: number) {
  const raw = PRIMARY_BLUEPRINT.map(({ category, targetCount }) => ({ category, raw: (targetCount / PRIMARY_BLUEPRINT_TARGET_TOTAL) * questionCount }));
  const quotas = new Map(raw.map(({ category, raw: amount }) => [category, Math.floor(amount)]));
  let remaining = questionCount - Array.from(quotas.values()).reduce((total, amount) => total + amount, 0);
  for (const { category } of [...raw].sort((left, right) => right.raw % 1 - left.raw % 1)) {
    if (!remaining) break;
    quotas.set(category, (quotas.get(category) ?? 0) + 1);
    remaining -= 1;
  }
  return quotas;
}

export function buildPrimaryMockPlan(questions: Question[], seed: number): PrimaryMockPlan {
  const approved = approvedQuestionsForMock(questions);
  const random = seededRandom(seed);
  const shuffled = [...approved];

  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(random() * (index + 1));
    [shuffled[index], shuffled[swapIndex]] = [shuffled[swapIndex], shuffled[index]];
  }

  const count = Math.min(shuffled.length, PRIMARY_MOCK_TARGET_QUESTIONS);
  const quotas = targetQuotas(count);
  const selected: Question[] = [];
  const remaining: Question[] = [];

  for (const { category } of PRIMARY_BLUEPRINT) {
    const grouped = shuffled.filter((question) => question.primaryBlueprintCategory === category);
    selected.push(...grouped.slice(0, quotas.get(category) ?? 0));
    remaining.push(...grouped.slice(quotas.get(category) ?? 0));
  }

  selected.push(...remaining.slice(0, Math.max(0, count - selected.length)));
  const questionIds = selected.map((question) => question.id);
  const mode = questionIds.length === PRIMARY_MOCK_TARGET_QUESTIONS ? "full" : "partial";
  const blueprintCoverage = blueprintCoverageFor(questions).map((coverage) => ({ ...coverage, selected: selected.filter((question) => question.primaryBlueprintCategory === coverage.category).length }));

  return {
    seed,
    questionIds,
    targetQuestionCount: PRIMARY_MOCK_TARGET_QUESTIONS,
    durationSeconds: mode === "full" ? PRIMARY_MOCK_DURATION_SECONDS : questionIds.length * 60,
    mode,
    blueprintCoverage,
  };
}

export function formatMockTime(totalSeconds: number) {
  const safeSeconds = Math.max(0, Math.floor(totalSeconds));
  const hours = Math.floor(safeSeconds / 3600);
  const minutes = Math.floor((safeSeconds % 3600) / 60);
  const seconds = safeSeconds % 60;
  return hours ? `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}` : `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}
