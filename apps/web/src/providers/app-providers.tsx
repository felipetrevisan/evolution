"use client";

import type { ReactNode } from "react";
import { Toaster } from "sonner";
import { AuthProvider } from "./auth-provider";
import { ThemeProvider, useTheme } from "./theme-provider";

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      <AuthProvider>
        {children}
        <ThemedToaster />
      </AuthProvider>
    </ThemeProvider>
  );
}

function ThemedToaster() {
  const { resolvedTheme } = useTheme();

  return (
    <Toaster
      closeButton
      position="top-right"
      richColors
      theme={resolvedTheme}
      toastOptions={{
        classNames: {
          closeButton:
            "border-border bg-card text-card-foreground hover:bg-muted hover:text-foreground",
          description: "text-muted-foreground",
          error:
            "border-destructive/40 bg-card text-card-foreground shadow-lg shadow-destructive/10",
          success: "border-primary/40 bg-card text-card-foreground shadow-lg shadow-primary/10",
          title: "text-card-foreground",
          toast:
            "rounded-xl border-border bg-card text-card-foreground shadow-lg shadow-primary/10",
          warning: "border-tertiary/40 bg-card text-card-foreground shadow-lg shadow-tertiary/10",
        },
      }}
    />
  );
}
