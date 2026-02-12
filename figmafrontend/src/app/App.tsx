import { useState } from 'react';
import { DiscoveryCard } from './components/DiscoveryCard';
import { OnboardingScreen } from './components/OnboardingScreen';
import { LobbyScreen } from './components/LobbyScreen';
import { GameplayScreen } from './components/GameplayScreen';
import { MilestoneScreen } from './components/MilestoneScreen';
import { EliminationScreen } from './components/EliminationScreen';
import { VictoryScreen } from './components/VictoryScreen';
import { PotFeedOverlay } from './components/PotFeedOverlay';
import { DesignSystemOverlay } from './components/DesignSystemOverlay';
import { NavigationHelper } from './components/NavigationHelper';

export type Screen = 
  | 'discovery'
  | 'onboarding'
  | 'lobby'
  | 'gameplay'
  | 'milestone'
  | 'elimination'
  | 'victory';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('discovery');
  const [showPotOverlay, setShowPotOverlay] = useState(false);
  const [showDesignSystem, setShowDesignSystem] = useState(false);
  const [currentLevel, setCurrentLevel] = useState(1);
  const [potAmount, setPotAmount] = useState(2500);

  const handleNavigate = (screen: Screen) => {
    setCurrentScreen(screen);
  };

  const handleFeedPot = (amount: number) => {
    setPotAmount(prev => prev + amount);
    setShowPotOverlay(false);
  };

  return (
    <div className="min-h-screen bg-[#0F0F1A] text-white font-sans antialiased">
      {/* Mobile Frame Container */}
      <div className="mx-auto max-w-[428px] min-h-screen relative">
        {/* Design System Button */}
        {!showDesignSystem && (
          <button
            onClick={() => setShowDesignSystem(true)}
            className="fixed top-4 right-4 z-40 w-12 h-12 bg-gradient-to-r from-[#0066FF] to-[#7C3AED] rounded-full shadow-lg shadow-[#0066FF40] flex items-center justify-center hover:scale-110 active:scale-95 transition-transform"
            title="View Design System"
          >
            <span className="text-xl">🎨</span>
          </button>
        )}

        {currentScreen === 'discovery' && (
          <DiscoveryCard 
            onJoin={() => handleNavigate('onboarding')}
            potAmount={potAmount}
          />
        )}
        
        {currentScreen === 'onboarding' && (
          <OnboardingScreen onContinue={() => handleNavigate('lobby')} />
        )}
        
        {currentScreen === 'lobby' && (
          <LobbyScreen onJoinArena={() => handleNavigate('gameplay')} />
        )}
        
        {currentScreen === 'gameplay' && (
          <GameplayScreen 
            onMilestone={() => handleNavigate('milestone')}
            onElimination={() => handleNavigate('elimination')}
            onVictory={() => handleNavigate('victory')}
            onFeedPot={() => setShowPotOverlay(true)}
            currentLevel={currentLevel}
            setCurrentLevel={setCurrentLevel}
            potAmount={potAmount}
          />
        )}
        
        {currentScreen === 'milestone' && (
          <MilestoneScreen 
            level={currentLevel}
            onContinue={() => handleNavigate('gameplay')}
            onCashOut={() => handleNavigate('lobby')}
          />
        )}
        
        {currentScreen === 'elimination' && (
          <EliminationScreen 
            questionsAnswered={currentLevel - 1}
            onRematch={() => {
              setCurrentLevel(1);
              handleNavigate('gameplay');
            }}
            onLobby={() => handleNavigate('lobby')}
          />
        )}
        
        {currentScreen === 'victory' && (
          <VictoryScreen 
            prizeAmount={potAmount / 2}
            onLobby={() => handleNavigate('lobby')}
          />
        )}

        {showPotOverlay && (
          <PotFeedOverlay 
            onClose={() => setShowPotOverlay(false)}
            onFeed={handleFeedPot}
          />
        )}

        {showDesignSystem && (
          <DesignSystemOverlay 
            onClose={() => setShowDesignSystem(false)}
          />
        )}

        {/* Navigation Helper */}
        {!showDesignSystem && (
          <NavigationHelper 
            currentScreen={currentScreen}
            onNavigate={(screen) => handleNavigate(screen as Screen)}
          />
        )}
      </div>
    </div>
  );
}