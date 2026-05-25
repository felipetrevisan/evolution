import { OnboardingShell } from "@/components/layout/onboarding-shell";
import { TriageQuestionScreen } from "@/components/triage/triage-question-screen";

export default function TriagePage() {
  return (
    <OnboardingShell step={3} title="Triagem vetorial comportamental">
      <TriageQuestionScreen />
    </OnboardingShell>
  );
}
