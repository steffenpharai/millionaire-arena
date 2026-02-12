"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ArenaFooter } from "../components/ArenaFooter";

const SHARE_TEXT = "Reached Q15—join Millionaire Arena! Skill-based trivia on Base. 0 gas—sponsored.";
const SHARE_TITLE = "Millionaire Arena";

function ResultsContent() {
  const searchParams = useSearchParams();
  const outcome = (searchParams.get("outcome") as "win" | "loss" | null) || null;
  const [shareStatus, setShareStatus] = useState<"idle" | "copied" | "shared" | "error">("idle");
  const [confettiFired, setConfettiFired] = useState(false);

  const shareUrl = typeof window !== "undefined" ? window.location.origin : "";
  const sharePayload = { title: SHARE_TITLE, text: SHARE_TEXT, url: shareUrl };

  const fireConfetti = useCallback(() => {
    if (confettiFired || typeof window === "undefined") return;
    import("canvas-confetti").then(({ default: confetti }) => {
      confetti({ particleCount: 80, spread: 70, origin: { y: 0.7 } });
      setTimeout(() => confetti({ particleCount: 50, angle: 60, spread: 55, origin: { x: 0 } }), 200);
      setTimeout(() => confetti({ particleCount: 50, angle: 120, spread: 55, origin: { x: 1 } }), 400);
      setConfettiFired(true);
    });
  }, [confettiFired]);

  useEffect(() => {
    if (outcome === "win") fireConfetti();
  }, [outcome, fireConfetti]);

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

  const isWin = outcome === "win";
  const isLoss = outcome === "loss";

  return (
    <main className="min-h-screen bg-arena-bg text-arena-fg p-4 sm:p-6 max-w-md mx-auto">
      {isWin && (
        <p className="text-arena-accent font-semibold mb-4" role="status">
          You won! Claim your share—gasless when supported.
        </p>
      )}
      {isLoss && (
        <p className="text-arena-muted mb-4" role="status">
          Practice hard trivia and try again. No purchase necessary.
        </p>
      )}
      <h1 className="text-xl font-semibold mb-4">Post-win distribution</h1>
      <p className="text-arena-muted text-sm mb-4">
        20% of the pot goes to the winner. Rest per ecosystem rules.
      </p>
      <p className="text-arena-muted text-sm mb-4">
        After a round is settled, the Game Master triggers payout. Winners claim via the pot contract. Gasless claim when supported.
      </p>
      <div className="flex flex-wrap gap-3 mb-6">
        <button
          type="button"
          onClick={handleShare}
          className="inline-flex items-center min-h-[44px] py-2 px-4 rounded border border-arena-accent text-arena-accent hover:bg-arena-accent/10 focus:outline-none focus:ring-2 focus:ring-arena-accent"
        >
          Share recap
        </button>
        <Link href="/" className="inline-flex items-center min-h-[44px] py-2 px-4 rounded bg-arena-accent text-white">
          Back home
        </Link>
      </div>
      {shareStatus === "copied" && <p className="text-arena-accent text-sm mb-2">Link copied! Paste to share.</p>}
      {shareStatus === "shared" && <p className="text-arena-accent text-sm mb-2">Thanks for sharing!</p>}
      {shareStatus === "error" && <p className="text-arena-muted text-sm mb-2">Could not share. Copy the URL manually.</p>}
      <ArenaFooter />
    </main>
  );
}

export default function ResultsPage() {
  return (
    <Suspense fallback={
      <main className="min-h-screen bg-arena-bg text-arena-fg p-4 sm:p-6 max-w-md mx-auto">
        <p className="text-arena-muted">Loading…</p>
      </main>
    }>
      <ResultsContent />
    </Suspense>
  );
}
