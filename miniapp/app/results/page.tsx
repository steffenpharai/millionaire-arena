"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ArenaFooter } from "../components/ArenaFooter";
import { VictoryScreen } from "../components/figma/VictoryScreen";
import { EliminationScreen } from "../components/figma/EliminationScreen";

const SHARE_TEXT = "Reached Q15—join Millionaire Arena! Skill-based trivia on Base. 0 gas—sponsored.";
const SHARE_TITLE = "Millionaire Arena";
const DEFAULT_PRIZE = 2500;

function ResultsContent() {
  const searchParams = useSearchParams();
  const outcome = (searchParams.get("outcome") as "win" | "loss" | null) || null;
  const prizeParam = searchParams.get("prize");
  const questionsParam = searchParams.get("questions");
  const [shareStatus, setShareStatus] = useState<"idle" | "copied" | "shared" | "error">("idle");

  const prizeAmount = prizeParam ? parseInt(prizeParam, 10) : DEFAULT_PRIZE;
  const questionsAnswered = questionsParam ? parseInt(questionsParam, 10) : 0;

  const shareUrl = typeof window !== "undefined" ? window.location.origin : "";
  const sharePayload = { title: SHARE_TITLE, text: SHARE_TEXT, url: shareUrl };

  const handleShare = async () => {
    if (typeof window === "undefined") return;
    try {
      if (navigator.share && navigator.canShare?.({ ...sharePayload, url: shareUrl })) {
        await navigator.share(sharePayload);
        setShareStatus("shared");
      } else {
        await navigator.clipboard.writeText(`${SHARE_TEXT} ${shareUrl}`);
        setShareStatus("copied");
      }
    } catch {
      setShareStatus("error");
    }
  };

  if (outcome === "win") {
    return (
      <main className="min-h-screen">
        <VictoryScreen prizeAmount={prizeAmount} lobbyHref="/lobby" />
        <div className="px-4 pb-8">
          <ArenaFooter />
        </div>
      </main>
    );
  }

  if (outcome === "loss") {
    return (
      <main className="min-h-screen">
        <EliminationScreen questionsAnswered={questionsAnswered || 3} rematchHref="/game" lobbyHref="/lobby" />
        <div className="px-4 pb-8">
          <ArenaFooter />
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen p-6 max-w-md mx-auto">
      <div className="bg-gradient-to-br from-[#1A1A2E] to-[#0F0F1A] rounded-3xl p-6 border border-[#ffffff15] mb-6">
        <h1 className="text-xl font-bold text-white mb-3">Post-win distribution</h1>
        <p className="text-gray-400 text-sm mb-2">
          20% of the pot goes to the winner. Rest per ecosystem rules.
        </p>
        <p className="text-gray-400 text-sm">
          After a round is settled, the Game Master triggers payout. Winners claim via the pot contract. Gasless claim when supported.
        </p>
      </div>
      <div className="flex flex-wrap gap-3 mb-6">
        <button
          type="button"
          onClick={handleShare}
          className="inline-flex items-center min-h-[44px] py-2 px-4 rounded-xl border border-[#7C3AED] text-[#7C3AED] hover:bg-[#7C3AED20] focus:outline-none focus:ring-2 focus:ring-[#0066FF]"
        >
          Share recap
        </button>
        <Link
          href="/"
          className="inline-flex items-center min-h-[44px] py-2 px-4 rounded-xl bg-gradient-to-r from-[#0066FF] to-[#7C3AED] text-white font-medium"
        >
          Back home
        </Link>
      </div>
      {shareStatus === "copied" && <p className="text-[#0066FF] text-sm mb-2">Link copied! Paste to share.</p>}
      {shareStatus === "shared" && <p className="text-[#0066FF] text-sm mb-2">Thanks for sharing!</p>}
      {shareStatus === "error" && <p className="text-gray-400 text-sm mb-2">Could not share. Copy the URL manually.</p>}
      <ArenaFooter />
    </main>
  );
}

export default function ResultsPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen p-6">
          <p className="text-gray-400">Loading…</p>
        </main>
      }
    >
      <ResultsContent />
    </Suspense>
  );
}
