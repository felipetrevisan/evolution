import {
  ALTERNATIVAS_POR_PERGUNTA,
  ALTERNATIVAS_POR_VETOR,
  type TriageQuestion,
  type VectorKey,
} from "@evolution/domain";
import { ApiError, ConfigurationError } from "../../../shared/errors/api-error";
import type { AdminConfigRepository } from "../../repositories/admin-config-repository";

export async function getAdminTriageQuestions(repository: AdminConfigRepository) {
  const questions = await repository.getTriageQuestions();

  if (!questions) {
    throw new ConfigurationError("Triagem não configurada no banco de dados.");
  }

  return questions;
}

export async function saveAdminTriageQuestions(
  questions: TriageQuestion[],
  repository: AdminConfigRepository,
) {
  validateQuestions(questions);
  return repository.saveTriageQuestions(questions);
}

function validateQuestions(questions: TriageQuestion[]) {
  if (questions.length === 0) {
    throw new ApiError(
      "INVALID_TRIAGE_CONFIG",
      "A triagem precisa ter ao menos uma pergunta.",
      422,
    );
  }

  const duplicateIds = questions.filter(
    (question, index) => questions.findIndex((item) => item.id === question.id) !== index,
  );

  if (duplicateIds.length > 0) {
    throw new ApiError("INVALID_TRIAGE_CONFIG", "As perguntas precisam ter IDs únicos.", 422);
  }

  for (const question of questions) {
    if (question.alternatives.length !== ALTERNATIVAS_POR_PERGUNTA) {
      throw new ApiError(
        "INVALID_TRIAGE_CONFIG",
        `A pergunta ${question.id} precisa ter 12 alternativas.`,
        422,
      );
    }

    const distribution = question.alternatives.reduce<Record<VectorKey, number>>(
      (accumulator, alternative) => {
        accumulator[alternative.vector] += 1;
        return accumulator;
      },
      {
        comportamento: 0,
        constancia: 0,
        gestao_pessoal: 0,
        controle_emocional: 0,
      },
    );

    if (Object.values(distribution).some((count) => count !== ALTERNATIVAS_POR_VETOR)) {
      throw new ApiError(
        "INVALID_TRIAGE_CONFIG",
        `A pergunta ${question.id} precisa ter 3 alternativas por vetor.`,
        422,
      );
    }
  }
}
