"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getStoredTheme, setStoredTheme, type ArenaTheme } from "./ThemeProvider";

export function ArenaFooter() {
  const [theme, setThemeState] = useState<ArenaTheme>("dark");

  useEffect(() => {
    setThemeState(getStoredTheme());
    const onTheme = () => setThemeState(getStoredTheme());
    window.addEventListener("arena-theme-change", onTheme);
    return () => window.removeEventListener("arena-theme-change", onTheme);
  }, []);

  const setTheme = (t: ArenaTheme) => {
    setStoredTheme(t);
    setThemeState(t);
    window.dispatchEvent(new Event("arena-theme-change"));
  };

  return (
    <footer
      className="mt-8 pt-4 border-t border-arena-muted text-sm text-arena-muted"
      role="contentinfo"
      aria-label="Legal disclaimer"
      title="Skill-based knowledge contest. No purchase necessary. Not gambling."
    >
      <span id="arena-disclaimer">Skill-based contest; no purchase necessary. Not gambling. </span>
      <Link href="/terms" className="underline focus:outline-none focus:ring-2 focus:ring-arena-accent rounded min-h-[44px] inline-flex items-center">
        Terms
      </Link>
      <div className="mt-3 flex gap-2 flex-wrap items-center" role="group" aria-label="Theme">
        <span className="text-arena-muted text-xs">Theme:</span>
        {(["dark", "light", "high-contrast"] as const).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTheme(t)}
            className="text-xs py-1.5 px-2 rounded border border-arena-muted hover:bg-arena-muted/20 focus:outline-none focus:ring-2 focus:ring-arena-accent min-h-[32px]"
            aria-pressed={theme === t}
            aria-label={`Use ${t} theme`}
          >
            {t === "high-contrast" ? "High contrast" : t}
          </button>
        ))}
      </div>
    </footer>
  );
}
