"use client";

import { CalendarCheck, Home, Route, Sparkles } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { routes } from "@/lib/routes/routes";

export function MobileNav() {
  const pathname = usePathname();
  const items = [
    { href: routes.dashboard, icon: Home, label: "Início", match: routes.dashboard },
    { href: routes.anamnesis, icon: Sparkles, label: "Jornada", match: "/onboarding" },
    { href: routes.plan, icon: Route, label: "Plano", match: routes.plan },
    { href: routes.checkIn, icon: CalendarCheck, label: "Check-in", match: routes.checkIn },
  ];

  return (
    <nav className="fixed inset-x-3 bottom-3 z-30 grid grid-cols-4 rounded-[24px] border border-border/60 bg-card/95 p-2 shadow-lg shadow-primary/10 backdrop-blur md:hidden">
      {items.map((item) => {
        const Icon = item.icon;
        const active =
          pathname === item.href || (item.match !== item.href && pathname.startsWith(item.match));

        return (
          <Link
            className={`grid place-items-center gap-1 rounded-[18px] px-2 py-2 text-[11px] font-semibold transition active:scale-95 ${
              active ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted"
            }`}
            href={item.href}
            key={item.href}
          >
            <Icon className="size-5" />
            <span>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
