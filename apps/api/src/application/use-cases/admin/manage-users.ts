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

function shouldSetAnnualExpiration(currentPeriodEnd?: string) {
  return !currentPeriodEnd || new Date(currentPeriodEnd).getTime() < Date.now();
}
