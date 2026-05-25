import { VECTOR_KEYS } from "../constants";
import type { PriorityVectorResult } from "../types/triage.types";
import type { VectorKey, VectorScoreMap } from "../types/vector.types";
import { normalizeVectorScore } from "./normalize-vector-score";

export function resolvePriorityVector(
  rawScores: VectorScoreMap,
  userChoice?: VectorKey,
): PriorityVectorResult {
  const normalized = VECTOR_KEYS.map((vector) => ({
    vector,
    score: normalizeVectorScore(rawScores[vector]),
  }));
  const highest = Math.max(...normalized.map((item) => item.score));
  const tiedVectors = normalized
    .filter((item) => item.score === highest)
    .map((item) => item.vector);

  if (tiedVectors.length > 1 && !userChoice) {
    return {
      tiedVectors,
      requiresUserChoice: true,
    };
  }

  return {
    vector:
      userChoice && tiedVectors.includes(userChoice)
        ? userChoice
        : (tiedVectors[0] ?? "comportamento"),
    tiedVectors,
    requiresUserChoice: false,
  };
}

export function priorityOrderScore(rawScore: number, isChosen: boolean): number {
  return normalizeVectorScore(rawScore) + (isChosen ? 0.01 : 0);
}
