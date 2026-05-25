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
    <Card className="stitch-glass-card stitch-soft-shadow rounded-[24px] border-0">
      <CardContent className="grid gap-4 p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="grid gap-1">
            <p className="text-sm font-medium text-muted-foreground">{label}</p>
            <p className="text-3xl font-semibold tracking-normal">{value}</p>
          </div>
          <span className="rounded-full bg-secondary p-2.5 text-primary">
            <Icon className="size-4" />
          </span>
        </div>
        <p className="text-sm leading-6 text-muted-foreground">{helper}</p>
      </CardContent>
    </Card>
  );
}
