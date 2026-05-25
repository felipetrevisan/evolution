import { CICLO_PADRAO_DIAS } from "../constants";
import { generateWeeklyProtocol } from "../protocols/generate-weekly-protocol";
import { getProtocolWeek } from "../protocols/protocol-library";
import type { AdaptiveLevel } from "../types/adaptive-engine.types";
import type { ActionPlan } from "../types/plan.types";
import type { VectorKey } from "../types/vector.types";

export function generateActionPlan(
  priorityVector: VectorKey,
  adaptiveLevel: AdaptiveLevel,
): ActionPlan {
  return {
    durationDays: CICLO_PADRAO_DIAS,
    priorityVector,
    adaptiveLevel,
    days: Array.from({ length: CICLO_PADRAO_DIAS }, (_, index) => {
      const day = index + 1;
      const week = Math.ceil(day / 7);
      const protocolWeek = getProtocolWeek(priorityVector, week);

      return {
        day,
        focus: protocolWeek.objective,
        microAction: protocolWeek.action,
        message: protocolWeek.language,
        protocol: generateWeeklyProtocol(week, priorityVector, adaptiveLevel),
        checkpoint: day % 7 === 0 || day === CICLO_PADRAO_DIAS,
      };
    }),
  };
}
