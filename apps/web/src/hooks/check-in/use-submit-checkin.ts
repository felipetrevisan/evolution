"use client";

import { api, type CheckInPayload } from "@/lib/api-client";
import { useApiAction } from "../api/use-api-action";

export function useSubmitCheckin() {
  return useApiAction((payload: CheckInPayload) => api.submitCheckIn(payload));
}
