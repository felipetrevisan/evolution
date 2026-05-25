import type { UserScopedRepository } from "../../repositories/base-repository";
import type { ActionPlanRecord } from "./generate-action-plan";

export async function getCurrentActionPlan(
  uid: string,
  repository: UserScopedRepository<ActionPlanRecord>,
) {
  return repository.getLatest(uid);
}
