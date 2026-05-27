import {
  type ActionPlanRecord,
  generateActionPlan,
} from "../../application/use-cases/action-plan/generate-action-plan";
import { getCurrentActionPlan } from "../../application/use-cases/action-plan/get-current-action-plan";
import type { AdaptiveProfileRecord } from "../../application/use-cases/adaptive-engine/generate-adaptive-profile";
import type { CurrentUser } from "../../infrastructure/auth/current-user";
import { repositories } from "../../infrastructure/repositories/repository-factory";
import type { ActionPlanBodyDto } from "../dtos/action-plan.dto";

function actionPlanRepository() {
  return repositories().scoped<ActionPlanRecord>("plans");
}

export async function generateActionPlanController(
  currentUser: CurrentUser,
  body: ActionPlanBodyDto,
) {
  return generateActionPlan(currentUser.uid, body, {
    plans: actionPlanRepository(),
    profiles: repositories().scoped<AdaptiveProfileRecord>("adaptiveProfiles"),
  });
}

export async function currentActionPlanController(currentUser: CurrentUser) {
  return getCurrentActionPlan(
    currentUser.uid,
    actionPlanRepository(),
    repositories().scoped<AdaptiveProfileRecord>("adaptiveProfiles"),
  );
}
