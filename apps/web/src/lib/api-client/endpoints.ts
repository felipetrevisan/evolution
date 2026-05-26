import { apiRequest, apiUpload } from "./client";
import type {
  ActionPlanData,
  AnamnesePayload,
  CheckInPayload,
  CheckoutData,
  CurrentUser,
  CycleReportData,
  DashboardData,
  InvestigationCurrent,
  InvestigationQuestion,
  OnboardingStatus,
  OperationalCurrent,
  OperationalQuestion,
  PaymentProviderConfig,
  SubscriptionPlan,
  TodayCheckIn,
  TriageQuestion,
  TriageQuestionsResponse,
  TriageSessionData,
  UserProfile,
} from "./types";

export const api = {
  me: () => apiRequest<CurrentUser>("/me"),
  updateProfile: (body: {
    name?: string;
    photoUrl?: string;
    birthDate?: string;
    gender?: string;
    goals?: string[];
  }) => apiRequest<UserProfile, typeof body>("/me/profile", { method: "POST", body }),
  uploadAvatar: (file: File, onProgress?: (progress: number) => void) => {
    const formData = new FormData();
    formData.append("avatar", file);
    return apiUpload<UserProfile>("/me/avatar", formData, onProgress);
  },
  onboardingStatus: () => apiRequest<OnboardingStatus>("/onboarding/status"),
  submitAnamnese: (body: AnamnesePayload) =>
    apiRequest<unknown, AnamnesePayload>("/onboarding/anamnesis", { method: "POST", body }),
  submitTriageAnswer: (body: {
    questionId: number;
    layer?: "FVA" | "IM";
    selections: Array<{ alternativeId: string; vector: string }>;
    sessionId?: string;
  }) => apiRequest<TriageSessionData, typeof body>("/triage/answer", { method: "POST", body }),
  triageQuestions: () => apiRequest<TriageQuestionsResponse>("/triage/questions"),
  currentTriageSession: () => apiRequest<TriageSessionData | null>("/triage/current-session"),
  completeTriage: () => apiRequest<unknown>("/triage/complete", { method: "POST" }),
  triageTieBreak: (body: { layer: "FVA" | "IM"; vector: string }) =>
    apiRequest<TriageSessionData, typeof body>("/triage/tie-break", { method: "POST", body }),
  currentTriageResult: () => apiRequest<TriageSessionData | null>("/triage/current-result"),
  currentInvestigation: () => apiRequest<InvestigationCurrent>("/investigation/current"),
  investigationAnswer: (body: unknown) =>
    apiRequest<unknown, unknown>("/investigation/answer", { method: "POST", body }),
  completeInvestigation: () => apiRequest<unknown>("/investigation/complete", { method: "POST" }),
  currentOperationalAssessment: () =>
    apiRequest<OperationalCurrent>("/operational-assessment/current"),
  operationalAnswer: (body: unknown) =>
    apiRequest<unknown, unknown>("/operational-assessment/answer", { method: "POST", body }),
  completeOperational: () =>
    apiRequest<unknown>("/operational-assessment/complete", { method: "POST" }),
  generateAdaptiveProfile: () =>
    apiRequest<unknown>("/adaptive-engine/generate-profile", { method: "POST" }),
  generatePlan: () => apiRequest<unknown>("/action-plan/generate", { method: "POST", body: {} }),
  currentPlan: () => apiRequest<ActionPlanData>("/action-plan/current"),
  dashboard: () => apiRequest<DashboardData>("/dashboard"),
  checkout: () => apiRequest<CheckoutData>("/checkout"),
  submitCheckIn: (body: CheckInPayload) =>
    apiRequest<unknown, CheckInPayload>("/check-in", { method: "POST", body }),
  todayCheckIn: () => apiRequest<TodayCheckIn>("/check-in/today"),
  checkInHistory: () => apiRequest<unknown[]>("/check-in/history"),
  cycleReport: () => apiRequest<CycleReportData>("/cycle-report/current"),
  currentCycle: () => apiRequest<unknown>("/cycle/current"),
  startNextCycle: () => apiRequest<unknown>("/cycle/start-next", { method: "POST" }),
  adminSession: () => apiRequest<{ isAdmin: true; uid: string; role: "admin" }>("/admin/session"),
  adminUsers: () => apiRequest<UserProfile[]>("/admin/users"),
  adminUpdateUser: (
    uid: string,
    body: { role?: "user" | "admin"; subscription?: UserProfile["subscription"] },
  ) => apiRequest<UserProfile, typeof body>(`/admin/users/${uid}`, { method: "PATCH", body }),
  adminResetUserProgress: (uid: string) =>
    apiRequest<{ deletedRecords: number; user: UserProfile | null }>(
      `/admin/users/${uid}/reset-progress`,
      { method: "POST" },
    ),
  adminSubscriptionPlans: () => apiRequest<SubscriptionPlan[]>("/admin/subscription-plans"),
  adminSaveSubscriptionPlan: (body: SubscriptionPlan) =>
    apiRequest<SubscriptionPlan, SubscriptionPlan>("/admin/subscription-plans", {
      method: "POST",
      body,
    }),
  adminDeleteSubscriptionPlan: (planId: string) =>
    apiRequest<{ id: string }>(`/admin/subscription-plans/${planId}`, { method: "DELETE" }),
  adminPaymentProvider: () => apiRequest<PaymentProviderConfig | null>("/admin/payment-provider"),
  adminSavePaymentProvider: (body: PaymentProviderConfig) =>
    apiRequest<PaymentProviderConfig, PaymentProviderConfig>("/admin/payment-provider", {
      method: "PUT",
      body,
    }),
  adminTriageQuestions: () =>
    apiRequest<{ questions: TriageQuestion[] }>("/admin/triage/questions"),
  adminSaveTriageQuestions: (body: { questions: TriageQuestion[] }) =>
    apiRequest<{ questions: TriageQuestion[] }, typeof body>("/admin/triage/questions", {
      method: "PUT",
      body,
    }),
  adminInvestigationQuestions: (priorityVector: string) =>
    apiRequest<{ questions: InvestigationQuestion[] }>(
      `/admin/investigation/questions/${priorityVector}`,
    ),
  adminSaveInvestigationQuestions: (body: {
    questionsByVector: Record<string, InvestigationQuestion[]>;
  }) =>
    apiRequest<{ questionsByVector: Record<string, InvestigationQuestion[]> }, typeof body>(
      "/admin/investigation/questions",
      {
        method: "PUT",
        body,
      },
    ),
  adminOperationalQuestions: () =>
    apiRequest<{ questions: OperationalQuestion[] }>("/admin/operational-assessment/questions"),
  adminSaveOperationalQuestions: (body: { questions: OperationalQuestion[] }) =>
    apiRequest<{ questions: OperationalQuestion[] }, typeof body>(
      "/admin/operational-assessment/questions",
      {
        method: "PUT",
        body,
      },
    ),
};
