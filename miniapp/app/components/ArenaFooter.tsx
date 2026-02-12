"use client";

import Link from "next/link";

export function ArenaFooter() {
  return (
    <footer className="mt-8 pt-4 border-t border-arena-muted text-sm text-arena-muted" title="Skill-based knowledge contest. No purchase necessary. Not gambling.">
      No purchase necessary. Skill-based contest. Not gambling.{" "}
      <Link href="/terms" className="underline">
        Terms
      </Link>
    </footer>
  );
}
