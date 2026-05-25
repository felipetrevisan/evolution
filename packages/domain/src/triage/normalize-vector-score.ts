import { MAX_SCORE_VETOR } from "../constants";
import { clamp, roundTo } from "../shared/math";

export function normalizeVectorScore(raw: number, maxScore = MAX_SCORE_VETOR): number {
  if (maxScore <= 0) {
    return 0;
  }

  return roundTo(clamp((raw / maxScore) * 100), 2);
}
