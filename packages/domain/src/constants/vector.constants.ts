import type { VectorDefinition, VectorKey } from "../types/vector.types";

export const VECTOR_KEYS: VectorKey[] = [
  "comportamento",
  "constancia",
  "gestao_pessoal",
  "controle_emocional",
];

export const VECTOR_DEFINITIONS: Record<VectorKey, VectorDefinition> = {
  comportamento: {
    key: "comportamento",
    label: "Comportamento",
  },
  constancia: {
    key: "constancia",
    label: "Constância",
  },
  gestao_pessoal: {
    key: "gestao_pessoal",
    label: "Gestão Pessoal",
  },
  controle_emocional: {
    key: "controle_emocional",
    label: "Controle Emocional",
  },
};
