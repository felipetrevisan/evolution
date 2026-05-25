import { roundTo } from "../shared/math";
import type {
  OperationalAnswer,
  OperationalBlock,
  OperationalScore,
} from "../types/operational-assessment.types";
import { OPERATIONAL_QUESTIONS } from "./operational-questions";

export function calculateBlockScore(
  answers: OperationalAnswer[],
  block: OperationalBlock,
): OperationalScore {
  const questionIds = OPERATIONAL_QUESTIONS.filter((question) => question.block === block).map(
    (question) => question.id,
  );
  const raw = answers
    .filter((answer) => questionIds.includes(answer.questionId))
    .reduce((sum, answer) => sum + answer.value, 0);

  return {
    raw,
    normalized: roundTo(((raw - 4) / 20) * 100, 2),
  };
}
