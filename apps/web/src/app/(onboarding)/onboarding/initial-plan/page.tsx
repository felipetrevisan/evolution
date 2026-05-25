import { OnboardingShell } from "@/components/layout/onboarding-shell";
import { PlanTimeline } from "@/components/plan/plan-timeline";

export default function InitialPlanPage() {
  return (
    <OnboardingShell step={6} title="Plano inicial">
      <PlanTimeline />
    </OnboardingShell>
  );
}
