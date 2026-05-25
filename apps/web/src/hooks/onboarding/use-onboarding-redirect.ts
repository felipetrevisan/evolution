"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { useOnboardingStatus } from "./use-onboarding-status";

export function useOnboardingRedirect() {
  const pathname = usePathname();
  const router = useRouter();
  const { status, loading } = useOnboardingStatus();

  useEffect(() => {
    if (loading || !status?.canContinue || !status.nextRoute) {
      return;
    }

    if (pathname.startsWith("/onboarding") && pathname !== status.nextRoute) {
      router.replace(status.nextRoute);
    }
  }, [loading, pathname, router, status]);

  return { status, loading };
}
