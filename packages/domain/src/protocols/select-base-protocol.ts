import type { AdaptiveLevel } from "../types/adaptive-engine.types";
import type { VectorKey } from "../types/vector.types";
import { getProtocolDefinition } from "./protocol-library";

export function selectBaseProtocol(priorityVector: VectorKey, level: AdaptiveLevel): string {
  return `${getProtocolDefinition(priorityVector).name} · ${level}`;
}
