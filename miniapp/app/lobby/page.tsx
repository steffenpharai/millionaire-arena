"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArenaFooter } from "../components/ArenaFooter";

const API = process.env.NEXT_PUBLIC_AGENT_API_URL || "";

export default function LobbyPage() {
  const [lobbies, setLobbies] = useState<{ id: string; count: number }[]>([]);

  useEffect(() => {
    if (API) {
      fetch(`${API}/api/lobbies`).catch(() => {}).then((r) => r?.ok ? r.json() : null).then((d) => {
        if (Array.isArray(d)) setLobbies(d);
      });
    }
  }, []);

  return (
    <main className="min-h-screen bg-arena-bg text-arena-fg p-6 max-w-md mx-auto">
      <h1 className="text-xl font-semibold mb-4">Lobby</h1>
      <p className="text-arena-muted text-sm mb-4">
        Join an arena via chat: type <strong>/arena join</strong> then open this app.
      </p>
      <p className="text-arena-muted text-sm mb-4">
        Team chat: use Base App chat (XMTP) for group coordination and lifeline polls.
      </p>
      {lobbies.length > 0 ? (
        <ul className="list-none p-0 space-y-2">
          {lobbies.map((l) => (
            <li key={l.id} className="py-2 border-b border-arena-muted">
              Arena {l.id.slice(0, 8)}… — {l.count} player(s)
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-arena-muted">No active lobbies. Start one in chat with /arena join.</p>
      )}
      <ArenaFooter />
    </main>
  );
}
