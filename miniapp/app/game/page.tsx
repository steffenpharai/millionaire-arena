"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArenaFooter } from "../components/ArenaFooter";

const ROUND_SEC = 30;
const LIFELINES: { id: string; label: string; cost: string; title: string }[] = [
  { id: "5050", label: "50:50", cost: "10 $MILLION?", title: "50:50: Remove two wrong answers—costs 10 $MILLION?" },
  { id: "poll", label: "Poll", cost: "free", title: "Poll the audience via XMTP (free)" },
  { id: "phone", label: "Phone-a-friend", cost: "5 $MILLION?", title: "Phone a friend (AI hint)—costs 5 $MILLION?" },
  { id: "ask", label: "Ask-agent", cost: "free", title: "Ask agent to decode obfuscated question (free)" },
];

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

  const progress = (ROUND_SEC - seconds) / ROUND_SEC;
  const circumference = 2 * Math.PI * 36;
  const strokeDash = circumference * (1 - progress);

  return (
    <main className="min-h-screen bg-arena-bg text-arena-fg p-6 max-w-md mx-auto">
      <h1 className="text-xl font-semibold mb-2">Round 1</h1>

      <div className="flex items-center gap-4 mb-6" aria-live="polite" aria-atomic="true">
        <div className="relative w-20 h-20 flex-shrink-0" aria-label={`Time remaining: ${seconds} seconds`}>
          <svg className="w-full h-full arena-countdown-circle" viewBox="0 0 80 80">
            <circle cx="40" cy="40" r="36" fill="none" stroke="currentColor" strokeWidth="6" className="text-arena-muted/30" />
            <circle
              cx="40"
              cy="40"
              r="36"
              fill="none"
              stroke="currentColor"
              strokeWidth="6"
              strokeLinecap="round"
              className={seconds <= 10 ? "text-red-400 animate-pulse" : "text-arena-accent"}
              strokeDasharray={circumference}
              strokeDashoffset={strokeDash}
              style={{ transition: "stroke-dashoffset 1s linear" }}
            />
          </svg>
          <span className="absolute inset-0 flex items-center justify-center text-lg font-bold tabular-nums">
            {seconds}
          </span>
        </div>
        <p className={`text-lg font-medium ${seconds <= 10 ? "text-red-400 animate-pulse" : "text-arena-muted"}`}>
          Timer: {seconds}s
        </p>
      </div>

      <p className="mb-4 text-arena-fg">
        {showObfuscated ? "Arena riddle (decode in chat with Ask-agent lifeline)" : question.text}
      </p>
      <button
        type="button"
        className="text-sm text-arena-accent underline mb-4 min-h-[44px] inline-flex items-center"
        onClick={() => setShowObfuscated((v) => !v)}
      >
        {showObfuscated ? "Show plain" : "Show obfuscated (agent view)"}
      </button>

      <ul className="list-none p-0 space-y-2" role="group" aria-label="Answer options">
        {question.options.map((opt, i) => (
          <li key={i}>
            <button
              type="button"
              aria-pressed={selected === i}
              className="w-full py-3 px-4 rounded-lg border min-h-[44px] text-left transition-colors disabled:opacity-50 border-arena-muted bg-transparent text-arena-fg hover:border-arena-accent hover:bg-arena-accent/10"
              style={selected === i ? { borderColor: "var(--tw-color-arena-accent)", backgroundColor: "rgba(59, 130, 246, 0.1)" } : undefined}
              onClick={() => setSelected(i)}
              disabled={selected !== null}
            >
              {opt}
            </button>
          </li>
        ))}
      </ul>

      <div className="mt-6 flex flex-wrap gap-2 items-center" role="group" aria-label="Lifelines">
        <span className="text-arena-muted text-sm">Lifelines:</span>
        {LIFELINES.map((ll) => (
          <button
            key={ll.id}
            type="button"
            className="text-sm py-2 px-3 rounded min-h-[44px] bg-arena-muted/20 text-arena-fg hover:bg-arena-muted/30 focus:outline-none focus:ring-2 focus:ring-arena-accent"
            title={ll.title}
          >
            {ll.label} <span className="text-arena-muted text-xs">({ll.cost})</span>
          </button>
        ))}
      </div>

      <Link href="/" className="inline-block mt-6 py-2 text-arena-accent hover:underline min-h-[44px] flex items-center">
        Back
      </Link>

      <ArenaFooter />
    </main>
  );
}
