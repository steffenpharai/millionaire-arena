"use client";

import { useEffect, useState, useCallback } from "react";
import { ArenaFooter } from "../components/ArenaFooter";
import { LobbyScreen, type Arena } from "../components/figma/LobbyScreen";

const API = process.env.NEXT_PUBLIC_AGENT_API_URL || "";

function mapLobbyToArena(l: { id: string; count: number }): Arena {
  return {
    id: l.id,
    pot: 2500 + Math.floor(Math.random() * 5000),
    players: l.count,
    maxPlayers: 20,
    timeLeft: "2m",
    theme: "General Knowledge",
    status: l.count >= 5 ? "starting" : "open",
  };
}

export default function LobbyPage() {
  const [lobbies, setLobbies] = useState<{ id: string; count: number }[]>([]);
  const [loading, setLoading] = useState(!!API);
  const [error, setError] = useState(false);

  const fetchLobbies = useCallback(() => {
    if (!API) return;
    setLoading(true);
    setError(false);
    fetch(`${API}/api/lobbies`)
      .then((r) => (r?.ok ? r.json() : null))
      .then((d) => {
        if (Array.isArray(d)) setLobbies(d);
        setLoading(false);
      })
      .catch(() => {
        setError(true);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    fetchLobbies();
  }, [fetchLobbies]);

  const arenas = lobbies.map(mapLobbyToArena);

  return (
    <main className="min-h-screen">
      <LobbyScreen
        arenas={arenas}
        loading={loading}
        error={error}
        onRetry={fetchLobbies}
        gameHref="/game"
      />
      <div className="px-4 pb-8">
        <ArenaFooter />
      </div>
    </main>
  );
}
