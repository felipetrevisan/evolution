import type { DashboardData } from "@/lib/api-client";
import { ChartCard } from "./chart-card";

type VectorEvolutionChartProps = {
  data: DashboardData["vectorEvolution"];
};

export function VectorEvolutionChart({ data }: VectorEvolutionChartProps) {
  return (
    <ChartCard title="Evolução vetorial">
      <div className="grid gap-4">
        {data.map((item) => (
          <div className="grid gap-2" key={item.vector}>
            <div className="flex items-center justify-between gap-3 text-sm">
              <span className="font-medium">{item.label}</span>
              <span className="text-muted-foreground">
                FVA {item.fva}% · IM {item.im}%
              </span>
            </div>
            <div className="grid gap-1">
              <div className="h-2 rounded-full bg-muted">
                <div
                  className="h-2 rounded-full bg-primary"
                  style={{ width: `${Math.min(100, item.fva)}%` }}
                />
              </div>
              <div className="h-2 rounded-full bg-muted">
                <div
                  className="h-2 rounded-full bg-tertiary"
                  style={{ width: `${Math.min(100, item.im)}%` }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </ChartCard>
  );
}
