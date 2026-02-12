"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function Home() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    import("@farcaster/miniapp-sdk").then(({ sdk }) => {
      try {
        sdk.actions.ready();
      } catch {
        // not in Base App embed
      }
    }).catch(() => {});
  }, []);

  return (
    <main className="min-h-screen bg-arena-bg text-arena-fg p-6 max-w-md mx-auto">
      <h1 className="text-2xl font-semibold mb-2">Millionaire Arena</h1>
      <p className="text-arena-muted mb-6">
        Skill-based trivia battle royale. 15 questions. No purchase necessary.
      </p>
      <nav className="flex flex-col gap-3">
        <Link
          href="/lobby"
          className="block py-3 px-4 rounded-lg bg-arena-accent text-white text-center font-semibold"
        >
          Join arena (gasless)
        </Link>
        <Link
          href="/ladder"
          className="block py-3 px-4 rounded-lg border border-arena-muted text-center"
        >
          View ladder
        </Link>
        <Link
          href="/leaderboard"
          className="block py-3 px-4 rounded-lg border border-arena-muted text-center"
        >
          Leaderboard
        </Link>
        <Link
          href="/feed-pot"
          className="block py-3 px-4 rounded-lg border border-arena-muted text-center"
        >
          Feed pot (gasless)
        </Link>
        <Link
          href="/game"
          className="block py-3 px-4 rounded-lg border border-arena-muted text-center"
        >
          Play round (sample)
        </Link>
        <Link
          href="/results"
          className="block py-3 px-4 rounded-lg border border-arena-muted text-center"
        >
          Post-win distribution
        </Link>
      </nav>
      <footer className="mt-8 pt-4 border-t border-arena-muted text-sm text-arena-muted">
        No purchase necessary. Skill-based knowledge contest. Not gambling. <Link href="/terms" className="underline">Terms</Link>.
      </footer>
    </main>
  );
}
