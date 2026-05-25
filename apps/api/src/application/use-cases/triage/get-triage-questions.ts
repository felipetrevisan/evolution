import { ALTERNATIVAS_POR_PERGUNTA, SELECOES_OBRIGATORIAS } from "@evolution/domain";
import { ConfigurationError } from "../../../shared/errors/api-error";
import type { AdminConfigRepository } from "../../repositories/admin-config-repository";

export async function getTriageQuestions(repository: AdminConfigRepository) {
  const questions = await repository.getTriageQuestions();

  if (!questions) {
    throw new ConfigurationError("Triagem não configurada no banco de dados.");
  }

  return {
    questions,
    maxSelections: SELECOES_OBRIGATORIAS,
    alternativesPerQuestion: ALTERNATIVAS_POR_PERGUNTA,
  };
}
