import type { AdaptiveLevel } from "../types/adaptive-engine.types";

export function selectAdaptiveLevel(spi: number): AdaptiveLevel {
  if (spi <= 25) {
    return "Nível 1 — Fundação";
  }

  if (spi <= 45) {
    return "Nível 2 — Estruturação";
  }

  if (spi <= 65) {
    return "Nível 3 — Construção";
  }

  if (spi <= 80) {
    return "Nível 4 — Aceleração";
  }

  return "Nível 5 — Transformação";
}
