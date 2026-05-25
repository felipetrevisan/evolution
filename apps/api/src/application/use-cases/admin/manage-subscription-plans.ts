import type {
  AdminConfigRepository,
  SubscriptionPlanRecord,
} from "../../repositories/admin-config-repository";

export function listSubscriptionPlans(repository: AdminConfigRepository) {
  return repository.listSubscriptionPlans();
}

export function saveSubscriptionPlan(
  plan: SubscriptionPlanRecord,
  repository: AdminConfigRepository,
) {
  return repository.saveSubscriptionPlan(plan);
}

export function deleteSubscriptionPlan(planId: string, repository: AdminConfigRepository) {
  return repository.deleteSubscriptionPlan(planId);
}
