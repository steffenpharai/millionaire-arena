"use client";

import Link from "next/link";

export function ArenaFooter() {
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
    </footer>
  );
}
