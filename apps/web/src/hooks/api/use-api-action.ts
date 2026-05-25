"use client";

import { useState } from "react";
import { ApiClientError } from "@/lib/api-client";

export function useApiAction<TArgs extends unknown[], TResult>(
  action: (...args: TArgs) => Promise<TResult>,
) {
  const [data, setData] = useState<TResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function execute(...args: TArgs) {
    setLoading(true);
    setError(null);

    try {
      const result = await action(...args);
      setData(result);
      return result;
    } catch (caught) {
      const message =
        caught instanceof ApiClientError ? caught.message : "Não foi possível concluir a ação.";
      setError(message);
      throw caught;
    } finally {
      setLoading(false);
    }
  }

  return { data, error, loading, execute };
}
