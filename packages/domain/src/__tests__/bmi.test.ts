import { describe, expect, test } from "bun:test";
import { calculateBmi, classifyBmi, validateBmi } from "../bmi";

describe("BMI", () => {
  test("calculates BMI rounded to 2 decimals", () => {
    expect(calculateBmi(70, 175)).toBe(22.86);
  });

  test("classifies BMI ranges", () => {
    expect(classifyBmi(18)).toBe("Abaixo do peso");
    expect(classifyBmi(24.9)).toBe("Peso normal");
    expect(classifyBmi(29.9)).toBe("Sobrepeso");
    expect(classifyBmi(34.9)).toBe("Obesidade grau I");
    expect(classifyBmi(39.9)).toBe("Obesidade grau II");
    expect(classifyBmi(40)).toBe("Obesidade grau III");
  });

  test("validates anthropometric bounds and historical warning", () => {
    expect(validateBmi(70, 175).valid).toBe(true);
    expect(validateBmi(400, 175).valid).toBe(false);
    expect(validateBmi(20, 220).warnings).toContain(
      "IMC fora da faixa esperada. Confirme antes de salvar no histórico.",
    );
  });
});
