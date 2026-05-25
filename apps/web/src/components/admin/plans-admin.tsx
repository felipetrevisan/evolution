"use client";

import {
  Badge,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@evolution/ui";
import { Edit3, Plus, Save, Trash2, WalletCards } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { api, type SubscriptionPlan } from "@/lib/api-client";
import { DropdownSelect } from "../shared/dropdown-select";

const emptyPlan: SubscriptionPlan = {
  id: "annual",
  name: "Plano Anual",
  priceCents: 99700,
  currency: "BRL",
  interval: "year",
  active: true,
  features: ["Acesso ao onboarding", "Plano de 45 dias", "Dashboard e check-in"],
};

const intervalOptions = [
  { label: "Mensal", value: "month" },
  { label: "Anual", value: "year" },
] as const;

const statusOptions = [
  { label: "Ativo", value: "active" },
  { label: "Inativo", value: "inactive" },
] as const;

export function PlansAdmin() {
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [draft, setDraft] = useState<SubscriptionPlan>(emptyPlan);
  const [modalOpen, setModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    api
      .adminSubscriptionPlans()
      .then(setPlans)
      .catch(() => toast.error("Não foi possível carregar planos."));
  }, []);

  const sortedPlans = useMemo(
    () => [...plans].sort((left, right) => left.name.localeCompare(right.name)),
    [plans],
  );

  async function savePlan() {
    setSaving(true);
    const saveToast = toast.loading("Salvando plano...");

    try {
      const saved = await api.adminSaveSubscriptionPlan(normalizePlan(draft));
      setPlans((current) => [saved, ...current.filter((plan) => plan.id !== saved.id)]);
      setDraft(saved);
      setModalOpen(false);
      toast.success("Plano salvo.", { id: saveToast });
    } catch {
      toast.error("Não foi possível salvar o plano.", { id: saveToast });
    } finally {
      setSaving(false);
    }
  }

  async function deletePlan(plan: SubscriptionPlan) {
    setDeletingId(plan.id);
    const deleteToast = toast.loading("Excluindo plano...");

    try {
      await api.adminDeleteSubscriptionPlan(plan.id);
      setPlans((current) => current.filter((item) => item.id !== plan.id));
      if (draft.id === plan.id) setDraft(emptyPlan);
      toast.success("Plano excluído.", { id: deleteToast });
    } catch {
      toast.error("Não foi possível excluir o plano.", { id: deleteToast });
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <section className="grid gap-6">
      <Card className="border-border bg-card">
        <CardHeader className="gap-4">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <CardTitle className="flex items-center gap-2">
                <WalletCards className="size-5 text-primary" />
                Planos
              </CardTitle>
              <p className="mt-1 text-muted-foreground text-sm">
                Controle os planos comerciais disponíveis para assinatura.
              </p>
            </div>
            <Button
              onClick={() => {
                setDraft(emptyPlan);
                setModalOpen(true);
              }}
              type="button"
              variant="outline"
            >
              <Plus className="size-4" />
              Novo plano
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <PlansTable
            deletingId={deletingId}
            onDelete={deletePlan}
            onEdit={(plan) => {
              setDraft(plan);
              setModalOpen(true);
            }}
            plans={sortedPlans}
            selectedPlanId={draft.id}
          />
        </CardContent>
      </Card>

      <Dialog onOpenChange={setModalOpen} open={modalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Editar plano</DialogTitle>
            <DialogDescription>
              Configure preço, ciclo, status e recursos disponíveis para este plano.
            </DialogDescription>
          </DialogHeader>
          <PlanEditor draft={draft} onChange={setDraft} onSave={savePlan} saving={saving} />
        </DialogContent>
      </Dialog>
    </section>
  );
}

function PlansTable({
  deletingId,
  onDelete,
  onEdit,
  plans,
  selectedPlanId,
}: {
  deletingId: string | null;
  onDelete: (plan: SubscriptionPlan) => void;
  onEdit: (plan: SubscriptionPlan) => void;
  plans: SubscriptionPlan[];
  selectedPlanId: string;
}) {
  return (
    <div className="overflow-hidden rounded-xl border border-border bg-background">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/70 hover:bg-muted/70">
            <TableHead>Plano</TableHead>
            <TableHead className="w-32">Preço</TableHead>
            <TableHead className="w-28">Ciclo</TableHead>
            <TableHead className="w-28">Status</TableHead>
            <TableHead className="w-32 text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {plans.map((plan) => (
            <TableRow
              className="data-[selected=true]:bg-primary/10"
              data-selected={plan.id === selectedPlanId}
              key={plan.id}
            >
              <TableCell>
                <p className="font-semibold">{plan.name}</p>
                <p className="text-muted-foreground text-xs">{plan.id}</p>
                <p className="mt-1 line-clamp-1 text-muted-foreground text-xs">
                  {plan.features.join(" • ")}
                </p>
              </TableCell>
              <TableCell className="font-medium">{formatMoney(plan)}</TableCell>
              <TableCell>{plan.interval === "month" ? "Mensal" : "Anual"}</TableCell>
              <TableCell>
                <Badge className={plan.active ? "bg-primary/10 text-primary" : ""}>
                  {plan.active ? "Ativo" : "Inativo"}
                </Badge>
              </TableCell>
              <TableCell>
                <div className="flex justify-end gap-1">
                  <Button
                    aria-label="Editar plano"
                    onClick={() => onEdit(plan)}
                    size="icon"
                    type="button"
                    variant="ghost"
                  >
                    <Edit3 className="size-4" />
                  </Button>
                  <Button
                    aria-label="Excluir plano"
                    disabled={deletingId === plan.id}
                    onClick={() => onDelete(plan)}
                    size="icon"
                    type="button"
                    variant="ghost"
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {plans.length === 0 ? (
        <p className="p-6 text-center text-muted-foreground text-sm">Nenhum plano cadastrado.</p>
      ) : null}
    </div>
  );
}

function PlanEditor({
  draft,
  onChange,
  onSave,
  saving,
}: {
  draft: SubscriptionPlan;
  onChange: (plan: SubscriptionPlan) => void;
  onSave: () => void;
  saving: boolean;
}) {
  return (
    <div className="grid gap-4">
      <Field label="ID" onChange={(id) => onChange({ ...draft, id })} value={draft.id} />
      <Field label="Nome" onChange={(name) => onChange({ ...draft, name })} value={draft.name} />
      <Field
        inputMode="numeric"
        label="Preço em centavos"
        onChange={(priceCents) => onChange({ ...draft, priceCents: Number(priceCents) })}
        value={String(draft.priceCents)}
      />
      <div className="grid gap-3 sm:grid-cols-2">
        <DropdownSelect
          label="Ciclo"
          onChange={(interval) => onChange({ ...draft, interval })}
          options={intervalOptions}
          value={draft.interval}
        />
        <DropdownSelect
          label="Status"
          onChange={(status) => onChange({ ...draft, active: status === "active" })}
          options={statusOptions}
          value={draft.active ? "active" : "inactive"}
        />
      </div>
      <label className="grid gap-2 text-sm font-medium">
        Recursos
        <textarea
          className="min-h-28 rounded-lg border border-border bg-muted px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary"
          onChange={(event) => onChange({ ...draft, features: parseFeatures(event.target.value) })}
          placeholder="Um recurso por linha"
          value={draft.features.join("\n")}
        />
      </label>
      <Button disabled={saving} onClick={onSave} type="button">
        <Save className="size-4" />
        {saving ? "Salvando..." : "Salvar plano"}
      </Button>
    </div>
  );
}

function Field({
  inputMode,
  label,
  onChange,
  value,
}: {
  inputMode?: "numeric";
  label: string;
  onChange: (value: string) => void;
  value: string;
}) {
  return (
    <label className="grid gap-2 text-sm font-medium">
      {label}
      <input
        className="rounded-lg border border-border bg-muted px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary"
        inputMode={inputMode}
        onChange={(event) => onChange(event.target.value)}
        value={value}
      />
    </label>
  );
}

function normalizePlan(plan: SubscriptionPlan): SubscriptionPlan {
  return {
    ...plan,
    currency: plan.currency.toUpperCase(),
    features: plan.features.map((feature) => feature.trim()).filter(Boolean),
    id: plan.id.trim(),
    name: plan.name.trim(),
    priceCents: Number.isFinite(plan.priceCents) ? plan.priceCents : 0,
  };
}

function parseFeatures(value: string) {
  return value
    .split("\n")
    .map((feature) => feature.trim())
    .filter(Boolean);
}

function formatMoney(plan: SubscriptionPlan) {
  return (plan.priceCents / 100).toLocaleString("pt-BR", {
    style: "currency",
    currency: plan.currency,
  });
}
