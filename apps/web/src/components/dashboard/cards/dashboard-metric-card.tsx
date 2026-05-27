import { Card, CardContent } from "@evolution/ui";
import type { LucideIcon } from "lucide-react";

type DashboardMetricCardProps = {
  icon: LucideIcon;
  label: string;
  value: string;
  helper: string;
};

export function DashboardMetricCard({
  icon: Icon,
  label,
  value,
  helper,
}: DashboardMetricCardProps) {
  return (
    <Card className="stitch-glass-card rounded-[24px] border border-border/20 transition hover:-translate-y-1 hover:shadow-[0_12px_36px_-12px_rgba(107,72,169,0.25)]">
      <CardContent className="grid gap-4 p-6">
        <div className="flex items-start justify-between gap-3">
          <div className="grid gap-1">
            <p className="text-sm font-medium text-muted-foreground">{label}</p>
            <p className="text-3xl font-semibold tracking-normal">{value}</p>
          </div>
          <span className="rounded-full bg-secondary p-3 text-primary">
            <Icon className="size-4" />
          </span>
        </div>
        <p className="text-sm leading-6 text-muted-foreground">{helper}</p>
      </CardContent>
    </Card>
  );
}
