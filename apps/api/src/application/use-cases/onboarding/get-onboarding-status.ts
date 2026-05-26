import type { UserScopedRepository } from "../../repositories/base-repository";
import { type OnboardingStep, onboardingRoutesByStep } from "./onboarding-steps";

export async function getOnboardingStatus(
  uid: string,
  repositories: {
    cycles: UserScopedRepository<{ id: string; uid: string; createdAt: string }>;
    anamnese?: UserScopedRepository<{ id: string; uid: string; createdAt: string }>;
    bodyMeasurements: UserScopedRepository<{ id: string; uid: string; createdAt: string }>;
    triageSessions: UserScopedRepository<{
      id: string;
      uid: string;
      createdAt: string;
      result?: unknown;
      status?: string;
    }>;
    investigations: UserScopedRepository<{
      id: string;
      uid: string;
      createdAt: string;
      status?: string;
    }>;
    operationalAssessments: UserScopedRepository<{
      id: string;
      uid: string;
      createdAt: string;
      status?: string;
    }>;
    adaptiveProfiles: UserScopedRepository<{ id: string; uid: string; createdAt: string }>;
    plans: UserScopedRepository<{ id: string; uid: string; createdAt: string }>;
  },
) {
  const [
    cycle,
    anamnese,
    bodyMeasurement,
    triage,
    investigation,
    operationalAssessment,
    profile,
    plan,
  ] = await Promise.all([
    repositories.cycles.getLatest(uid),
    repositories.anamnese?.getLatest(uid) ?? Promise.resolve(null),
    repositories.bodyMeasurements.getLatest(uid),
    repositories.triageSessions.getLatest(uid),
    repositories.investigations.getLatest(uid),
    repositories.operationalAssessments.getLatest(uid),
    repositories.adaptiveProfiles.getLatest(uid),
    repositories.plans.getLatest(uid),
  ]);
  const anamneseCompleted = Boolean(anamnese ?? bodyMeasurement);
  const triageResult = triage?.result as
    | {
        fvaPriority?: { requiresUserChoice?: boolean; vector?: string };
        imPriority?: { requiresUserChoice?: boolean; vector?: string };
      }
    | undefined;
  const triageNeedsTieBreak =
    triage?.status === "completed" &&
    (triageResult?.fvaPriority?.requiresUserChoice ||
      triageResult?.imPriority?.requiresUserChoice ||
      !triageResult?.fvaPriority?.vector);
  const completedSteps: OnboardingStep[] = ["boas-vindas"];

  if (anamneseCompleted) completedSteps.push("anamnese");
  if (triage?.status === "completed") completedSteps.push("triagem", "resultado-triagem");
  if (!triageNeedsTieBreak && investigation?.status === "completed")
    completedSteps.push("investigacao");
  if (operationalAssessment?.status === "completed") completedSteps.push("autoavaliacao");
  if (profile) completedSteps.push("perfil-adaptativo");
  if (plan) completedSteps.push("plano-inicial");

  const currentStep: OnboardingStep = !anamneseCompleted
    ? "anamnese"
    : triage?.status !== "completed"
      ? "triagem"
      : triageNeedsTieBreak
        ? "resultado-triagem"
        : investigation?.status !== "completed"
          ? "investigacao"
          : operationalAssessment?.status !== "completed"
            ? "autoavaliacao"
            : !profile
              ? "perfil-adaptativo"
              : "plano-inicial";

  return {
    currentStep,
    anamneseCompleted,
    triageCompleted: triage?.status === "completed",
    triageNeedsTieBreak,
    investigationCompleted: investigation?.status === "completed",
    operationalAssessmentCompleted: operationalAssessment?.status === "completed",
    adaptiveProfileGenerated: Boolean(profile),
    actionPlanGenerated: Boolean(plan),
    completedSteps,
    currentCycleId: cycle?.id ?? null,
    canContinue: true,
    nextRoute: onboardingRoutesByStep[currentStep],
  };
}
