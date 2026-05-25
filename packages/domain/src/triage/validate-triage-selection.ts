import { PERGUNTAS_TRIAGEM, SELECOES_OBRIGATORIAS } from "../constants";
import type { TriageSelection, TriageValidationResult } from "../types/triage.types";

export function validateTriageSelection(
  selections: TriageSelection[],
  expectedQuestionIds = Array.from({ length: PERGUNTAS_TRIAGEM }, (_, index) => index + 1),
): TriageValidationResult {
  const errors: string[] = [];

  for (const questionId of expectedQuestionIds) {
    const selectionsForQuestion = selections.filter(
      (selection) => selection.questionId === questionId,
    );
    const uniqueAlternativeIds = new Set(
      selectionsForQuestion.map((selection) => selection.alternativeId),
    );

    if (selectionsForQuestion.length !== SELECOES_OBRIGATORIAS) {
      errors.push(`Pergunta ${questionId} deve ter exatamente 6 seleções.`);
    }

    if (uniqueAlternativeIds.size !== selectionsForQuestion.length) {
      errors.push(`Pergunta ${questionId} possui seleções duplicadas.`);
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}
