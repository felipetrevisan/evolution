import { roundTo } from "../shared/math";
import type { OperationalAnswer, OperationalScore } from "../types/operational-assessment.types";

export function calculateOperationalScore(answers: OperationalAnswer[]): OperationalScore {
  const raw = answers.reduce((sum, answer) => sum + answer.value, 0);

  return {
    raw,
    normalized: roundTo(((raw - 12) / 60) * 100, 2),
  };
}
