import { Card, CardContent, CardHeader, CardTitle } from "@evolution/ui";
import type { ReactNode } from "react";

type ChartCardProps = {
  title: string;
  children: ReactNode;
};

export function ChartCard({ title, children }: ChartCardProps) {
  return (
    <Card className="stitch-soft-shadow rounded-[24px] border-0 bg-card">
      <CardHeader>
        <CardTitle className="text-base">{title}</CardTitle>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}
