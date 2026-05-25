import type { UserProfileRecord } from "../../repositories/user-repository";

export type SubscriptionAccess = {
  status: "active" | "trialing" | "expiring" | "expired" | "blocked";
  canAccess: boolean;
  daysUntilExpiration: number | null;
  expiresAt: string | null;
  planId: string | null;
};

const expiringWindowDays = 15;

export function getSubscriptionAccess(profile: UserProfileRecord | null): SubscriptionAccess {
  const subscription = profile?.subscription;
  const status = subscription?.status ?? "free";
  const expiresAt = subscription?.currentPeriodEnd ?? null;
  const daysUntilExpiration = expiresAt ? diffDays(expiresAt) : null;

  if (status === "active" || status === "trialing") {
    if (daysUntilExpiration === null) {
      return {
        status: "blocked",
        canAccess: false,
        daysUntilExpiration,
        expiresAt,
        planId: subscription?.planId ?? null,
      };
    }

    if (daysUntilExpiration < 0) {
      return {
        status: "expired",
        canAccess: false,
        daysUntilExpiration,
        expiresAt,
        planId: subscription?.planId ?? null,
      };
    }

    return {
      status: daysUntilExpiration <= expiringWindowDays ? "expiring" : status,
      canAccess: true,
      daysUntilExpiration,
      expiresAt,
      planId: subscription?.planId ?? null,
    };
  }

  return {
    status: status === "canceled" || status === "past_due" ? "expired" : "blocked",
    canAccess: false,
    daysUntilExpiration,
    expiresAt,
    planId: subscription?.planId ?? null,
  };
}

export function annualExpirationFromNow() {
  const date = new Date();
  date.setFullYear(date.getFullYear() + 1);
  return date.toISOString();
}

function diffDays(dateIso: string) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const date = new Date(dateIso);
  date.setHours(0, 0, 0, 0);

  return Math.ceil((date.getTime() - today.getTime()) / 86_400_000);
}
