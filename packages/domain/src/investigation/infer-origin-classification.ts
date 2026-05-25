import type { OriginClassification } from "../types/investigation.types";

export function inferOriginClassification(answer: string): OriginClassification {
  if (answer.includes("nascimento") || answer.includes("sempre")) {
    return "congenita";
  }

  if (answer.includes("repentino") || answer.includes("súbito")) {
    return "subita";
  }

  return "gradual";
}
