import type { AbandonmentPattern } from "../types/investigation.types";

export function inferAbandonmentPattern(answer: string): AbandonmentPattern {
  if (answer.includes("primeira") || answer.includes("começo")) {
    return "precoce";
  }

  if (answer.includes("resultado")) {
    return "apos_resultado";
  }

  if (answer.includes("interromp") || answer.includes("ritmo")) {
    return "apos_interrupcao";
  }

  if (answer.includes("nunca")) {
    return "nunca_tentou";
  }

  return "indefinido";
}
