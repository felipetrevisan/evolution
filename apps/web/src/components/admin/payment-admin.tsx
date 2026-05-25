"use client";

import { Button, Card, CardContent, CardHeader, CardTitle } from "@evolution/ui";
import { ExternalLink, Save, WalletCards } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { api, type PaymentProviderConfig } from "@/lib/api-client";
import { DropdownSelect } from "../shared/dropdown-select";

const providerOptions = [{ label: "Hotmart", value: "hotmart" }] as const;
const statusOptions = [
  { label: "Ativo", value: "active" },
  { label: "Inativo", value: "inactive" },
] as const;

export function PaymentAdmin() {
  const [config, setConfig] = useState<PaymentProviderConfig>({
    active: true,
    checkoutUrl: "",
    hottok: "",
    provider: "hotmart",
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api
      .adminPaymentProvider()
      .then((provider) => {
        if (provider) setConfig(provider);
      })
      .catch(() => toast.error("Não foi possível carregar a configuração de pagamento."));
  }, []);

  async function save() {
    setSaving(true);
    const saveToast = toast.loading("Salvando configuração...");

    try {
      const saved = await api.adminSavePaymentProvider(config);
      setConfig(saved);
      toast.success("Configuração salva.", { id: saveToast });
    } catch {
      toast.error("Não foi possível salvar.", { id: saveToast });
    } finally {
      setSaving(false);
    }
  }

  return (
    <section className="grid gap-6 lg:grid-cols-[1fr_360px]">
      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <WalletCards className="size-5 text-primary" />
            Provedor de pagamento
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4">
          <DropdownSelect
            label="Provedor"
            onChange={(provider) => setConfig((current) => ({ ...current, provider }))}
            options={providerOptions}
            value={config.provider}
          />
          <DropdownSelect
            label="Status"
            onChange={(status) =>
              setConfig((current) => ({ ...current, active: status === "active" }))
            }
            options={statusOptions}
            value={config.active ? "active" : "inactive"}
          />
          <label className="grid gap-2 text-sm font-medium">
            Página de pagamento
            <input
              className="rounded-lg border border-border bg-muted px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary"
              onChange={(event) =>
                setConfig((current) => ({ ...current, checkoutUrl: event.target.value }))
              }
              placeholder="https://pay.hotmart.com/..."
              type="url"
              value={config.checkoutUrl}
            />
          </label>
          <label className="grid gap-2 text-sm font-medium">
            Token de verificação
            <input
              className="rounded-lg border border-border bg-muted px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary"
              onChange={(event) =>
                setConfig((current) => ({ ...current, hottok: event.target.value }))
              }
              placeholder="Cole o Hottok configurado na Hotmart"
              type="password"
              value={config.hottok ?? ""}
            />
          </label>
          <div className="rounded-2xl bg-muted p-4 text-muted-foreground text-sm">
            <p className="font-medium text-foreground">URL para configurar na Hotmart</p>
            <p className="mt-2 break-all">{apiWebhookUrl()}</p>
          </div>
          <Button className="w-fit cursor-pointer" disabled={saving} onClick={save} type="button">
            <Save className="size-4" />
            {saving ? "Salvando..." : "Salvar pagamento"}
          </Button>
        </CardContent>
      </Card>

      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle>Como funciona</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3 text-muted-foreground text-sm">
          <p>A pessoa será enviada para a página configurada quando precisar renovar.</p>
          <p>
            O acesso é liberado automaticamente quando a compra aprovada chega pela confirmação de
            pagamento.
          </p>
          {config.checkoutUrl ? (
            <Button asChild className="mt-2 cursor-pointer" type="button" variant="outline">
              <a href={config.checkoutUrl} rel="noreferrer" target="_blank">
                <ExternalLink className="size-4" />
                Abrir página
              </a>
            </Button>
          ) : null}
        </CardContent>
      </Card>
    </section>
  );
}

function apiWebhookUrl() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";
  return `${apiUrl}/webhooks/hotmart`;
}
