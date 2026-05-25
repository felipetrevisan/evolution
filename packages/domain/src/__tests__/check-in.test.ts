import { describe, expect, test } from "bun:test";
import { calculateStreak } from "../check-in";

describe("check-in", () => {
  test("calculates streak until first incomplete day", () => {
    expect(
      calculateStreak([
        { date: "2026-05-20", completed: true },
        { date: "2026-05-21", completed: false },
        { date: "2026-05-22", completed: true },
        { date: "2026-05-23", completed: true },
      ]),
    ).toBe(2);
  });
});
