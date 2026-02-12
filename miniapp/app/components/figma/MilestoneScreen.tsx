"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface MilestoneScreenProps {
  level: number;
  continueHref?: string;
  cashOutHref?: string;
  onContinue?: () => void;
  onCashOut?: () => void;
}

const milestones: Record<number, { multiplier: string; amount: number }> = {
  5: { multiplier: "10×", amount: 500 },
  10: { multiplier: "320×", amount: 3200 },
  15: { multiplier: "1000×", amount: 10000 },
};

export function MilestoneScreen({ level, continueHref = "/game", cashOutHref = "/lobby", onContinue, onCashOut }: MilestoneScreenProps) {
  const [showConfetti, setShowConfetti] = useState(true);
  const milestone = milestones[level] ?? milestones[5];

  useEffect(() => {
    if (navigator.vibrate) navigator.vibrate([100, 50, 100]);
    const timer = setTimeout(() => setShowConfetti(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 pb-24 relative overflow-hidden">
      {showConfetti && (
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 rounded-full animate-fall"
              style={{
                left: `${Math.random() * 100}%`,
                top: `-${Math.random() * 20}%`,
                backgroundColor: ["#0066FF", "#7C3AED", "#FFD700", "#00D084", "#FF3B30"][Math.floor(Math.random() * 5)],
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${2 + Math.random() * 2}s`,
              }}
            />
          ))}
        </div>
      )}

      <div className="relative z-10 text-center">
        <div className="w-32 h-32 mx-auto mb-6 bg-gradient-to-br from-[#FFD700] to-[#FFA500] rounded-full flex items-center justify-center shadow-2xl shadow-[#FFD70050] animate-pulse">
          <span className="text-6xl">🏆</span>
        </div>
        <h1 className="text-5xl font-bold mb-3 bg-gradient-to-r from-[#FFD700] to-[#FFA500] bg-clip-text text-transparent">
          Safe Haven!
        </h1>
        <p className="text-2xl font-semibold mb-2">Level {level} Reached</p>
        <p className="text-gray-400 mb-8">You&apos;ve secured a minimum prize</p>

        <div className="bg-gradient-to-br from-[#1A1A2E] to-[#0F0F1A] rounded-3xl p-8 border border-[#FFD70030] mb-8 max-w-sm mx-auto">
          <div className="mb-6">
            <div className="text-sm text-gray-400 mb-2">Guaranteed Prize</div>
            <div className="text-4xl font-bold text-[#FFD700]">${milestone.amount.toLocaleString()}</div>
          </div>
          <div className="flex items-center justify-center gap-2 text-sm text-gray-400">
            <span>Multiplier:</span>
            <span className="text-2xl font-bold text-[#0066FF]">{milestone.multiplier}</span>
          </div>
        </div>

        <div className="mb-8">
          <div className="flex items-center justify-center gap-2 mb-2">
            {[5, 10, 15].map((lvl) => (
              <div
                key={lvl}
                className={`w-12 h-12 rounded-full flex items-center justify-center font-bold transition-all ${
                  lvl === level ? "bg-gradient-to-br from-[#FFD700] to-[#FFA500] scale-110" : lvl < level ? "bg-[#00D08430] text-[#00D084]" : "bg-[#ffffff08] text-gray-500"
                }`}
              >
                {lvl}
              </div>
            ))}
          </div>
          <div className="text-xs text-gray-400">
            {level === 15 ? "Final Level!" : `Next milestone: Level ${level === 5 ? "10" : "15"}`}
          </div>
        </div>

        <div className="space-y-3 max-w-sm mx-auto">
          {level < 15 && (
            <>
              {onContinue ? (
                <button
                  type="button"
                  onClick={onContinue}
                  className="w-full bg-gradient-to-r from-[#0066FF] to-[#7C3AED] text-white font-semibold py-4 rounded-2xl hover:scale-[1.02] active:scale-[0.98] transition-transform shadow-lg shadow-[#0066FF40]"
                >
                  Continue to Level {level + 1}
                </button>
              ) : (
                <Link
                  href={continueHref}
                  className="block w-full bg-gradient-to-r from-[#0066FF] to-[#7C3AED] text-white font-semibold py-4 rounded-2xl hover:scale-[1.02] active:scale-[0.98] transition-transform shadow-lg shadow-[#0066FF40] text-center"
                >
                  Continue to Level {level + 1}
                </Link>
              )}
              {onCashOut ? (
                <button
                  type="button"
                  onClick={onCashOut}
                  className="w-full bg-[#ffffff08] hover:bg-[#ffffff12] text-white font-medium py-4 rounded-2xl transition-all"
                >
                  Cash Out ${milestone.amount.toLocaleString()}
                </button>
              ) : (
                <Link
                  href={cashOutHref}
                  className="block w-full bg-[#ffffff08] hover:bg-[#ffffff12] text-white font-medium py-4 rounded-2xl transition-all text-center"
                >
                  Cash Out ${milestone.amount.toLocaleString()}
                </Link>
              )}
            </>
          )}
          {level === 15 && (
            <Link
              href="/results?outcome=win"
              className="block w-full bg-gradient-to-r from-[#FFD700] to-[#FFA500] text-black font-bold py-4 rounded-2xl hover:scale-[1.02] active:scale-[0.98] transition-transform shadow-lg shadow-[#FFD70050] text-center"
            >
              Claim Victory! 🎉
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
