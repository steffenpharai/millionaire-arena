import { useEffect, useState } from 'react';

interface VictoryScreenProps {
  prizeAmount: number;
  onLobby: () => void;
}

export function VictoryScreen({ prizeAmount, onLobby }: VictoryScreenProps) {
  const [claimed, setClaimed] = useState(false);
  const [showFireworks, setShowFireworks] = useState(true);

  useEffect(() => {
    // Simulate haptic feedback
    if (navigator.vibrate) {
      navigator.vibrate([200, 100, 200, 100, 200]);
    }
    
    const timer = setTimeout(() => setShowFireworks(false), 4000);
    return () => clearTimeout(timer);
  }, []);

  const handleClaim = () => {
    setClaimed(true);
    // Trigger success toast
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 pb-24 relative overflow-hidden bg-gradient-to-b from-[#0F0F1A] via-[#1A1A2E] to-[#0F0F1A]">
      {/* Fireworks Animation */}
      {showFireworks && (
        <div className="absolute inset-0 pointer-events-none">
          {/* Confetti */}
          {[...Array(100)].map((_, i) => (
            <div
              key={`confetti-${i}`}
              className="absolute w-3 h-3 rounded-full animate-fall"
              style={{
                left: `${Math.random() * 100}%`,
                top: `-${Math.random() * 30}%`,
                backgroundColor: ['#FFD700', '#FFA500', '#0066FF', '#7C3AED', '#00D084'][Math.floor(Math.random() * 5)],
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${2 + Math.random() * 3}s`,
              }}
            />
          ))}
          
          {/* Firework Bursts */}
          {[...Array(5)].map((_, i) => (
            <div
              key={`burst-${i}`}
              className="absolute w-2 h-2 bg-[#FFD700] rounded-full animate-burst"
              style={{
                left: `${20 + i * 15}%`,
                top: '30%',
                animationDelay: `${i * 0.5}s`,
              }}
            />
          ))}
        </div>
      )}

      {/* Content */}
      <div className="relative z-10 text-center max-w-md">
        {/* Trophy */}
        <div className="w-40 h-40 mx-auto mb-6 bg-gradient-to-br from-[#FFD700] to-[#FFA500] rounded-full flex items-center justify-center shadow-2xl shadow-[#FFD70060] animate-bounce-slow">
          <span className="text-8xl">🏆</span>
        </div>

        {/* Headline */}
        <h1 className="text-6xl font-bold mb-4 bg-gradient-to-r from-[#FFD700] via-[#FFA500] to-[#FFD700] bg-clip-text text-transparent animate-gradient">
          You Won!
        </h1>
        
        <p className="text-2xl text-gray-300 mb-8">
          Perfect run! All 15 questions answered! 🎉
        </p>

        {/* Prize Card */}
        <div className="bg-gradient-to-br from-[#FFD70020] to-[#FFA50020] rounded-3xl p-8 border-2 border-[#FFD700] mb-8 backdrop-blur-xl">
          <div className="text-sm text-gray-400 mb-2">Your Prize</div>
          <div className="text-5xl font-bold text-[#FFD700] mb-3">
            ${prizeAmount.toLocaleString()}
          </div>
          <div className="text-sm text-gray-400">in $MILLION tokens</div>
          
          {/* Stats */}
          <div className="mt-6 pt-6 border-t border-[#FFD70030] grid grid-cols-3 gap-4 text-sm">
            <div>
              <div className="font-bold text-white mb-1">15/15</div>
              <div className="text-xs text-gray-400">Correct</div>
            </div>
            <div>
              <div className="font-bold text-white mb-1">100%</div>
              <div className="text-xs text-gray-400">Accuracy</div>
            </div>
            <div>
              <div className="font-bold text-white mb-1">1st</div>
              <div className="text-xs text-gray-400">Place</div>
            </div>
          </div>
        </div>

        {/* Claim Button */}
        {!claimed ? (
          <button
            onClick={handleClaim}
            className="w-full bg-gradient-to-r from-[#FFD700] to-[#FFA500] text-black font-bold py-5 rounded-2xl hover:scale-[1.02] active:scale-[0.98] transition-transform shadow-2xl shadow-[#FFD70060] mb-4"
          >
            💰 Claim Prize (Gasless)
          </button>
        ) : (
          <div className="bg-[#00D08430] border-2 border-[#00D084] rounded-2xl p-4 mb-4">
            <div className="flex items-center justify-center gap-2 text-[#00D084] font-semibold">
              <span className="text-2xl">✓</span>
              <span>Prize Claimed Successfully!</span>
            </div>
            <div className="text-xs text-gray-400 mt-2">
              Transaction confirmed in 0.8s • 0 gas fees
            </div>
          </div>
        )}

        {/* Share Card Preview */}
        <div className="bg-gradient-to-br from-[#1A1A2E] to-[#0F0F1A] rounded-2xl p-5 border border-[#ffffff15] mb-4">
          <div className="text-xs text-gray-400 mb-3 text-left">Share your victory:</div>
          
          {/* Mini Preview Card */}
          <div className="bg-[#0F0F1A] rounded-xl p-4 border border-[#FFD70030] mb-3">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-2xl">💎</span>
              <div className="text-left flex-1">
                <div className="font-bold text-sm">I just won ${prizeAmount.toLocaleString()}!</div>
                <div className="text-xs text-gray-400">Millionaire Arena • Base</div>
              </div>
            </div>
            <div className="flex gap-2">
              {[...Array(15)].map((_, i) => (
                <div key={i} className="h-1.5 flex-1 bg-[#00D084] rounded-full" />
              ))}
            </div>
          </div>
          
          <button className="w-full bg-[#0066FF15] hover:bg-[#0066FF25] text-[#0066FF] font-medium py-3 rounded-xl transition-all">
            📤 Share to Chat
          </button>
        </div>

        {/* Actions */}
        <div className="space-y-3">
          <button
            onClick={onLobby}
            className="w-full bg-gradient-to-r from-[#0066FF] to-[#7C3AED] text-white font-semibold py-4 rounded-2xl hover:scale-[1.02] active:scale-[0.98] transition-transform"
          >
            Play Another Round
          </button>
          
          <button className="w-full bg-[#ffffff08] hover:bg-[#ffffff12] text-white font-medium py-3 rounded-2xl transition-all text-sm">
            View Leaderboard
          </button>
        </div>

        {/* Achievement Badge */}
        <div className="mt-8 inline-flex items-center gap-2 bg-[#7C3AED20] border border-[#7C3AED] rounded-full px-4 py-2 text-sm">
          <span className="text-lg">🌟</span>
          <span className="text-[#7C3AED] font-semibold">New Achievement: Perfect Victory!</span>
        </div>
      </div>

      <style>{`
        @keyframes fall {
          to {
            transform: translateY(100vh) rotate(720deg);
            opacity: 0;
          }
        }
        @keyframes burst {
          0% {
            transform: scale(0);
            opacity: 1;
          }
          100% {
            transform: scale(20);
            opacity: 0;
          }
        }
        @keyframes bounce-slow {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-20px);
          }
        }
        @keyframes gradient {
          0%, 100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }
        .animate-fall {
          animation: fall linear forwards;
        }
        .animate-burst {
          animation: burst 1s ease-out forwards;
        }
        .animate-bounce-slow {
          animation: bounce-slow 2s ease-in-out infinite;
        }
        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 3s ease infinite;
        }
      `}</style>
    </div>
  );
}