import type { VectorKey } from "./vector.types";

export type TriageLayer = "FVA" | "IM";

export type TriageAlternative = {
  id: string;
  questionId: number;
  vector: VectorKey;
  label: string;
  weight: 1;
};

export type TriageQuestion = {
  id: number;
  layer: TriageLayer;
  text: string;
  alternatives: TriageAlternative[];
};

export type TriageSelection = {
  questionId: number;
  alternativeId: string;
  vector: VectorKey;
  layer?: TriageLayer;
};

export type TriageValidationResult = {
  valid: boolean;
  errors: string[];
};

export type PriorityVectorResult = {
  vector?: VectorKey;
  tiedVectors: VectorKey[];
  requiresUserChoice: boolean;
};

export type DiagnosticSummary = {
  fvaPriority: PriorityVectorResult;
  imPriority: PriorityVectorResult;
  fva: Record<VectorKey, { raw: number; normalized: number; classification: string }>;
  im: Record<VectorKey, { raw: number; normalized: number; classification: string }>;
};
