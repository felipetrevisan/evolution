import type { TriageQuestion } from "@/lib/api-client";

export type TriageLayerFilter = "all" | "FVA" | "IM";
export type TriageAdminTab = "questions" | "editor";
export type VectorKey = TriageQuestion["alternatives"][number]["vector"];

export const layerOptions = [
  { label: "FVA", value: "FVA" },
  { label: "IM", value: "IM" },
] as const;

export const layerFilterOptions = [{ label: "Todas", value: "all" }, ...layerOptions] as const;

export const vectorOptions = [
  { label: "Comportamento", value: "comportamento" },
  { label: "Constância", value: "constancia" },
  { label: "Gestão Pessoal", value: "gestao_pessoal" },
  { label: "Controle Emocional", value: "controle_emocional" },
] as const;
