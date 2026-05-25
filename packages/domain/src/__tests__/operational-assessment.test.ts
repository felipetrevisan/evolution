import { describe, expect, test } from "bun:test";
import {
  calculateBlockScore,
  calculateOperationalScore,
  classifyBlockStatus,
} from "../operational-assessment";
import type { OperationalAnswer } from "../types";

const answers = Array.from({ length: 12 }, (_, index) => ({
  questionId: index + 1,
  value: 6,
})) as OperationalAnswer[];

describe("operational assessment", () => {
  test("calculates normalized total score", () => {
    expect(calculateOperationalScore(answers)).toEqual({ raw: 72, normalized: 100 });
  });

  test("calculates block score", () => {
    expect(calculateBlockScore(answers, "X")).toEqual({ raw: 24, normalized: 100 });
  });

  test("classifies block status", () => {
    expect(classifyBlockStatus(20)).toBe("Baixo Bloqueio");
    expect(classifyBlockStatus(50)).toBe("Bloqueio Moderado");
    expect(classifyBlockStatus(80)).toBe("Bloqueio Alto");
  });
});
