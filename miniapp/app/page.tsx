"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArenaFooter } from "./components/ArenaFooter";

const BANNER_DISMISS_KEY = "arena-pot-banner-dismissed";

export default function Home() {
  const [bannerDismissed, setBannerDismissed] = useState(true); // useEffect sets from localStorage so returning users don't see banner

  useEffect(() => {
    if (typeof window === "undefined") return;
    setBannerDismissed(localStorage.getItem(BANNER_DISMISS_KEY) === "1");
    import("@farcaster/miniapp-sdk").then(({ sdk }) => {
      try {
        sdk.actions.ready();
      } catch {
        // not in Base App embed
      }
    }).catch(() => {});
  }, []);

  const showBanner = !bannerDismissed;
  const dismissBanner = () => {
    setBannerDismissed(true);
    if (typeof window !== "undefined") localStorage.setItem(BANNER_DISMISS_KEY, "1");
  };

  return (
    <main className="min-h-screen bg-arena-bg text-arena-fg p-4 sm:p-6 max-w-md mx-auto">
      {showBanner && (
        <div
          className="mb-4 rounded-lg border border-arena-accent/40 bg-arena-accent/10 px-4 py-3 flex items-center justify-between gap-2"
          role="region"
          aria-label="Pot feed promo"
        >
          <Link href="/feed-pot" className="text-arena-accent font-medium hover:underline flex-1">
            Feed now—gasless stake! 0 gas—sponsored!
          </Link>
          <button
            type="button"
            onClick={dismissBanner}
            className="p-2 text-arena-muted hover:text-arena-fg rounded focus:outline-none focus:ring-2 focus:ring-arena-accent"
            aria-label="Dismiss banner"
          >
            ×
          </button>
        </div>
      )}
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
