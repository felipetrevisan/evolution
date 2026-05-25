import { Progress } from "@evolution/ui";
import { CheckCircle2, Circle } from "lucide-react";

const steps = [
  "Boas-vindas",
  "Anamnese",
  "Triagem",
  "Investigação",
  "Autoavaliação",
  "Plano inicial",
];

export function OnboardingProgress({
  currentStep,
  currentTitle,
}: {
  currentStep: number;
  currentTitle: string;
}) {
  const progress = Math.min(100, (currentStep / steps.length) * 100);
  const nextStep = steps[currentStep] ?? "Finalizar plano inicial";

  return (
    <div className="stitch-glass-card stitch-soft-shadow rounded-[16px] p-4">
      <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-foreground">Jornada inicial</p>
          <p className="text-xs text-muted-foreground">
            Agora: {currentTitle} · Próximo: {nextStep}
          </p>
        </div>
        <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
          {currentStep}/{steps.length}
        </span>
      </div>
      <Progress value={progress} />
      <div className="mt-4 hidden grid-cols-6 gap-2 lg:grid">
        {steps.map((step, index) => {
          const stepNumber = index + 1;
          const isCompleted = stepNumber < currentStep;
          const isCurrent = stepNumber === currentStep;
          const Icon = isCompleted ? CheckCircle2 : Circle;

          return (
            <div
              className={`rounded-xl border px-3 py-2 transition ${
                isCurrent
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border bg-card/60 text-muted-foreground"
              }`}
              key={step}
            >
              <Icon className="mb-2 size-4" />
              <p className="truncate text-xs font-medium">{step}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
