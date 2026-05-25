import type { CheckInEntry } from "../types/check-in.types";

export function calculateStreak(entries: CheckInEntry[]): number {
  let streak = 0;

  for (const entry of [...entries].reverse()) {
    if (!entry.completed) {
      break;
    }

    streak += 1;
  }

  return streak;
}
