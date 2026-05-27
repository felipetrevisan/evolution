import {
  type AdaptiveLevel,
  generateActionPlan as generateDomainActionPlan,
} from "../../../../../../packages/domain/src/index.ts";
import type { UserScopedRepository } from "../../repositories/base-repository";
import type { AdaptiveProfileRecord } from "../adaptive-engine/generate-adaptive-profile";
import type { ActionPlanRecord } from "./generate-action-plan";

export async function getCurrentActionPlan(
  uid: string,
  repository: UserScopedRepository<ActionPlanRecord>,
  profiles?: UserScopedRepository<AdaptiveProfileRecord>,
) {
  const plan = await repository.getLatest(uid);

  if (!plan || !profiles || isCompletePlan(plan)) {
    return plan;
  }

  const profile = await profiles.getLatest(uid);
  if (!profile) {
    return plan;
  }

  const domainPlan = generateDomainActionPlan(
    profile.dominantVector,
    profile.adaptiveLevel as AdaptiveLevel,
    profile.supportVector ? { supportVector: profile.supportVector } : {},
  );
  const nextPlan: ActionPlanRecord = {
    ...plan,
    narrative: plan.narrative ?? profile.causalNarrative,
    weeks: plan.weeks ?? domainPlan.weeks,
    weeklyObjectives:
      plan.weeklyObjectives?.length > 0
        ? plan.weeklyObjectives
        : domainPlan.weeks.map((week) => ({
            week: week.week,
            title: week.title,
            objective: week.objective,
            protocol: `${week.base.action} · ${week.base.frequency}`,
            baseAction: week.base.action,
            supportAction: week.support.action,
            regulationAction: week.regulation.action,
          })),
    days: plan.days?.length > 0 ? plan.days : domainPlan.days,
  };

  return repository.save(uid, nextPlan.id, nextPlan);
}

function isCompletePlan(plan: ActionPlanRecord) {
  return Boolean(plan.narrative && plan.weeks && plan.weeks.length > 0);
}
