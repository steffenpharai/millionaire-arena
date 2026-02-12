interface DiscoveryCardProps {
  onJoin: () => void;
  potAmount: number;
}

export function DiscoveryCard({ onJoin, potAmount }: DiscoveryCardProps) {
  return (
    <div className="flex items-center justify-center min-h-screen p-6 pb-24">
      {/* Welcome Tooltip */}
      <div className="fixed top-20 left-1/2 -translate-x-1/2 z-30 max-w-xs animate-fade-in">
        <div className="bg-gradient-to-r from-[#0066FF] to-[#7C3AED] rounded-2xl p-4 shadow-2xl shadow-[#0066FF40] border border-[#ffffff20]">
          <p className="text-sm font-medium text-center mb-2">
            👋 Welcome to the Prototype!
          </p>
          <p className="text-xs text-center opacity-90">
            Use the navigation bar at the bottom to explore all screens, or click the 🎨 button to view the design system.
          </p>
        </div>
      </div>

      <div className="w-full max-w-sm">
        {/* Chat Message Bubble Context */}
        <div className="mb-4 flex items-start gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#0066FF] to-[#7C3AED] flex items-center justify-center text-sm font-semibold">
            AI
          </div>
          <div className="flex-1 bg-[#1A1A2E] rounded-2xl rounded-tl-none p-3 text-sm">
            Hey! I just found an epic trivia battle happening now. Want to join?
          </div>
        </div>

        {/* Unfurl Card */}
        <div className="bg-gradient-to-b from-[#1A1A2E] to-[#0F0F1A] rounded-3xl overflow-hidden border border-[#ffffff15] backdrop-blur-xl">
          {/* Header */}
          <div className="p-6 pb-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-br from-[#FFD700] to-[#FFA500] rounded-lg flex items-center justify-center">
                  <span className="text-lg">💎</span>
                </div>
                <span className="font-semibold">Millionaire Arena</span>
              </div>
              <span className="px-2 py-1 bg-[#00D08420] text-[#00D084] text-xs rounded-full font-medium">
                LIVE
              </span>
            </div>
            
            <h3 className="text-2xl font-bold mb-1">
              Battle for ${(potAmount).toLocaleString()}
            </h3>
            <p className="text-sm text-gray-400">
              Real-time trivia • Skill-based • Winner takes all
            </p>
          </div>

          {/* Stats Grid */}
          <div className="px-6 pb-4 grid grid-cols-3 gap-3">
            <div className="bg-[#ffffff08] rounded-xl p-3 text-center">
              <div className="text-2xl font-bold text-[#0066FF]">{potAmount}</div>
              <div className="text-xs text-gray-400 mt-1">$MILLION</div>
            </div>
            <div className="bg-[#ffffff08] rounded-xl p-3 text-center">
              <div className="text-2xl font-bold text-[#7C3AED]">12</div>
              <div className="text-xs text-gray-400 mt-1">Players</div>
            </div>
            <div className="bg-[#ffffff08] rounded-xl p-3 text-center">
              <div className="text-2xl font-bold text-[#00D084]">Q8</div>
              <div className="text-xs text-gray-400 mt-1">Level</div>
            </div>
          </div>

          {/* Ladder Preview */}
          <div className="px-6 pb-4">
            <div className="flex items-center gap-1 justify-center">
              {[...Array(15)].map((_, i) => (
                <div 
                  key={i}
                  className={`h-2 flex-1 rounded-full transition-all ${
                    i < 7 ? 'bg-[#00D084]' : i === 7 ? 'bg-[#0066FF] animate-pulse' : 'bg-[#ffffff15]'
                  }`}
                />
              ))}
            </div>
            <div className="text-xs text-center text-gray-400 mt-2">
              8 of 15 questions
            </div>
          </div>

          {/* CTA */}
          <div className="p-6 pt-0">
            <button 
              onClick={onJoin}
              className="w-full bg-gradient-to-r from-[#0066FF] to-[#7C3AED] text-white font-semibold py-4 rounded-2xl hover:scale-[1.02] active:scale-[0.98] transition-transform shadow-lg shadow-[#0066FF40]"
            >
              Join Arena Now
            </button>
            
            {/* Gasless Badge */}
            <div className="flex items-center justify-center gap-2 mt-3 text-xs text-gray-400">
              <div className="w-1.5 h-1.5 bg-[#00D084] rounded-full animate-pulse" />
              <span>Gasless – Sponsored by Paymaster</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}