export function classifyFva(scoreNorm: number): string {
  if (scoreNorm < 25) {
    return "Fragilidade Mínima";
  }

  if (scoreNorm < 50) {
    return "Fragilidade Leve";
  }

  if (scoreNorm < 75) {
    return "Fragilidade Moderada";
  }

  return "Fragilidade Dominante";
}
