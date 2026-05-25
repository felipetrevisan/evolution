"use client";

import { Button, Card, CardContent } from "@evolution/ui";
import {
  ArrowRight,
  CheckCircle2,
  Circle,
  ClipboardList,
  Heart,
  ShieldCheck,
  Target,
} from "lucide-react";
import Link from "next/link";
import { useOnboardingStatus } from "@/hooks/onboarding/use-onboarding-status";
import { routes } from "@/lib/routes/routes";

export function EmptyDashboard() {
  const { status, loading } = useOnboardingStatus();
  const continueRoute = status?.nextRoute ?? routes.anamnesis;

  if (loading || status?.actionPlanGenerated) {
    return null;
  }

  return (
    <div className="grid gap-12">
      <Card className="stitch-glass-card stitch-soft-shadow relative overflow-hidden rounded-[24px] border-0">
        <div className="absolute inset-x-0 top-0 h-2 bg-gradient-to-r from-secondary via-primary to-secondary opacity-60" />
        <CardContent className="flex flex-col items-center justify-center p-8 text-center md:p-12">
          <div className="mb-6 grid size-20 place-items-center rounded-full bg-secondary text-primary">
            <ClipboardList className="size-10" />
          </div>
          <h2 className="max-w-2xl text-[32px] font-semibold leading-tight text-foreground">
            Vamos terminar sua jornada inicial
          </h2>
          <p className="mt-4 max-w-xl text-base leading-7 text-muted-foreground md:text-lg">
            Você está a poucos passos de liberar seu plano personalizado de 45 dias. Continue de
            onde parou e acompanhe o que ainda falta concluir.
          </p>
          <JourneyChecklist status={status} />
          <Button asChild className="mt-8 h-14 rounded-full px-8 text-base font-semibold">
            <Link href={continueRoute}>
              Continuar minha jornada
              <ArrowRight className="size-5" />
            </Link>
          </Button>
        </CardContent>
      </Card>

      <section className="stitch-soft-shadow rounded-[24px] bg-card p-8 text-card-foreground">
        <h3 className="mb-8 text-2xl font-semibold">O que você vai encontrar</h3>
        <div className="grid gap-6 md:grid-cols-3">
          <InfoCard
            icon={Heart}
            text="Avaliamos aspectos físicos, mentais e rotineiros para criar um perfil completo."
            title="Abordagem Integrada"
          />
          <InfoCard
            icon={Target}
            text="Seu plano evolui com você a partir do progresso contínuo e dos check-ins."
            title="Metas Adaptativas"
          />
          <InfoCard
            icon={ShieldCheck}
            text="Seus dados de saúde são usados apenas para personalizar a sua jornada."
            title="Privacidade Total"
          />
        </div>
      </section>
    </div>
  );
}

function JourneyChecklist({
  status,
}: {
  status: ReturnType<typeof useOnboardingStatus>["status"];
}) {
  const steps = [
    { done: status?.anamneseCompleted, label: "Anamnese" },
    { done: status?.triageCompleted, label: "Triagem" },
    { done: status?.investigationCompleted, label: "Investigação" },
    { done: status?.operationalAssessmentCompleted, label: "Autoavaliação" },
    { done: status?.actionPlanGenerated, label: "Plano inicial" },
  ];

  return (
    <div className="mt-8 grid w-full max-w-3xl gap-3 text-left sm:grid-cols-2 lg:grid-cols-5">
      {steps.map((step) => {
        const Icon = step.done ? CheckCircle2 : Circle;

        return (
          <div
            className={`rounded-2xl border p-4 ${
              step.done
                ? "border-primary/30 bg-primary/10 text-primary"
                : "border-border bg-card/70 text-muted-foreground"
            }`}
            key={step.label}
          >
            <Icon className="mb-3 size-5" />
            <p className="text-sm font-semibold">{step.label}</p>
            <p className="mt-1 text-xs">{step.done ? "Concluído" : "Pendente"}</p>
          </div>
        );
      })}
    </div>
  );
}

function InfoCard({
  icon: Icon,
  text,
  title,
}: {
  icon: typeof Heart;
  text: string;
  title: string;
}) {
  return (
    <article className="stitch-glass-card rounded-[24px] p-6 transition hover:-translate-y-1">
      <div className="mb-4 grid size-12 place-items-center rounded-full bg-secondary text-primary">
        <Icon className="size-6" />
      </div>
      <h4 className="mb-2 text-sm font-bold text-foreground">{title}</h4>
      <p className="text-sm leading-6 text-muted-foreground">{text}</p>
    </article>
  );
}
