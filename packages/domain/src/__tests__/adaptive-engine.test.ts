import { describe, expect, test } from "bun:test";
import {
  calculateGapC,
  calculateGapE,
  calculateGapP,
  calculateSpi,
  calculateSvc,
  classifySvc,
  selectAdaptiveLevel,
} from "../adaptive-engine";

describe("adaptive engine", () => {
  test("calculates priority SVC with capped modifiers", () => {
    expect(
      calculateSvc({
        vector: "comportamento",
        priorityVector: "comportamento",
        fvaNorm: 80,
        imNorm: 20,
        operationalScoreNorm: 60,
        investigation: {
          origin: "congenita",
          hasPreviousFailedAttempt: true,
          abandonmentPattern: "precoce",
          trigger: "nao_identificado",
        },
      }),
    ).toBe(83);
  });

  test("calculates GAPs, SPI and adaptive level", () => {
    const gapP = calculateGapP("comportamento", {
      comportamento: 80,
      constancia: 50,
      gestao_pessoal: 40,
      controle_emocional: 30,
    });
    const gapE = calculateGapE(70, 40);
    const gapC = calculateGapC({
      weeklyAvailability: "2_3h",
      experienceLevel: "iniciante",
      hasWeightOscillation: true,
    });
    const spi = calculateSpi(80, gapP, gapE, gapC);

    expect(gapP).toBe(40);
    expect(gapE).toBe(30);
    expect(gapC).toBe(20);
    expect(spi).toBe(56);
    expect(selectAdaptiveLevel(spi)).toBe("Nível 3 — Construção");
  });

  test("calculates GAP-P from priority SVC and other vector mean", () => {
    expect(
      calculateGapP("comportamento", {
        comportamento: 80,
        constancia: 50,
        gestao_pessoal: 40,
        controle_emocional: 30,
      }),
    ).toBe(40);
  });

  test("calculates GAP-E from intent and operational score", () => {
    expect(calculateGapE(70, 40)).toBe(30);
  });

  test("calculates GAP-C from contextual complexity inputs", () => {
    expect(
      calculateGapC({
        weeklyAvailability: "menos_2h",
        experienceLevel: "nunca",
        hasWeightOscillation: true,
        hasHealthCondition: true,
        hasSystemicImpactB02: true,
      }),
    ).toBe(40);
  });

  test("calculates SPI with absolute GAP-E", () => {
    expect(calculateSpi(80, 40, -30, 20)).toBe(56);
  });

  test("selects adaptive level at boundaries", () => {
    expect(selectAdaptiveLevel(25)).toBe("Nível 1 — Fundação");
    expect(selectAdaptiveLevel(45)).toBe("Nível 2 — Estruturação");
    expect(selectAdaptiveLevel(80.01)).toBe("Nível 5 — Transformação");
  });

  test("classifies SVC", () => {
    expect(classifySvc(20)).toBe("Vulnerabilidade Mínima");
    expect(classifySvc(60)).toBe("Vulnerabilidade Alta");
    expect(classifySvc(90)).toBe("Vulnerabilidade Crítica");
  });
});
