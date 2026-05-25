import type { InvestigationSignals } from "./investigation.types";
import type { VectorKey, VectorScoreMap } from "./vector.types";

export type SvcInput = {
  vector: VectorKey;
  priorityVector: VectorKey;
  fvaNorm: number;
  imNorm: number;
  operationalScoreNorm?: number;
  investigation?: InvestigationSignals;
};

export type SvcClassification =
  | "Vulnerabilidade Mínima"
  | "Vulnerabilidade Moderada"
  | "Vulnerabilidade Alta"
  | "Vulnerabilidade Crítica";

export type GapCInput = {
  weeklyAvailability: "menos_2h" | "2_3h" | "4_5h" | "6h_mais";
  experienceLevel: "nunca" | "iniciante" | "intermediario" | "avancado";
  hasWeightOscillation?: boolean;
  hasHealthCondition?: boolean;
  hasSystemicImpactB02?: boolean;
};

export type AdaptiveLevel =
  | "Nível 1 — Fundação"
  | "Nível 2 — Estruturação"
  | "Nível 3 — Construção"
  | "Nível 4 — Aceleração"
  | "Nível 5 — Transformação";

export type RiskFlag = {
  code: string;
  message: string;
};

export type SvcScoreMap = VectorScoreMap;
