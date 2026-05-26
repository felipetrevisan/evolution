import type {
  InvestigationQuestion,
  OperationalQuestion,
  VectorKey,
} from "../../../../../../packages/domain/src/index.ts";
import { ApiError, ConfigurationError } from "../../../shared/errors/api-error";
import type { AdminConfigRepository } from "../../repositories/admin-config-repository";

export async function getAdminInvestigationQuestions(
  priorityVector: VectorKey,
  repository: AdminConfigRepository,
) {
  const questions = await repository.getInvestigationQuestions(priorityVector);

  if (!questions) {
    throw new ConfigurationError("Investigação não configurada no banco de dados.");
  }

  return questions;
}

export async function saveAdminInvestigationQuestions(
  questionsByVector: Record<VectorKey, InvestigationQuestion[]>,
  repository: AdminConfigRepository,
) {
  return repository.saveInvestigationQuestions(questionsByVector);
}

export async function getAdminOperationalQuestions(repository: AdminConfigRepository) {
  const questions = await repository.getOperationalQuestions();

  if (!questions) {
    throw new ConfigurationError("Autoavaliação operacional não configurada no banco de dados.");
  }

  return questions;
}

export async function saveAdminOperationalQuestions(
  questions: OperationalQuestion[],
  repository: AdminConfigRepository,
) {
  validateOperationalQuestions(questions);
  return repository.saveOperationalQuestions(questions);
}

function validateOperationalQuestions(questions: OperationalQuestion[]) {
  if (questions.length !== 12) {
    throw new ApiError(
      "INVALID_OPERATIONAL_CONFIG",
      "A autoavaliação precisa ter 12 perguntas.",
      422,
    );
  }

  for (const block of ["X", "Y", "Z"] as const) {
    if (questions.filter((question) => question.block === block).length !== 4) {
      throw new ApiError(
        "INVALID_OPERATIONAL_CONFIG",
        `O bloco ${block} precisa ter 4 perguntas.`,
        422,
      );
    }
  }
}
