interface NavigationHelperProps {
  currentScreen: string;
  onNavigate: (screen: string) => void;
}

export function NavigationHelper({ currentScreen, onNavigate }: NavigationHelperProps) {
  const screens = [
    { id: 'discovery', label: 'Discovery', icon: '🔍' },
    { id: 'onboarding', label: 'Onboarding', icon: '👋' },
    { id: 'lobby', label: 'Lobby', icon: '🏛️' },
    { id: 'gameplay', label: 'Game', icon: '🎮' },
    { id: 'milestone', label: 'Milestone', icon: '🏆' },
    { id: 'elimination', label: 'Loss', icon: '😔' },
    { id: 'victory', label: 'Win', icon: '🎉' },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-[#0F0F1A]/95 border-t border-[#ffffff15] backdrop-blur-lg p-2 z-50 overflow-x-auto">
      <div className="flex gap-1 justify-center min-w-max mx-auto">
        {screens.map(screen => (
          <button
            key={screen.id}
            onClick={() => onNavigate(screen.id)}
            className={`px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap ${
              currentScreen === screen.id
                ? 'bg-gradient-to-r from-[#0066FF] to-[#7C3AED] scale-105'
                : 'bg-[#ffffff08] hover:bg-[#ffffff12]'
            }`}
          >
            <span className="mr-1">{screen.icon}</span>
            {screen.label}
          </button>
        ))}
      </div>
      <div className="text-center text-[10px] text-gray-600 mt-1">
        Prototype Navigation
      </div>
    </div>
  );
}