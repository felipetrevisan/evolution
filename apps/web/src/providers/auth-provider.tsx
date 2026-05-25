"use client";

import type { User } from "firebase/auth";
import { createContext, type ReactNode, useContext, useEffect, useMemo, useState } from "react";
import {
  configureAuthPersistence,
  getIdToken,
  loginWithEmail,
  loginWithGoogle,
  logout,
  observeAuth,
  signupWithEmail,
} from "@/lib/firebase-client/auth";

type AuthContextValue = {
  user: User | null;
  loading: boolean;
  authenticated: boolean;
  getToken: () => Promise<string | null>;
  login: (email: string, password: string) => Promise<void>;
  loginGoogle: () => Promise<void>;
  signup: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    configureAuthPersistence().catch(() => undefined);
    return observeAuth((nextUser) => {
      setUser(nextUser);
      setLoading(false);
    });
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      loading,
      authenticated: Boolean(user),
      getToken: getIdToken,
      login: async (email, password) => {
        await loginWithEmail(email, password);
      },
      loginGoogle: async () => {
        await loginWithGoogle();
      },
      signup: async (email, password) => {
        await signupWithEmail(email, password);
      },
      logout,
    }),
    [loading, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider.");
  }

  return context;
}
