const vectorLabels: Record<string, string> = {
  comportamento: "Comportamento",
  constancia: "Constância",
  controle_emocional: "Controle emocional",
  gestao_pessoal: "Gestão pessoal",
};

const blockLabels: Record<string, string> = {
  X: "Base de execução",
  Y: "Rotina e continuidade",
  Z: "Autogestão e ajustes",
};

const blockDescriptions: Record<string, string> = {
  X: "Como você inicia, organiza e coloca ações em prática.",
  Y: "Como mantém frequência, ritmo e consistência ao longo dos dias.",
  Z: "Como percebe sinais, ajusta a rota e sustenta decisões.",
};

export function formatVectorLabel(vector?: string | null) {
  if (!vector) {
    return "A definir";
  }

  return vectorLabels[vector] ?? humanizeKey(vector);
}

export function formatBlockLabel(block?: string | null) {
  if (!block) {
    return "Área operacional";
  }

  return blockLabels[block] ?? humanizeKey(block);
}

export function formatBlockDescription(block?: string | null) {
  if (!block) {
    return "Aspecto observado na autoavaliação.";
  }

  return blockDescriptions[block] ?? "Aspecto observado na autoavaliação.";
}

function humanizeKey(value: string) {
  return value
    .split("_")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}
