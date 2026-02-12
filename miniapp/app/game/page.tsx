"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const ROUND_SEC = 30;

export default function GamePage() {
  const [seconds, setSeconds] = useState(ROUND_SEC);
  const [question] = useState({ text: "Sample question from OpenTDB?", options: ["A", "B", "C", "D"] });

  useEffect(() => {
    const t = setInterval(() => setSeconds((s) => (s > 0 ? s - 1 : 0)), 1000);
    return () => clearInterval(t);
  }, []);

  return (
    <main style={{ padding: "1.5rem", maxWidth: "480px", margin: "0 auto" }}>
      <h1 style={{ fontSize: "1.25rem", marginBottom: "0.5rem" }}>Round 1</h1>
      <p style={{ color: "var(--muted)", marginBottom: "1rem" }}>Timer: {seconds}s</p>
      <p style={{ marginBottom: "1rem" }}>{question.text}</p>
      <ul style={{ listStyle: "none", padding: 0 }}>
        {question.options.map((opt, i) => (
          <li key={i} style={{ marginBottom: "0.5rem" }}>
            <button
              type="button"
              style={{
                width: "100%",
                padding: "0.75rem",
                border: "1px solid var(--muted)",
                borderRadius: "8px",
                background: "transparent",
                color: "var(--fg)",
                cursor: "pointer",
              }}
            >
              {opt}
            </button>
          </li>
        ))}
      </ul>
      <p style={{ marginTop: "1rem", fontSize: "0.875rem", color: "var(--muted)" }}>
        Lifelines: 50:50 | Poll | Phone-a-friend | Ask-agent
      </p>
      <Link href="/" style={{ display: "inline-block", marginTop: "1rem", color: "var(--accent)" }}>
        Back
      </Link>
      <footer className="mt-8 pt-4 border-t border-arena-muted text-sm text-arena-muted">
        No purchase necessary. Skill-based contest. <Link href="/terms" className="underline">Terms</Link>
      </footer>
    </main>
  );
}
