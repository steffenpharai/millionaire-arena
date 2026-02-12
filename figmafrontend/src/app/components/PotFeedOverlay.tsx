import { useState } from 'react';

interface PotFeedOverlayProps {
  onClose: () => void;
  onFeed: (amount: number) => void;
}

interface Contributor {
  id: number;
  name: string;
  avatar: string;
  amount: number;
  badge?: string;
}

const topContributors: Contributor[] = [
  { id: 1, name: 'CryptoWhale', avatar: '🐋', amount: 5000, badge: '👑' },
  { id: 2, name: 'TokenKing', avatar: '👑', amount: 3500, badge: '🥈' },
  { id: 3, name: 'DeFiMaster', avatar: '🧙', amount: 2200, badge: '🥉' },
  { id: 4, name: 'Web3Wizard', avatar: '✨', amount: 1800 },
  { id: 5, name: 'BlockchainPro', avatar: '⛓️', amount: 1500 },
];

export function PotFeedOverlay({ onClose, onFeed }: PotFeedOverlayProps) {
  const [customAmount, setCustomAmount] = useState('');
  const [selectedPreset, setSelectedPreset] = useState<number | null>(null);
  const [showPreview, setShowPreview] = useState(false);

  const presets = [10, 50, 100, 250];

  const handlePreset = (amount: number) => {
    setSelectedPreset(amount);
    setCustomAmount('');
    setShowPreview(true);
  };

  const handleCustomChange = (value: string) => {
    setCustomAmount(value);
    setSelectedPreset(null);
    if (value) setShowPreview(true);
  };

  const handleConfirm = () => {
    const amount = selectedPreset || parseInt(customAmount) || 0;
    if (amount > 0) {
      onFeed(amount);
    }
  };

  const currentAmount = selectedPreset || parseInt(customAmount) || 0;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-gradient-to-b from-[#1A1A2E] to-[#0F0F1A] rounded-t-3xl sm:rounded-3xl w-full max-w-md max-h-[90vh] overflow-y-auto border-t sm:border border-[#ffffff20] shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-b from-[#1A1A2E] to-transparent p-6 pb-4 z-10">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-2xl font-bold">Feed the Pot</h2>
            <button 
              onClick={onClose}
              className="w-10 h-10 rounded-full bg-[#ffffff08] hover:bg-[#ffffff12] flex items-center justify-center transition-all"
            >
              ✕
            </button>
          </div>
          <p className="text-sm text-gray-400">
            Support players and increase the prize pool
          </p>
        </div>

        {/* Content */}
        <div className="px-6 pb-6">
          {/* Quick Presets */}
          <div className="mb-6">
            <div className="text-sm font-medium text-gray-400 mb-3">Quick Amount</div>
            <div className="grid grid-cols-4 gap-2">
              {presets.map(amount => (
                <button
                  key={amount}
                  onClick={() => handlePreset(amount)}
                  className={`py-4 rounded-xl font-semibold transition-all ${
                    selectedPreset === amount
                      ? 'bg-gradient-to-r from-[#0066FF] to-[#7C3AED] scale-95'
                      : 'bg-[#ffffff08] hover:bg-[#ffffff12]'
                  }`}
                >
                  {amount}
                </button>
              ))}
            </div>
          </div>

          {/* Custom Amount */}
          <div className="mb-6">
            <div className="text-sm font-medium text-gray-400 mb-3">Custom Amount</div>
            <div className="relative">
              <input
                type="number"
                value={customAmount}
                onChange={(e) => handleCustomChange(e.target.value)}
                placeholder="Enter amount"
                className="w-full bg-[#ffffff08] border border-[#ffffff15] rounded-xl px-4 py-4 text-lg font-semibold focus:outline-none focus:border-[#0066FF] transition-all"
              />
              <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 font-medium">
                $MILLION
              </div>
            </div>
          </div>

          {/* Transaction Preview */}
          {showPreview && currentAmount > 0 && (
            <div className="bg-[#0066FF15] border border-[#0066FF30] rounded-2xl p-4 mb-6">
              <div className="text-xs text-gray-400 mb-3">Transaction Preview</div>
              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Amount</span>
                  <span className="font-semibold">{currentAmount} $MILLION</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Network Fee</span>
                  <span className="font-semibold text-[#00D084]">0 (Gasless)</span>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-[#ffffff15]">
                  <span className="text-gray-400">You Pay</span>
                  <span className="font-bold text-lg">{currentAmount} $MILLION</span>
                </div>
              </div>
            </div>
          )}

          {/* Confirm Button */}
          <button
            onClick={handleConfirm}
            disabled={currentAmount === 0}
            className={`w-full font-bold py-4 rounded-2xl transition-all mb-4 ${
              currentAmount > 0
                ? 'bg-gradient-to-r from-[#0066FF] to-[#7C3AED] hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-[#0066FF40]'
                : 'bg-[#ffffff08] text-gray-600 cursor-not-allowed'
            }`}
          >
            {currentAmount > 0 ? `Feed ${currentAmount} $MILLION` : 'Enter Amount'}
          </button>

          {/* Gasless Badge */}
          <div className="flex items-center justify-center gap-2 text-xs text-gray-400 mb-6">
            <div className="w-1.5 h-1.5 bg-[#00D084] rounded-full animate-pulse" />
            <span>Gasless transaction sponsored by Base Paymaster</span>
          </div>

          {/* Top Contributors */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="text-sm font-medium text-gray-400">Top Contributors</div>
              <button className="text-xs text-[#0066FF] hover:underline">View All</button>
            </div>
            
            <div className="space-y-2">
              {topContributors.map((contributor, index) => (
                <div
                  key={contributor.id}
                  className={`flex items-center gap-3 p-3 rounded-xl transition-all ${
                    index < 3
                      ? 'bg-gradient-to-r from-[#FFD70010] to-[#FFA50010] border border-[#FFD70030]'
                      : 'bg-[#ffffff05]'
                  }`}
                >
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <span className="text-2xl">{contributor.avatar}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1">
                        <span className="text-sm font-medium truncate">{contributor.name}</span>
                        {contributor.badge && (
                          <span className="text-lg">{contributor.badge}</span>
                        )}
                      </div>
                      <div className="text-xs text-gray-400">${contributor.amount.toLocaleString()} contributed</div>
                    </div>
                  </div>
                  
                  <div className="text-sm font-bold text-[#FFD700]">
                    #{index + 1}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Benefits */}
          <div className="mt-6 bg-[#7C3AED15] border border-[#7C3AED30] rounded-2xl p-4">
            <div className="text-sm font-semibold mb-2 text-[#7C3AED]">
              🎁 Contributor Benefits
            </div>
            <ul className="text-xs text-gray-400 space-y-1">
              <li>• Earn XP and climb the contributor leaderboard</li>
              <li>• Get exclusive badges and profile flair</li>
              <li>• Access to VIP spectator features</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
