"use client";

import { useState } from "react";
import Link from "next/link";
import { ArenaFooter } from "../components/ArenaFooter";
import { PotFeedOverlay } from "../components/figma/PotFeedOverlay";

const API = process.env.NEXT_PUBLIC_AGENT_API_URL || "";
const DEFAULT_AMOUNT_WEI = "1000000000000000000";

export default function FeedPotPage() {
  const [roundId, setRoundId] = useState("");
  const [amountWei, setAmountWei] = useState(DEFAULT_AMOUNT_WEI);
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [preview, setPreview] = useState<{ to: string; data: string } | null>(null);
  const [showFigmaOverlay, setShowFigmaOverlay] = useState(true);

  const handlePreview = async () => {
    if (!roundId.trim() || !API) return;
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

  const handleFeedPot = (amount: number) => {
    setAmountWei(String(amount * 1e18));
    if (roundId.trim() && API) {
      setStatus("loading");
      fetch(`${API}/api/contribute`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ roundId, amountWei: String(amount * 1e18) }),
      })
        .then((r) => (r.ok ? r.json() : null))
        .then((d) => {
          if (d?.to && d?.data) setPreview({ to: d.to, data: d.data });
          setStatus("done");
        })
        .catch(() => setStatus("error"));
    }
    setShowFigmaOverlay(false);
  };

  return (
    <main className="min-h-screen">
      <div className="p-6 pb-4">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-xl bg-[#FFA50020] flex items-center justify-center text-[#FFA500]">
            <span className="text-2xl">💰</span>
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">Feed the pot</h1>
            <p className="text-gray-400 text-sm">0 gas—sponsored! Use the overlay or form below.</p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setShowFigmaOverlay(true)}
          className="w-full bg-gradient-to-r from-[#0066FF] to-[#7C3AED] text-white font-semibold py-4 rounded-2xl hover:scale-[1.02] active:scale-[0.98] transition-transform shadow-lg shadow-[#0066FF40] mb-6"
        >
          Open Feed Pot (Figma UI)
        </button>

        <div className="bg-gradient-to-br from-[#1A1A2E] to-[#0F0F1A] rounded-3xl p-5 border border-[#ffffff15] mb-6">
          <label className="block text-sm text-gray-400 mb-1">Round ID</label>
          <input
            type="text"
            placeholder="e.g. round1"
            value={roundId}
            onChange={(e) => setRoundId(e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-[#ffffff15] bg-[#ffffff08] text-white mb-4 focus:outline-none focus:border-[#0066FF]"
          />
          <label className="block text-sm text-gray-400 mb-1">Amount (wei)</label>
          <input
            type="text"
            placeholder="1000000000000000000"
            value={amountWei}
            onChange={(e) => setAmountWei(e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-[#ffffff15] bg-[#ffffff08] text-white mb-4 focus:outline-none focus:border-[#0066FF]"
          />
          <div className="flex gap-2">
            <button
              type="button"
              onClick={handlePreview}
              disabled={status === "loading"}
              className="flex-1 py-3 rounded-xl border border-[#0066FF] text-[#0066FF] font-medium disabled:opacity-50 min-h-[44px]"
            >
              Preview
            </button>
            <button
              type="button"
              onClick={() => handleFeedPot(Number(amountWei) / 1e18)}
              disabled={status === "loading"}
              className="flex-1 py-3 rounded-xl bg-gradient-to-r from-[#0066FF] to-[#7C3AED] text-white font-medium disabled:opacity-50 min-h-[44px]"
              aria-label={status === "done" ? "Done" : "Feed pot (0 gas, sponsored)"}
            >
              {status === "loading" ? "Sending…" : status === "done" ? "Done" : "Feed pot (0 gas)"}
            </button>
          </div>
          {preview && (
            <div className="mt-4 p-4 rounded-xl border border-[#FFA50030] bg-[#FFA50010] text-sm break-all" role="status" aria-live="polite">
              <p className="text-[#FFA500] font-medium mb-1">Preview: contribute to pot</p>
              <p className="text-white">To: {preview.to}</p>
              <p className="truncate text-gray-400" title={preview.data}>Data: {preview.data.slice(0, 42)}…</p>
            </div>
          )}
          {status === "error" && (
            <div className="mt-4 p-4 rounded-xl border border-[#FF3B3020] bg-[#FF3B3010]" role="alert">
              <p className="text-[#FF3B30] text-sm">Network busy—retry?</p>
            </div>
          )}
        </div>
      </div>

      {showFigmaOverlay && (
        <PotFeedOverlay
          onClose={() => setShowFigmaOverlay(false)}
          onFeed={handleFeedPot}
          apiBase={API}
        />
      )}

      <Link href="/" className="inline-block mt-4 py-2 px-4 rounded-xl bg-[#ffffff08] hover:bg-[#ffffff12] text-white font-medium min-h-[44px] flex items-center">
        ← Back to home
      </Link>
      <div className="px-4 pb-8">
        <ArenaFooter />
      </div>
    </main>
  );
}
