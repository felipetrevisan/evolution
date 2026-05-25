import { Card, CardContent, CardHeader, CardTitle } from "@evolution/ui";
import type { LucideIcon } from "lucide-react";

type MetricCardProps = {
  icon: LucideIcon;
  label: string;
  value: string;
  helper?: string;
};

export function MetricCard({ icon: Icon, label, value, helper }: MetricCardProps) {
  return (
    <Card className="stitch-glass-card stitch-soft-shadow rounded-[24px] border-0">
      <CardHeader>
        <div className="flex items-center justify-between gap-3">
          <CardTitle className="text-sm text-muted-foreground">{label}</CardTitle>
          <span className="rounded-full bg-secondary p-2 text-primary">
            <Icon className="size-4" />
          </span>
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="text-3xl font-semibold">{value}</div>
        {helper ? <p className="text-sm text-muted-foreground">{helper}</p> : null}
      </CardContent>
    </Card>
  );
}
