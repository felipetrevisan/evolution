import type { RiskFlag } from "../types/adaptive-engine.types";

export function detectRiskFlags(input: { svc: number; gapC: number; gapE: number }): RiskFlag[] {
  return [
    ...(input.svc >= 75
      ? [{ code: "SVC_CRITICO", message: "Vulnerabilidade crítica no vetor prioritário." }]
      : []),
    ...(input.gapC >= 25
      ? [{ code: "GAP_C_ALTO", message: "Complexidade contextual elevada." }]
      : []),
    ...(Math.abs(input.gapE) >= 40
      ? [{ code: "GAP_E_ALTO", message: "Distância elevada entre intenção e operação." }]
      : []),
  ];
}
