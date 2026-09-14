/**
 * Clinical Field Notes style: deterministic local scheduling for verified questions.
 * No network calls and no OCR draft data enter this module's daily queue.
 */
export type RecallRating = "again" | "hard" | "good" | "easy";

export type ReviewSchedule = {
  dueDate: string;
  intervalDays: number;
  ease: number;
  repetitions: number;
  lapses: number;
  lastRating: RecallRating;
  lastReviewed: string;
};

export type SchedulableRecord = {
  schedule?: ReviewSchedule;
};

export type DailyQueue = {
  dueIds: string[];
  newIds: string[];
  total: number;
};

export function localDateKey(date = new Date()): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function addDays(date: Date, days: number): string {
  const next = new Date(date);
  next.setHours(12, 0, 0, 0);
  next.setDate(next.getDate() + days);
  return localDateKey(next);
}

function rounded(value: number): number {
  return Math.max(1, Math.round(value));
}

function clampEase(value: number): number {
  return Math.min(3, Math.max(1.3, Math.round(value * 100) / 100));
}

export function scheduleRating(current: ReviewSchedule | undefined, rating: RecallRating, now = new Date()): ReviewSchedule {
  const previous = current ?? { dueDate: localDateKey(now), intervalDays: 0, ease: 2.3, repetitions: 0, lapses: 0, lastRating: "good" as RecallRating, lastReviewed: "" };
  const firstReview = previous.repetitions === 0;
  let intervalDays = 1;
  let ease = previous.ease;
  let repetitions = previous.repetitions;
  let lapses = previous.lapses;

  if (rating === "again") {
    intervalDays = 0;
    ease = clampEase(previous.ease - 0.2);
    repetitions = 0;
    lapses += 1;
  } else if (rating === "hard") {
    intervalDays = firstReview ? 1 : rounded(Math.max(1, previous.intervalDays) * 1.2);
    ease = clampEase(previous.ease - 0.15);
    repetitions += 1;
  } else if (rating === "good") {
    intervalDays = firstReview ? 1 : previous.repetitions === 1 ? 3 : rounded(Math.max(1, previous.intervalDays) * previous.ease);
    repetitions += 1;
  } else {
    intervalDays = firstReview ? 4 : rounded(Math.max(1, previous.intervalDays) * previous.ease * 1.3);
    ease = clampEase(previous.ease + 0.15);
    repetitions += 1;
  }

  return {
    dueDate: addDays(now, intervalDays),
    intervalDays,
    ease,
    repetitions,
    lapses,
    lastRating: rating,
    lastReviewed: now.toISOString(),
  };
}

export function buildDailyQueue(questionIds: string[], records: Record<string, SchedulableRecord>, today = localDateKey(), newLimit = 20): DailyQueue {
  const due = questionIds
    .filter((id) => records[id]?.schedule?.dueDate && records[id].schedule!.dueDate <= today)
    .sort((left, right) => {
      const a = records[left].schedule!;
      const b = records[right].schedule!;
      return a.dueDate.localeCompare(b.dueDate) || a.ease - b.ease || a.intervalDays - b.intervalDays;
    });
  const unscheduled = questionIds.filter((id) => !records[id]?.schedule);
  const newIds = unscheduled.slice(0, Math.max(0, newLimit - due.length));
  return { dueIds: due, newIds, total: due.length + newIds.length };
}
