import { describe, expect, it } from "vitest";
import { blockingTimeAfterPaint } from "../../scripts/blocking-time.mjs";

describe("blockingTimeAfterPaint", () => {
  it("ignores work that finishes before the first paint", () => {
    // The page's own first render, as a CI runner logs it: 100 ms at 24 ms
    expect(blockingTimeAfterPaint([{ startTime: 24, duration: 100 }], 184)).toBe(0);
  });

  it("counts a long task after the paint, slowed by the phone's CPU", () => {
    // 30 ms on the runner is 120 ms on the phone: 70 ms over the 50 ms line
    expect(blockingTimeAfterPaint([{ startTime: 300, duration: 30 }], 184)).toBe(70);
  });

  it("counts only the part of a task that falls after the paint", () => {
    // 20 of its 40 ms come after the paint: 20 * 4 - 50
    expect(blockingTimeAfterPaint([{ startTime: 144, duration: 40 }], 164)).toBe(30);
  });

  it("does not count a task that stays under the line on the phone", () => {
    expect(blockingTimeAfterPaint([{ startTime: 400, duration: 10 }], 184)).toBe(0);
  });

  it("adds the tasks up", () => {
    const tasks = [
      { startTime: 300, duration: 30 },
      { startTime: 500, duration: 40 },
    ];
    expect(blockingTimeAfterPaint(tasks, 184)).toBe(70 + 110);
  });
});
