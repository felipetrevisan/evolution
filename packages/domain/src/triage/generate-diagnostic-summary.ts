import { VECTOR_KEYS } from "../constants";
import type { DiagnosticSummary, TriageSelection } from "../types/triage.types";
import { calculateFvaScore } from "./calculate-fva-score";
import { calculateImScore } from "./calculate-im-score";
import { classifyFva } from "./classify-fva";
import { classifyIm } from "./classify-im";
import { normalizeVectorScore } from "./normalize-vector-score";
import { resolvePriorityVector } from "./resolve-priority-vector";

export function generateDiagnosticSummary(
  selections: TriageSelection[],
  options?: { fvaMaxScore?: number; imMaxScore?: number },
): DiagnosticSummary {
  const fvaRaw = calculateFvaScore(selections);
  const imRaw = calculateImScore(selections);

  return {
    fvaPriority: resolvePriorityVector(fvaRaw),
    imPriority: resolvePriorityVector(imRaw),
    fva: Object.fromEntries(
      VECTOR_KEYS.map((vector) => {
        const normalized = normalizeVectorScore(fvaRaw[vector], options?.fvaMaxScore);
        return [
          vector,
          { raw: fvaRaw[vector], normalized, classification: classifyFva(normalized) },
        ];
      }),
    ) as DiagnosticSummary["fva"],
    im: Object.fromEntries(
      VECTOR_KEYS.map((vector) => {
        const normalized = normalizeVectorScore(imRaw[vector], options?.imMaxScore);
        return [vector, { raw: imRaw[vector], normalized, classification: classifyIm(normalized) }];
      }),
    ) as DiagnosticSummary["im"],
  };
}
