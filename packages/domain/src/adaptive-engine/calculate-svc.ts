import { clamp, roundTo } from "../shared/math";
import type { SvcInput } from "../types/adaptive-engine.types";
import type { InvestigationSignals } from "../types/investigation.types";

function calculateLayer2Modifier(investigation?: InvestigationSignals): number {
  const modifiers = [
    investigation?.origin === "subita" ? 3 : 0,
    investigation?.origin === "congenita" ? 5 : 0,
    investigation?.hasPreviousFailedAttempt ? 3 : 0,
    investigation?.abandonmentPattern === "precoce" ? 2 : 0,
    investigation?.trigger === "nao_identificado" ? 2 : 0,
  ].filter((modifier) => modifier > 0);

  return Math.min(
    10,
    modifiers.slice(0, 3).reduce((sum, modifier) => sum + modifier, 0),
  );
}

export function calculateSvc(input: SvcInput): number {
  const modifier = calculateLayer2Modifier(input.investigation);
  const value =
    input.vector === input.priorityVector
      ? input.fvaNorm * 0.4 +
        (100 - input.imNorm) * 0.25 +
        (input.operationalScoreNorm ?? 0) * 0.35 +
        modifier
      : input.fvaNorm * 0.6 + (100 - input.imNorm) * 0.4;

  return roundTo(clamp(value), 2);
}
