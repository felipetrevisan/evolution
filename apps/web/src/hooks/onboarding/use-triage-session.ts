"use client";

import { useEffect, useState } from "react";
import { api, type TriageQuestionsResponse } from "@/lib/api-client";

export function useTriageSession() {
  const [questionIndex, setQuestionIndex] = useState(0);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [metadata, setMetadata] = useState<TriageQuestionsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const question = metadata?.questions[questionIndex];
  const maxSelections = metadata?.maxSelections ?? 0;
  const totalQuestions = metadata?.questions.length ?? 0;

  useEffect(() => {
    api
      .triageQuestions()
      .then(async (response) => {
        const currentSession = await api.currentTriageSession().catch(() => null);
        const answeredQuestionIds = new Set(
          currentSession?.answers?.map((answer) => answer.questionId) ?? [],
        );
        const nextQuestionIndex = response.questions.findIndex(
          (question) => !answeredQuestionIds.has(question.id),
        );

        setError(null);
        setMetadata(response);
        setSessionId(currentSession?.id ?? null);
        setQuestionIndex(nextQuestionIndex >= 0 ? nextQuestionIndex : 0);
      })
      .catch(() => setError("Não foi possível carregar a triagem."))
      .finally(() => setLoading(false));
  }, []);

  function toggle(id: string) {
    setSelectedIds((current) => {
      if (current.includes(id)) {
        return current.filter((item) => item !== id);
      }

      return current.length < maxSelections ? [...current, id] : current;
    });
  }

  return {
    question,
    questionIndex,
    totalQuestions,
    isLastQuestion: totalQuestions > 0 && questionIndex === totalQuestions - 1,
    sessionId,
    selectedIds,
    maxSelections,
    alternativesPerQuestion: metadata?.alternativesPerQuestion ?? 0,
    canContinue: maxSelections > 0 && selectedIds.length === maxSelections,
    loading,
    error,
    toggle,
    setSessionId,
    next: () => {
      setSelectedIds([]);
      setQuestionIndex((index) => Math.min(index + 1, (metadata?.questions.length ?? 1) - 1));
    },
  };
}
