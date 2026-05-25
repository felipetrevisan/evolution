import { describe, expect, test } from "bun:test";
import type { InvestigationQuestion } from "@evolution/domain";
import { getNextQuestionFromTree } from "../application/use-cases/investigation/investigation-flow";

describe("investigation flow", () => {
  test("starts with first configured question when X1 is not present", () => {
    const questions: InvestigationQuestion[] = [
      {
        id: "custom-start",
        block: "X",
        text: "Primeira pergunta configurada",
        options: [{ id: "a", label: "A" }],
      },
    ];

    expect(getNextQuestionFromTree(questions, [])?.id).toBe("custom-start");
  });
});
