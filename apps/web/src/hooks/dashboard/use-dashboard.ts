"use client";

import { useCallback, useEffect, useState } from "react";
import { api, type DashboardData } from "@/lib/api-client";

export function useDashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      setData(await api.dashboard());
    } catch {
      setData(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  useEffect(() => {
    function handleCheckInSaved() {
      void refresh();
    }

    window.addEventListener("evolua:check-in-saved", handleCheckInSaved);
    return () => window.removeEventListener("evolua:check-in-saved", handleCheckInSaved);
  }, [refresh]);

  return { data, loading, refresh };
}
