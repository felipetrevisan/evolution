import { OnboardingShell } from "@/components/layout/onboarding-shell";
import { OperationalAssessmentForm } from "@/components/operational-assessment/operational-assessment-form";

export default function OperationalAssessmentPage() {
  return (
    <OnboardingShell step={5} title="Autoavaliação operacional">
      <OperationalAssessmentForm />
    </OnboardingShell>
  );
}
