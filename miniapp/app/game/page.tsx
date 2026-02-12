"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArenaFooter } from "../components/ArenaFooter";

const ROUND_SEC = 30;

export default function GamePage() {
  const [seconds, setSeconds] = useState(ROUND_SEC);
  const [question] = useState({
    text: "Sample question from OpenTDB?",
    options: ["A", "B", "C", "D"],
  });
  const [selected, setSelected] = useState<number | null>(null);
  const [showObfuscated, setShowObfuscated] = useState(false);

  useEffect(() => {
    const t = setInterval(() => setSeconds((s) => (s > 0 ? s - 1 : 0)), 1000);
    return () => clearInterval(t);
  }, []);

  return (
    <main className="min-h-screen bg-arena-bg text-arena-fg p-6 max-w-md mx-auto">
      <h1 className="text-xl font-semibold mb-2">Round 1</h1>
      <p
        className={`text-lg font-medium mb-2 ${seconds <= 10 ? "text-red-400 animate-pulse" : "text-arena-muted"}`}
        aria-live="polite"
      >
        Timer: {seconds}s
      </p>

      <p className="mb-4 text-arena-fg">
        {showObfuscated ? "Arena riddle (decode in chat with Ask-agent lifeline)" : question.text}
      </p>
      <button
        type="button"
        className="text-sm text-arena-accent underline mb-4"
        onClick={() => setShowObfuscated((v) => !v)}
      >
        {showObfuscated ? "Show plain" : "Show obfuscated (agent view)"}
      </button>

      <ul className="list-none p-0 space-y-2" role="group" aria-label="Answer options">
        {question.options.map((opt, i) => (
          <li key={i}>
            <button
              type="button"
              className="w-full py-3 px-4 rounded-lg border border-arena-muted bg-transparent text-arena-fg text-left hover:border-arena-accent hover:bg-arena-accent/10 transition-colors disabled:opacity-50"
              onClick={() => setSelected(i)}
              disabled={selected !== null}
            >
              {opt}
            </button>
          </li>
        ))}
      </ul>

      <div className="mt-6 flex flex-wrap gap-2" role="group" aria-label="Lifelines">
        <span className="text-arena-muted text-sm">Lifelines:</span>
        <button type="button" className="text-sm py-1 px-2 rounded bg-arena-muted/20 text-arena-fg" title="Remove two wrong answers">50:50</button>
        <button type="button" className="text-sm py-1 px-2 rounded bg-arena-muted/20 text-arena-fg" title="Poll the audience via XMTP">Poll</button>
        <button type="button" className="text-sm py-1 px-2 rounded bg-arena-muted/20 text-arena-fg" title="Phone a friend (AI)">Phone-a-friend</button>
        <button type="button" className="text-sm py-1 px-2 rounded bg-arena-muted/20 text-arena-fg" title="Ask agent to decode obfuscated question">Ask-agent</button>
      </div>

      <Link href="/" className="inline-block mt-6 text-arena-accent hover:underline">
        Back
      </Link>

      <ArenaFooter />
    </main>
  );
}
