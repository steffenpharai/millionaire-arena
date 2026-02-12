"use client";

import Link from "next/link";
import { ArenaFooter } from "../components/ArenaFooter";
import { IconLadder, IconShield } from "../components/ArenaIcons";

const MULTIPLIERS = [1, 2, 3, 5, 10, 20, 40, 80, 160, 320, 640, 1250, 2500, 5000, 10000];
const TIERS = ["easy", "easy", "easy", "easy", "easy", "medium", "medium", "medium", "medium", "medium", "hard", "hard", "hard", "hard", "hard"];
const SAFE_AT = [5, 10];
const LADDER_SIZE = 15;

export default function LadderPage() {
  return (
    <main className="min-h-screen bg-arena-bg text-arena-fg p-4 sm:p-6 max-w-md mx-auto">
      <div className="arena-hero px-4 py-5 mb-6 flex items-center gap-3">
        <div className="w-12 h-12 rounded-xl bg-arena-accent/20 flex items-center justify-center text-arena-accent">
          <IconLadder className="w-7 h-7" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-arena-fg">15-Question Ladder</h1>
          <p className="text-arena-muted text-sm">US show style. Safe at Q5 and Q10.</p>
        </div>
      </div>

      <div className="arena-card p-4 mb-6" role="progressbar" aria-valuenow={0} aria-valuemin={0} aria-valuemax={LADDER_SIZE} aria-label="Ladder progress">
        <div className="h-3 rounded-full bg-arena-muted/30 overflow-hidden">
          <div className="h-full bg-arena-ladder rounded-full transition-all duration-500" style={{ width: "0%" }} />
        </div>
        <p className="text-xs text-arena-muted mt-2">0 / {LADDER_SIZE} questions • Safe at Q5, Q10</p>
      </div>

      <ol className="space-y-2 max-h-[50vh] overflow-y-auto overscroll-contain" aria-label="Question ladder">
        {MULTIPLIERS.map((mul, i) => {
          const isSafe = SAFE_AT.includes(i + 1);
          const isTop = i === LADDER_SIZE - 1;
          return (
            <li
              key={i}
              className={`arena-card flex justify-between items-center py-3 px-4 min-h-[48px] rounded-xl border-l-4 ${
                isTop
                  ? "border-l-arena-accent-gold bg-arena-accent-gold/10"
                  : isSafe
                    ? "arena-ladder-milestone border-l-arena-accent bg-arena-accent/10"
                    : "border-l-arena-muted bg-arena-bg-card"
              }`}
            >
              <span className="text-arena-fg flex items-center gap-2">
                <span className="font-semibold text-arena-muted w-6">Q{i + 1}</span>
                <span className="text-arena-muted text-sm">{TIERS[i]}</span>
                {isSafe && (
                  <span className="text-arena-accent flex items-center gap-1" title="Safe milestone">
                    <IconShield className="w-4 h-4" /> Safe
                  </span>
                )}
                {isTop && <span className="text-arena-accent-gold font-medium">Jackpot</span>}
              </span>
              <strong className={isTop ? "text-arena-accent-gold text-lg" : ""}>{mul}x</strong>
            </li>
          );
        })}
      </ol>

      <Link href="/" className="inline-block mt-6 py-2 px-4 rounded-xl bg-gradient-to-r from-[#0066FF] to-[#7C3AED] text-white font-medium min-h-[44px] flex items-center">
        ← Back to home
      </Link>
      <ArenaFooter />
    </main>
  );
}
