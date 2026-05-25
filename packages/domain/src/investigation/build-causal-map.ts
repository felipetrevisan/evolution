import { VECTOR_DEFINITIONS } from "../constants";
import type { CausalMap, InvestigationSignals } from "../types/investigation.types";

export function buildCausalMap(signals: InvestigationSignals): CausalMap {
  const origin = signals.origin ?? "gradual";
  const trigger = signals.trigger ?? "nao_identificado";
  const abandonmentPattern = signals.abandonmentPattern ?? "indefinido";
  const sustainingFactor = signals.sustainingFactor ?? "indefinido";
  const context = signals.context ?? "indefinido";
  const narrativeSignals = {
    ...(signals.vector ? { vector: signals.vector } : {}),
    ...(signals.originDetail ? { originDetail: signals.originDetail } : {}),
    origin,
    trigger,
    context,
    abandonmentPattern,
    sustainingFactor,
  };

  return {
    ...(signals.vector ? { vector: signals.vector } : {}),
    origin,
    ...(signals.originDetail ? { originDetail: signals.originDetail } : {}),
    trigger,
    context,
    abandonmentPattern,
    sustainingFactor,
    hasPreviousFailedAttempt: signals.hasPreviousFailedAttempt ?? false,
    hasIdentifiedTrigger: trigger !== "nao_identificado",
    narrative: buildNarrative(narrativeSignals),
  };
}

function buildNarrative(
  signals: Required<
    Pick<CausalMap, "origin" | "trigger" | "context" | "abandonmentPattern" | "sustainingFactor">
  > &
    Pick<CausalMap, "originDetail" | "vector">,
) {
  const vectorLabel = signals.vector ? VECTOR_DEFINITIONS[signals.vector].label : "prioritário";
  const originDetail = signals.originDetail ? ` ${signals.originDetail}` : "";
  const triggerPhrase =
    signals.trigger === "nao_identificado"
      ? "O gatilho principal não foi identificado pelo usuário"
      : `O gatilho principal é ${formatValue(signals.trigger)}, contextualizado em ${formatValue(signals.context)}`;
  const abandonmentPhrase =
    signals.abandonmentPattern === "nunca_tentou"
      ? "O usuário não possui histórico de tentativas estruturadas"
      : `O histórico de tentativas revela padrão de abandono ${formatValue(signals.abandonmentPattern)}`;
  const sustainingPhrase =
    signals.sustainingFactor &&
    !["indefinido", "nenhum_identificado"].includes(signals.sustainingFactor)
      ? ` O fator de sustentação identificado foi ${formatValue(signals.sustainingFactor)}.`
      : "";

  return `O padrão de ${vectorLabel} do usuário tem origem ${formatValue(signals.origin)}${originDetail}. ${triggerPhrase}. ${abandonmentPhrase}.${sustainingPhrase}`;
}

function formatValue(value: string) {
  return value.replaceAll("_", " ");
}
