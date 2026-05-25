import { ALTERNATIVAS_POR_PERGUNTA, ALTERNATIVAS_POR_VETOR, PERGUNTAS_TRIAGEM } from "../constants";
import type { TriageAlternative, TriageLayer, TriageQuestion } from "../types/triage.types";
import type { VectorKey } from "../types/vector.types";

type AlternativeDefinition = {
  label: string;
  vector: VectorKey;
};

type QuestionDefinition = {
  id: number;
  layer: TriageLayer;
  text: string;
  alternatives: AlternativeDefinition[];
};

const questionDefinitions: QuestionDefinition[] = [
  {
    id: 1,
    layer: "FVA",
    text: "Hoje, qual destas áreas mais dificulta sua evolução pessoal?",
    alternatives: [
      { label: "Rotina caótica", vector: "gestao_pessoal" },
      { label: "Direção perdida", vector: "gestao_pessoal" },
      { label: "Tempo escasso", vector: "gestao_pessoal" },
      { label: "Paro e recomeço", vector: "constancia" },
      { label: "Ciclos de abandono", vector: "constancia" },
      { label: "Dificuldade de retomada", vector: "constancia" },
      { label: "Inércia de ação", vector: "comportamento" },
      { label: "Procrastino", vector: "comportamento" },
      { label: "Fico paralisado", vector: "comportamento" },
      { label: "Ansiedade alta", vector: "controle_emocional" },
      { label: "Estresse constante", vector: "controle_emocional" },
      { label: "Emoções dominam", vector: "controle_emocional" },
    ],
  },
  {
    id: 2,
    layer: "FVA",
    text: "Quando você tenta mudar sua rotina, o que mais faz você parar?",
    alternatives: [
      { label: "Rotina desorganizada", vector: "gestao_pessoal" },
      { label: "Perder prioridades", vector: "gestao_pessoal" },
      { label: "Planejamento falho", vector: "gestao_pessoal" },
      { label: "Motivação oscila", vector: "comportamento" },
      { label: "Cansaço físico", vector: "comportamento" },
      { label: "Trava no início", vector: "comportamento" },
      { label: "Abandono rápido", vector: "constancia" },
      { label: "Falha e desisto", vector: "constancia" },
      { label: "Sustentação frágil", vector: "constancia" },
      { label: "Comer emocional", vector: "controle_emocional" },
      { label: "Autocrítica forte", vector: "controle_emocional" },
      { label: "Ansiedade bloqueia", vector: "controle_emocional" },
    ],
  },
  {
    id: 3,
    layer: "FVA",
    text: "O que mais incomoda você quando pensa na sua saúde e no seu corpo?",
    alternatives: [
      { label: "Sedentarismo", vector: "comportamento" },
      { label: "Corpo inativo", vector: "comportamento" },
      { label: "Energia baixa", vector: "comportamento" },
      { label: "Rotina instável", vector: "constancia" },
      { label: "Sempre recomeçando", vector: "constancia" },
      { label: "Persistência curta", vector: "constancia" },
      { label: "Desorganização", vector: "gestao_pessoal" },
      { label: "Estrutura ausente", vector: "gestao_pessoal" },
      { label: "Caos diário", vector: "gestao_pessoal" },
      { label: "Peso como escape", vector: "controle_emocional" },
      { label: "Baixa autoestima", vector: "controle_emocional" },
      { label: "Descontrole geral", vector: "controle_emocional" },
    ],
  },
  {
    id: 4,
    layer: "IM",
    text: "Escolha as palavras que representam quem você quer construir nos próximos 45 dias",
    alternatives: [
      { label: "Disciplinado", vector: "comportamento" },
      { label: "Ativo", vector: "comportamento" },
      { label: "Iniciador", vector: "comportamento" },
      { label: "Constante", vector: "constancia" },
      { label: "Persistente", vector: "constancia" },
      { label: "Regular", vector: "constancia" },
      { label: "Organizado", vector: "gestao_pessoal" },
      { label: "Estruturado", vector: "gestao_pessoal" },
      { label: "Planejado", vector: "gestao_pessoal" },
      { label: "Equilibrado", vector: "controle_emocional" },
      { label: "Leve", vector: "controle_emocional" },
      { label: "Centrado", vector: "controle_emocional" },
    ],
  },
  {
    id: 5,
    layer: "IM",
    text: "O que você mais quer sentir daqui para frente?",
    alternatives: [
      { label: "Disposição", vector: "comportamento" },
      { label: "Motivação", vector: "comportamento" },
      { label: "Energia", vector: "comportamento" },
      { label: "Progresso real", vector: "constancia" },
      { label: "Continuidade", vector: "constancia" },
      { label: "Ritmo firme", vector: "constancia" },
      { label: "Controle da rotina", vector: "gestao_pessoal" },
      { label: "Direção clara", vector: "gestao_pessoal" },
      { label: "Previsibilidade", vector: "gestao_pessoal" },
      { label: "Paz mental", vector: "controle_emocional" },
      { label: "Serenidade", vector: "controle_emocional" },
      { label: "Orgulho pessoal", vector: "controle_emocional" },
    ],
  },
  {
    id: 6,
    layer: "IM",
    text: "Qual destas características mais falta para você hoje?",
    alternatives: [
      { label: "Clareza", vector: "gestao_pessoal" },
      { label: "Prioridade", vector: "gestao_pessoal" },
      { label: "Foco", vector: "gestao_pessoal" },
      { label: "Constância", vector: "constancia" },
      { label: "Persistência", vector: "constancia" },
      { label: "Regularidade", vector: "constancia" },
      { label: "Ação", vector: "comportamento" },
      { label: "Iniciativa", vector: "comportamento" },
      { label: "Execução", vector: "comportamento" },
      { label: "Autocontrole", vector: "controle_emocional" },
      { label: "Autoconfiança", vector: "controle_emocional" },
      { label: "Equilíbrio", vector: "controle_emocional" },
    ],
  },
];

export const TRIAGE_QUESTIONS: TriageQuestion[] = questionDefinitions.map((question) => {
  validateQuestionDefinition(question);

  return {
    id: question.id,
    layer: question.layer,
    text: question.text,
    alternatives: question.alternatives.map<TriageAlternative>((alternative, index) => ({
      id: `Q${question.id.toString().padStart(2, "0")}_${index + 1}`,
      questionId: question.id,
      vector: alternative.vector,
      label: alternative.label,
      weight: 1,
    })),
  };
});

function validateQuestionDefinition(question: QuestionDefinition) {
  if (questionDefinitions.length !== PERGUNTAS_TRIAGEM) {
    throw new Error("Invalid triage question count.");
  }

  if (question.alternatives.length !== ALTERNATIVAS_POR_PERGUNTA) {
    throw new Error(`Invalid alternative count for triage question ${question.id}.`);
  }

  const alternativesByVector = question.alternatives.reduce<Record<VectorKey, number>>(
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

  const validDistribution = Object.values(alternativesByVector).every(
    (count) => count === ALTERNATIVAS_POR_VETOR,
  );

  if (!validDistribution) {
    throw new Error(`Invalid vector distribution for triage question ${question.id}.`);
  }
}
