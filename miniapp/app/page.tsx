"use client";

import { useEffect } from "react";
import Link from "next/link";
import { ArenaFooter } from "./components/ArenaFooter";

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
      <p className="text-sm text-arena-accent mb-4" role="status">
        Unlock prizes—gasless! Sponsored transactions; 0 gas for you.
      </p>
      <nav className="flex flex-col gap-3" aria-label="Main navigation">
        <Link
          href="/lobby"
          className="block py-3 px-4 rounded-lg bg-arena-accent text-white text-center font-semibold min-h-[44px] flex items-center justify-center"
          aria-label="Join arena (gasless, sponsored)"
        >
          Join arena (0 gas—sponsored!)
        </Link>
        <Link
          href="/ladder"
          className="block py-3 px-4 rounded-lg border border-arena-muted text-center min-h-[44px] flex items-center justify-center"
        >
          View ladder
        </Link>
        <Link
          href="/leaderboard"
          className="block py-3 px-4 rounded-lg border border-arena-muted text-center min-h-[44px] flex items-center justify-center"
        >
          Leaderboard
        </Link>
        <Link
          href="/feed-pot"
          className="block py-3 px-4 rounded-lg border border-arena-muted text-center min-h-[44px] flex items-center justify-center"
          aria-label="Feed the pot (gasless, sponsored)"
        >
          Feed pot (0 gas—sponsored!)
        </Link>
        <Link
          href="/game"
          className="block py-3 px-4 rounded-lg border border-arena-muted text-center min-h-[44px] flex items-center justify-center"
        >
          Play round (sample)
        </Link>
        <Link
          href="/results"
          className="block py-3 px-4 rounded-lg border border-arena-muted text-center min-h-[44px] flex items-center justify-center"
        >
          Post-win distribution
        </Link>
      </nav>
      <ArenaFooter />
    </main>
  );
}
