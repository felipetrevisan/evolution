import { Card, CardContent } from "@evolution/ui";

export function TriageMetric({ label, value }: { label: string; value: string }) {
  return (
    <Card className="border-border bg-card">
      <CardContent className="p-5">
        <p className="text-muted-foreground text-xs font-medium uppercase tracking-wide">{label}</p>
        <p className="mt-1 text-2xl font-semibold">{value}</p>
      </CardContent>
    </Card>
  );
}
