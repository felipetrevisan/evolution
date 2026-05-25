"use client";

import { useRouter } from "next/navigation";
import { type ReactNode, useEffect, useState } from "react";
import { ApiClientError, api } from "@/lib/api-client";
import { routes } from "@/lib/routes/routes";
import { useAuth } from "@/providers/auth-provider";

export function AdminGuard({ children }: { children: ReactNode }) {
  const router = useRouter();
  const { authenticated, loading } = useAuth();
  const [status, setStatus] = useState<"checking" | "allowed" | "denied" | "error">("checking");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (loading) {
      return;
    }

    if (!authenticated) {
      router.replace(routes.dashboard);
      return;
    }

    let active = true;
    setStatus("checking");
    setErrorMessage(null);

    api
      .adminUsers()
      .then(() => {
        if (active) {
          setStatus("allowed");
        }
      })
      .catch((error) => {
        if (active) {
          if (
            error instanceof ApiClientError &&
            (error.code === "FORBIDDEN" || error.code === "UNAUTHORIZED")
          ) {
            setStatus("denied");
            setErrorMessage(`${error.code}: ${error.message}`);
            return;
          }

          setStatus("error");
          setErrorMessage(
            error instanceof Error
              ? error.message
              : "Não foi possível validar o acesso administrativo.",
          );
        }
      });

    return () => {
      active = false;
    };
  }, [authenticated, loading, router]);

  if (loading || status === "checking") {
    return <div className="rounded-2xl bg-card p-6 text-card-foreground">Validando acesso...</div>;
  }

  if (status !== "allowed") {
    if (status === "error" || status === "denied") {
      return (
        <div className="grid gap-3 rounded-2xl bg-card p-6 text-card-foreground">
          <p className="font-semibold">Não foi possível validar o acesso administrativo.</p>
          {errorMessage ? <p className="text-muted-foreground text-sm">{errorMessage}</p> : null}
          <p className="text-muted-foreground text-sm">
            Usuário esperado no banco configurado: felipejs@gmail.com com perfil admin.
          </p>
        </div>
      );
    }

    return <div className="rounded-2xl bg-card p-6 text-card-foreground">Redirecionando...</div>;
  }

  return children;
}
