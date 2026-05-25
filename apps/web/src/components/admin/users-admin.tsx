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
} from "@evolution/ui";
import { Edit3, Search, ShieldCheck, UserCheck, UsersRound, X } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { api, type UserProfile } from "@/lib/api-client";
import { DropdownSelect } from "../shared/dropdown-select";
import { type UserEditDraft, UserEditor } from "./users-admin-editor";

const subscriptionStatuses = ["free", "trialing", "active", "past_due", "canceled"] as const;
type SubscriptionStatus = (typeof subscriptionStatuses)[number];
type RoleFilter = "all" | "user" | "admin";
type SubscriptionFilter = "all" | SubscriptionStatus;
type AccessFilter = "all" | "enabled" | "blocked";
type SortOption = "recent" | "name_asc" | "name_desc" | "role" | "subscription";

const roleFilterOptions = [
  { label: "Todos os perfis", value: "all" },
  { label: "Usuários", value: "user" },
  { label: "Administradores", value: "admin" },
] as const;
const subscriptionStatusOptions = subscriptionStatuses.map((status) => ({
  label: subscriptionStatusLabel(status),
  value: status,
}));
const subscriptionFilterOptions = [
  { label: "Todos os status", value: "all" },
  ...subscriptionStatusOptions,
] as const;
const accessFilterOptions = [
  { label: "Todos os acessos", value: "all" },
  { label: "Com acesso", value: "enabled" },
  { label: "Sem acesso", value: "blocked" },
] as const;
const sortOptions = [
  { label: "Mais recentes", value: "recent" },
  { label: "Nome A-Z", value: "name_asc" },
  { label: "Nome Z-A", value: "name_desc" },
  { label: "Perfil", value: "role" },
  { label: "Status do plano", value: "subscription" },
] as const;

