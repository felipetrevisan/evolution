import { roundTo } from "../shared/math";

export function calculateGapE(
  imNormPriority: number,
  operationalScoreNormPriority: number,
): number {
  return roundTo(imNormPriority - operationalScoreNormPriority, 2);
}
