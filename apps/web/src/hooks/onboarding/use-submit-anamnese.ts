"use client";

import { type AnamnesePayload, api } from "@/lib/api-client";
import { useApiAction } from "../api/use-api-action";

export function useSubmitAnamnese() {
  return useApiAction((payload: AnamnesePayload) => api.submitAnamnese(payload));
}
