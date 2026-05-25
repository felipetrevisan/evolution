import type { DashboardData } from "@/lib/api-client";
import { ChartCard } from "./chart-card";

type AdherenceChartProps = {
  data: DashboardData["adherenceOverTime"];
};

export function AdherenceChart({ data }: AdherenceChartProps) {
  return (
    <ChartCard title="Aderência ao longo do tempo">
      <div className="flex h-44 items-end gap-2">
        {data.length > 0 ? (
          data.slice(-14).map((entry) => (
            <div className="flex flex-1 flex-col items-center gap-2" key={entry.date}>
              <div
                className="w-full rounded-t-xl bg-primary"
                style={{ height: `${Math.max(8, entry.adherence)}%` }}
              />
              <span className="text-[11px] text-muted-foreground">{entry.date.slice(5)}</span>
            </div>
          ))
        ) : (
          <div className="grid h-full flex-1 place-items-center rounded-2xl bg-muted text-sm text-muted-foreground">
            Sem check-ins
          </div>
        )}
      </div>
    </ChartCard>
  );
}
