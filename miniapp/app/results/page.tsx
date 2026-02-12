"use client";

import { useState } from "react";
import Link from "next/link";
import { ArenaFooter } from "../components/ArenaFooter";

const SHARE_TEXT = "Reached Q15—join Millionaire Arena! Skill-based trivia on Base. 0 gas—sponsored.";
const SHARE_TITLE = "Millionaire Arena";

export default function ResultsPage() {
  const [shareStatus, setShareStatus] = useState<"idle" | "copied" | "shared" | "error">("idle");

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

  return (
    <main className="min-h-screen bg-arena-bg text-arena-fg p-6 max-w-md mx-auto">
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
