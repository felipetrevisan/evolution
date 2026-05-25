"use client";

import { api } from "@/lib/api-client";
import { useApiAction } from "../api/use-api-action";

export function useSubmitTriageAnswer() {
  return useApiAction(api.submitTriageAnswer);
}
