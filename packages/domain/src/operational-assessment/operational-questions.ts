import type { OperationalQuestion } from "../types/operational-assessment.types";

export const OPERATIONAL_QUESTIONS: OperationalQuestion[] = Array.from(
  { length: 12 },
  (_, index) => {
    const id = index + 1;

    return {
      id,
      block: id <= 4 ? "X" : id <= 8 ? "Y" : "Z",
      text: `Questão operacional ${id.toString().padStart(2, "0")}`,
    };
  },
);
