import { describe, expect, it } from "vitest";
import { buildDailyQueue, scheduleRating } from "./spacedRepetition";

describe("spaced repetition scheduling", () => {
  const now = new Date("2026-08-21T09:00:00");

  it("builds the first Good interval, then expands the second successful interval", () => {
    const first = scheduleRating(undefined, "good", now);
    const second = scheduleRating(first, "good", now);
    expect(first.intervalDays).toBe(1);
    expect(first.dueDate).toBe("2026-08-22");
    expect(second.intervalDays).toBe(3);
    expect(second.dueDate).toBe("2026-08-24");
  });

  it("returns a lapse to today and lowers ease", () => {
    const current = { dueDate: "2026-08-21", intervalDays: 6, ease: 2.3, repetitions: 3, lapses: 0, lastRating: "good" as const, lastReviewed: "" };
    const lapse = scheduleRating(current, "again", now);
    expect(lapse.intervalDays).toBe(0);
    expect(lapse.dueDate).toBe("2026-08-21");
    expect(lapse.repetitions).toBe(0);
    expect(lapse.lapses).toBe(1);
    expect(lapse.ease).toBe(2.1);
  });

  it("places overdue approved questions before unscheduled new questions", () => {
    const records = {
      laterDue: { schedule: { dueDate: "2026-08-20", intervalDays: 4, ease: 2.4, repetitions: 2, lapses: 0, lastRating: "good" as const, lastReviewed: "" } },
      earlyDue: { schedule: { dueDate: "2026-08-18", intervalDays: 8, ease: 2.1, repetitions: 3, lapses: 0, lastRating: "good" as const, lastReviewed: "" } },
      future: { schedule: { dueDate: "2026-08-24", intervalDays: 3, ease: 2.3, repetitions: 2, lapses: 0, lastRating: "good" as const, lastReviewed: "" } },
      newOne: {},
      newTwo: {},
    };
    const queue = buildDailyQueue(["laterDue", "earlyDue", "future", "newOne", "newTwo"], records, "2026-08-21", 3);
    expect(queue.dueIds).toEqual(["earlyDue", "laterDue"]);
    expect(queue.newIds).toEqual(["newOne"]);
    expect(queue.total).toBe(3);
  });
});
