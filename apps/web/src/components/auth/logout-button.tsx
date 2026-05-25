"use client";

import { Button } from "@evolution/ui";
import { LogOut } from "lucide-react";
import { useAuthActions } from "@/hooks/auth/use-auth-actions";

export function LogoutButton() {
  const { signout } = useAuthActions();

  return (
    <Button className="rounded-full" onClick={signout} variant="secondary">
      <LogOut className="size-4" />
      Sair
    </Button>
  );
}
