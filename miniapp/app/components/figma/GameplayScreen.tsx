"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface GameplayScreenProps {
  onMilestone?: (level: number) => void;
  onElimination?: () => void;
  onVictory?: () => void;
  onFeedPot?: () => void;
  potAmount?: number;
  question?: { text: string; options: string[]; correctIndex?: number };
  /** Controlled level (from parent). When provided, parent owns level state. */
  level?: number;
  onLevelChange?: (level: number) => void;
}

const defaultQuestions = [
  { question: "What is the native token of the Base blockchain?", answers: ["BASE", "ETH", "USDC", "CBETH"], correct: 1 },
  { question: "Which layer does Base operate on?", answers: ["Layer 1", "Layer 2", "Layer 3", "Sidechain"], correct: 1 },
  { question: "What consensus mechanism does Ethereum use?", answers: ["Proof of Work", "Proof of Stake", "Proof of Authority", "Delegated PoS"], correct: 1 },
  { question: "In what year was Bitcoin created?", answers: ["2007", "2008", "2009", "2010"], correct: 2 },
  { question: "What does DeFi stand for?", answers: ["Digital Finance", "Decentralized Finance", "Distributed Finance", "Direct Finance"], correct: 1 },
];

export function GameplayScreen({
  onMilestone,
  onElimination,
  onVictory,
  onFeedPot,
  potAmount = 2500,
  question: externalQuestion,
  level: controlledLevel,
  onLevelChange,
}: GameplayScreenProps) {
  const [internalLevel, setInternalLevel] = useState(1);
  const currentLevel = controlledLevel ?? internalLevel;
  const setCurrentLevel = onLevelChange ?? setInternalLevel;
  const [timeLeft, setTimeLeft] = useState(30);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [showLifelines, setShowLifelines] = useState(false);
  const [usedLifelines, setUsedLifelines] = useState<string[]>([]);
  /** 50:50 – indices of answers to hide (two wrong ones) */
  const [eliminatedOptions, setEliminatedOptions] = useState<number[]>([]);
  /** Message shown when Poll / Call / AI lifeline is used */
  const [lifelineMessage, setLifelineMessage] = useState<string | null>(null);

  const questions = defaultQuestions;
  const currentQuestion = externalQuestion
    ? { question: externalQuestion.text, answers: externalQuestion.options, correct: externalQuestion.correctIndex ?? 0 }
    : questions[(currentLevel - 1) % questions.length];
  const ladderLevels = Array.from({ length: 15 }, (_, i) => i + 1).reverse();

  useEffect(() => {
    setEliminatedOptions([]);
    setLifelineMessage(null);
  }, [currentLevel]);

  useEffect(() => {
    if (showResult) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 0) {
          handleWrongAnswer();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [showResult, currentLevel]);

  const handleWrongAnswer = () => {
    onElimination?.();
  };

  const handleAnswer = (index: number) => {
    if (showResult || selectedAnswer !== null) return;
    setSelectedAnswer(index);
    setShowResult(true);
    const correct = index === currentQuestion.correct;
    setIsCorrect(correct);

    setTimeout(() => {
      if (correct) {
        if (currentLevel === 5 || currentLevel === 10) {
          onMilestone?.(currentLevel);
        } else if (currentLevel === 15) {
          onVictory?.();
        } else {
          const next = currentLevel + 1;
          setCurrentLevel(next);
          setSelectedAnswer(null);
          setShowResult(false);
          setTimeLeft(30);
        }
      } else {
        handleWrongAnswer();
      }
    }, 1500);
  };

  /** Pick two distinct wrong answers for 50:50 */
  const getFiftyFiftyIndices = () => {
    const correct = currentQuestion.correct;
    const wrong = [0, 1, 2, 3].filter((i) => i !== correct);
    const shuffled = [...wrong].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, 2);
  };

  const handleLifeline = (type: string) => {
    if (usedLifelines.includes(type)) return;
    setUsedLifelines((prev) => [...prev, type]);
    setShowLifelines(false);

    if (type === "50-50") {
      setEliminatedOptions(getFiftyFiftyIndices());
      return;
    }

    const correctIndex = currentQuestion.correct;
    const letters = ["A", "B", "C", "D"];
    const correctLetter = letters[correctIndex];

    if (type === "poll") {
      const pct = [0, 0, 0, 0];
      pct[correctIndex] = 40 + Math.floor(Math.random() * 15);
      const others = [0, 1, 2, 3].filter((i) => i !== correctIndex);
      const rest = 100 - pct[correctIndex];
      const weights = others.map(() => 0.2 + Math.random() * 0.6);
      const totalW = weights.reduce((a, b) => a + b, 0);
      others.forEach((i, idx) => { pct[i] = Math.round((weights[idx] / totalW) * rest); });
      const sum = pct.reduce((a, b) => a + b, 0);
      pct[correctIndex] += 100 - sum;
      const text = `Audience poll: ${letters.map((l, i) => `${l} ${pct[i]}%`).join(", ")}`;
      setLifelineMessage(text);
    } else if (type === "phone") {
      const hint = Math.random() < 0.85 ? correctLetter : letters[Math.floor(Math.random() * 4)];
      setLifelineMessage(`Your friend says: I think it's ${hint}!`);
    } else if (type === "ai") {
      setLifelineMessage(`AI hint: Strong signal for option ${correctLetter}.`);
    }
  };

  useEffect(() => {
    if (!lifelineMessage) return;
    const t = setTimeout(() => setLifelineMessage(null), 5000);
    return () => clearTimeout(t);
  }, [lifelineMessage]);

  return (
    <div className="min-h-screen flex">
      <div className="w-16 bg-[#0F0F1A] border-r border-[#ffffff15] py-4 flex flex-col-reverse gap-1 overflow-y-auto">
        {ladderLevels.map((level) => {
          const isCurrent = level === currentLevel;
          const isPassed = level < currentLevel;
          const isMilestone = level === 5 || level === 10 || level === 15;
          return (
            <div
              key={level}
              className={`relative flex items-center justify-center h-8 text-xs font-semibold transition-all ${
                isCurrent ? "bg-gradient-to-r from-[#0066FF] to-[#7C3AED] scale-110" : isPassed ? "bg-[#00D08430] text-[#00D084]" : "bg-[#ffffff08] text-gray-500"
              } ${isMilestone ? "h-10 text-sm" : ""}`}
            >
              {isMilestone && isCurrent && <div className="absolute inset-0 bg-gradient-to-r from-[#FFD700] to-[#FFA500] animate-pulse opacity-50" />}
              <span className="relative z-10">{level}</span>
            </div>
          );
        })}
      </div>

      <div className="flex-1 flex flex-col">
        <div className="bg-[#0F0F1A] border-b border-[#ffffff15] p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="text-2xl">💎</span>
              <div>
                <div className="text-xs text-gray-400">Prize Pot</div>
                <div className="font-bold text-[#FFD700]">${potAmount.toLocaleString()}</div>
              </div>
            </div>
            <div className={`relative w-16 h-16 ${timeLeft <= 10 ? "animate-pulse" : ""}`}>
              <svg className="transform -rotate-90 w-full h-full" viewBox="0 0 64 64">
                <circle cx="32" cy="32" r="28" fill="none" stroke="#ffffff15" strokeWidth="4" />
                <circle
                  cx="32"
                  cy="32"
                  r="28"
                  fill="none"
                  stroke={timeLeft <= 10 ? "#FF3B30" : "#0066FF"}
                  strokeWidth="4"
                  strokeDasharray={`${(timeLeft / 30) * 175.93} 175.93`}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className={`text-xl font-bold ${timeLeft <= 10 ? "text-[#FF3B30]" : ""}`}>{timeLeft}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex-1 p-4 overflow-y-auto">
          <div className="mb-4">
            <div className="bg-gradient-to-br from-[#1A1A2E] to-[#0F0F1A] rounded-3xl p-6 border border-[#ffffff15] mb-4">
              <div className="text-xs text-gray-400 mb-2">Question {currentLevel} of 15</div>
              <h2 className="text-xl font-semibold leading-tight">{currentQuestion.question}</h2>
            </div>

            {lifelineMessage && (
              <div className="mb-4 p-4 rounded-2xl bg-[#7C3AED20] border border-[#7C3AED40] text-sm text-[#E9D5FF] animate-fade-in" role="status">
                {lifelineMessage}
              </div>
            )}

            <div className="grid grid-cols-1 gap-3">
              {currentQuestion.answers.map((answer, index) => {
                const eliminated = eliminatedOptions.includes(index);
                if (eliminated) {
                  return (
                    <div
                      key={index}
                      className="p-4 rounded-2xl font-medium text-left bg-[#ffffff05] border-2 border-[#ffffff08] opacity-50 line-through pointer-events-none"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm bg-[#ffffff10] text-gray-500">
                          {String.fromCharCode(65 + index)}
                        </div>
                        <span className="text-gray-500">{answer}</span>
                      </div>
                    </div>
                  );
                }
                const isSelected = selectedAnswer === index;
                const isCorrectAnswer = index === currentQuestion.correct;
                const showCorrect = showResult && isCorrectAnswer;
                const showWrong = showResult && isSelected && !isCorrectAnswer;
                return (
                  <button
                    key={index}
                    type="button"
                    onClick={() => handleAnswer(index)}
                    disabled={showResult}
                    className={`p-4 rounded-2xl font-medium text-left transition-all ${
                      showCorrect
                        ? "bg-[#00D08430] border-2 border-[#00D084] scale-[1.02]"
                        : showWrong
                        ? "bg-[#FF3B3030] border-2 border-[#FF3B30] scale-[0.98]"
                        : isSelected
                        ? "bg-gradient-to-r from-[#0066FF] to-[#7C3AED] border-2 border-transparent"
                        : "bg-[#ffffff08] border-2 border-transparent hover:border-[#0066FF] active:scale-95"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                          showCorrect || showWrong ? "bg-white text-black" : "bg-[#ffffff15]"
                        }`}
                      >
                        {showCorrect ? "✓" : showWrong ? "✗" : String.fromCharCode(65 + index)}
                      </div>
                      <span>{answer}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="bg-[#0F0F1A] border-t border-[#ffffff15] p-4">
          <div className="flex items-center justify-between gap-2 mb-3">
            <button
              type="button"
              onClick={() => setShowLifelines(!showLifelines)}
              className="flex-1 bg-[#ffffff08] hover:bg-[#ffffff12] py-3 rounded-xl font-medium text-sm transition-all"
            >
              🎯 Lifelines
            </button>
            {onFeedPot ? (
              <button
                type="button"
                onClick={onFeedPot}
                className="flex-1 bg-gradient-to-r from-[#0066FF] to-[#7C3AED] py-3 rounded-xl font-medium text-sm hover:scale-[1.02] active:scale-[0.98] transition-transform"
              >
                💰 Feed Pot
              </button>
            ) : (
              <Link href="/feed-pot" className="flex-1 bg-gradient-to-r from-[#0066FF] to-[#7C3AED] py-3 rounded-xl font-medium text-sm hover:scale-[1.02] active:scale-[0.98] transition-transform text-center">
                💰 Feed Pot
              </Link>
            )}
          </div>
          {showLifelines && (
            <div className="grid grid-cols-2 gap-2 mb-3">
              {[
                { id: "50-50", label: "50:50", icon: "⚡" },
                { id: "poll", label: "Poll", icon: "👥" },
                { id: "phone", label: "Call", icon: "📞" },
                { id: "ai", label: "AI Help", icon: "🤖" },
              ].map((ll) => (
                <button
                  key={ll.id}
                  type="button"
                  onClick={() => handleLifeline(ll.id)}
                  disabled={usedLifelines.includes(ll.id)}
                  className={`py-2 px-3 rounded-xl text-xs font-medium transition-all ${
                    usedLifelines.includes(ll.id) ? "bg-[#ffffff05] text-gray-600 line-through" : "bg-[#7C3AED20] text-[#7C3AED] hover:bg-[#7C3AED30] active:scale-95"
                  }`}
                >
                  {ll.icon} {ll.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
