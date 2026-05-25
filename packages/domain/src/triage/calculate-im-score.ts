import { VECTOR_KEYS } from "../constants";
import type { TriageSelection } from "../types/triage.types";
import type { VectorScoreMap } from "../types/vector.types";

export function calculateImScore(selections: TriageSelection[]): VectorScoreMap {
  const scores = Object.fromEntries(VECTOR_KEYS.map((vector) => [vector, 0])) as VectorScoreMap;

  for (const selection of selections) {
    if (
      selection.layer === "IM" ||
      (!selection.layer && selection.questionId >= 4 && selection.questionId <= 6)
    ) {
      scores[selection.vector] += 1;
    }
  }

  return scores;
}
