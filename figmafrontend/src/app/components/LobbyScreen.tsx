import { useState } from 'react';

interface LobbyScreenProps {
  onJoinArena: () => void;
}

interface Arena {
  id: number;
  pot: number;
  players: number;
  maxPlayers: number;
  timeLeft: string;
  theme: string;
  status: 'open' | 'starting' | 'live';
}

const mockArenas: Arena[] = [
  { id: 1, pot: 5000, players: 8, maxPlayers: 12, timeLeft: '2m', theme: 'General Knowledge', status: 'starting' },
  { id: 2, pot: 12500, players: 15, maxPlayers: 20, timeLeft: '45s', theme: 'Crypto & Web3', status: 'open' },
  { id: 3, pot: 3200, players: 6, maxPlayers: 10, timeLeft: 'Live', theme: 'Science', status: 'live' },
  { id: 4, pot: 8900, players: 11, maxPlayers: 15, timeLeft: '5m', theme: 'Pop Culture', status: 'open' },
  { id: 5, pot: 2100, players: 4, maxPlayers: 8, timeLeft: '8m', theme: 'History', status: 'open' },
];

export function LobbyScreen({ onJoinArena }: LobbyScreenProps) {
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'open' | 'high' | 'friends'>('all');

  const filters = [
    { id: 'all', label: 'All Arenas' },
    { id: 'open', label: 'Open Now' },
    { id: 'high', label: 'High Pot' },
    { id: 'friends', label: 'Friends' },
  ];

  return (
    <div className="min-h-screen pb-32">
      {/* Header */}
      <div className="sticky top-0 bg-[#0F0F1A] border-b border-[#ffffff15] backdrop-blur-xl z-10">
        <div className="p-6 pb-4">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold">Arena Lobby</h1>
            <button className="w-10 h-10 rounded-full bg-[#ffffff08] flex items-center justify-center">
              <span className="text-xl">⚙️</span>
            </button>
          </div>
          
          {/* Filter Chips */}
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {filters.map(filter => (
              <button
                key={filter.id}
                onClick={() => setSelectedFilter(filter.id as any)}
                className={`px-4 py-2 rounded-full font-medium text-sm whitespace-nowrap transition-all ${
                  selectedFilter === filter.id
                    ? 'bg-gradient-to-r from-[#0066FF] to-[#7C3AED] text-white'
                    : 'bg-[#ffffff08] text-gray-400 hover:bg-[#ffffff12]'
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Arena List */}
      <div className="p-6 space-y-4">
        {mockArenas.map(arena => (
          <button
            key={arena.id}
            onClick={onJoinArena}
            className="w-full bg-gradient-to-br from-[#1A1A2E] to-[#0F0F1A] rounded-3xl p-5 border border-[#ffffff15] hover:border-[#0066FF] hover:scale-[1.02] active:scale-[0.98] transition-all text-left"
          >
            {/* Header Row */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-gradient-to-br from-[#0066FF] to-[#7C3AED] rounded-xl flex items-center justify-center">
                  <span className="text-lg">💎</span>
                </div>
                <div>
                  <div className="font-semibold">{arena.theme}</div>
                  <div className="text-xs text-gray-400">Arena #{arena.id}</div>
                </div>
              </div>
              
              <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                arena.status === 'live' 
                  ? 'bg-[#FF3B3020] text-[#FF3B30]' 
                  : arena.status === 'starting'
                  ? 'bg-[#FFA50020] text-[#FFA500]'
                  : 'bg-[#00D08420] text-[#00D084]'
              }`}>
                {arena.status === 'live' ? '🔴 LIVE' : arena.status === 'starting' ? '⏱️ Starting' : '✓ Open'}
              </div>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-3 gap-3 mb-3">
              <div>
                <div className="text-xl font-bold text-[#FFD700]">
                  ${(arena.pot).toLocaleString()}
                </div>
                <div className="text-xs text-gray-400">Prize Pot</div>
              </div>
              <div>
                <div className="text-xl font-bold text-[#0066FF]">
                  {arena.players}/{arena.maxPlayers}
                </div>
                <div className="text-xs text-gray-400">Players</div>
              </div>
              <div>
                <div className="text-xl font-bold text-[#7C3AED]">
                  {arena.timeLeft}
                </div>
                <div className="text-xs text-gray-400">
                  {arena.status === 'live' ? 'In Progress' : 'Starts in'}
                </div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="relative h-2 bg-[#ffffff08] rounded-full overflow-hidden">
              <div 
                className="absolute inset-y-0 left-0 bg-gradient-to-r from-[#0066FF] to-[#7C3AED] rounded-full transition-all"
                style={{ width: `${(arena.players / arena.maxPlayers) * 100}%` }}
              />
            </div>
          </button>
        ))}
      </div>

      {/* Floating Action Button */}
      <button 
        onClick={onJoinArena}
        className="fixed bottom-20 right-6 w-16 h-16 bg-gradient-to-r from-[#0066FF] to-[#7C3AED] rounded-2xl shadow-2xl shadow-[#0066FF60] flex items-center justify-center hover:scale-110 active:scale-95 transition-transform z-40"
      >
        <span className="text-3xl">+</span>
      </button>
    </div>
  );
}