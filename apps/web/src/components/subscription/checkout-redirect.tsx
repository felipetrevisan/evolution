"use client";

import { Button, Card, CardContent, CardHeader, CardTitle } from "@evolution/ui";
import { ExternalLink } from "lucide-react";
import { useEffect, useState } from "react";
import { api, type CheckoutData } from "@/lib/api-client";

export function CheckoutRedirect() {
  const [data, setData] = useState<CheckoutData | null>(null);

  useEffect(() => {
    api.checkout().then((checkout) => {
      setData(checkout);
      if (checkout.checkoutUrl) {
        window.location.href = checkout.checkoutUrl;
      }
    });
  }, []);

  return (
    <Card className="border-border bg-card">
      <CardHeader>
        <CardTitle>Renovar acesso</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4 text-muted-foreground text-sm">
        {!data ? <p>Preparando sua renovação...</p> : null}
        {data?.alreadyActive ? <p>Sua assinatura está ativa.</p> : null}
        {data && !data.checkoutUrl && !data.alreadyActive ? (
          <p>A renovação ainda não está disponível. Fale com o suporte.</p>
        ) : null}
        {data?.checkoutUrl ? (
          <Button asChild className="w-fit cursor-pointer">
            <a href={data.checkoutUrl} rel="noreferrer">
              <ExternalLink className="size-4" />
              Abrir pagamento
            </a>
          </Button>
        ) : null}
      </CardContent>
    </Card>
  );
}
