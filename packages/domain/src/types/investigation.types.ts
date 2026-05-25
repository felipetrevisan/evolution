import type { VectorKey } from "./vector.types";

export type OriginClassification = "subita" | "gradual" | "congenita";

export type TriggerClassification = "rotina" | "emocional" | "novidade" | "nao_identificado";

export type VulnerabilityContext =
  | "mudanca_horario"
  | "mudanca_local"
  | "mudanca_compromissos"
  | "mudanca_saude"
  | "trabalho"
  | "relacionamentos"
  | "interno"
  | "falta_resultado"
  | "comparacao"
  | "cansaco"
  | "imprevisivel"
  | "misto"
  | "indefinido";

export type AbandonmentPattern =
  | "precoce"
  | "apos_resultado"
  | "apos_interrupcao"
  | "nunca_tentou"
  | "indefinido";

export type SustainingFactor =
  | "companhia_social"
  | "horario_fixo"
  | "prazer_atividade"
  | "nenhum_identificado"
  | "indefinido";

export type InvestigationBlock = "X" | "Y" | "Z";

export type InvestigationQuestionOption = {
  id: string;
  label: string;
  nextQuestionId?: string;
};

export type InvestigationQuestion = {
  id: string;
  block: InvestigationBlock;
  text: string;
  options: InvestigationQuestionOption[];
};

export type InvestigationAnswer = {
  questionId: string;
  answer: string;
};

export type InvestigationSignals = {
  vector?: VectorKey;
  origin?: OriginClassification;
  originDetail?: string;
  hasPreviousFailedAttempt?: boolean;
  abandonmentPattern?: AbandonmentPattern;
  trigger?: TriggerClassification;
  context?: VulnerabilityContext;
  sustainingFactor?: SustainingFactor;
};

export type CausalMap = {
  vector?: VectorKey;
  origin: OriginClassification;
  originDetail?: string;
  trigger: TriggerClassification;
  context: VulnerabilityContext;
  abandonmentPattern: AbandonmentPattern;
  sustainingFactor: SustainingFactor;
  hasPreviousFailedAttempt: boolean;
  hasIdentifiedTrigger: boolean;
  narrative: string;
};
