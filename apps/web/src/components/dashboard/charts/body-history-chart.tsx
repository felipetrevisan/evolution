import type { DashboardData } from "@/lib/api-client";
import { ChartCard } from "./chart-card";

type BodyHistoryChartProps = {
  data: DashboardData["bodyMeasurementHistory"];
};

export function BodyHistoryChart({ data }: BodyHistoryChartProps) {
  return (
    <ChartCard title="Histórico corporal e IMC">
      <div className="flex h-44 items-end gap-2">
        {data.length > 0 ? (
          data.map((entry) => (
            <div className="flex flex-1 flex-col items-center gap-2" key={entry.date}>
              <div
                className="w-full rounded-t-xl bg-tertiary"
                style={{ height: `${Math.max(12, Math.min(100, (entry.bmi ?? 20) * 2))}%` }}
              />
              <span className="text-[11px] text-muted-foreground">{entry.date.slice(5)}</span>
            </div>
          ))
        ) : (
          <div className="grid h-full flex-1 place-items-center rounded-2xl bg-muted text-sm text-muted-foreground">
            Sem medidas registradas
          </div>
        )}
      </div>
    </ChartCard>
  );
}
