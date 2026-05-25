import { VECTOR_DEFINITIONS } from "../constants";
import type {
  AbandonmentPattern,
  InvestigationAnswer,
  InvestigationQuestion,
  OriginClassification,
  SustainingFactor,
  TriggerClassification,
  VulnerabilityContext,
} from "../types/investigation.types";
import type { VectorKey } from "../types/vector.types";

const vectorText: Record<VectorKey, string> = {
  comportamento: "começar a agir",
  constancia: "manter constância",
  gestao_pessoal: "organizar sua rotina",
  controle_emocional: "regular emocionalmente",
};

export function getInvestigationQuestions(priorityVector: VectorKey): InvestigationQuestion[] {
  const vectorLabel = VECTOR_DEFINITIONS[priorityVector].label;
  const difficulty = vectorText[priorityVector];

  return [
    {
      id: "X1",
      block: "X",
      text: `Quando você pensa na sua dificuldade de ${difficulty}, ela parece ter começado em algum momento específico da sua vida, ou foi algo que foi se construindo aos poucos?`,
      options: [
        { id: "X1_A", label: "Começou em um momento específico", nextQuestionId: "X1a" },
        { id: "X1_B", label: "Foi se construindo aos poucos", nextQuestionId: "X1b" },
        { id: "X1_C", label: "Sempre foi assim", nextQuestionId: "X1c" },
      ],
    },
    {
      id: "X1a",
      block: "X",
      text: "Esse momento foi relacionado a mudança de rotina, estresse intenso, ou outra circunstância?",
      options: [
        { id: "X1a_A", label: "Mudança de rotina", nextQuestionId: "X2" },
        { id: "X1a_B", label: "Estresse intenso", nextQuestionId: "X2" },
        { id: "X1a_C", label: "Outra circunstância", nextQuestionId: "X2" },
      ],
    },
    {
      id: "X1b",
      block: "X",
      text: "Você consegue identificar quando começou a notar que isso era um padrão recorrente?",
      options: [
        { id: "X1b_A", label: "Nos últimos 6 meses", nextQuestionId: "X2" },
        { id: "X1b_B", label: "Nos últimos 2-3 anos", nextQuestionId: "X2" },
        { id: "X1b_C", label: "Há mais tempo que consigo lembrar", nextQuestionId: "X2" },
      ],
    },
    {
      id: "X1c",
      block: "X",
      text: "Desde quando você se lembra, essa dificuldade já existia em alguma forma?",
      options: [
        { id: "X1c_A", label: "Desde a infância", nextQuestionId: "X2" },
        { id: "X1c_B", label: "Desde a adolescência", nextQuestionId: "X2" },
        { id: "X1c_C", label: "Desde a vida adulta", nextQuestionId: "X2" },
      ],
    },
    {
      id: "X2",
      block: "X",
      text: "Considerando o que você descreveu, você diria que esse padrão começou de forma súbita, gradual, ou que sempre fez parte de você?",
      options: [
        { id: "X2_A", label: "De forma súbita", nextQuestionId: "Y1" },
        { id: "X2_B", label: "De forma gradual", nextQuestionId: "Y1" },
        { id: "X2_C", label: "Sempre fez parte de mim", nextQuestionId: "Y1" },
      ],
    },
    {
      id: "Y1",
      block: "Y",
      text: `Nos últimos 45 dias, em que tipo de situação você notou que sua dificuldade com ${vectorLabel} ficou mais evidente?`,
      options: [
        { id: "Y1_A", label: "Quando minha rotina muda", nextQuestionId: "Y1a" },
        { id: "Y1_B", label: "Quando estou emocionalmente sobrecarregado", nextQuestionId: "Y1b" },
        { id: "Y1_C", label: "Quando tento fazer algo novo ou diferente", nextQuestionId: "Y1c" },
        { id: "Y1_D", label: "Não consigo identificar um padrão", nextQuestionId: "Y1d" },
      ],
    },
    {
      id: "Y1a",
      block: "Y",
      text: "Qual tipo de mudança mais afeta?",
      options: [
        { id: "Y1a_A", label: "Mudança de horário", nextQuestionId: "Y2" },
        { id: "Y1a_B", label: "Mudança de local", nextQuestionId: "Y2" },
        { id: "Y1a_C", label: "Mudança de compromissos", nextQuestionId: "Y2" },
        { id: "Y1a_D", label: "Mudança na saúde", nextQuestionId: "Y2" },
      ],
    },
    {
      id: "Y1b",
      block: "Y",
      text: "Essa sobrecarga vem de trabalho, relacionamentos, ou de você mesmo?",
      options: [
        { id: "Y1b_A", label: "Trabalho", nextQuestionId: "Y2" },
        { id: "Y1b_B", label: "Relacionamentos", nextQuestionId: "Y2" },
        { id: "Y1b_C", label: "De mim mesmo", nextQuestionId: "Y2" },
      ],
    },
    {
      id: "Y1c",
      block: "Y",
      text: "O que te faz desistir: falta de resultado, comparação, ou cansaço?",
      options: [
        { id: "Y1c_A", label: "Falta de resultado", nextQuestionId: "Y2" },
        { id: "Y1c_B", label: "Comparação com outros", nextQuestionId: "Y2" },
        { id: "Y1c_C", label: "Cansaço", nextQuestionId: "Y2" },
      ],
    },
    {
      id: "Y1d",
      block: "Y",
      text: "A dificuldade parece aparecer mesmo sem motivo aparente?",
      options: [
        { id: "Y1d_A", label: "Sim, aparece de forma imprevisível", nextQuestionId: "Y2" },
        { id: "Y1d_B", label: "Às vezes sim, às vezes há motivo", nextQuestionId: "Y2" },
      ],
    },
    {
      id: "Y2",
      block: "Y",
      text: `Se você pudesse eliminar uma dessas situações, qual faria mais diferença para sua ${vectorLabel}?`,
      options: [
        { id: "Y2_A", label: "Mudanças de rotina", nextQuestionId: "Z1" },
        { id: "Y2_B", label: "Sobrecarga emocional", nextQuestionId: "Z1" },
        { id: "Y2_C", label: "Tentar coisas novas", nextQuestionId: "Z1" },
        { id: "Y2_D", label: "Não sei identificar", nextQuestionId: "Z1" },
      ],
    },
    {
      id: "Z1",
      block: "Z",
      text: `Você já tentou alguma estratégia específica para melhorar sua ${vectorLabel}?`,
      options: [
        { id: "Z1_A", label: "Sim, várias vezes", nextQuestionId: "Z1a" },
        { id: "Z1_B", label: "Tentei uma ou duas vezes", nextQuestionId: "Z1b" },
        { id: "Z1_C", label: "Nunca tentei de forma estruturada", nextQuestionId: "Z1c" },
        { id: "Z1_D", label: "Tentei, mas desisti antes de ver resultado", nextQuestionId: "Z1d" },
      ],
    },
    {
      id: "Z1a",
      block: "Z",
      text: "O que geralmente faz com que a estratégia pare de funcionar?",
      options: [
        { id: "Z1a_A", label: "Perdi o ritmo e não retomei", nextQuestionId: "Z2" },
        { id: "Z1a_B", label: "Não vi resultado rápido", nextQuestionId: "Z2" },
        { id: "Z1a_C", label: "Aconteceu algo que interrompeu", nextQuestionId: "Z2" },
        { id: "Z1a_D", label: "Outro", nextQuestionId: "Z2" },
      ],
    },
    {
      id: "Z1b",
      block: "Z",
      text: "O que aconteceu na primeira vez que tentou?",
      options: [
        { id: "Z1b_A", label: "Funcionou bem no início", nextQuestionId: "Z3" },
        { id: "Z1b_B", label: "Não funcionou desde o começo", nextQuestionId: "Z3" },
        { id: "Z1b_C", label: "Funcionou, mas parei sem motivo claro", nextQuestionId: "Z3" },
      ],
    },
    {
      id: "Z1c",
      block: "Z",
      text: "O que te impediu de começar?",
      options: [
        { id: "Z1c_A", label: "Medo de não conseguir", nextQuestionId: "Z3" },
        { id: "Z1c_B", label: "Falta de tempo", nextQuestionId: "Z3" },
        { id: "Z1c_C", label: "Não sabia por onde começar", nextQuestionId: "Z3" },
      ],
    },
    {
      id: "Z1d",
      block: "Z",
      text: "Quanto tempo passou até desistir?",
      options: [
        { id: "Z1d_A", label: "Menos de 1 semana", nextQuestionId: "Z2" },
        { id: "Z1d_B", label: "1-2 semanas", nextQuestionId: "Z2" },
        { id: "Z1d_C", label: "1 mês", nextQuestionId: "Z2" },
        { id: "Z1d_D", label: "Mais de 1 mês", nextQuestionId: "Z2" },
      ],
    },
    {
      id: "Z2",
      block: "Z",
      text: "Das estratégias que você tentou, qual durou mais tempo?",
      options: [
        { id: "Z2_A", label: "A que tinha acompanhamento de alguém", nextQuestionId: "Z3" },
        { id: "Z2_B", label: "A que tinha horário fixo", nextQuestionId: "Z3" },
        { id: "Z2_C", label: "A que eu realmente gostava de fazer", nextQuestionId: "Z3" },
        { id: "Z2_D", label: "Nenhuma durou mais que as outras", nextQuestionId: "Z3" },
      ],
    },
    {
      id: "Z3",
      block: "Z",
      text: "Se você pudesse tentar novamente com uma condição diferente, qual seria?",
      options: [
        { id: "Z3_A", label: "Ter alguém me acompanhando" },
        { id: "Z3_B", label: "Ter horário fixo e inegociável" },
        { id: "Z3_C", label: "Começar com algo que goste mais" },
        { id: "Z3_D", label: "Ter um plano mais simples" },
      ],
    },
  ];
}

