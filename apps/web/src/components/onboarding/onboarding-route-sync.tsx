"use client";

import { useOnboardingRedirect } from "@/hooks/onboarding/use-onboarding-redirect";

export function OnboardingRouteSync() {
  useOnboardingRedirect();
  return null;
}
