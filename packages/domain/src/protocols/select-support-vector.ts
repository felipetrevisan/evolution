import { VECTOR_KEYS } from "../constants";
import type { VectorKey } from "../types/vector.types";

export function selectSupportVector(
  priorityVector: VectorKey,
  scores: {
    fva: Record<VectorKey, number>;
    im: Record<VectorKey, number>;
  },
): VectorKey {
  return VECTOR_KEYS.filter((vector) => vector !== priorityVector).sort((left, right) => {
    const imDifference = scores.im[right] - scores.im[left];
    if (imDifference !== 0) return imDifference;

    const fvaDifference = scores.fva[left] - scores.fva[right];
    if (fvaDifference !== 0) return fvaDifference;

    return left.localeCompare(right);
  })[0] as VectorKey;
}
