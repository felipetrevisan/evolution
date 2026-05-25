"use client";

import { Badge, Button, Card, CardContent, CardHeader, CardTitle } from "@evolution/ui";
import { ArrowRight, ClipboardList, Compass, Route, Sparkles } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { type ActionPlanData, api } from "@/lib/api-client";
import { routes } from "@/lib/routes/routes";
import { formatVectorLabel } from "@/lib/utils/domain-labels";

export function PlanTimeline() {
  const [plan, setPlan] = useState<ActionPlanData | null>(null);

  useEffect(() => {
    api
      .currentPlan()
      .then(setPlan)
      .catch(() => setPlan(null));
  }, []);

  if (!plan) {
    return <EmptyPlanState />;
  }

  return (
    <div className="grid gap-6 pb-24 md:pb-8">
      <Card className="stitch-soft-shadow rounded-2xl border-0 bg-gradient-to-br from-primary-container to-primary text-primary-foreground">
        <CardContent className="flex flex-wrap items-center gap-8 p-8">
          <div className="min-w-48">
            <p className="mb-1 text-xs font-semibold uppercase tracking-wider opacity-80">
              Vetor prioritário
            </p>
            <h2 className="text-2xl font-semibold">{formatVectorLabel(plan.priorityVector)}</h2>
          </div>
          <div className="hidden h-12 w-px bg-white/20 md:block" />
          <div className="min-w-48">
            <p className="mb-1 text-xs font-semibold uppercase tracking-wider opacity-80">
              Protocolo
            </p>
            <p className="text-xl font-semibold">{plan.protocolBase}</p>
          </div>
          <div className="hidden h-12 w-px bg-white/20 md:block" />
          <div className="min-w-48 flex-1 rounded-xl border border-white/20 bg-white/10 p-4">
            <p className="mb-1 text-xs font-semibold uppercase tracking-wider opacity-80">
              Próxima micro-meta
            </p>
            <p className="font-semibold">
              {plan.days[0]?.microAction ?? plan.weeklyObjectives[0]?.objective ?? "Iniciar ciclo"}
            </p>
          </div>
        </CardContent>
      </Card>

      <Card className="stitch-glass-card stitch-soft-shadow rounded-2xl border-0">
        <CardHeader>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <CardTitle>Plano de Ação Evolution - Ciclo 1</CardTitle>
            <Badge className="rounded-full bg-secondary text-secondary-foreground">45 dias</Badge>
          </div>
        </CardHeader>
        <CardContent className="grid gap-5">
          <div className="grid gap-3 md:grid-cols-3">
            <PlanInfo label="Vetor de suporte" value={formatVectorLabel(plan.supportVector)} />
            <PlanInfo label="Regulação" value={formatVectorLabel(plan.regulationVector)} />
            <PlanInfo label="Duração" value={`${plan.days.length || 45} dias`} />
          </div>
          <div className="flex flex-wrap gap-2">
            {plan.imWords.map((word) => (
              <Badge className="rounded-full bg-secondary/60 text-secondary-foreground" key={word}>
                {word}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 lg:grid-cols-6">
        {plan.weeklyObjectives.map((week) => (
          <Card
            className="stitch-glass-card stitch-soft-shadow rounded-2xl border-0"
            key={week.week}
          >
            <CardContent className="grid gap-3 p-5">
              <span className="grid size-10 place-items-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
                {week.week}
              </span>
              <p className="font-semibold">Semana {week.week}</p>
              <p className="text-sm leading-6 text-muted-foreground">{week.objective}</p>
              <p className="text-xs font-medium text-primary">{week.protocol}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

function EmptyPlanState() {
  return (
    <section className="grid gap-6 pb-24 md:pb-8">
      <Card className="overflow-hidden rounded-3xl border-border bg-card">
        <CardContent className="grid gap-8 p-6 md:grid-cols-[1fr_320px] md:p-8">
          <div className="grid content-center gap-5">
            <span className="grid size-14 place-items-center rounded-2xl bg-primary text-primary-foreground shadow-lg shadow-primary/20">
              <Route className="size-7" />
            </span>
            <div className="grid gap-3">
              <p className="text-muted-foreground text-sm font-semibold uppercase tracking-wide">
                Plano de ação
              </p>
              <h1 className="max-w-2xl text-3xl font-semibold leading-tight text-foreground">
                Seu plano personalizado ainda não foi criado.
              </h1>
              <p className="max-w-2xl text-muted-foreground leading-7">
                Ele aparece aqui depois que você conclui as etapas iniciais. A partir disso, você
                verá sua rota de 45 dias com foco da semana, micro-metas e próximos passos.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button asChild className="h-12 rounded-xl">
                <Link href={routes.anamnesis}>
                  Continuar minha jornada
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
              <Button asChild className="h-12 rounded-xl" variant="outline">
                <Link href={routes.dashboard}>Voltar ao painel</Link>
              </Button>
            </div>
          </div>

          <div className="grid gap-3 rounded-3xl border border-border bg-muted p-4">
            <EmptyPlanStep
              description="Informações iniciais para entender seu contexto atual."
              icon={ClipboardList}
              title="Anamnese"
            />
            <EmptyPlanStep
              description="Mapeamento dos vetores que orientam a sua jornada."
              icon={Compass}
              title="Triagem e investigação"
            />
            <EmptyPlanStep
              description="Geração da rota prática para os próximos 45 dias."
              icon={Sparkles}
              title="Plano personalizado"
            />
          </div>
        </CardContent>
      </Card>
    </section>
  );
}

function EmptyPlanStep({
  description,
  icon: Icon,
  title,
}: {
  description: string;
  icon: typeof Route;
  title: string;
}) {
  return (
    <div className="flex gap-3 rounded-2xl bg-card p-4">
      <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-secondary text-secondary-foreground">
        <Icon className="size-5" />
      </span>
      <div>
        <p className="font-semibold text-sm">{title}</p>
        <p className="mt-1 text-muted-foreground text-sm leading-6">{description}</p>
      </div>
    </div>
  );
}

function PlanInfo({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-muted p-4">
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="mt-2 font-semibold">{value}</p>
    </div>
  );
}
