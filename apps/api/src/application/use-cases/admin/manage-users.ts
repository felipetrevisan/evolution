import type { UserScopedRepository } from "../../repositories/base-repository";
import type { UserProfileRecord, UserRepository } from "../../repositories/user-repository";
import { annualExpirationFromNow } from "../subscription/subscription-access";

export async function listAdminUsers(repository: UserRepository) {
  return repository.list(200);
}

export async function updateAdminUser(
  uid: string,
  dto: Pick<UserProfileRecord, "role" | "subscription">,
  repository: UserRepository,
) {
  const subscription =
    dto.subscription?.status === "active" &&
    shouldSetAnnualExpiration(dto.subscription.currentPeriodEnd)
      ? { ...dto.subscription, currentPeriodEnd: annualExpirationFromNow() }
      : dto.subscription;

  return repository.upsert(uid, {
    ...(dto.role ? { role: dto.role } : {}),
    ...(subscription ? { subscription } : {}),
  });
}

export async function resetAdminUserProgress(
  uid: string,
  repositories: {
    adaptiveProfiles: UserScopedRepository<{ id: string; uid: string; createdAt: string }>;
    anamnese: UserScopedRepository<{ id: string; uid: string; createdAt: string }>;
    bodyMeasurements: UserScopedRepository<{ id: string; uid: string; createdAt: string }>;
    checkins: UserScopedRepository<{ id: string; uid: string; createdAt: string }>;
    cycles: UserScopedRepository<{ id: string; uid: string; createdAt: string }>;
    investigations: UserScopedRepository<{ id: string; uid: string; createdAt: string }>;
    operationalAssessments: UserScopedRepository<{ id: string; uid: string; createdAt: string }>;
    plans: UserScopedRepository<{ id: string; uid: string; createdAt: string }>;
    reports: UserScopedRepository<{ id: string; uid: string; createdAt: string }>;
    triageSessions: UserScopedRepository<{ id: string; uid: string; createdAt: string }>;
    users: UserRepository;
  },
) {
  const deletedCounts = await Promise.all([
    repositories.cycles.deleteAll(uid),
    repositories.anamnese.deleteAll(uid),
    repositories.bodyMeasurements.deleteAll(uid),
    repositories.triageSessions.deleteAll(uid),
    repositories.investigations.deleteAll(uid),
    repositories.operationalAssessments.deleteAll(uid),
    repositories.adaptiveProfiles.deleteAll(uid),
    repositories.plans.deleteAll(uid),
    repositories.checkins.deleteAll(uid),
    repositories.reports.deleteAll(uid),
  ]);
  const user = await repositories.users.clearOnboardingProgress(uid);

  return {
    deletedRecords: deletedCounts.reduce((total, count) => total + count, 0),
    user,
  };
}

function shouldSetAnnualExpiration(currentPeriodEnd?: string) {
  return !currentPeriodEnd || new Date(currentPeriodEnd).getTime() < Date.now();
}
