import type { CheckInMode } from "../types/check-in.types";

export function getCheckinMode(input: { streak: number; shouldRecalibrate: boolean }): CheckInMode {
  if (input.shouldRecalibrate) {
    return "recalibration";
  }

  return input.streak >= 7 ? "minimal" : "standard";
}
