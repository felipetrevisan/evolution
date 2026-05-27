import { VECTOR_DEFINITIONS } from "../constants";
import type { AdaptiveLevel } from "../types/adaptive-engine.types";
import type { CausalMap } from "../types/investigation.types";
import type { VectorKey } from "../types/vector.types";

export type CausalNarrativeInput = {
  priorityVector: VectorKey;
  svc: number;
  imNorm: number;
  operationalScoreNorm: number;
  gapE: number;
  gapC: number;
  spi: number;
  adaptiveLevel: AdaptiveLevel;
  protocolBase: string;
  weeklyAvailability: "menos_2h" | "2_3h" | "4_5h" | "6h_mais";
  experienceLevel: "nunca" | "iniciante" | "intermediario" | "avancado";
  investigation?: Partial<CausalMap>;
};

export type CausalNarrative = {
  diagnosis: string;
  execution: string;
  context: string;
  direction: string;
  fullText: string;
};

export function buildCausalNarrative(input: CausalNarrativeInput): CausalNarrative {
  const vector = VECTOR_DEFINITIONS[input.priorityVector].label;
  const origin = formatValue(input.investigation?.origin ?? "gradual");
  const abandonment = describeAbandonment(input.investigation?.abandonmentPattern);
  const sustaining = describeSustaining(input.investigation?.sustainingFactor);
  const intention = classifyIntention(input.imNorm);
  const execution = classifyExecution(input.operationalScoreNorm);
  const gap = describeGapE(input.gapE);
  const calibration = describeGapC(input.gapC);
  const protocol = describeProtocol(input.protocolBase);

  const diagnosis = `Seu mecanismo central de dificuldade está em ${vector} (SVC ${formatNumber(
    input.svc,
  )}). Esse padrão parece ter se instalado de forma ${origin}, e se mantém porque ${abandonment}. O que funcionou melhor foi ${sustaining}.`;
  const executionBlock = `Você demonstra ${intention} intenção de evoluir nesta área (IM ${formatNumber(
    input.imNorm,
  )}), enquanto sua execução prática está em nível ${execution} (Autoavaliação ${formatNumber(
    input.operationalScoreNorm,
  )}). O GAP entre intenção e prática é de ${formatNumber(input.gapE)} pontos — ${gap}.`;
  const context = `Considerando sua disponibilidade de ${formatAvailability(
    input.weeklyAvailability,
  )} e sua experiência ${formatExperience(input.experienceLevel)}, sua jornada foi calibrada para ${calibration}.`;
  const direction = `Seu Nível Adaptativo é ${input.adaptiveLevel} (SPI ${formatNumber(
    input.spi,
  )}). A intervenção será ${protocol}.`;

  return {
    diagnosis,
    execution: executionBlock,
    context,
    direction,
    fullText: [diagnosis, executionBlock, context, direction].join("\n\n"),
  };
}

function classifyIntention(value: number) {
  if (value >= 75) return "alta";
  if (value >= 50) return "moderada";
  return "baixa";
}

function classifyExecution(value: number) {
  if (value >= 75) return "alto";
  if (value >= 50) return "moderado";
  if (value >= 25) return "em construção";
  return "inicial";
}

function describeGapE(value: number) {
  if (value > 30) {
    return "sua motivação está maior do que a rotina consegue sustentar hoje, então o plano começa com passos menores para reduzir frustração";
  }
  if (value >= 0) {
    return "existe um espaço saudável para transformar intenção em prática com consistência";
  }
  return "você já executa mais do que imagina, e o plano vai ajudar a reconhecer essa base";
}

function describeGapC(value: number) {
  if (value > 20) return "reduzir a ambição inicial em 20%";
  if (value >= 10) return "reduzir a ambição inicial em 10%";
  return "manter a progressão padrão";
}

function describeAbandonment(value?: string) {
  const labels: Record<string, string> = {
    precoce: "a retomada costuma falhar logo no começo",
    apos_resultado: "o foco no resultado enfraquece a continuidade do processo",
    apos_interrupcao: "uma interrupção tende a virar abandono",
    nunca_tentou: "ainda não houve uma tentativa estruturada suficiente para criar referência",
    indefinido: "o padrão de interrupção ainda precisa ficar mais claro",
  };
  return labels[value ?? "indefinido"] ?? formatValue(value ?? "indefinido");
}

function describeSustaining(value?: string) {
  const labels: Record<string, string> = {
    companhia_social: "quando havia companhia ou algum tipo de apoio externo",
    horario_fixo: "quando existia um horário fixo protegido",
    prazer_atividade: "quando a atividade tinha prazer e fazia sentido na rotina",
    nenhum_identificado: "quando testamos pequenos ajustes de ambiente e rotina",
    indefinido: "quando o plano começa testando o que sustenta melhor sua continuidade",
  };
  return labels[value ?? "indefinido"] ?? formatValue(value ?? "indefinido");
}

function describeProtocol(protocol: string) {
  return `${protocol.toLowerCase()}, com metas semanais claras e ações pequenas o suficiente para caber na vida real`;
}

function formatAvailability(value: CausalNarrativeInput["weeklyAvailability"]) {
  const labels = {
    menos_2h: "menos de 2 horas por semana",
    "2_3h": "2 a 3 horas por semana",
    "4_5h": "4 a 5 horas por semana",
    "6h_mais": "6 horas ou mais por semana",
  };
  return labels[value];
}

function formatExperience(value: CausalNarrativeInput["experienceLevel"]) {
  const labels = {
    nunca: "inicial",
    iniciante: "iniciante",
    intermediario: "intermediária",
    avancado: "avançada",
  };
  return labels[value];
}

function formatNumber(value: number) {
  return value.toFixed(2).replace(".", ",");
}

function formatValue(value: string) {
  return value.replaceAll("_", " ");
}
