"use client";

import { useCallback, useEffect, useState } from "react";
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

  const [error, setError] = useState(false);
  const fetchScores = useCallback(() => {
    if (!API) return;
    setError(false);
    fetch(`${API}/api/leaderboard`)
      .then((r) => (r?.ok ? r.json() : null))
      .then((d) => {
        if (Array.isArray(d)) setScores(d);
      })
      .catch(() => setError(true));
  }, []);

  useEffect(() => {
    fetchScores();
  }, [fetchScores]);

  const avatarColors = ["bg-arena-accent/25 text-arena-accent", "bg-arena-accent-emerald/25 text-arena-accent-emerald", "bg-arena-accent-amber/25 text-arena-accent-amber", "bg-arena-accent-violet/25 text-arena-accent-violet", "bg-arena-accent-gold/25 text-arena-accent-gold"];

  return (
    <main className="min-h-screen bg-arena-bg text-arena-fg p-4 sm:p-6 max-w-md mx-auto">
      <div className="arena-hero px-4 py-5 mb-6 flex items-center gap-3">
        <div className="w-12 h-12 rounded-xl bg-arena-accent-emerald/20 flex items-center justify-center text-arena-accent-emerald">
          <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
        </div>
        <div>
          <h1 className="text-xl font-bold text-arena-fg">Leaderboard</h1>
          <p className="text-arena-muted text-sm">Top players. Display names when available.</p>
        </div>
      </div>

      {scores.length > 0 ? (
        <ol className="space-y-2 list-none p-0" aria-label="Leaderboard">
          {scores.map((s, i) => (
            <li key={s.address} className="arena-card flex items-center gap-3 min-h-[52px] py-2 px-4 rounded-xl border-l-4 border-l-arena-accent">
              <span
                className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl font-bold text-sm ${avatarColors[i % avatarColors.length]}`}
                aria-hidden
              >
                {initials(s)}
              </span>
              <span className="truncate flex-1 text-arena-fg" title={s.address}>
                {s.displayName || `${s.address.slice(0, 6)}…${s.address.slice(-4)}`}
              </span>
              <strong className="tabular-nums text-arena-accent-gold">{s.score}</strong>
            </li>
          ))}
        </ol>
      ) : error ? (
        <div className="arena-card p-4 border-l-4 border-red-400" role="alert">
          <p className="text-red-400 text-sm">Network busy—retry?</p>
          <button type="button" onClick={fetchScores} className="mt-2 text-sm py-2 px-3 rounded-lg bg-arena-accent text-white min-h-[44px]">Retry</button>
        </div>
      ) : (
        <div className="arena-card p-6 text-center">
          <p className="text-arena-muted">No scores yet. Join an arena and play!</p>
        </div>
      )}
      <Link href="/" className="inline-block mt-6 py-2 px-4 rounded-xl bg-gradient-to-r from-[#0066FF] to-[#7C3AED] text-white font-medium min-h-[44px] flex items-center">
        ← Back to home
      </Link>
      <ArenaFooter />
    </main>
  );
}
