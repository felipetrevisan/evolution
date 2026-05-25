"use client";

import { useEffect, useState } from "react";
import type { InvestigationCurrent } from "@/lib/api-client";
import { api } from "@/lib/api-client";
import { useApiAction } from "../api/use-api-action";

export function useInvestigationFlow() {
  const [current, setCurrent] = useState<InvestigationCurrent | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const answer = useApiAction(api.investigationAnswer);
  const complete = useApiAction(api.completeInvestigation);

  useEffect(() => {
    api
      .currentInvestigation()
      .then((response) => {
        setCurrent(response);
        setError(null);
      })
      .catch(() => {
        setCurrent(null);
        setError("Não foi possível carregar a investigação.");
      })
      .finally(() => setLoading(false));
  }, []);

  async function refresh() {
    const response = await api.currentInvestigation();
    setCurrent(response);
    return response;
  }

  return { answer, complete, current, error, loading, refresh };
}
