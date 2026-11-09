import { describe, it, expect } from "vitest";
import {
  buildSmoothPath,
  getCalendarYearInfo,
  getDotCenter,
  COLS,
  GAP,
  SNAKE_SPEEDS,
} from "../lib/focusframe/snakeRenderer";

describe("FocusFrame Snake Renderer & Calendar Adapter", () => {
  it("buildSmoothPath handles edge cases correctly", () => {
    expect(buildSmoothPath([])).toBe("");

    const p1 = [{ x: 5, y: 5 }];
    expect(buildSmoothPath(p1)).toBe("M 5.0 5.0 L 5.0 5.0");

    const p2 = [
      { x: 5, y: 5 },
      { x: 15, y: 5 },
    ];
    expect(buildSmoothPath(p2)).toBe("M 5.0 5.0 L 15.0 5.0");

    const p3 = [
      { x: 5, y: 5 },
      { x: 15, y: 5 },
      { x: 15, y: 15 },
    ];
    // Midpoint of p0, p1 is (10, 5), midpoint of p1, p2 is (15, 10)
    expect(buildSmoothPath(p3)).toBe("M 5.0 5.0 L 10.0 5.0 Q 15.0 5.0 15.0 10.0 L 15.0 15.0");
  });

  it("getDotCenter computes correct row-major centers for 26 columns", () => {
    // Cell 0 is top-left
    expect(getDotCenter(0)).toEqual({ x: GAP / 2, y: GAP / 2 });
    // Cell 25 is end of row 0
    expect(getDotCenter(25)).toEqual({ x: 25 * GAP + GAP / 2, y: GAP / 2 });
    // Cell 26 is start of row 1
    expect(getDotCenter(26)).toEqual({ x: GAP / 2, y: GAP + GAP / 2 });
  });

  it("getCalendarYearInfo respects 365 vs 366 days and excludes today from walkable", () => {
    // Leap year: 2024
    const leapDate = new Date(2024, 1, 29, 12, 0, 0); // Feb 29 2024
    const leapInfo = getCalendarYearInfo(leapDate);
    expect(leapInfo.daysInYear).toBe(366);
    expect(leapInfo.year).toBe(2024);
    expect(leapInfo.walkableCount).toBe(leapInfo.dayOfYear - 1);
    expect(leapInfo.todayIndex).toBe(leapInfo.dayOfYear - 1);

    // Non-leap year: 2026
    const nonLeapDate = new Date(2026, 6, 1, 12, 0, 0); // July 1 2026
    const nonLeapInfo = getCalendarYearInfo(nonLeapDate);
    expect(nonLeapInfo.daysInYear).toBe(365);
    expect(nonLeapInfo.year).toBe(2026);
    expect(nonLeapInfo.walkableCount).toBe(nonLeapInfo.dayOfYear - 1);

    // Jan 1: no completed days yet
    const jan1 = new Date(2026, 0, 1, 12, 0, 0);
    const jan1Info = getCalendarYearInfo(jan1);
    expect(jan1Info.dayOfYear).toBe(1);
    expect(jan1Info.walkableCount).toBe(0);
    expect(jan1Info.todayIndex).toBe(0);
    expect(jan1Info.daysLeft).toBe(364);

    // Dec 31: 364 days completed, 1 today, 0 left
    const dec31 = new Date(2026, 11, 31, 12, 0, 0);
    const dec31Info = getCalendarYearInfo(dec31);
    expect(dec31Info.dayOfYear).toBe(365);
    expect(dec31Info.walkableCount).toBe(364);
    expect(dec31Info.todayIndex).toBe(364);
    expect(dec31Info.daysLeft).toBe(0);
  });

  it("SNAKE_SPEEDS match extension exact timings", () => {
    expect(SNAKE_SPEEDS.Slow).toBe(220);
    expect(SNAKE_SPEEDS.Medium).toBe(140);
    expect(SNAKE_SPEEDS.Fast).toBe(90);
  });
});

