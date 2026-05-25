import type { CausalMap } from "../types/investigation.types";
import type { VectorKey } from "../types/vector.types";

export function buildCausalNarrative(priorityVector: VectorKey, causalMap: CausalMap): string {
  return `O vetor ${priorityVector} apresenta origem ${causalMap.origin}, gatilho ${causalMap.trigger}, padrão de abandono ${causalMap.abandonmentPattern} e fator de sustentação ${causalMap.sustainingFactor}.`;
}
