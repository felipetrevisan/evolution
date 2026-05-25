export type VectorKey = "comportamento" | "constancia" | "gestao_pessoal" | "controle_emocional";

export type VectorDefinition = {
  key: VectorKey;
  label: string;
};

export type VectorScoreMap = Record<VectorKey, number>;

export type ClassifiedVectorScore = {
  vector: VectorKey;
  raw: number;
  normalized: number;
  classification: string;
  priorityOrderScore?: number;
};
