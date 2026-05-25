import type { TriageQuestion } from "@/lib/api-client";
import { type TriageLayerFilter, vectorOptions } from "./triage-admin.types";

export function createQuestion(id: number, layer: "FVA" | "IM"): TriageQuestion {
  return {
    id,
    layer,
    text: "Nova pergunta de triagem",
    alternatives: vectorOptions.flatMap((vector) =>
      Array.from({ length: 3 }, (_, index) => ({
        id: `Q${String(id).padStart(2, "0")}_${vector.value}_${index + 1}`,
        questionId: id,
        vector: vector.value,
        label: `${vector.label} ${index + 1}`,
        weight: 1 as const,
      })),
    ),
  };
}

export function filterQuestions(
  questions: TriageQuestion[],
  query: string,
  layerFilter: TriageLayerFilter,
) {
  const normalizedQuery = query.trim().toLowerCase();

  return orderQuestions(questions).filter((question) => {
    const matchesLayer = layerFilter === "all" || question.layer === layerFilter;
    const matchesQuery =
      !normalizedQuery ||
      String(question.id).includes(normalizedQuery) ||
      question.text.toLowerCase().includes(normalizedQuery);

    return matchesLayer && matchesQuery;
  });
}

export function orderQuestions(questions: TriageQuestion[]) {
  return [...questions].sort((left, right) => left.id - right.id);
}

export function nextQuestionId(questions: TriageQuestion[]) {
  return Math.max(0, ...questions.map((question) => question.id)) + 1;
}
