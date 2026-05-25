"use client";

import { Bell, CalendarCheck, Check, Monitor, Moon, Settings, Sun, UserRound } from "lucide-react";
import Link from "next/link";
import { useDashboard } from "@/hooks/dashboard/use-dashboard";
import { routes } from "@/lib/routes/routes";
import { useTheme } from "@/providers/theme-provider";

type HeaderMenuProps = {
  open: boolean;
  onClose: () => void;
  onToggle: () => void;
};

export function HeaderNotifications({ open, onClose, onToggle }: HeaderMenuProps) {
  const { data } = useDashboard();
  const notifications = buildNotifications(data);

  return (
    <div className="relative">
      <button
        aria-expanded={open}
        aria-haspopup="menu"
        aria-label="Notificações"
        className="relative cursor-pointer rounded-full p-2 text-muted-foreground transition hover:bg-muted hover:text-primary"
        onClick={onToggle}
        type="button"
      >
        <Bell className="size-5" />
        {notifications.length > 0 ? (
          <span className="-right-0.5 -top-0.5 absolute size-2.5 rounded-full bg-primary" />
        ) : null}
      </button>
      {open ? (
        <div
          className="absolute right-0 top-11 z-50 w-80 overflow-hidden rounded-xl border border-border bg-card text-card-foreground shadow-xl shadow-primary/10"
          role="menu"
        >
          <div className="border-b border-border px-4 py-3">
            <p className="font-semibold">Notificações</p>
            <p className="text-xs text-muted-foreground">Alertas do seu ciclo atual</p>
          </div>
          <div className="grid max-h-96 gap-1 p-2">
            {notifications.length > 0 ? (
              notifications.map((notification) => (
                <Link
                  className="grid gap-1 rounded-lg px-3 py-2 text-sm transition hover:bg-muted"
                  href={notification.href}
                  key={notification.id}
                  onClick={onClose}
                  role="menuitem"
                >
                  <span className="font-medium">{notification.title}</span>
                  <span className="text-muted-foreground text-xs">{notification.description}</span>
                </Link>
              ))
            ) : (
              <div className="grid place-items-center gap-2 px-4 py-8 text-center text-sm text-muted-foreground">
                <Check className="size-5 text-primary" />
                Nenhuma pendência no momento.
              </div>
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
}

export function HeaderSettings({ open, onClose, onToggle }: HeaderMenuProps) {
  const { preference, setPreference } = useTheme();

  function changeTheme(nextPreference: typeof preference) {
    setPreference(nextPreference);
    onClose();
  }

  return (
    <div className="relative">
      <button
        aria-expanded={open}
        aria-haspopup="menu"
        aria-label="Configurações"
        className="cursor-pointer rounded-full p-2 text-muted-foreground transition hover:bg-muted hover:text-primary"
        onClick={onToggle}
        type="button"
      >
        <Settings className="size-5" />
      </button>
      {open ? (
        <div
          className="absolute right-0 top-11 z-50 w-72 overflow-hidden rounded-xl border border-border bg-card p-2 text-card-foreground shadow-xl shadow-primary/10"
          role="menu"
        >
          <Link
            className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition hover:bg-muted hover:text-primary"
            href={routes.profile}
            onClick={onClose}
            role="menuitem"
          >
            <UserRound className="size-4" />
            Conta e perfil
          </Link>
          <Link
            className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition hover:bg-muted hover:text-primary"
            href={routes.checkIn}
            onClick={onClose}
            role="menuitem"
          >
            <CalendarCheck className="size-4" />
            Check-in de hoje
          </Link>
          <div className="my-2 border-t border-border pt-2">
            <p className="px-3 pb-2 text-muted-foreground text-xs font-semibold">Tema</p>
            <ThemeOption
              active={preference === "system"}
              icon={Monitor}
              label="Sistema"
              onClick={() => changeTheme("system")}
            />
            <ThemeOption
              active={preference === "light"}
              icon={Sun}
              label="Claro"
              onClick={() => changeTheme("light")}
            />
            <ThemeOption
              active={preference === "dark"}
              icon={Moon}
              label="Escuro"
              onClick={() => changeTheme("dark")}
            />
          </div>
        </div>
      ) : null}
    </div>
  );
}

function ThemeOption({
  active,
  icon: Icon,
  label,
  onClick,
}: {
  active: boolean;
  icon: typeof Monitor;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      aria-pressed={active}
      className={`flex w-full cursor-pointer items-center justify-between rounded-lg px-3 py-2.5 text-left text-sm font-medium transition ${
        active ? "bg-secondary text-secondary-foreground" : "text-muted-foreground hover:bg-muted"
      }`}
      onClick={onClick}
      type="button"
    >
      <span className="flex items-center gap-3">
        <Icon className="size-4" />
        {label}
      </span>
      {active ? <span className="size-2 rounded-full bg-primary" /> : null}
    </button>
  );
}

function buildNotifications(data: ReturnType<typeof useDashboard>["data"]) {
  if (!data) return [];

  return [
    ...(data.subscription.status === "expiring"
      ? [
          {
            id: "subscription-expiring",
            title: "Assinatura perto de expirar",
            description: `Faltam ${data.subscription.daysUntilExpiration ?? 0} dias para renovar.`,
            href: routes.checkout,
          },
        ]
      : []),
    ...(data.subscription.status === "expired" || data.subscription.status === "blocked"
      ? [
          {
            id: "subscription-expired",
            title: "Assinatura expirada",
            description: "Renove para voltar a usar sua jornada.",
            href: routes.checkout,
          },
        ]
      : []),
    ...(!data.checkInStatus.completedToday
      ? [
          {
            id: "check-in",
            title: "Check-in pendente",
            description: "Registre sua presença de hoje.",
            href: routes.checkIn,
          },
        ]
      : []),
    ...(data.daysUntilReassessment <= 3
      ? [
          {
            id: "cycle-report",
            title: "Reavaliação próxima",
            description: `Faltam ${data.daysUntilReassessment} dias para o fechamento do ciclo.`,
            href: routes.cycleReport,
          },
        ]
      : []),
  ];
}
