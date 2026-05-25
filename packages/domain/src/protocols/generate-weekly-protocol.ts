import type { AdaptiveLevel } from "../types/adaptive-engine.types";
import type { VectorKey } from "../types/vector.types";
import { getProtocolWeek } from "./protocol-library";
import { selectBaseProtocol } from "./select-base-protocol";

export function generateWeeklyProtocol(
  week: number,
  priorityVector: VectorKey,
  level: AdaptiveLevel,
): string {
  const protocolWeek = getProtocolWeek(priorityVector, week);
  return `${selectBaseProtocol(priorityVector, level)} · Semana ${protocolWeek.week}: ${
    protocolWeek.action
  }`;
}
