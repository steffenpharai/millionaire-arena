"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArenaFooter } from "../components/ArenaFooter";

const API = process.env.NEXT_PUBLIC_AGENT_API_URL || "";

type LeaderboardEntry = { rank: number; address: string; score: number; displayName?: string };

function initials(entry: LeaderboardEntry): string {
  if (entry.displayName && entry.displayName.length >= 2) {
    return entry.displayName.slice(0, 2).toUpperCase();
  }
  return entry.address.slice(2, 4).toUpperCase();
}

export default function LeaderboardPage() {
  const [scores, setScores] = useState<LeaderboardEntry[]>([]);

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
      <p className="text-arena-muted text-sm mb-4">Top players in the current arena. Display names when available.</p>
      {scores.length > 0 ? (
        <ol className="list-decimal list-inside space-y-3" aria-label="Leaderboard">
          {scores.map((s) => (
            <li key={s.address} className="flex items-center gap-3 min-h-[44px]">
              <span
                className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-arena-accent/20 text-arena-accent font-semibold text-sm"
                aria-hidden
              >
                {initials(s)}
              </span>
              <span className="truncate flex-1" title={s.address}>
                {s.displayName || `${s.address.slice(0, 6)}…${s.address.slice(-4)}`}
              </span>
              <strong className="tabular-nums">{s.score}</strong>
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
