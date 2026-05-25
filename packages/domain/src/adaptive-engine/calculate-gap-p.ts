import { mean, roundTo } from "../shared/math";
import type { VectorKey } from "../types/vector.types";

export function calculateGapP(
  priorityVector: VectorKey,
  svcScores: Record<VectorKey, number>,
): number {
  const others = Object.entries(svcScores)
    .filter(([vector]) => vector !== priorityVector)
    .map(([, score]) => score);

  return roundTo(svcScores[priorityVector] - mean(others), 2);
}
