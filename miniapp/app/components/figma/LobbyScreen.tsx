"use client";

import { useState } from "react";
import Link from "next/link";

export interface Arena {
  id: string;
  pot: number;
  players: number;
  maxPlayers: number;
  timeLeft: string;
  theme: string;
  status: "open" | "starting" | "live";
}

interface LobbyScreenProps {
  arenas: Arena[];
  loading?: boolean;
  error?: boolean;
  onRetry?: () => void;
  gameHref?: string;
}

const defaultArenas: Arena[] = [
  { id: "1", pot: 5000, players: 8, maxPlayers: 12, timeLeft: "2m", theme: "General Knowledge", status: "starting" },
  { id: "2", pot: 12500, players: 15, maxPlayers: 20, timeLeft: "45s", theme: "Crypto & Web3", status: "open" },
  { id: "3", pot: 3200, players: 6, maxPlayers: 10, timeLeft: "Live", theme: "Science", status: "live" },
  { id: "4", pot: 8900, players: 11, maxPlayers: 15, timeLeft: "5m", theme: "Pop Culture", status: "open" },
  { id: "5", pot: 2100, players: 4, maxPlayers: 8, timeLeft: "8m", theme: "History", status: "open" },
];

export function LobbyScreen({
  arenas = defaultArenas,
  loading = false,
  error = false,
  onRetry,
  gameHref = "/game",
}: LobbyScreenProps) {
  const [selectedFilter, setSelectedFilter] = useState<"all" | "open" | "high" | "friends">("all");

  const filters = [
    { id: "all" as const, label: "All Arenas" },
    { id: "open" as const, label: "Open Now" },
    { id: "high" as const, label: "High Pot" },
    { id: "friends" as const, label: "Friends" },
  ];

  const rawArenas = arenas.length > 0 ? arenas : defaultArenas;
  const displayArenas = (() => {
    if (selectedFilter === "all") return rawArenas;
    if (selectedFilter === "open") return rawArenas.filter((a) => a.status === "open");
    if (selectedFilter === "high") return [...rawArenas].sort((a, b) => b.pot - a.pot);
    if (selectedFilter === "friends") return rawArenas; // No friends data yet; show all
    return rawArenas;
  })();

  return (
    <div className="min-h-screen pb-32">
      <div className="sticky top-0 bg-[#0F0F1A] border-b border-[#ffffff15] backdrop-blur-xl z-10">
        <div className="p-6 pb-4">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold">Arena Lobby</h1>
            <Link href="/terms" className="w-10 h-10 rounded-full bg-[#ffffff08] flex items-center justify-center hover:bg-[#ffffff12] transition-colors" aria-label="Terms and settings">
              <span className="text-xl">⚙️</span>
            </Link>
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {filters.map((filter) => (
              <button
                key={filter.id}
                type="button"
                onClick={() => setSelectedFilter(filter.id)}
                className={`px-4 py-2 rounded-full font-medium text-sm whitespace-nowrap transition-all ${
                  selectedFilter === filter.id
                    ? "bg-gradient-to-r from-[#0066FF] to-[#7C3AED] text-white"
                    : "bg-[#ffffff08] text-gray-400 hover:bg-[#ffffff12]"
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="p-6 space-y-4">
        {loading && (
          <div className="bg-[#1A1A2E] rounded-3xl p-6 border border-[#ffffff15]">
            <p className="text-gray-400 text-sm">Loading lobbies…</p>
          </div>
        )}
        {error && onRetry && (
          <div className="bg-[#1A1A2E] rounded-3xl p-6 border border-[#FF3B3020]" role="alert">
            <p className="text-[#FF3B30] text-sm mb-2">Network busy—retry?</p>
            <button type="button" onClick={onRetry} className="py-2 px-4 rounded-xl bg-gradient-to-r from-[#0066FF] to-[#7C3AED] text-white font-medium text-sm">
              Retry
            </button>
          </div>
        )}
        {!loading && !error && displayArenas.map((arena) => (
          <Link
            key={arena.id}
            href={gameHref}
            className="block w-full bg-gradient-to-br from-[#1A1A2E] to-[#0F0F1A] rounded-3xl p-5 border border-[#ffffff15] hover:border-[#0066FF] hover:scale-[1.02] active:scale-[0.98] transition-all text-left"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-gradient-to-br from-[#0066FF] to-[#7C3AED] rounded-xl flex items-center justify-center">
                  <span className="text-lg">💎</span>
                </div>
                <div>
                  <div className="font-semibold">{arena.theme}</div>
                  <div className="text-xs text-gray-400">Arena #{arena.id}</div>
                </div>
              </div>
              <div
                className={`px-2 py-1 rounded-full text-xs font-medium ${
                  arena.status === "live"
                    ? "bg-[#FF3B3020] text-[#FF3B30]"
                    : arena.status === "starting"
                    ? "bg-[#FFA50020] text-[#FFA500]"
                    : "bg-[#00D08420] text-[#00D084]"
                }`}
              >
                {arena.status === "live" ? "🔴 LIVE" : arena.status === "starting" ? "⏱️ Starting" : "✓ Open"}
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3 mb-3">
              <div>
                <div className="text-xl font-bold text-[#FFD700]">${arena.pot.toLocaleString()}</div>
                <div className="text-xs text-gray-400">Prize Pot</div>
              </div>
              <div>
                <div className="text-xl font-bold text-[#0066FF]">
                  {arena.players}/{arena.maxPlayers}
                </div>
                <div className="text-xs text-gray-400">Players</div>
              </div>
              <div>
                <div className="text-xl font-bold text-[#7C3AED]">{arena.timeLeft}</div>
                <div className="text-xs text-gray-400">{arena.status === "live" ? "In Progress" : "Starts in"}</div>
              </div>
            </div>
            <div className="relative h-2 bg-[#ffffff08] rounded-full overflow-hidden">
              <div
                className="absolute inset-y-0 left-0 bg-gradient-to-r from-[#0066FF] to-[#7C3AED] rounded-full transition-all"
                style={{ width: `${(arena.players / arena.maxPlayers) * 100}%` }}
              />
            </div>
          </Link>
        ))}
        {!loading && !error && arenas.length === 0 && (
          <div className="bg-[#1A1A2E] rounded-3xl p-6 border border-[#ffffff15] text-center">
            <p className="text-gray-400">No active lobbies. Start one in chat with /arena join.</p>
          </div>
        )}
      </div>

      <Link
        href={gameHref}
        className="fixed bottom-20 right-6 w-16 h-16 bg-gradient-to-r from-[#0066FF] to-[#7C3AED] rounded-2xl shadow-2xl shadow-[#0066FF60] flex items-center justify-center hover:scale-110 active:scale-95 transition-transform z-40"
        aria-label="Join arena"
      >
        <span className="text-3xl">+</span>
      </Link>
    </div>
  );
}
