import type { SvcClassification } from "../types/adaptive-engine.types";

export function classifySvc(svc: number): SvcClassification {
  if (svc < 25) {
    return "Vulnerabilidade Mínima";
  }

  if (svc < 50) {
    return "Vulnerabilidade Moderada";
  }

  if (svc < 75) {
    return "Vulnerabilidade Alta";
  }

  return "Vulnerabilidade Crítica";
}
