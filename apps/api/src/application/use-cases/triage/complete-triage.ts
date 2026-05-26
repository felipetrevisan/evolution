import {
  ALTERNATIVAS_POR_VETOR,
  generateDiagnosticSummary,
  type TriageQuestion,
  validateTriageSelection,
} from "../../../../../../packages/domain/src/index.ts";
import { ApiError, NotFoundError } from "../../../shared/errors/api-error";
import type { UserScopedRepository } from "../../repositories/base-repository";
import { getCurrentTriageSession } from "./get-current-triage-session";
import type { TriageSessionRecord } from "./record-triage-answer";

export async function completeTriage(
  uid: string,
  repository: UserScopedRepository<TriageSessionRecord>,
  questions?: TriageQuestion[],
) {
  const session = await getCompletableSession(uid, repository);

  if (!session) {
    throw new NotFoundError("Nenhuma sessão de triagem em andamento.");
  }

  const questionIds = questions?.map((question) => question.id);
  const validation = validateTriageSelection(session.answers, questionIds);

  if (!validation.valid) {
    throw new ApiError(
      "INVALID_TRIAGE_SESSION",
      "Triagem incompleta ou inválida.",
      422,
      validation.errors,
    );
  }

  const answers = questions ? withQuestionLayers(session.answers, questions) : session.answers;
  const result = generateDiagnosticSummary(answers, getDynamicMaxScores(questions));

  return repository.save(uid, session.id, {
    ...session,
    status: "completed",
    updatedAt: new Date().toISOString(),
    result,
  });
}

async function getCompletableSession(
  uid: string,
  repository: UserScopedRepository<TriageSessionRecord>,
) {
  return getCurrentTriageSession(uid, repository);
}

function getDynamicMaxScores(questions?: TriageQuestion[]) {
  if (!questions) {
    return undefined;
  }

  return {
    fvaMaxScore:
      questions.filter((question) => question.layer === "FVA").length * ALTERNATIVAS_POR_VETOR,
    imMaxScore:
      questions.filter((question) => question.layer === "IM").length * ALTERNATIVAS_POR_VETOR,
  };
}

function withQuestionLayers(answers: TriageSessionRecord["answers"], questions: TriageQuestion[]) {
  const layers = new Map(questions.map((question) => [question.id, question.layer]));

  return answers.map((answer) => {
    const layer = answer.layer ?? layers.get(answer.questionId);

    return layer ? { ...answer, layer } : answer;
  });
}
