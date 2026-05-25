import type { TriggerClassification } from "../types/investigation.types";

export function inferTrigger(answer?: string): TriggerClassification {
  if (!answer?.trim()) return "nao_identificado";
  if (answer.includes("rotina") || answer.includes("horário")) return "rotina";
  if (answer.includes("novo") || answer.includes("diferente")) return "novidade";
  if (answer.includes("emo") || answer.includes("sobrecarga")) return "emocional";
  return "nao_identificado";
}
