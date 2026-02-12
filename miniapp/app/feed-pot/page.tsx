"use client";

import { useState } from "react";
import Link from "next/link";

const API = process.env.NEXT_PUBLIC_AGENT_API_URL || "";

export default function FeedPotPage() {
  const [roundId, setRoundId] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");

  const handleFeedPot = async () => {
    if (!roundId.trim()) return;
    setStatus("loading");
    try {
      const res = await fetch(`${API}/api/contribute`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ roundId, amountWei: "0" }),
      });
      setStatus(res.ok ? "done" : "error");
    } catch {
      setStatus("error");
    }
  };

  return (
    <main className="min-h-screen bg-arena-bg text-arena-fg p-6 max-w-md mx-auto">
      <h1 className="text-xl font-semibold mb-4">Feed the pot</h1>
      <p className="text-arena-muted text-sm mb-4">
        Community contributions go to the arena pot. Gasless via Paymaster.
      </p>
      <input
        type="text"
        placeholder="Round ID"
        value={roundId}
        onChange={(e) => setRoundId(e.target.value)}
        className="w-full px-3 py-2 rounded border border-arena-muted bg-transparent text-arena-fg mb-4"
      />
      <button
        type="button"
        onClick={handleFeedPot}
        disabled={status === "loading"}
        className="w-full py-3 rounded bg-arena-accent text-white font-medium disabled:opacity-50"
      >
        {status === "loading" ? "Sending…" : status === "done" ? "Done" : "Feed pot (gasless)"}
      </button>
      {status === "error" && <p className="mt-2 text-red-400 text-sm">Request failed. Check backend.</p>}
      <footer className="mt-8 pt-4 border-t border-arena-muted text-sm text-arena-muted">
        No purchase necessary. Skill-based contest. <Link href="/terms" className="underline">Terms</Link>
      </footer>
    </main>
  );
}
