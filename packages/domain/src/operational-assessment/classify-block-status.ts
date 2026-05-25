import type { BlockStatus } from "../types/operational-assessment.types";

export function classifyBlockStatus(normalizedScore: number): BlockStatus {
  if (normalizedScore < 34) {
    return "Baixo Bloqueio";
  }

  if (normalizedScore < 67) {
    return "Bloqueio Moderado";
  }

  return "Bloqueio Alto";
}
