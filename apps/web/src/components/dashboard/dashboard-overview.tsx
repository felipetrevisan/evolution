"use client";

import { Button, Card, CardContent } from "@evolution/ui";
import { Activity, CalendarDays, Flame, Gauge, Route, Sparkles, Target, Timer } from "lucide-react";
import Link from "next/link";
import { useDashboard } from "@/hooks/dashboard/use-dashboard";
import { routes } from "@/lib/routes/routes";
import { CheckInQuickDialog } from "../check-in/check-in-quick-dialog";
import { SectionHeading } from "../shared/section-heading";
import { SubscriptionAlert } from "../subscription/subscription-alert";
import { DashboardMetricCard } from "./cards/dashboard-metric-card";
import { AdherenceChart } from "./charts/adherence-chart";
import { BlockScoresChart } from "./charts/block-scores-chart";
import { BodyHistoryChart } from "./charts/body-history-chart";
import { VectorEvolutionChart } from "./charts/vector-evolution-chart";
import { EmptyDashboard } from "./empty-dashboard";

const loadingCards = ["cycle", "streak", "frequency", "focus"];

export function DashboardOverview() {
  const { data, loading } = useDashboard();

  if (loading) {
    return <DashboardLoadingState />;
  }

  if (!data) {
    return <EmptyDashboard />;
  }

  return (
    <div className="mx-auto grid w-full max-w-6xl gap-8 pb-24 md:pb-8">
      <SectionHeading
        description="Acompanhe seu ciclo atual, sua presença diária e seus sinais adaptativos."
        eyebrow={`Olá, ${data.user.greetingName}`}
        title="Seu painel de evolução"
      />

      <SubscriptionAlert subscription={data.subscription} />

      <Card className="stitch-soft-shadow rounded-[24px] border-0 bg-gradient-to-br from-primary-container to-primary text-primary-foreground">
        <CardContent className="grid gap-6 p-6 md:grid-cols-[1fr_auto] md:items-center lg:p-8">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider opacity-80">
              Próxima micro-meta
            </p>
            <h2 className="mt-2 max-w-3xl text-2xl font-semibold tracking-normal">
              {data.nextMicroGoal}
            </h2>
            <p className="mt-3 text-sm opacity-85">
              Semana {data.currentWeek} · Palavra IM: {data.checkInStatus.imWord}
            </p>
          </div>
          {data.subscription.canAccess ? (
            data.checkInStatus.completedToday ? (
              <Button
                asChild
                className="h-12 rounded-xl bg-card px-6 font-bold text-primary hover:bg-muted"
              >
                <Link href={routes.checkIn}>Ver check-in de hoje</Link>
              </Button>
            ) : (
              <CheckInQuickDialog>
                <Button
                  className="h-12 rounded-xl bg-card px-6 font-bold text-primary hover:bg-muted"
                  type="button"
                >
                  Fazer check-in
                </Button>
              </CheckInQuickDialog>
            )
          ) : (
            <Button
              asChild
              className="h-12 rounded-xl bg-card px-6 font-bold text-primary hover:bg-muted"
            >
              <Link href={routes.checkout}>Renovar acesso</Link>
            </Button>
          )}
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        <DashboardMetricCard
          helper={`${data.currentCycle.progressPercent}% do ciclo concluído`}
          icon={CalendarDays}
          label="Ciclo atual"
          value={`Dia ${data.currentCycle.day}/${data.currentCycle.durationDays}`}
        />
        <DashboardMetricCard
          helper="Sequência de presença diária"
          icon={Flame}
          label="Streak"
          value={`${data.streak} dias`}
        />
        <DashboardMetricCard
          helper="Check-ins concluídos nos últimos 7 dias"
          icon={Activity}
          label="Frequência semanal"
          value={`${data.weeklyFrequency.completed}/${data.weeklyFrequency.target}`}
        />
        <DashboardMetricCard
          helper="Janela calculada para o ciclo de 45 dias"
          icon={Timer}
          label="Reavaliação"
          value={`${data.daysUntilReassessment} dias`}
        />
        <DashboardMetricCard
          helper="Vetor FVA prioritário"
          icon={Target}
          label="Foco"
          value={data.currentFocusVector.label}
        />
        <DashboardMetricCard
          helper="Perfil adaptativo atual"
          icon={Sparkles}
          label="Nível"
          value={data.adaptiveLevel}
        />
        <DashboardMetricCard
          helper="Índice composto do ciclo atual"
          icon={Gauge}
          label="SPI"
          value={`${Math.round(data.spi)}%`}
        />
        <DashboardMetricCard
          helper={data.currentPlanSummary.protocolBase}
          icon={Route}
          label="Protocolo"
          value={`Semana ${data.currentWeek}`}
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <VectorEvolutionChart data={data.vectorEvolution} />
        <BodyHistoryChart data={data.bodyMeasurementHistory} />
        <BlockScoresChart data={data.operationalBlockScores} />
        <AdherenceChart data={data.adherenceOverTime} />
      </div>
    </div>
  );
}

function DashboardLoadingState() {
  return (
    <div className="grid gap-6 pb-24 md:pb-8">
      <SectionHeading
        description="Organizando suas informações para mostrar o próximo passo com clareza."
        eyebrow="Seu painel"
        title="Preparando sua visão do dia"
      />
      <Card className="stitch-soft-shadow overflow-hidden rounded-2xl border-0 bg-card">
        <CardContent className="grid gap-4 p-6 md:grid-cols-[auto_1fr] md:items-center">
          <div className="grid size-14 place-items-center rounded-2xl bg-primary/10 text-primary">
            <Sparkles className="size-7 animate-pulse" />
          </div>
          <div>
            <p className="text-base font-semibold text-foreground">Carregando seu painel...</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Em instantes você verá seu ciclo atual, check-in e próximos objetivos.
            </p>
          </div>
        </CardContent>
      </Card>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {loadingCards.map((card) => (
          <div
            className="h-32 animate-pulse rounded-2xl border border-border bg-muted/40"
            key={card}
          />
        ))}
      </div>
    </div>
  );
}
