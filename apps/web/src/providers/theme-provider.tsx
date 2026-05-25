"use client";

import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

export type ThemePreference = "light" | "dark" | "system";
type ResolvedTheme = "light" | "dark";

type ThemeContextValue = {
  preference: ThemePreference;
  resolvedTheme: ResolvedTheme;
  setPreference: (preference: ThemePreference) => void;
};

const storageKey = "evolution-theme";
const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [preference, setPreferenceState] = useState<ThemePreference>("system");
  const [resolvedTheme, setResolvedTheme] = useState<ResolvedTheme>("light");

  const applyTheme = useCallback((nextPreference: ThemePreference) => {
    const nextResolvedTheme = resolveTheme(nextPreference);
    document.documentElement.classList.toggle("dark", nextResolvedTheme === "dark");
    document.documentElement.classList.toggle("light", nextResolvedTheme === "light");
    document.documentElement.dataset.theme = nextResolvedTheme;
    setResolvedTheme(nextResolvedTheme);
  }, []);

  useEffect(() => {
    const storedPreference = getStoredPreference();
    setPreferenceState(storedPreference);
    applyTheme(storedPreference);

    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const handleSystemChange = () => {
      if (getStoredPreference() === "system") {
        applyTheme("system");
      }
    };

    media.addEventListener("change", handleSystemChange);
    return () => media.removeEventListener("change", handleSystemChange);
  }, [applyTheme]);

  const setPreference = useCallback(
    (nextPreference: ThemePreference) => {
      localStorage.setItem(storageKey, nextPreference);
      setPreferenceState(nextPreference);
      applyTheme(nextPreference);
    },
    [applyTheme],
  );

  const value = useMemo(
    () => ({ preference, resolvedTheme, setPreference }),
    [preference, resolvedTheme, setPreference],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error("useTheme must be used inside ThemeProvider.");
  }

  return context;
}

function getStoredPreference(): ThemePreference {
  const storedPreference = localStorage.getItem(storageKey);

  if (
    storedPreference === "light" ||
    storedPreference === "dark" ||
    storedPreference === "system"
  ) {
    return storedPreference;
  }

  return "system";
}

function resolveTheme(preference: ThemePreference): ResolvedTheme {
  if (preference !== "system") {
    return preference;
  }

  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}
