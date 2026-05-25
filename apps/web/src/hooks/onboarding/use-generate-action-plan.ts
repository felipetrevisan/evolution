"use client";

import { api } from "@/lib/api-client";
import { useApiAction } from "../api/use-api-action";

export function useGenerateActionPlan() {
  return useApiAction(api.generatePlan);
}
