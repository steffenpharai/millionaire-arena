import { useState, useEffect } from 'react';

interface GameplayScreenProps {
  onMilestone: () => void;
  onElimination: () => void;
  onVictory: () => void;
  onFeedPot: () => void;
  currentLevel: number;
  setCurrentLevel: (level: number) => void;
  potAmount: number;
}

interface Question {
  question: string;
  answers: string[];
  correct: number;
  aiVersion?: string;
}

const questions: Question[] = [
  {
    question: "What is the native token of the Base blockchain?",
    answers: ["BASE", "ETH", "USDC", "CBETH"],
    correct: 1,
    aiVersion: "d2hhdCBpcyBuYXRpdmUgdG9rZW4gb2YgQmFzZQ=="
  },
  {
    question: "Which layer does Base operate on?",
    answers: ["Layer 1", "Layer 2", "Layer 3", "Sidechain"],
    correct: 1,
    aiVersion: "TGF5ZXIgZm9yIEJhc2UgY2hhaW4/"
  },
  {
    question: "What consensus mechanism does Ethereum use?",
    answers: ["Proof of Work", "Proof of Stake", "Proof of Authority", "Delegated PoS"],
    correct: 1,
  },
  {
    question: "In what year was Bitcoin created?",
    answers: ["2007", "2008", "2009", "2010"],
    correct: 2,
  },
  {
    question: "What does DeFi stand for?",
    answers: ["Digital Finance", "Decentralized Finance", "Distributed Finance", "Direct Finance"],
    correct: 1,
  },
];

interface Player {
  id: number;
  name: string;
  avatar: string;
  score: number;
  isAI: boolean;
  status: 'active' | 'eliminated';
}

const mockPlayers: Player[] = [
  { id: 1, name: 'You', avatar: '😎', score: 0, isAI: false, status: 'active' },
  { id: 2, name: 'CryptoKing', avatar: '👑', score: 0, isAI: false, status: 'active' },
  { id: 3, name: 'Agent Alpha', avatar: '🤖', score: 0, isAI: true, status: 'active' },
  { id: 4, name: 'TriviaMaster', avatar: '🧠', score: 0, isAI: false, status: 'active' },
  { id: 5, name: 'Web3Wizard', avatar: '🧙', score: 0, isAI: false, status: 'active' },
];

