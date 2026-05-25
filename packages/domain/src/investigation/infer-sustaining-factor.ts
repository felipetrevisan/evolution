import type { SustainingFactor } from "../types/investigation.types";

export function inferSustainingFactor(answer: string): SustainingFactor {
  if (answer.includes("rotina") || answer.includes("horário")) {
    return "horario_fixo";
  }

  if (answer.includes("alguém") || answer.includes("acompanh")) {
    return "companhia_social";
  }

  if (answer.includes("gost")) {
    return "prazer_atividade";
  }

  return "indefinido";
}
