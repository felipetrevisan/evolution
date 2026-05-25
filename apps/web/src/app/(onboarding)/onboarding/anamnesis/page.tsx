import { AnamneseForm } from "@/components/anamnese/anamnese-form";
import { OnboardingShell } from "@/components/layout/onboarding-shell";

export default function AnamnesisPage() {
  return (
    <OnboardingShell step={2} title="Anamnese">
      <AnamneseForm />
    </OnboardingShell>
  );
}
