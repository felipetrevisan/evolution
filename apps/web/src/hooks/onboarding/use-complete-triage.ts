"use client";

import { api } from "@/lib/api-client";
import { useApiAction } from "../api/use-api-action";

export function useCompleteTriage() {
  return useApiAction(api.completeTriage);
}
