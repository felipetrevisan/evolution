import { Card, CardContent, CardHeader, CardTitle } from "@evolution/ui";

type SimplePageCardProps = {
  title: string;
  description: string;
};

export function SimplePageCard({ title, description }: SimplePageCardProps) {
  return (
    <Card className="stitch-glass-card stitch-soft-shadow rounded-[16px] border-0">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
}
