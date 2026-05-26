"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import type { InvestigationCurrent } from "@/lib/api-client";
import { ApiClientError, api } from "@/lib/api-client";
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
      .catch((error: unknown) => {
        const message =
          error instanceof ApiClientError
            ? error.message
            : "Não foi possível carregar a investigação.";
        setCurrent(null);
        setError(message);
        toast.error(message);
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
