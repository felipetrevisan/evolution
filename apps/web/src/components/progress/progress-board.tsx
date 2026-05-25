"use client";

import { useDashboard } from "@/hooks/dashboard/use-dashboard";
import { AdherenceChart } from "../dashboard/charts/adherence-chart";
import { BlockScoresChart } from "../dashboard/charts/block-scores-chart";
import { BodyHistoryChart } from "../dashboard/charts/body-history-chart";
import { VectorEvolutionChart } from "../dashboard/charts/vector-evolution-chart";
import { SectionHeading } from "../shared/section-heading";

export function ProgressBoard() {
  const { data } = useDashboard();

  return (
    <div className="grid gap-6 pb-24 md:pb-8">
      <SectionHeading
        description="Veja os principais sinais de evolução do seu ciclo."
        eyebrow="Progressão"
        title="Sinais do ciclo"
      />
      <div className="grid gap-4 xl:grid-cols-2">
        <VectorEvolutionChart data={data?.vectorEvolution ?? []} />
        <BodyHistoryChart data={data?.bodyMeasurementHistory ?? []} />
        <BlockScoresChart data={data?.operationalBlockScores ?? []} />
        <AdherenceChart data={data?.adherenceOverTime ?? []} />
      </div>
    </div>
  );
}
