import type { AdminConfigRepository } from "../../repositories/admin-config-repository";
import type { UserProfileRecord } from "../../repositories/user-repository";
import { getSubscriptionAccess } from "../subscription/subscription-access";

export async function getCheckout(
  profile: UserProfileRecord | null,
  repository: AdminConfigRepository,
) {
  const access = getSubscriptionAccess(profile);
  const provider = await repository.getPaymentProvider();

  if (access.canAccess && access.status !== "expiring") {
    return {
      alreadyActive: true,
      checkoutUrl: null,
      provider,
      subscription: access,
    };
  }

  return {
    alreadyActive: false,
    checkoutUrl: provider?.active ? provider.checkoutUrl : null,
    provider,
    subscription: access,
  };
}
