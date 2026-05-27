"use client";

import {
  BarChart3,
  CalendarCheck,
  ChevronLeft,
  FileText,
  HelpCircle,
  Home,
  LogOut,
  PanelLeftClose,
  PanelLeftOpen,
  Route,
  Shield,
  Sparkles,
  UserRound,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { adminNavItems } from "@/components/admin/admin-layout";
import { useAuthActions } from "@/hooks/auth/use-auth-actions";
import { routes } from "@/lib/routes/routes";
import { EvolutionMark } from "./evolution-mark";

const items = [
  { href: routes.dashboard, label: "Início", icon: Home },
  { href: routes.anamnesis, label: "Minha Jornada", icon: Sparkles, section: "onboarding" },
  { href: routes.plan, label: "Plano", icon: Route },
  { href: routes.progression, label: "Progresso", icon: BarChart3 },
  { href: routes.checkIn, label: "Check-in", icon: CalendarCheck },
  { href: routes.cycleReport, label: "Relatório", icon: FileText },
  { href: routes.profile, label: "Perfil", icon: UserRound },
];

export function AppSidebar({
  collapsed,
  onToggleCollapsed,
}: {
  collapsed: boolean;
  onToggleCollapsed: () => void;
}) {
  const pathname = usePathname();
  const { signout } = useAuthActions();
  const isAdminArea = pathname.startsWith(routes.admin);
  const visibleItems = isAdminArea
    ? [{ href: routes.admin, label: "Visão geral", icon: Shield }, ...adminNavItems]
    : [...items, { href: routes.admin, label: "Admin", icon: Shield }];

  return (
    <aside
      className={`fixed left-0 top-0 z-30 hidden h-screen flex-col bg-surface-container-low px-4 py-6 transition-[width] duration-200 md:flex ${
        collapsed ? "w-20" : "w-64"
      }`}
    >
      <div className="mb-8 flex items-center justify-between gap-2">
        <EvolutionMark showText={!collapsed} />
        <button
          aria-label={collapsed ? "Expandir menu" : "Recolher menu"}
          className="grid size-9 shrink-0 cursor-pointer place-items-center rounded-lg text-muted-foreground transition hover:bg-secondary/70 hover:text-primary active:scale-95"
          onClick={onToggleCollapsed}
          type="button"
        >
          {collapsed ? <PanelLeftOpen className="size-5" /> : <PanelLeftClose className="size-5" />}
        </button>
      </div>
      {isAdminArea && !collapsed ? (
        <div className="mb-5 rounded-[24px] border border-border/40 bg-card/80 p-4 text-card-foreground">
          <p className="text-muted-foreground text-xs font-medium uppercase tracking-wide">
            Administração
          </p>
          <p className="mt-1 font-semibold">Painel Evolua</p>
        </div>
      ) : null}
      <nav className="grid flex-1 content-start gap-2">
        {visibleItems.map((item) => (
          <SidebarLink
            active={
              "section" in item && item.section === "onboarding"
                ? pathname.startsWith("/onboarding")
                : pathname === item.href || pathname.startsWith(`${item.href}/`)
            }
            collapsed={collapsed}
            href={item.href}
            icon={item.icon}
            key={item.href}
            label={item.label}
          />
        ))}
      </nav>
      <div className="grid gap-2 border-t border-border/40 pt-4">
        {isAdminArea ? (
          <SidebarLink
            collapsed={collapsed}
            href={routes.dashboard}
            icon={ChevronLeft}
            label="Voltar ao app"
          />
        ) : (
          <SidebarLink collapsed={collapsed} href="#" icon={HelpCircle} label="Centro de Ajuda" />
        )}
        <SidebarAction collapsed={collapsed} icon={LogOut} label="Sair" onClick={signout} />
      </div>
    </aside>
  );
}

function SidebarLink({
  active,
  collapsed,
  href,
  icon: Icon,
  label,
}: {
  active?: boolean;
  collapsed: boolean;
  href: string;
  icon: typeof Home;
  label: string;
}) {
  return (
    <Link
      className={`flex items-center gap-4 rounded-lg py-3 text-sm transition active:scale-95 ${
        active
          ? "border-r-4 border-primary bg-secondary/70 font-bold text-primary"
          : "text-muted-foreground hover:bg-secondary/60 hover:text-primary"
      } ${collapsed ? "justify-center px-0" : "px-4"}`}
      href={href}
      title={collapsed ? label : undefined}
    >
      <Icon className="size-5 shrink-0" />
      {collapsed ? null : <span>{label}</span>}
    </Link>
  );
}

function SidebarAction({
  collapsed,
  icon: Icon,
  label,
  onClick,
}: {
  collapsed: boolean;
  icon: typeof Home;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      className={`flex items-center gap-4 rounded-lg py-3 text-left text-sm text-muted-foreground transition hover:bg-secondary/70 hover:text-primary active:scale-95 ${
        collapsed ? "justify-center px-0" : "px-4"
      }`}
      onClick={onClick}
      title={collapsed ? label : undefined}
      type="button"
    >
      <Icon className="size-5 shrink-0" />
      {collapsed ? null : <span>{label}</span>}
    </button>
  );
}
