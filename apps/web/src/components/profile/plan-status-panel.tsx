"use client";

import { Badge, Card, CardContent, CardHeader, CardTitle } from "@evolution/ui";
import { CalendarClock, CheckCircle2, CreditCard, ShieldCheck } from "lucide-react";
import type { UserProfile } from "@/lib/api-client";

type PlanStatusPanelProps = {
  profile?: UserProfile | null;
};

export function PlanStatusPanel({ profile }: PlanStatusPanelProps) {
  const subscription = profile?.subscription;
  const status = subscription?.status ?? "free";

  return (
    <section className="grid gap-5 lg:grid-cols-[1fr_360px]">
      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="size-5 text-primary" />
            Status do plano
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="flex flex-wrap items-center gap-3">
            <Badge>{statusLabel(status)}</Badge>
            {subscription?.planId ? (
              <span className="text-muted-foreground text-sm">Plano: {subscription.planId}</span>
            ) : null}
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <PlanInfo
              icon={ShieldCheck}
              label="Acesso ao sistema"
              value={hasAccess(status) ? "Liberado" : "Aguardando pagamento"}
            />
            <PlanInfo
              icon={CalendarClock}
              label="Próxima renovação"
              value={formatDate(subscription?.currentPeriodEnd)}
            />
          </div>
        </CardContent>
      </Card>

      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle2 className="size-5 text-primary" />
            Informações
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3 text-muted-foreground text-sm">
          <p>
            Seu plano define o acesso ao dashboard, check-in, plano de ação e relatórios de ciclo.
          </p>
          <p>
            Alterações de cobrança e liberação de acesso são gerenciadas pela administração da
            Evolua.
          </p>
        </CardContent>
      </Card>
    </section>
  );
}

function PlanInfo({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof ShieldCheck;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-border bg-muted p-4">
      <Icon className="mb-3 size-5 text-primary" />
      <p className="text-muted-foreground text-xs">{label}</p>
      <p className="mt-1 font-semibold text-foreground text-sm">{value}</p>
    </div>
  );
}

function statusLabel(status: string) {
  const labels: Record<string, string> = {
    active: "Ativo",
    canceled: "Cancelado",
    free: "Gratuito",
    past_due: "Pagamento pendente",
    trialing: "Teste",
  };

  return labels[status] ?? status;
}

function hasAccess(status: string) {
  return status === "active" || status === "trialing";
}

function formatDate(value?: string) {
  if (!value) return "Não definido";

  return new Intl.DateTimeFormat("pt-BR").format(new Date(value));
}
