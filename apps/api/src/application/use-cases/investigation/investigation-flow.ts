import type {
  InvestigationAnswer,
  InvestigationQuestion,
} from "../../../../../../packages/domain/src/index.ts";

export function getNextQuestionFromTree(
  questions: InvestigationQuestion[],
  answers: InvestigationAnswer[],
) {
  const byId = new Map(questions.map((question) => [question.id, question]));

  if (answers.length === 0) {
    return byId.get("X1") ?? questions[0];
  }

  const latest = answers.at(-1);
  const latestQuestion = latest ? byId.get(latest.questionId) : undefined;
  const selectedOption = latestQuestion?.options.find((option) => option.id === latest?.answer);

  return selectedOption?.nextQuestionId ? byId.get(selectedOption.nextQuestionId) : undefined;
}
