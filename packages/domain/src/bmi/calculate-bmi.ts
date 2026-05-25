import { roundTo } from "../shared/math";

export function calculateBmi(weightKg: number, heightCm: number): number {
  if (weightKg <= 0 || heightCm <= 0) {
    return 0;
  }

  const heightMeters = heightCm / 100;
  return roundTo(weightKg / (heightMeters * heightMeters), 2);
}
