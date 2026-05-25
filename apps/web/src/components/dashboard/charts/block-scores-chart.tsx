import type { DashboardData } from "@/lib/api-client";
import { formatBlockLabel } from "@/lib/utils/domain-labels";
import { ChartCard } from "./chart-card";

type BlockScoresChartProps = {
  data: DashboardData["operationalBlockScores"];
};

export function BlockScoresChart({ data }: BlockScoresChartProps) {
  return (
    <ChartCard title="Áreas operacionais">
      <div className="grid grid-cols-3 gap-3">
        {["X", "Y", "Z"].map((block) => {
          const score = data.find((item) => item.block === block);

          return (
            <div className="rounded-2xl bg-muted p-4" key={block}>
              <p className="text-sm text-muted-foreground">{formatBlockLabel(block)}</p>
              <p className="mt-2 text-2xl font-semibold">{Math.round(score?.normalized ?? 0)}%</p>
              <p className="mt-1 text-xs text-muted-foreground">{score?.status ?? "Pendente"}</p>
            </div>
          );
        })}
      </div>
    </ChartCard>
  );
}
