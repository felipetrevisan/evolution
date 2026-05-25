import type { BmiClassification } from "../types/anamnese.types";

export function classifyBmi(bmi: number): BmiClassification {
  if (bmi < 18.5) {
    return "Abaixo do peso";
  }

  if (bmi < 25) {
    return "Peso normal";
  }

  if (bmi < 30) {
    return "Sobrepeso";
  }

  if (bmi < 35) {
    return "Obesidade grau I";
  }

  if (bmi < 40) {
    return "Obesidade grau II";
  }

  return "Obesidade grau III";
}
