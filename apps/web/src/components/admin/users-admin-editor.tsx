import { Button } from "@evolution/ui";
import { Save } from "lucide-react";
import type { UserProfile } from "@/lib/api-client";
import { DropdownSelect } from "../shared/dropdown-select";

export type UserEditDraft = {
  currentPeriodEnd: string;
  planId: string;
  role: "user" | "admin";
  status: "free" | "trialing" | "active" | "past_due" | "canceled";
};

const roleOptions = [
  { label: "user", value: "user" },
  { label: "admin", value: "admin" },
] as const;

const subscriptionStatusOptions = [
  { label: "Gratuito", value: "free" },
  { label: "Teste", value: "trialing" },
  { label: "Ativo", value: "active" },
  { label: "Pendente", value: "past_due" },
  { label: "Cancelado", value: "canceled" },
] as const;

export function UserEditor({
  draft,
  onChange,
  onSave,
  saving,
  user,
}: {
  draft: UserEditDraft;
  onChange: (draft: UserEditDraft) => void;
  onSave: () => void;
  saving: boolean;
  user: UserProfile;
}) {
  return (
    <div className="grid gap-4">
      <div className="rounded-xl border border-border bg-muted p-4">
        <p className="font-semibold">{user.name ?? user.email ?? user.uid}</p>
        <p className="text-muted-foreground text-sm">{user.email ?? "Sem e-mail"}</p>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <DropdownSelect
          label="Perfil"
          onChange={(role) => onChange({ ...draft, role })}
          options={roleOptions}
          value={draft.role}
        />
        <DropdownSelect
          label="Status do plano"
          onChange={(status) => onChange({ ...draft, status })}
          options={subscriptionStatusOptions}
          value={draft.status}
        />
      </div>
      <Field
        label="ID do plano"
        onChange={(planId) => onChange({ ...draft, planId })}
        placeholder="annual"
        value={draft.planId}
      />
      <Field
        label="Expira em"
        onChange={(currentPeriodEnd) => onChange({ ...draft, currentPeriodEnd })}
        placeholder="2027-05-25T00:00:00.000Z"
        value={draft.currentPeriodEnd}
      />
      <Button disabled={saving} onClick={onSave} type="button">
        <Save className="size-4" />
        {saving ? "Salvando..." : "Salvar usuário"}
      </Button>
    </div>
  );
}

function Field({
  label,
  onChange,
  placeholder,
  value,
}: {
  label: string;
  onChange: (value: string) => void;
  placeholder?: string;
  value: string;
}) {
  return (
    <label className="grid gap-2 text-sm font-medium">
      {label}
      <input
        className="rounded-lg border border-border bg-muted px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary"
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        value={value}
      />
    </label>
  );
}
