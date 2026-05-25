"use client";

import { useEffect, useState } from "react";
import { api, type TodayCheckIn } from "@/lib/api-client";

export function useTodayCheckin() {
  const [data, setData] = useState<TodayCheckIn | null>(null);

  useEffect(() => {
    api
      .todayCheckIn()
      .then(setData)
      .catch(() => setData(null));
  }, []);

  return { data };
}
