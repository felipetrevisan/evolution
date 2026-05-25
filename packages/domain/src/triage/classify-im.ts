export function classifyIm(scoreNorm: number): string {
  if (scoreNorm < 25) {
    return "Intenção Mínima";
  }

  if (scoreNorm < 50) {
    return "Intenção Leve";
  }

  if (scoreNorm < 75) {
    return "Intenção Moderada";
  }

  return "Intenção Dominante";
}
