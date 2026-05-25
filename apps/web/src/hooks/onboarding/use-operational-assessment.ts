"use client";

import { useEffect, useState } from "react";
import type { OperationalCurrent } from "@/lib/api-client";
import { api } from "@/lib/api-client";
import { useApiAction } from "../api/use-api-action";

export function useOperationalAssessment() {
  const [current, setCurrent] = useState<OperationalCurrent | null>(null);
  const answer = useApiAction(api.operationalAnswer);
  const complete = useApiAction(api.completeOperational);
  const generateProfile = useApiAction(api.generateAdaptiveProfile);
  const generatePlan = useApiAction(api.generatePlan);

  useEffect(() => {
    api
      .currentOperationalAssessment()
      .then(setCurrent)
      .catch(() => setCurrent(null));
  }, []);

  return { answer, complete, current, generatePlan, generateProfile };
}