export function getNextInvestigationQuestion(
  priorityVector: VectorKey,
  answers: InvestigationAnswer[],
) {
  const questions = getInvestigationQuestions(priorityVector);
  const byId = new Map(questions.map((question) => [question.id, question]));

  if (answers.length === 0) {
    return byId.get("X1");
  }

  const latest = answers.at(-1);
  const latestQuestion = latest ? byId.get(latest.questionId) : undefined;
  const selectedOption = latestQuestion?.options.find((option) => option.id === latest?.answer);

  return selectedOption?.nextQuestionId ? byId.get(selectedOption.nextQuestionId) : undefined;
}

export function resolveOriginClassification(answer?: string): OriginClassification {
  if (answer === "X2_A") return "subita";
  if (answer === "X2_C") return "congenita";
  return "gradual";
}

export function resolveTrigger(answer?: string): TriggerClassification {
  if (answer === "Y2_A") return "rotina";
  if (answer === "Y2_B") return "emocional";
  if (answer === "Y2_C") return "novidade";
  return "nao_identificado";
}

export function resolveContext(answer?: string): VulnerabilityContext {
  const contexts: Record<string, VulnerabilityContext> = {
    Y1a_A: "mudanca_horario",
    Y1a_B: "mudanca_local",
    Y1a_C: "mudanca_compromissos",
    Y1a_D: "mudanca_saude",
    Y1b_A: "trabalho",
    Y1b_B: "relacionamentos",
    Y1b_C: "interno",
    Y1c_A: "falta_resultado",
    Y1c_B: "comparacao",
    Y1c_C: "cansaco",
    Y1d_A: "imprevisivel",
    Y1d_B: "misto",
  };

  return answer ? (contexts[answer] ?? "indefinido") : "indefinido";
}

export function resolveAbandonmentPattern(answer?: string): AbandonmentPattern {
  const patterns: Record<string, AbandonmentPattern> = {
    Z1a_A: "apos_interrupcao",
    Z1a_B: "apos_resultado",
    Z1a_C: "apos_interrupcao",
    Z1b_A: "apos_resultado",
    Z1b_B: "precoce",
    Z1b_C: "indefinido",
    Z1c_A: "nunca_tentou",
    Z1c_B: "nunca_tentou",
    Z1c_C: "nunca_tentou",
    Z1d_A: "precoce",
    Z1d_B: "precoce",
    Z1d_C: "apos_resultado",
    Z1d_D: "apos_interrupcao",
  };

  return answer ? (patterns[answer] ?? "indefinido") : "indefinido";
}

export function resolveSustainingFactor(answer?: string): SustainingFactor {
  const factors: Record<string, SustainingFactor> = {
    Z2_A: "companhia_social",
    Z2_B: "horario_fixo",
    Z2_C: "prazer_atividade",
    Z2_D: "nenhum_identificado",
  };

  return answer ? (factors[answer] ?? "indefinido") : "indefinido";
}
