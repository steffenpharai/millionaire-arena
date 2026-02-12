"use client";

import { useState } from "react";
import Link from "next/link";
import { ArenaFooter } from "../components/ArenaFooter";

const API = process.env.NEXT_PUBLIC_AGENT_API_URL || "";
const DEFAULT_AMOUNT_WEI = "1000000000000000000"; // 1 token (18 decimals)

export default function FeedPotPage() {
  const [roundId, setRoundId] = useState("");
  const [amountWei, setAmountWei] = useState(DEFAULT_AMOUNT_WEI);
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [preview, setPreview] = useState<{ to: string; data: string } | null>(null);

  const handlePreview = async () => {
    if (!roundId.trim()) return;
    setStatus("loading");
    setPreview(null);
    try {
      const res = await fetch(`${API}/api/contribute`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ roundId, amountWei }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.to && data.data) {
        setPreview({ to: data.to, data: data.data });
        setStatus("idle");
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  const handleFeedPot = async () => {
    if (!roundId.trim()) return;
    setStatus("loading");
    try {
      const res = await fetch(`${API}/api/contribute`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ roundId, amountWei }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        setPreview(data.to && data.data ? { to: data.to, data: data.data } : null);
        setStatus("done");
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  return (
    <main className="min-h-screen bg-arena-bg text-arena-fg p-6 max-w-md mx-auto">
      <h1 className="text-xl font-semibold mb-4">Feed the pot</h1>
      <p className="text-arena-muted text-sm mb-4">
        Community contributions go to the arena pot. Gasless via Paymaster. One-tap preview below.
      </p>
      <label className="block text-sm text-arena-muted mb-1">Round ID</label>
      <input
        type="text"
        placeholder="e.g. round1"
        value={roundId}
        onChange={(e) => setRoundId(e.target.value)}
        className="w-full px-3 py-2 rounded border border-arena-muted bg-transparent text-arena-fg mb-4"
      />
      <label className="block text-sm text-arena-muted mb-1">Amount (wei)</label>
      <input
        type="text"
        placeholder="1000000000000000000"
        value={amountWei}
        onChange={(e) => setAmountWei(e.target.value)}
        className="w-full px-3 py-2 rounded border border-arena-muted bg-transparent text-arena-fg mb-4"
      />
      <div className="flex gap-2">
        <button
          type="button"
          onClick={handlePreview}
          disabled={status === "loading"}
          className="flex-1 py-3 rounded border border-arena-accent text-arena-accent font-medium disabled:opacity-50"
        >
          Preview
        </button>
        <button
          type="button"
          onClick={handleFeedPot}
          disabled={status === "loading"}
          className="flex-1 py-3 rounded bg-arena-accent text-white font-medium disabled:opacity-50"
        >
          {status === "loading" ? "Sending…" : status === "done" ? "Done" : "Feed pot (gasless)"}
        </button>
      </div>
      {preview && (
        <div className="mt-4 p-3 rounded bg-arena-muted/20 text-sm break-all" role="status">
          <p className="text-arena-muted mb-1">Preview: contribute to pot</p>
          <p>To: {preview.to}</p>
          <p className="truncate" title={preview.data}>Data: {preview.data.slice(0, 42)}…</p>
        </div>
      )}
      {status === "error" && (
        <p className="mt-2 text-red-400 text-sm">Request failed. Check backend and POT_CONTRACT_ADDRESS.</p>
      )}
      <ArenaFooter />
    </main>
  );
}
