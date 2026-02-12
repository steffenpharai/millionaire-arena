"use client";

import { useEffect, useState } from "react";

export type ArenaTheme = "dark" | "light" | "high-contrast";
const THEME_KEY = "arena-theme";

export function getStoredTheme(): ArenaTheme {
  if (typeof window === "undefined") return "dark";
  const v = localStorage.getItem(THEME_KEY);
  if (v === "light" || v === "high-contrast") return v;
  return "dark";
}

export function setStoredTheme(theme: ArenaTheme) {
  if (typeof window === "undefined") return;
  localStorage.setItem(THEME_KEY, theme);
  document.documentElement.setAttribute("data-theme", theme);
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    const theme = getStoredTheme();
    document.documentElement.setAttribute("data-theme", theme);
    setMounted(true);
  }, []);
  return <>{children}</>;
}
