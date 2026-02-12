"use client";

import Link from "next/link";
import { ArenaFooter } from "../components/ArenaFooter";

const MULTIPLIERS = [1, 2, 3, 5, 10, 20, 40, 80, 160, 320, 640, 1250, 2500, 5000, 10000];
const TIERS = ["easy", "easy", "easy", "easy", "easy", "medium", "medium", "medium", "medium", "medium", "hard", "hard", "hard", "hard", "hard"];
const SAFE_AT = [5, 10]; // Q5 and Q10 safe milestones
const LADDER_SIZE = 15;

export default function LadderPage() {
  return (
    <main className="min-h-screen bg-arena-bg text-arena-fg p-4 sm:p-6 max-w-md mx-auto">
      <h1 className="text-xl font-semibold mb-2">15-Question Ladder</h1>
      <p className="text-arena-muted text-sm mb-4">US show style. Safe at Q5 and Q10.</p>

      <div className="mb-6" role="progressbar" aria-valuenow={0} aria-valuemin={0} aria-valuemax={LADDER_SIZE} aria-label="Ladder progress">
        <div className="h-3 rounded-full bg-arena-muted/30 overflow-hidden">
          <div className="h-full bg-arena-accent rounded-full transition-all duration-500" style={{ width: "0%" }} />
        </div>
        <p className="text-xs text-arena-muted mt-1">0 / {LADDER_SIZE} questions • Safe at Q5, Q10</p>
      </div>

      <ol className="list-decimal list-inside space-y-2 max-h-[50vh] overflow-y-auto overscroll-contain" aria-label="Question ladder">
        {MULTIPLIERS.map((mul, i) => {
          const isSafe = SAFE_AT.includes(i + 1);
          return (
            <li
              key={i}
              className={`flex justify-between items-center py-3 px-3 rounded-lg min-h-[44px] ${isSafe ? "arena-ladder-milestone bg-arena-accent/15 border border-arena-accent/50" : "bg-arena-muted/5"}`}
            >
              <span className="text-arena-fg">
                Q{i + 1} — <span className="text-arena-muted">{TIERS[i]}</span>
                {isSafe && <span className="ml-2 text-xs text-arena-accent font-medium" title="Safe milestone—walk away with winnings up to here">Safe</span>}
              </span>
              <strong>{mul}x</strong>
            </li>
          );
        })}
      </ol>

      <ArenaFooter />
    </main>
  );
}
