import type { ReactNode } from "react";
import { OnboardingRouteSync } from "../onboarding/onboarding-route-sync";
import { OnboardingProgress } from "../progress/onboarding-progress";
import { AppShell } from "./app-shell";

type OnboardingShellProps = {
  step: number;
  title: string;
  children: ReactNode;
};

export function OnboardingShell({ step, title, children }: OnboardingShellProps) {
  return (
    <AppShell>
      <OnboardingRouteSync />
      <div className="mx-auto grid w-full max-w-6xl gap-6">
        <OnboardingProgress currentStep={step} currentTitle={title} />
        <header className="stitch-page-card p-6 md:p-8">
          <span className="inline-block rounded-full bg-primary/10 px-4 py-1 text-xs font-semibold text-primary">
            Etapa {step} de 6
          </span>
          <h1 className="mt-3 text-[32px] font-semibold leading-tight text-foreground">{title}</h1>
          <div className="mt-4 h-2 w-48 overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-primary"
              style={{ width: `${Math.min(100, (step / 6) * 100)}%` }}
            />
          </div>
        </header>
        {children}
      </div>
    </AppShell>
  );
}
