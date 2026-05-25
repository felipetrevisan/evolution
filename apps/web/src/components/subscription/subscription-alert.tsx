"use client";

import { Button, Card, CardContent } from "@evolution/ui";
import { AlertTriangle, LockKeyhole } from "lucide-react";
import Link from "next/link";
import type { SubscriptionAccess } from "@/lib/api-client";
import { routes } from "@/lib/routes/routes";

export function SubscriptionAlert({ subscription }: { subscription: SubscriptionAccess }) {
  if (
    subscription.status !== "expiring" &&
    subscription.status !== "expired" &&
    subscription.status !== "blocked"
  ) {
    return null;
  }

  const expired = subscription.status === "expired" || subscription.status === "blocked";

  return (
    <Card className="border-border bg-card">
      <CardContent className="flex flex-col gap-4 p-5 md:flex-row md:items-center md:justify-between">
        <div className="flex gap-3">
          <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-destructive/10 text-destructive">
            {expired ? <LockKeyhole className="size-5" /> : <AlertTriangle className="size-5" />}
          </span>
          <div>
            <p className="font-semibold">
              {expired ? "Sua assinatura expirou" : "Sua assinatura está perto de expirar"}
            </p>
            <p className="text-muted-foreground text-sm">
              {expired
                ? "Renove para voltar a usar check-in, plano, relatórios e ações do ciclo."
                : `Faltam ${subscription.daysUntilExpiration ?? 0} dias. Renove para manter seu acesso sem interrupções.`}
            </p>
          </div>
        </div>
        <Button asChild className="cursor-pointer">
          <Link href={routes.checkout}>Renovar acesso</Link>
        </Button>
      </CardContent>
    </Card>
  );
}
