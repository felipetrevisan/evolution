import { BMI_CONFIRMATION_RANGE } from "../constants";
import type { BmiValidationResult } from "../types/anamnese.types";
import { calculateBmi } from "./calculate-bmi";

export function validateBmi(weightKg: number, heightCm: number): BmiValidationResult {
  const warnings: string[] = [];

  if (weightKg <= 0 || weightKg > 300) {
    warnings.push("Peso deve ser maior que 0kg e menor ou igual a 300kg.");
  }

  if (heightCm <= 0 || heightCm > 250) {
    warnings.push("Altura deve ser maior que 0cm e menor ou igual a 250cm.");
  }

  const bmi = calculateBmi(weightKg, heightCm);

  if (bmi < BMI_CONFIRMATION_RANGE.min || bmi > BMI_CONFIRMATION_RANGE.max) {
    warnings.push("IMC fora da faixa esperada. Confirme antes de salvar no histórico.");
  }

  return {
    valid: warnings.length === 0,
    warnings,
  };
}
