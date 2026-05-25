import { OnboardingShell } from "@/components/layout/onboarding-shell";
import { TriageResultPanel } from "@/components/triage/triage-result-panel";

export default function TriageResultPage() {
  return (
    <OnboardingShell step={3} title="Diagnóstico vetorial">
      <TriageResultPanel />
    </OnboardingShell>
  );
}
