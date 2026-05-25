import { InvestigationFlow } from "@/components/investigation/investigation-flow";
import { OnboardingShell } from "@/components/layout/onboarding-shell";

export default function InvestigationPage() {
  return (
    <OnboardingShell step={4} title="Investigação adaptativa">
      <InvestigationFlow />
    </OnboardingShell>
  );
}
