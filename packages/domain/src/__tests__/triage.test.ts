import { describe, expect, test } from "bun:test";
import {
  calculateFvaScore,
  calculateImScore,
  classifyFva,
  classifyIm,
  normalizeVectorScore,
  priorityOrderScore,
  resolvePriorityVector,
  validateTriageSelection,
} from "../triage";
import type { TriageSelection } from "../types";

const selections: TriageSelection[] = Array.from({ length: 6 }, (_, questionIndex) =>
  Array.from({ length: 6 }, (__, selectionIndex) => ({
    questionId: questionIndex + 1,
    alternativeId: `q${questionIndex + 1}-${selectionIndex}`,
    vector: selectionIndex < 3 ? "comportamento" : "constancia",
  })),
).flat() as TriageSelection[];

describe("triage", () => {
  test("validates exactly six selections per question", () => {
    expect(validateTriageSelection(selections).valid).toBe(true);
    expect(validateTriageSelection(selections.slice(1)).valid).toBe(false);
  });

  test("calculates FVA score from questions 1 to 3", () => {
    expect(calculateFvaScore(selections).comportamento).toBe(9);
    expect(calculateFvaScore(selections).constancia).toBe(9);
  });

  test("calculates IM score from questions 4 to 6", () => {
    expect(calculateImScore(selections).comportamento).toBe(9);
    expect(calculateImScore(selections).constancia).toBe(9);
  });

  test("normalizes raw vector score", () => {
    expect(normalizeVectorScore(9)).toBe(100);
    expect(normalizeVectorScore(4.5)).toBe(50);
  });

  test("classifies FVA score", () => {
    expect(classifyFva(24.99)).toBe("Fragilidade Mínima");
    expect(classifyFva(75)).toBe("Fragilidade Dominante");
  });

  test("classifies IM score", () => {
    expect(classifyIm(24.99)).toBe("Intenção Mínima");
    expect(classifyIm(50)).toBe("Intenção Moderada");
  });

  test("requires user choice on priority tie", () => {
    const result = resolvePriorityVector({
      comportamento: 3,
      constancia: 3,
      gestao_pessoal: 1,
      controle_emocional: 0,
    });

    expect(result.requiresUserChoice).toBe(true);
  });

  test("selects priority vector when there is no tie", () => {
    const result = resolvePriorityVector({
      comportamento: 9,
      constancia: 3,
      gestao_pessoal: 1,
      controle_emocional: 0,
    });

    expect(result.vector).toBe("comportamento");
    expect(result.requiresUserChoice).toBe(false);
  });

  test("applies tie-break ordering without changing classification score", () => {
    expect(priorityOrderScore(9, true)).toBe(100.01);
    expect(priorityOrderScore(9, false)).toBe(100);
  });
});