export function GameplayScreen({ 
  onMilestone, 
  onElimination, 
  onVictory, 
  onFeedPot,
  currentLevel,
  setCurrentLevel,
  potAmount 
}: GameplayScreenProps) {
  const [timeLeft, setTimeLeft] = useState(30);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [players, setPlayers] = useState(mockPlayers);
  const [showLifelines, setShowLifelines] = useState(false);
  const [usedLifelines, setUsedLifelines] = useState<string[]>([]);

  const currentQuestion = questions[(currentLevel - 1) % questions.length];
  const ladderLevels = Array.from({ length: 15 }, (_, i) => i + 1).reverse();

  useEffect(() => {
    if (showResult) return;
    
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 0) {
          handleWrongAnswer();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [showResult, currentLevel]);

  const handleAnswer = (index: number) => {
    if (showResult || selectedAnswer !== null) return;
    
    setSelectedAnswer(index);
    setShowResult(true);
    const correct = index === currentQuestion.correct;
    setIsCorrect(correct);

    setTimeout(() => {
      if (correct) {
        if (currentLevel === 5 || currentLevel === 10) {
          onMilestone();
        } else if (currentLevel === 15) {
          onVictory();
        } else {
          nextQuestion();
        }
      } else {
        handleWrongAnswer();
      }
    }, 1500);
  };

  const nextQuestion = () => {
    setCurrentLevel(currentLevel + 1);
    setSelectedAnswer(null);
    setShowResult(false);
    setTimeLeft(30);
    
    // Update player scores
    setPlayers(prev => prev.map(p => ({
      ...p,
      score: p.score + (Math.random() > 0.3 ? 1 : 0)
    })));
  };

  const handleWrongAnswer = () => {
    onElimination();
  };

  const handleLifeline = (type: string) => {
    if (usedLifelines.includes(type)) return;
    setUsedLifelines([...usedLifelines, type]);
    setShowLifelines(false);
    // Lifeline logic would go here
  };

  return (
    <div className="min-h-screen flex">
      {/* Ladder Sidebar */}
      <div className="w-16 bg-[#0F0F1A] border-r border-[#ffffff15] py-4 flex flex-col-reverse gap-1 overflow-y-auto">
        {ladderLevels.map(level => {
          const isCurrent = level === currentLevel;
          const isPassed = level < currentLevel;
          const isMilestone = level === 5 || level === 10 || level === 15;
          
          return (
            <div
              key={level}
              className={`relative flex items-center justify-center h-8 text-xs font-semibold transition-all ${
                isCurrent
                  ? 'bg-gradient-to-r from-[#0066FF] to-[#7C3AED] scale-110'
                  : isPassed
                  ? 'bg-[#00D08430] text-[#00D084]'
                  : 'bg-[#ffffff08] text-gray-500'
              } ${isMilestone ? 'h-10 text-sm' : ''}`}
            >
              {isMilestone && isCurrent && (
                <div className="absolute inset-0 bg-gradient-to-r from-[#FFD700] to-[#FFA500] animate-pulse opacity-50" />
              )}
              <span className="relative z-10">{level}</span>
            </div>
          );
        })}
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-[#0F0F1A] border-b border-[#ffffff15] p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="text-2xl">💎</span>
              <div>
                <div className="text-xs text-gray-400">Prize Pot</div>
                <div className="font-bold text-[#FFD700]">${potAmount.toLocaleString()}</div>
              </div>
            </div>
            
            {/* Timer */}
            <div className={`relative w-16 h-16 ${timeLeft <= 10 ? 'animate-pulse' : ''}`}>
              <svg className="transform -rotate-90" viewBox="0 0 64 64">
                <circle
                  cx="32"
                  cy="32"
                  r="28"
                  fill="none"
                  stroke="#ffffff15"
                  strokeWidth="4"
                />
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
                <span className={`text-xl font-bold ${timeLeft <= 10 ? 'text-[#FF3B30]' : ''}`}>
                  {timeLeft}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Question Card */}
        <div className="flex-1 p-4 overflow-y-auto">
          <div className="mb-4">
            <div className="bg-gradient-to-br from-[#1A1A2E] to-[#0F0F1A] rounded-3xl p-6 border border-[#ffffff15] mb-4">
              <div className="text-xs text-gray-400 mb-2">Question {currentLevel} of 15</div>
              <h2 className="text-xl font-semibold leading-tight">
                {currentQuestion.question}
              </h2>
            </div>

            {/* Answer Grid */}
            <div className="grid grid-cols-1 gap-3">
              {currentQuestion.answers.map((answer, index) => {
                const isSelected = selectedAnswer === index;
                const isCorrectAnswer = index === currentQuestion.correct;
                const showCorrect = showResult && isCorrectAnswer;
                const showWrong = showResult && isSelected && !isCorrectAnswer;

                return (
                  <button
                    key={index}
                    onClick={() => handleAnswer(index)}
                    disabled={showResult}
                    className={`p-4 rounded-2xl font-medium text-left transition-all ${
                      showCorrect
                        ? 'bg-[#00D08430] border-2 border-[#00D084] scale-[1.02]'
                        : showWrong
                        ? 'bg-[#FF3B3030] border-2 border-[#FF3B30] scale-[0.98]'
                        : isSelected
                        ? 'bg-gradient-to-r from-[#0066FF] to-[#7C3AED] border-2 border-transparent'
                        : 'bg-[#ffffff08] border-2 border-transparent hover:border-[#0066FF] active:scale-95'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                        showCorrect || showWrong
                          ? 'bg-white text-black'
                          : 'bg-[#ffffff15]'
                      }`}>
                        {showCorrect ? '✓' : showWrong ? '✗' : String.fromCharCode(65 + index)}
                      </div>
                      <span>{answer}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Lifelines & Actions */}
        <div className="bg-[#0F0F1A] border-t border-[#ffffff15] p-4">
          <div className="flex items-center justify-between gap-2 mb-3">
            <button 
              onClick={() => setShowLifelines(!showLifelines)}
              className="flex-1 bg-[#ffffff08] hover:bg-[#ffffff12] py-3 rounded-xl font-medium text-sm transition-all"
            >
              🎯 Lifelines
            </button>
            <button 
              onClick={onFeedPot}
              className="flex-1 bg-gradient-to-r from-[#0066FF] to-[#7C3AED] py-3 rounded-xl font-medium text-sm hover:scale-[1.02] active:scale-[0.98] transition-transform"
            >
              💰 Feed Pot
            </button>
          </div>

          {showLifelines && (
            <div className="grid grid-cols-2 gap-2 mb-3">
              {[
                { id: '50-50', label: '50:50', icon: '⚡' },
                { id: 'poll', label: 'Poll', icon: '👥' },
                { id: 'phone', label: 'Call', icon: '📞' },
                { id: 'ai', label: 'AI Help', icon: '🤖' },
              ].map(lifeline => (
                <button
                  key={lifeline.id}
                  onClick={() => handleLifeline(lifeline.id)}
                  disabled={usedLifelines.includes(lifeline.id)}
                  className={`py-2 px-3 rounded-xl text-xs font-medium transition-all ${
                    usedLifelines.includes(lifeline.id)
                      ? 'bg-[#ffffff05] text-gray-600 line-through'
                      : 'bg-[#7C3AED20] text-[#7C3AED] hover:bg-[#7C3AED30] active:scale-95'
                  }`}
                >
                  {lifeline.icon} {lifeline.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Leaderboard Sidebar (Hidden on small screens) */}
      <div className="hidden lg:block w-64 bg-[#0F0F1A] border-l border-[#ffffff15] p-4 overflow-y-auto">
        <h3 className="font-bold mb-3 text-sm text-gray-400">LEADERBOARD</h3>
        <div className="space-y-2">
          {players
            .sort((a, b) => b.score - a.score)
            .map((player, index) => (
              <div
                key={player.id}
                className={`flex items-center gap-2 p-2 rounded-xl ${
                  player.status === 'eliminated'
                    ? 'opacity-40'
                    : index === 0
                    ? 'bg-gradient-to-r from-[#FFD70020] to-[#FFA50020]'
                    : 'bg-[#ffffff05]'
                }`}
              >
                <span className="text-lg">{player.avatar}</span>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium truncate">{player.name}</div>
                  <div className="text-xs text-gray-400">Q{player.score}</div>
                </div>
                {player.isAI && (
                  <span className="text-xs bg-[#7C3AED20] text-[#7C3AED] px-2 py-0.5 rounded-full">
                    AI
                  </span>
                )}
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
