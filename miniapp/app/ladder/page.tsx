"use client";

import Link from "next/link";

const MULTIPLIERS = [1, 2, 3, 5, 10, 20, 40, 80, 160, 320, 640, 1250, 2500, 5000, 10000];
const TIERS = ["easy", "easy", "easy", "easy", "easy", "medium", "medium", "medium", "medium", "medium", "hard", "hard", "hard", "hard", "hard"];

export default function LadderPage() {
  return (
    <main style={{ padding: "1.5rem", maxWidth: "480px", margin: "0 auto" }}>
      <h1 style={{ fontSize: "1.5rem", marginBottom: "1rem" }}>15-Question Ladder</h1>
      <p style={{ color: "var(--muted)", marginBottom: "1rem" }}>US show style. Safe at Q5 and Q10.</p>
      <ol style={{ listStyle: "decimal", paddingLeft: "1.5rem" }}>
        {MULTIPLIERS.map((mul, i) => (
          <li key={i} style={{ padding: "0.35rem 0", display: "flex", justifyContent: "space-between" }}>
            <span>Q{i + 1} — {TIERS[i]}</span>
            <strong>{mul}x</strong>
          </li>
        ))}
      </ol>
      <footer className="mt-8 pt-4 border-t border-arena-muted text-sm text-arena-muted">
        No purchase necessary. Skill-based contest. <Link href="/terms" className="underline">Terms</Link>
      </footer>
    </main>
  );
}
