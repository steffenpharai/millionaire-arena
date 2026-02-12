"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

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
    <main style={{ padding: "1.5rem", maxWidth: "480px", margin: "0 auto" }}>
      <h1 style={{ fontSize: "1.5rem", marginBottom: "1rem" }}>Lobby</h1>
      <p style={{ color: "var(--muted)", marginBottom: "1rem" }}>
        Join an arena via chat: type <strong>/arena join</strong> then open this app.
      </p>
      {lobbies.length > 0 ? (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {lobbies.map((l) => (
            <li key={l.id} style={{ padding: "0.5rem 0", borderBottom: "1px solid var(--muted)" }}>
              Arena {l.id.slice(0, 8)} — {l.count} player(s)
            </li>
          ))}
        </ul>
      ) : (
        <p style={{ color: "var(--muted)" }}>No active lobbies. Start one in chat with /arena join.</p>
      )}
      <footer style={{ marginTop: "2rem", fontSize: "0.875rem", color: "var(--muted)" }}>
        No purchase necessary. Skill-based contest.
      </footer>
    </main>
  );
}
