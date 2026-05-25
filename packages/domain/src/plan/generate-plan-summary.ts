import type { ActionPlan, PlanSummary } from "../types/plan.types";

export function generatePlanSummary(plan: ActionPlan): PlanSummary {
  return {
    title: `Plano de ${plan.durationDays} dias`,
    priorityVector: plan.priorityVector,
    totalCheckpoints: plan.days.filter((day) => day.checkpoint).length,
  };
}