export function UsersAdmin() {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<RoleFilter>("all");
  const [subscriptionFilter, setSubscriptionFilter] = useState<SubscriptionFilter>("all");
  const [accessFilter, setAccessFilter] = useState<AccessFilter>("all");
  const [sort, setSort] = useState<SortOption>("recent");
  const [editingUser, setEditingUser] = useState<UserProfile | null>(null);
  const [draft, setDraft] = useState<UserEditDraft | null>(null);
  const [savingUser, setSavingUser] = useState(false);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      setUsers(await api.adminUsers());
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh().catch(() => toast.error("Não foi possível carregar usuários."));
  }, [refresh]);

  function openUserEditor(user: UserProfile) {
    setEditingUser(user);
    setDraft({
      currentPeriodEnd: user.subscription?.currentPeriodEnd ?? "",
      planId: user.subscription?.planId ?? "",
      role: user.role ?? "user",
      status: user.subscription?.status ?? "free",
    });
  }

  async function updateUser(user: UserProfile) {
    if (!draft) return;

    setSavingUser(true);
    const saveToast = toast.loading("Salvando usuário...");
    const patch = {
      role: draft.role,
      subscription: {
        ...user.subscription,
        status: draft.status,
        ...(draft.currentPeriodEnd ? { currentPeriodEnd: draft.currentPeriodEnd } : {}),
        ...(draft.planId ? { planId: draft.planId } : {}),
      },
    };

    try {
      const updated = await api.adminUpdateUser(user.uid, patch);
      setUsers((current) => current.map((item) => (item.uid === user.uid ? updated : item)));
      setEditingUser(null);
      setDraft(null);
      toast.success("Usuário atualizado.", { id: saveToast });
    } catch {
      toast.error("Não foi possível salvar o usuário.", { id: saveToast });
    } finally {
      setSavingUser(false);
    }
  }

  const filteredUsers = useMemo(
    () => filterUsers(users, { accessFilter, query, roleFilter, sort, subscriptionFilter }),
    [accessFilter, query, roleFilter, sort, subscriptionFilter, users],
  );
  const activeUsers = users.filter((user) => hasAccess(user.subscription?.status)).length;
  const adminUsers = users.filter((user) => user.role === "admin").length;

  return (
    <section className="grid gap-5">
      <div className="grid gap-4 md:grid-cols-3">
        <UserMetric
          icon={UsersRound}
          label="Total"
          value={String(users.length)}
          description="Contas cadastradas"
        />
        <UserMetric
          icon={UserCheck}
          label="Com acesso"
          value={String(activeUsers)}
          description="Planos ativos ou em teste"
        />
        <UserMetric
          icon={ShieldCheck}
          label="Admins"
          value={String(adminUsers)}
          description="Usuários administrativos"
        />
      </div>

      <Card className="border-border bg-card">
        <CardHeader className="gap-4">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <CardTitle>Usuários</CardTitle>
              <p className="mt-1 text-muted-foreground text-sm">
                Filtre, organize e gerencie permissões e acesso comercial.
              </p>
            </div>
            <Button className="cursor-pointer" onClick={refresh} type="button" variant="outline">
              Recarregar
            </Button>
          </div>
          <div className="grid gap-3 rounded-2xl border border-border bg-muted p-4 lg:grid-cols-[1.4fr_repeat(4,1fr)_auto]">
            <label className="grid gap-2 text-sm font-medium">
              Buscar
              <span className="flex h-10 items-center gap-2 rounded-md border border-border bg-card px-3">
                <Search className="size-4 text-muted-foreground" />
                <input
                  className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Nome, e-mail ou UID"
                  type="search"
                  value={query}
                />
              </span>
            </label>
            <DropdownSelect
              label="Perfil"
              onChange={setRoleFilter}
              options={roleFilterOptions}
              value={roleFilter}
            />
            <DropdownSelect
              label="Status"
              onChange={setSubscriptionFilter}
              options={subscriptionFilterOptions}
              value={subscriptionFilter}
            />
            <DropdownSelect
              label="Acesso"
              onChange={setAccessFilter}
              options={accessFilterOptions}
              value={accessFilter}
            />
            <DropdownSelect label="Ordenar" onChange={setSort} options={sortOptions} value={sort} />
            <Button
              className="self-end cursor-pointer"
              onClick={() => {
                setQuery("");
                setRoleFilter("all");
                setSubscriptionFilter("all");
                setAccessFilter("all");
                setSort("recent");
              }}
              type="button"
              variant="ghost"
            >
              <X className="size-4" />
              Limpar
            </Button>
          </div>
          <p className="text-muted-foreground text-sm">
            Exibindo {filteredUsers.length} de {users.length} usuários.
          </p>
        </CardHeader>
        <CardContent className="grid gap-3">
          {loading ? <p className="text-sm text-muted-foreground">Carregando...</p> : null}
          {!loading && filteredUsers.length === 0 ? (
            <div className="rounded-xl border border-border bg-muted p-6 text-sm text-muted-foreground">
              Nenhum usuário encontrado com os filtros atuais.
            </div>
          ) : null}
          {filteredUsers.map((user) => (
            <UserRow key={user.uid} onEdit={openUserEditor} user={user} />
          ))}
        </CardContent>
      </Card>

      <Dialog
        onOpenChange={(open) => {
          if (!open) {
            setEditingUser(null);
            setDraft(null);
          }
        }}
        open={Boolean(editingUser)}
      >
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>Editar usuário</DialogTitle>
            <DialogDescription>
              Ajuste permissões e status comercial da conta selecionada.
            </DialogDescription>
          </DialogHeader>
          {editingUser && draft ? (
            <UserEditor
              draft={draft}
              onChange={setDraft}
              onSave={() => updateUser(editingUser)}
              saving={savingUser}
              user={editingUser}
            />
          ) : null}
        </DialogContent>
      </Dialog>
    </section>
  );
}

