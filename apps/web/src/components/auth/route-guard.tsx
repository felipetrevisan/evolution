"use client";

import { useRouter } from "next/navigation";
import type { ReactNode } from "react";
import { useEffect } from "react";
import { useCurrentUser } from "@/hooks/auth/use-current-user";
import { routes } from "@/lib/routes/routes";

export function RouteGuard({ children }: { children: ReactNode }) {
  const router = useRouter();
  const { authenticated, loading } = useCurrentUser();

  useEffect(() => {
    if (!loading && !authenticated) {
      router.replace(routes.login);
    }
  }, [authenticated, loading, router]);

  if (loading) {
    return (
      <div className="stitch-glass-card stitch-soft-shadow rounded-[16px] p-6">
        Carregando sessão...
      </div>
    );
  }

  if (!authenticated) {
    return (
      <div className="stitch-glass-card stitch-soft-shadow rounded-[16px] p-6">
        Redirecionando...
      </div>
    );
  }

  return children;
}
