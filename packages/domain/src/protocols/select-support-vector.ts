import { VECTOR_KEYS } from "../constants";
import type { VectorKey } from "../types/vector.types";

export function selectSupportVector(
  priorityVector: VectorKey,
  svcScores: Record<VectorKey, number>,
): VectorKey {
  return VECTOR_KEYS.filter((vector) => vector !== priorityVector).sort(
    (a, b) => svcScores[b] - svcScores[a],
  )[0] as VectorKey;
}
