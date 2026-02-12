"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArenaFooter } from "../components/ArenaFooter";

const API = process.env.NEXT_PUBLIC_AGENT_API_URL || "";

export default function LeaderboardPage() {
  const [scores, setScores] = useState<{ rank: number; address: string; score: number }[]>([]);

  useEffect(() => {
    if (API) {
      fetch(`${API}/api/leaderboard`)
        .catch(() => {})
        .then((r) => (r?.ok ? r.json() : null))
        .then((d) => {
          if (Array.isArray(d)) setScores(d);
        });
    }
  }, []);

  return (
    <main className="min-h-screen bg-arena-bg text-arena-fg p-6 max-w-md mx-auto">
      <h1 className="text-xl font-semibold mb-4">Real-time leaderboard</h1>
      <p className="text-arena-muted text-sm mb-4">Top players in the current arena.</p>
      {scores.length > 0 ? (
        <ol className="list-decimal list-inside space-y-2">
          {scores.map((s) => (
            <li key={s.address} className="flex justify-between">
              <span className="truncate">{s.address.slice(0, 8)}...{s.address.slice(-6)}</span>
              <strong>{s.score}</strong>
            </li>
          ))}
        </ol>
      ) : (
        <p className="text-arena-muted">No scores yet. Join an arena and play!</p>
      )}
      <ArenaFooter />
    </main>
  );
}
