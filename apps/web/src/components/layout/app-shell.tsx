"use client";

import { Camera, ChevronDown, KeyRound, LogOut, Monitor, Moon, Sun, UserRound } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { type ReactNode, useEffect, useRef, useState } from "react";
import { useAuthActions } from "@/hooks/auth/use-auth-actions";
import { routes } from "@/lib/routes/routes";
import { useAuth } from "@/providers/auth-provider";
import { useTheme } from "@/providers/theme-provider";
import { RouteGuard } from "../auth/route-guard";
import { AppSidebar } from "../navigation/app-sidebar";
import { MobileNav } from "../navigation/mobile-nav";
import { HeaderNotifications, HeaderSettings } from "./header-actions";
import { HeaderSearch } from "./header-search";
import { PageTransition } from "./page-transition";

type HeaderMenu = "notifications" | "settings" | "user" | null;

export function AppShell({ children }: { children: ReactNode }) {
  const [openMenu, setOpenMenu] = useState<HeaderMenu>(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const headerMenusRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setSidebarCollapsed(localStorage.getItem("evolution:sidebar-collapsed") === "true");
  }, []);

  useEffect(() => {
    function closeOnOutsideClick(event: MouseEvent) {
      if (!headerMenusRef.current?.contains(event.target as Node)) {
        setOpenMenu(null);
      }
    }

    document.addEventListener("mousedown", closeOnOutsideClick);
    return () => document.removeEventListener("mousedown", closeOnOutsideClick);
  }, []);

  function toggleMenu(menu: Exclude<HeaderMenu, null>) {
    setOpenMenu((currentMenu) => (currentMenu === menu ? null : menu));
  }

  function toggleSidebar() {
    setSidebarCollapsed((current) => {
      const next = !current;
      localStorage.setItem("evolution:sidebar-collapsed", String(next));
      return next;
    });
  }

  return (
    <main className="min-h-screen bg-background text-foreground">
      <MobileNav />
      <AppSidebar collapsed={sidebarCollapsed} onToggleCollapsed={toggleSidebar} />
      <div
        className={`min-h-screen transition-[margin] duration-200 ${sidebarCollapsed ? "md:ml-20" : "md:ml-64"}`}
      >
        <header className="sticky top-0 z-20 hidden h-16 items-center justify-between bg-background/80 px-6 shadow-sm backdrop-blur-md md:flex">
          <HeaderSearch />
          <div className="flex items-center gap-4" ref={headerMenusRef}>
            <HeaderNotifications
              onClose={() => setOpenMenu(null)}
              onToggle={() => toggleMenu("notifications")}
              open={openMenu === "notifications"}
            />
            <HeaderSettings
              onClose={() => setOpenMenu(null)}
              onToggle={() => toggleMenu("settings")}
              open={openMenu === "settings"}
            />
            <UserMenu
              onClose={() => setOpenMenu(null)}
              onToggle={() => toggleMenu("user")}
              open={openMenu === "user"}
            />
          </div>
        </header>
        <section className="mx-auto min-w-0 px-4 py-6 pb-24 md:px-8 md:py-8">
          <PageTransition>
            <RouteGuard>{children}</RouteGuard>
          </PageTransition>
        </section>
      </div>
    </main>
  );
}

function UserMenu({
  onClose,
  onToggle,
  open,
}: {
  onClose: () => void;
  onToggle: () => void;
  open: boolean;
}) {
  const { user } = useAuth();
  const { signout } = useAuthActions();
  const { preference, setPreference } = useTheme();
  const label = getUserLabel(user?.displayName, user?.email);
  const initials = getInitials(label);

  function changeTheme(nextPreference: typeof preference) {
    setPreference(nextPreference);
    onClose();
  }

  async function handleSignout() {
    onClose();
    await signout();
  }

  return (
    <div className="relative">
      <motion.button
        aria-expanded={open}
        aria-haspopup="menu"
        className="flex cursor-pointer items-center gap-2 rounded-full border border-border bg-card p-1 pr-3 text-sm font-semibold text-card-foreground shadow-sm transition hover:bg-muted"
        onClick={onToggle}
        type="button"
        whileTap={{ scale: 0.97 }}
      >
        <UserAvatar initials={initials} photoUrl={user?.photoURL ?? null} />
        <ChevronDown
          className={`size-4 text-muted-foreground transition ${open ? "rotate-180" : ""}`}
        />
      </motion.button>

      <AnimatePresence>
        {open ? (
          <motion.div
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="absolute right-0 top-12 z-50 w-72 origin-top-right overflow-hidden rounded-xl border border-border/70 bg-card p-2 text-card-foreground shadow-xl shadow-primary/10"
            exit={{ opacity: 0, scale: 0.98, y: -6 }}
            initial={{ opacity: 0, scale: 0.98, y: -6 }}
            role="menu"
            transition={{ duration: 0.16, ease: "easeOut" }}
          >
            <div className="border-b border-border/50 px-3 py-3">
              <p className="truncate text-sm font-semibold">{label}</p>
              {user?.email ? (
                <p className="truncate text-xs text-muted-foreground">{user.email}</p>
              ) : null}
            </div>
            <MenuLink
              href={routes.profile}
              icon={UserRound}
              label="Ver meu perfil"
              onClick={onClose}
            />
            <MenuLink
              href={`${routes.profile}?avatar=1`}
              icon={Camera}
              label="Alterar foto"
              onClick={onClose}
              onSelect={() => window.dispatchEvent(new Event("evolution:open-avatar-upload"))}
            />
            <MenuLink
              href={routes.profile}
              icon={KeyRound}
              label="Alterar senha"
              onClick={onClose}
            />
            <div className="my-2 border-t border-border/50 pt-2">
              <p className="px-3 pb-2 text-xs font-semibold text-muted-foreground">Tema</p>
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
            <button
              className="flex w-full cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-medium text-destructive transition hover:bg-destructive/15"
              onClick={handleSignout}
              role="menuitem"
              type="button"
            >
              <LogOut className="size-4" />
              Sair
            </button>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}

function UserAvatar({ initials, photoUrl }: { initials: string; photoUrl: string | null }) {
  if (photoUrl) {
    return (
      <Image
        alt="Foto do usuário"
        className="size-9 rounded-full object-cover"
        height={36}
        src={photoUrl}
        unoptimized
        width={36}
      />
    );
  }

  return (
    <span className="grid size-9 place-items-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
      {initials}
    </span>
  );
}

function MenuLink({
  href,
  icon: Icon,
  label,
  onClick,
  onSelect,
}: {
  href: string;
  icon: typeof UserRound;
  label: string;
  onClick: () => void;
  onSelect?: () => void;
}) {
  return (
    <Link
      className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition hover:bg-muted hover:text-primary"
      href={href}
      onClick={() => {
        onSelect?.();
        onClick();
      }}
      role="menuitem"
    >
      <Icon className="size-4" />
      {label}
    </Link>
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

function getUserLabel(displayName?: string | null, email?: string | null) {
  return displayName?.trim() || email?.split("@")[0] || "Usuário";
}

function getInitials(label: string) {
  return label
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}
