"use client";

import { useCallback, useEffect, useState } from "react";
import { api, type TodayCheckIn } from "@/lib/api-client";

export function useTodayCheckin() {
  const [data, setData] = useState<TodayCheckIn | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      setData(await api.todayCheckIn());
    } catch {
      setData(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  return { data, loading, refresh };
}
