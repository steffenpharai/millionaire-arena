interface EliminationScreenProps {
  questionsAnswered: number;
  onRematch: () => void;
  onLobby: () => void;
}

export function EliminationScreen({ questionsAnswered, onRematch, onLobby }: EliminationScreenProps) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 pb-24 relative overflow-hidden">
      {/* Fade Effect */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#FF3B3010] to-[#FF3B3020]" />

      {/* Content */}
      <div className="relative z-10 text-center max-w-sm">
        {/* Sad Icon */}
        <div className="w-32 h-32 mx-auto mb-6 bg-gradient-to-br from-[#FF3B3020] to-[#FF3B3010] rounded-full flex items-center justify-center animate-pulse">
          <span className="text-6xl">😔</span>
        </div>

        {/* Headline */}
        <h1 className="text-4xl font-bold mb-3">
          Better Luck Next Time
        </h1>
        
        <p className="text-xl text-gray-400 mb-8">
          You've been eliminated from this round
        </p>

        {/* Stats Recap */}
        <div className="bg-gradient-to-br from-[#1A1A2E] to-[#0F0F1A] rounded-3xl p-6 border border-[#ffffff15] mb-8">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-3xl font-bold text-[#0066FF] mb-1">
                {questionsAnswered}
              </div>
              <div className="text-xs text-gray-400">Questions Answered</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-[#7C3AED] mb-1">
                {Math.floor(questionsAnswered * 10 * (1 + Math.random()))}
              </div>
              <div className="text-xs text-gray-400">Pot Contribution</div>
            </div>
          </div>
          
          <div className="mt-4 pt-4 border-t border-[#ffffff15]">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-400">Your Rank</span>
              <span className="font-bold text-[#FFD700]">#3 of 12</span>
            </div>
          </div>
        </div>

        {/* Encouraging Message */}
        <div className="bg-[#0066FF15] rounded-2xl p-4 mb-8 border border-[#0066FF30]">
          <p className="text-sm text-gray-300">
            💡 <span className="font-semibold">Pro Tip:</span> Use your lifelines early to build momentum!
          </p>
        </div>

        {/* Actions */}
        <div className="space-y-3">
          <button
            onClick={onRematch}
            className="w-full bg-gradient-to-r from-[#0066FF] to-[#7C3AED] text-white font-semibold py-4 rounded-2xl hover:scale-[1.02] active:scale-[0.98] transition-transform shadow-lg shadow-[#0066FF40]"
          >
            🔄 Play Again
          </button>
          
          <button
            onClick={onLobby}
            className="w-full bg-[#ffffff08] hover:bg-[#ffffff12] text-white font-medium py-4 rounded-2xl transition-all"
          >
            Back to Lobby
          </button>
          
          <button
            className="w-full bg-transparent text-[#0066FF] font-medium py-3 rounded-2xl hover:bg-[#0066FF10] transition-all"
          >
            📤 Share Result
          </button>
        </div>

        {/* Bottom Stats */}
        <div className="mt-8 flex items-center justify-center gap-6 text-xs text-gray-500">
          <div className="text-center">
            <div className="font-bold text-white mb-1">156</div>
            <div>Total Games</div>
          </div>
          <div className="w-px h-8 bg-[#ffffff15]" />
          <div className="text-center">
            <div className="font-bold text-white mb-1">42%</div>
            <div>Win Rate</div>
          </div>
          <div className="w-px h-8 bg-[#ffffff15]" />
          <div className="text-center">
            <div className="font-bold text-white mb-1">$8.5K</div>
            <div>Total Won</div>
          </div>
        </div>
      </div>
    </div>
  );
}