import type { Question } from "./questionBank";
import { isRevisionEligible } from "./questionEligibility";

export type StudyMode = "keyed" | "all" | "ungraded";

export type TopicSummary = {
  topic: string;
  label: string;
  total: number;
  keyed: number;
};

export function hasAnswerKey(question: Question): boolean {
  return (
    question.correctOption !== null
    && Number.isInteger(question.correctOption)
    && question.correctOption >= 0
    && question.correctOption < question.options.length
  );
}

export function isStudyQuality(question: Question): boolean {
  if (!isRevisionEligible(question)) return false;
  if (question.options.length < 2 || question.options.length > 6) return false;
  if (question.stem.trim().length < 12) return false;
  return question.options.every((option) => {
    const text = option.trim();
    return text.length >= 1 && text.length <= 350;
  });
}

export function topicShortName(topic: string, subject?: string): string {
  if (subject && topic.startsWith(`${subject} · `)) return topic.slice(subject.length + 3);
  const separator = " · ";
  const index = topic.indexOf(separator);
  return index >= 0 ? topic.slice(index + separator.length) : topic;
}

export function matchesSearch(question: Question, query: string): boolean {
  const needle = query.trim().toLowerCase();
  if (!needle) return true;
  const haystack = [question.stem, question.topic, question.subject, question.explanation, ...question.options, ...question.tags]
    .join(" ")
    .toLowerCase();
  return haystack.includes(needle);
}

export function filterStudyBank(
  questions: Question[],
  options: {
    mode?: StudyMode;
    subject?: string | null;
    topic?: string | null;
    query?: string;
  } = {},
): Question[] {
  const mode = options.mode ?? "keyed";
  return questions.filter((question) => {
    if (!isStudyQuality(question)) return false;
    if (mode === "keyed" && !hasAnswerKey(question)) return false;
    if (mode === "ungraded" && hasAnswerKey(question)) return false;
    if (options.subject && question.subject !== options.subject) return false;
    if (options.topic && question.topic !== options.topic) return false;
    if (options.query && !matchesSearch(question, options.query)) return false;
    return true;
  });
}

export function topicsFor(questions: Question[], subject?: string | null): TopicSummary[] {
  const counts = new Map<string, TopicSummary>();
  for (const question of questions) {
    if (subject && question.subject !== subject) continue;
    const current = counts.get(question.topic) ?? {
      topic: question.topic,
      label: topicShortName(question.topic, question.subject),
      total: 0,
      keyed: 0,
    };
    current.total += 1;
    if (hasAnswerKey(question)) current.keyed += 1;
    counts.set(question.topic, current);
  }
  return Array.from(counts.values()).sort(
    (left, right) => right.keyed - left.keyed || right.total - left.total || left.label.localeCompare(right.label),
  );
}

export function shuffleQuestions<T>(items: T[], seed = Date.now()): T[] {
  const copy = [...items];
  let value = seed >>> 0;
  const random = () => {
    value = (value * 1664525 + 1013904223) >>> 0;
    return value / 4294967296;
  };
  for (let index = copy.length - 1; index > 0; index -= 1) {
    const swap = Math.floor(random() * (index + 1));
    [copy[index], copy[swap]] = [copy[swap], copy[index]];
  }
  return copy;
}

export function isMissedAttempt(question: Question, record?: { attempts: number; correct: number }): boolean {
  return hasAnswerKey(question) && Boolean(record && record.attempts > 0 && record.correct < record.attempts);
}

export function isThinNote(value?: string | null): boolean {
  return !value || value.trim().length < 12;
}
