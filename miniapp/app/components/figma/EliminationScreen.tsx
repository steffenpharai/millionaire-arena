"use client";

import { useState } from "react";
import Link from "next/link";

const SHARE_TEXT = "I reached Q{n} on Millionaire Arena! Skill-based trivia on Base. Join the next round—0 gas.";
const SHARE_TITLE = "Millionaire Arena";

interface EliminationScreenProps {
  questionsAnswered: number;
  rematchHref?: string;
  lobbyHref?: string;
}

export function EliminationScreen({
  questionsAnswered,
  rematchHref = "/game",
  lobbyHref = "/lobby",
}: EliminationScreenProps) {
  const [shareStatus, setShareStatus] = useState<"idle" | "copied" | "shared" | "error">("idle");

  const handleShare = async () => {
    if (typeof window === "undefined") return;
    const text = SHARE_TEXT.replace("{n}", String(questionsAnswered));
    const url = window.location.origin;
    const payload = { title: SHARE_TITLE, text, url };
    try {
      if (navigator.share && navigator.canShare?.(payload)) {
        await navigator.share(payload);
        setShareStatus("shared");
      } else {
        await navigator.clipboard.writeText(`${text} ${url}`);
        setShareStatus("copied");
      }
    } catch {
      setShareStatus("error");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 pb-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#FF3B3010] to-[#FF3B3020]" />

      <div className="relative z-10 text-center max-w-sm">
        <div className="w-32 h-32 mx-auto mb-6 bg-gradient-to-br from-[#FF3B3020] to-[#FF3B3010] rounded-full flex items-center justify-center animate-pulse">
          <span className="text-6xl">😔</span>
        </div>
        <h1 className="text-4xl font-bold mb-3">Better Luck Next Time</h1>
        <p className="text-xl text-gray-400 mb-8">You&apos;ve been eliminated from this round</p>

        <div className="bg-gradient-to-br from-[#1A1A2E] to-[#0F0F1A] rounded-3xl p-6 border border-[#ffffff15] mb-8">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-3xl font-bold text-[#0066FF] mb-1">{questionsAnswered}</div>
              <div className="text-xs text-gray-400">Questions Answered</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-[#7C3AED] mb-1">
                {Math.floor(questionsAnswered * 10 * (1 + Math.random()))}
              </div>
              <div className="text-xs text-gray-400">Pot Contribution</div>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-[#ffffff15]">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-400">Your Rank</span>
              <span className="font-bold text-[#FFD700]">#3 of 12</span>
            </div>
          </div>
        </div>

        <div className="bg-[#0066FF15] rounded-2xl p-4 mb-8 border border-[#0066FF30]">
          <p className="text-sm text-gray-300">
            💡 <span className="font-semibold">Pro Tip:</span> Use your lifelines early to build momentum!
          </p>
        </div>

        <div className="space-y-3">
          <Link
            href={rematchHref}
            className="block w-full bg-gradient-to-r from-[#0066FF] to-[#7C3AED] text-white font-semibold py-4 rounded-2xl hover:scale-[1.02] active:scale-[0.98] transition-transform shadow-lg shadow-[#0066FF40] text-center"
          >
            🔄 Play Again
          </Link>
          <Link
            href={lobbyHref}
            className="block w-full bg-[#ffffff08] hover:bg-[#ffffff12] text-white font-medium py-4 rounded-2xl transition-all text-center"
          >
            Back to Lobby
          </Link>
          <button
            type="button"
            onClick={handleShare}
            className="w-full bg-transparent text-[#0066FF] font-medium py-3 rounded-2xl hover:bg-[#0066FF10] transition-all"
          >
            📤 Share Result
          </button>
          {shareStatus === "copied" && <p className="text-sm text-[#00D084] mt-2">Link copied to clipboard.</p>}
          {shareStatus === "shared" && <p className="text-sm text-[#00D084] mt-2">Thanks for sharing!</p>}
          {shareStatus === "error" && <p className="text-sm text-gray-400 mt-2">Could not share. Copy the URL manually.</p>}
        </div>
      </div>
    </div>
  );
}
