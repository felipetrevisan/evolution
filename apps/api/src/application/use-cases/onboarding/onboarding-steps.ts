export type OnboardingStep =
  | "boas-vindas"
  | "anamnese"
  | "triagem"
  | "resultado-triagem"
  | "investigacao"
  | "autoavaliacao"
  | "perfil-adaptativo"
  | "plano-inicial";

export const onboardingRoutesByStep: Record<OnboardingStep, string> = {
  "boas-vindas": "/welcome",
  anamnese: "/onboarding/anamnesis",
  triagem: "/onboarding/triage",
  "resultado-triagem": "/onboarding/triage/result",
  investigacao: "/onboarding/investigation",
  autoavaliacao: "/onboarding/operational-assessment",
  "perfil-adaptativo": "/onboarding/initial-plan",
  "plano-inicial": "/onboarding/initial-plan",
};
