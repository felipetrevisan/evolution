import type { ReactNode } from "react";

export function PublicShell({ children }: { children: ReactNode }) {
  return <div className="auth-surface min-h-screen">{children}</div>;
}
