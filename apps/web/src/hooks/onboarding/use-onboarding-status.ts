"use client";

import { useEffect, useState } from "react";
import { api, type OnboardingStatus } from "@/lib/api-client";

export function useOnboardingStatus() {
  const [status, setStatus] = useState<OnboardingStatus | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .onboardingStatus()
      .then(setStatus)
      .catch(() => setStatus(null))
      .finally(() => setLoading(false));
  }, []);

  return { status, loading, incomplete: !status?.actionPlanGenerated };
}