function UserRow({ onEdit, user }: { onEdit: (user: UserProfile) => void; user: UserProfile }) {
  const status = user.subscription?.status ?? "free";

  return (
    <div className="grid gap-4 rounded-xl border border-border bg-muted p-4 xl:grid-cols-[1fr_140px_150px_auto]">
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <p className="truncate font-semibold">{user.name ?? user.email ?? user.uid}</p>
          <Badge className={statusBadgeClass(status)}>{subscriptionStatusLabel(status)}</Badge>
          {user.role === "admin" ? (
            <Badge className="bg-primary/10 text-primary">admin</Badge>
          ) : null}
        </div>
        <p className="truncate text-muted-foreground text-sm">{user.email ?? "Sem e-mail"}</p>
        <p className="truncate text-muted-foreground text-xs">{user.uid}</p>
      </div>
      <div>
        <p className="text-muted-foreground text-xs font-medium uppercase tracking-wide">Perfil</p>
        <p className="mt-1 font-medium text-sm">{user.role ?? "user"}</p>
      </div>
      <div>
        <p className="text-muted-foreground text-xs font-medium uppercase tracking-wide">Status</p>
        <p className="mt-1 font-medium text-sm">{subscriptionStatusLabel(status)}</p>
      </div>
      <Button className="self-center" onClick={() => onEdit(user)} type="button" variant="outline">
        <Edit3 className="size-4" />
        Editar
      </Button>
    </div>
  );
}

function UserMetric({
  description,
  icon: Icon,
  label,
  value,
}: {
  description: string;
  icon: typeof UsersRound;
  label: string;
  value: string;
}) {
  return (
    <Card className="border-border bg-card">
      <CardContent className="flex gap-4 p-5">
        <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-secondary text-secondary-foreground">
          <Icon className="size-5" />
        </span>
        <div>
          <p className="text-muted-foreground text-xs font-medium uppercase tracking-wide">
            {label}
          </p>
          <p className="mt-1 text-2xl font-semibold">{value}</p>
          <p className="text-muted-foreground text-sm">{description}</p>
        </div>
      </CardContent>
    </Card>
  );
}

function filterUsers(
  users: UserProfile[],
  filters: {
    accessFilter: AccessFilter;
    query: string;
    roleFilter: RoleFilter;
    sort: SortOption;
    subscriptionFilter: SubscriptionFilter;
  },
) {
  const normalizedQuery = filters.query.trim().toLowerCase();

  return users
    .filter((user) => {
      const status = user.subscription?.status ?? "free";
      const searchable = [user.name, user.email, user.uid, user.subscription?.planId]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return (
        (!normalizedQuery || searchable.includes(normalizedQuery)) &&
        (filters.roleFilter === "all" || (user.role ?? "user") === filters.roleFilter) &&
        (filters.subscriptionFilter === "all" || status === filters.subscriptionFilter) &&
        (filters.accessFilter === "all" ||
          (filters.accessFilter === "enabled" ? hasAccess(status) : !hasAccess(status)))
      );
    })
    .sort((left, right) => compareUsers(left, right, filters.sort));
}

function compareUsers(left: UserProfile, right: UserProfile, sort: SortOption) {
  if (sort === "name_asc") return getUserLabel(left).localeCompare(getUserLabel(right));
  if (sort === "name_desc") return getUserLabel(right).localeCompare(getUserLabel(left));
  if (sort === "role") return (left.role ?? "user").localeCompare(right.role ?? "user");
  if (sort === "subscription") {
    return (left.subscription?.status ?? "free").localeCompare(
      right.subscription?.status ?? "free",
    );
  }

  return 0;
}

function getUserLabel(user: UserProfile) {
  return user.name ?? user.email ?? user.uid;
}

function hasAccess(status?: string) {
  return status === "active" || status === "trialing";
}

function subscriptionStatusLabel(status: string) {
  const labels: Record<string, string> = {
    active: "Ativo",
    canceled: "Cancelado",
    free: "Gratuito",
    past_due: "Pendente",
    trialing: "Teste",
  };

  return labels[status] ?? status;
}

function statusBadgeClass(status: string) {
  if (status === "active" || status === "trialing")
    return "border-primary/30 bg-primary/10 text-primary";
  if (status === "past_due") return "border-tertiary/30 bg-tertiary/20 text-tertiary-foreground";
  if (status === "canceled") return "border-destructive/30 bg-destructive/10 text-destructive";
  return "bg-card text-muted-foreground";
}
