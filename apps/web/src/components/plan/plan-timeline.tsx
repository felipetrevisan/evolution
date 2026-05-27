"use client";

import { Badge, Button, Card, CardContent, CardHeader, CardTitle } from "@evolution/ui";
import {
  ArrowRight,
  CalendarCheck,
  CheckCircle2,
  ClipboardList,
  Compass,
  Route,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { type ActionPlanData, api } from "@/lib/api-client";
import { routes } from "@/lib/routes/routes";
import { formatVectorLabel } from "@/lib/utils/domain-labels";

export function PlanTimeline() {
  const [plan, setPlan] = useState<ActionPlanData | null>(null);
  const [activeWeek, setActiveWeek] = useState(1);

  useEffect(() => {
    api
      .currentPlan()
      .then(setPlan)
      .catch(() => setPlan(null));
  }, []);

  if (!plan) {
    return <EmptyPlanState />;
  }

  const selectedWeek = getSelectedWeek(plan, activeWeek);
  const selectedDays = plan.days.filter(
    (day) => (day.week ?? Math.ceil((day.day ?? 1) / 7)) === activeWeek,
  );

  return (
    <div className="mx-auto grid w-full max-w-6xl gap-8 pb-24 md:pb-8">
      <Card className="stitch-soft-shadow rounded-[24px] border-0 bg-gradient-to-br from-primary-container to-primary text-primary-foreground">
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

      {plan.narrative ? (
        <Card className="stitch-glass-card stitch-soft-shadow rounded-[24px] border-0">
          <CardHeader>
            <CardTitle>Leitura adaptativa da sua jornada</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3">
            {[
              plan.narrative.diagnosis,
              plan.narrative.execution,
              plan.narrative.context,
              plan.narrative.direction,
            ].map((text) => (
              <p
                className="rounded-[24px] bg-muted p-4 text-sm leading-7 text-muted-foreground"
                key={text}
              >
                {text}
              </p>
            ))}
          </CardContent>
        </Card>
      ) : null}

      <Card className="stitch-glass-card stitch-soft-shadow rounded-[24px] border-0">
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

      <div className="grid gap-6 lg:grid-cols-6">
        {plan.weeklyObjectives.map((week) => (
          <button
            className="cursor-pointer text-left"
            key={week.week}
            onClick={() => setActiveWeek(week.week)}
            type="button"
          >
            <Card
              className={`stitch-glass-card h-full rounded-[24px] border transition hover:-translate-y-1 ${
                activeWeek === week.week ? "border-primary/50 bg-primary/10" : "border-transparent"
              }`}
            >
              <CardContent className="grid gap-3 p-5">
                <span className="grid size-10 place-items-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
                  {week.week}
                </span>
                <p className="font-semibold">
                  Semana {week.week}
                  {week.title ? ` · ${week.title}` : ""}
                </p>
                <p className="text-sm leading-6 text-muted-foreground">{week.objective}</p>
                <p className="text-xs font-medium text-primary">{week.protocol}</p>
              </CardContent>
            </Card>
          </button>
        ))}
      </div>

      <Card className="stitch-glass-card stitch-soft-shadow rounded-[24px] border-0">
        <CardHeader>
          <CardTitle>
            Semana {activeWeek}
            {selectedWeek?.title ? ` · ${selectedWeek.title}` : ""}
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-5">
          {selectedWeek ? (
            <div className="grid gap-3 md:grid-cols-3">
              <ActionBlock
                label="Vetor base"
                title={formatVectorLabel(selectedWeek.base.vector)}
                value={selectedWeek.base.action}
                helper={selectedWeek.base.frequency}
              />
              <ActionBlock
                label="Vetor de suporte"
                title={formatVectorLabel(selectedWeek.support.vector)}
                value={selectedWeek.support.action}
                helper={selectedWeek.support.frequency}
              />
              <ActionBlock
                label="Regulação"
                title="Revisão da semana"
                value={selectedWeek.regulation.action}
                helper={selectedWeek.regulation.frequency}
              />
            </div>
          ) : null}

          <div className="grid gap-3">
            {selectedDays.map((day) => (
              <div
                className="grid gap-3 rounded-[24px] border border-border bg-card p-4 md:grid-cols-[88px_1fr_auto] md:items-center"
                key={day.day}
              >
                <div className="flex items-center gap-2 font-semibold text-primary">
                  <CalendarCheck className="size-4" />
                  Dia {day.day}
                </div>
                <div className="grid gap-1">
                  <p className="font-semibold">{day.microAction}</p>
                  <p className="text-muted-foreground text-sm leading-6">{day.message}</p>
                  <p className="text-muted-foreground text-xs">
                    Suporte: {day.supportAction} · Regulação: {day.regulationAction}
                  </p>
                </div>
                <Button
                  asChild
                  className="rounded-xl"
                  variant={day.checkpoint ? "default" : "outline"}
                >
                  <Link href={routes.checkIn}>
                    Fazer check-in
                    <CheckCircle2 className="size-4" />
                  </Link>
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function getSelectedWeek(plan: ActionPlanData, week: number) {
  return plan.weeks?.find((item) => item.week === week);
}

function EmptyPlanState() {
  return (
    <section className="grid gap-6 pb-24 md:pb-8">
      <Card className="overflow-hidden rounded-3xl border-border bg-card">
        <CardContent className="grid gap-8 p-6 md:grid-cols-[1fr_320px] md:p-8">
          <div className="grid content-center gap-5">
            <span className="grid size-14 place-items-center rounded-[24px] bg-primary text-primary-foreground shadow-lg shadow-primary/20">
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
    <div className="flex gap-3 rounded-[24px] bg-card p-4">
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

function ActionBlock({
  helper,
  label,
  title,
  value,
}: {
  helper: string;
  label: string;
  title: string;
  value: string;
}) {
  return (
    <div className="rounded-[24px] border border-border bg-muted p-4">
      <p className="text-muted-foreground text-xs font-semibold uppercase tracking-wide">{label}</p>
      <p className="mt-2 font-semibold">{title}</p>
      <p className="mt-2 text-sm leading-6">{value}</p>
      <p className="mt-3 text-primary text-xs font-semibold">{helper}</p>
    </div>
  );
}
