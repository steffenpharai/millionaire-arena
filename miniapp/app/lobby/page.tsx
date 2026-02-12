"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { ArenaFooter } from "../components/ArenaFooter";

const API = process.env.NEXT_PUBLIC_AGENT_API_URL || "";

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

  return (
    <main className="min-h-screen bg-arena-bg text-arena-fg p-4 sm:p-6 max-w-md mx-auto">
      <h1 className="text-xl font-semibold mb-4">Lobby</h1>
      <p className="text-arena-accent text-sm mb-2 font-medium">Unlock prizes—gasless! 0 gas—sponsored.</p>
      <p className="text-arena-muted text-sm mb-4">
        Join an arena via chat: type <strong>/arena join</strong> then open this app.
      </p>
      <p className="text-arena-muted text-sm mb-4">
        Team chat: use Base App chat (XMTP) for group coordination and lifeline polls.
      </p>
      {loading && <p className="text-arena-muted text-sm">Loading lobbies…</p>}
      {error && (
        <div className="mb-4 p-3 rounded border border-red-400/50 bg-red-400/10" role="alert">
          <p className="text-red-400 text-sm">Network busy—retry?</p>
          <button type="button" onClick={fetchLobbies} className="mt-2 text-sm py-2 px-3 rounded bg-arena-accent text-white min-h-[44px]">Retry</button>
        </div>
      )}
      {!loading && !error && lobbies.length > 0 && (
        <ul className="list-none p-0 space-y-2">
          {lobbies.map((l) => (
            <li key={l.id} className="py-2 border-b border-arena-muted">
              Arena {l.id.slice(0, 8)}… — {l.count} player(s)
            </li>
          ))}
        </ul>
      )}
      {!loading && !error && lobbies.length === 0 && (
        <p className="text-arena-muted">No active lobbies. Start one in chat with /arena join.</p>
      )}
      <ArenaFooter />
    </main>
  );
}
