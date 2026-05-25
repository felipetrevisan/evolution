"use client";

import { useEffect, useState } from "react";
import { api, type CycleReportData } from "@/lib/api-client";

export function useCycleReport() {
  const [data, setData] = useState<CycleReportData>(null);

  useEffect(() => {
    api
      .cycleReport()
      .then(setData)
      .catch(() => setData(null));
  }, []);

  return { data };
}
