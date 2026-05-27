import { CICLO_PADRAO_DIAS } from "../constants";
import { generateWeeklyProtocol } from "../protocols/generate-weekly-protocol";
import { getProtocolWeek } from "../protocols/protocol-library";
import type { AdaptiveLevel } from "../types/adaptive-engine.types";
import type { ActionPlan } from "../types/plan.types";
import type { VectorKey } from "../types/vector.types";

export function generateActionPlan(
  priorityVector: VectorKey,
  adaptiveLevel: AdaptiveLevel,
  options: { supportVector?: VectorKey } = {},
): ActionPlan {
  const supportVector = options.supportVector ?? priorityVector;
  const regulationVector = "controle_emocional";
  const weeks = Array.from({ length: 6 }, (_, index) =>
    buildPlanWeek(index + 1, priorityVector, supportVector),
  );

  return {
    durationDays: CICLO_PADRAO_DIAS,
    priorityVector,
    supportVector,
    regulationVector,
    adaptiveLevel,
    weeks,
    days: Array.from({ length: CICLO_PADRAO_DIAS }, (_, index) => {
      const day = index + 1;
      const week = Math.ceil(day / 7);
      const protocolWeek = getProtocolWeek(priorityVector, week);
      const supportWeek = getProtocolWeek(supportVector, week);
      const regulationAction = getRegulationAction(week);

      return {
        day,
        week,
        focus: protocolWeek.objective,
        microAction: protocolWeek.action,
        supportAction: supportWeek.action,
        regulationAction,
        message: protocolWeek.language,
        protocol: generateWeeklyProtocol(week, priorityVector, adaptiveLevel),
        checkpoint: day % 7 === 0 || day === CICLO_PADRAO_DIAS,
      };
    }),
  };
}

function buildPlanWeek(week: number, priorityVector: VectorKey, supportVector: VectorKey) {
  const base = getProtocolWeek(priorityVector, week);
  const support = getProtocolWeek(supportVector, week);

  return {
    week,
    title: getWeekTitle(week),
    objective: base.objective,
    base: {
      vector: priorityVector,
      action: base.action,
      frequency: "3 a 5 vezes na semana",
      language: base.language,
    },
    support: {
      vector: supportVector,
      action: support.action,
      frequency: "2 a 3 vezes na semana",
      language: support.language,
    },
    regulation: {
      action: getRegulationAction(week),
      frequency: "1 vez na semana",
    },
  };
}

function getWeekTitle(week: number) {
  const titles = [
    "Fundação",
    "Ancoragem",
    "Expansão",
    "Consolidação",
    "Autonomia",
    "Transferência",
  ];
  return titles[week - 1] ?? `Semana ${week}`;
}

function getRegulationAction(week: number) {
  const actions = [
    "Check-in de domingo por 5 minutos",
    "Check-in e ajuste de horário se necessário",
    "Autoavaliação parcial do ponto mais sensível",
    "Revisão de metas e celebração de progresso",
    "Check-in emocional aprofundado",
    "Autoavaliação completa e preparação do próximo ciclo",
  ];
  return actions[week - 1] ?? "Revisão simples da semana";
}
