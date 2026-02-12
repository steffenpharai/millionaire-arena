import { useState } from 'react';

interface OnboardingScreenProps {
  onContinue: () => void;
}

export function OnboardingScreen({ onContinue }: OnboardingScreenProps) {
  const [animateStep, setAnimateStep] = useState(0);

  useState(() => {
    const timer = setInterval(() => {
      setAnimateStep(prev => (prev < 15 ? prev + 1 : prev));
    }, 150);
    return () => clearInterval(timer);
  });

  return (
    <div className="min-h-screen flex flex-col items-center justify-between p-6 py-12 pb-24">
      {/* Hero Section */}
      <div className="flex-1 flex flex-col items-center justify-center text-center">
        <div className="w-24 h-24 bg-gradient-to-br from-[#FFD700] to-[#FFA500] rounded-3xl flex items-center justify-center mb-6 shadow-2xl shadow-[#FFD70050] animate-pulse">
          <span className="text-5xl">💎</span>
        </div>
        
        <h1 className="text-4xl font-bold mb-3 bg-gradient-to-r from-[#0066FF] to-[#7C3AED] bg-clip-text text-transparent">
          Millionaire Arena
        </h1>
        
        <p className="text-xl font-semibold mb-2">
          Battle for real $MILLION prizes
        </p>
        
        <p className="text-gray-400 max-w-xs mb-8">
          Skill only, no purchase necessary. Answer 15 questions to win the pot.
        </p>

        {/* Ladder Teaser Animation */}
        <div className="mb-8">
          <div className="flex flex-col gap-2 items-center">
            {[...Array(15)].reverse().map((_, i) => {
              const level = 15 - i;
              const isActive = level <= animateStep;
              const isMilestone = level === 5 || level === 10 || level === 15;
              
              return (
                <div 
                  key={level}
                  className={`flex items-center gap-3 transition-all duration-300 ${
                    isActive ? 'opacity-100 scale-100' : 'opacity-30 scale-95'
                  }`}
                >
                  <span className="text-xs text-gray-500 w-6 text-right">{level}</span>
                  <div className={`h-3 w-32 rounded-full transition-all duration-300 ${
                    isActive 
                      ? isMilestone 
                        ? 'bg-gradient-to-r from-[#FFD700] to-[#FFA500] shadow-lg shadow-[#FFD70050]'
                        : 'bg-gradient-to-r from-[#0066FF] to-[#7C3AED]'
                      : 'bg-[#ffffff15]'
                  }`} />
                  {isMilestone && (
                    <span className={`text-xs font-semibold transition-opacity ${
                      isActive ? 'opacity-100' : 'opacity-0'
                    }`}>
                      {level === 15 ? '🏆' : '✓'}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Value Props */}
        <div className="space-y-3 text-sm text-left max-w-xs mb-8">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#0066FF20] flex items-center justify-center flex-shrink-0">
              <span className="text-[#0066FF]">⚡</span>
            </div>
            <span className="text-gray-300">Gasless transactions - no fees</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#7C3AED20] flex items-center justify-center flex-shrink-0">
              <span className="text-[#7C3AED]">👥</span>
            </div>
            <span className="text-gray-300">Battle 5-20 players in real-time</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#00D08420] flex items-center justify-center flex-shrink-0">
              <span className="text-[#00D084]">🤖</span>
            </div>
            <span className="text-gray-300">Challenge AI agents in their language</span>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="w-full max-w-sm space-y-4">
        <button 
          onClick={onContinue}
          className="w-full bg-gradient-to-r from-[#0066FF] to-[#7C3AED] text-white font-semibold py-4 rounded-2xl hover:scale-[1.02] active:scale-[0.98] transition-transform shadow-lg shadow-[#0066FF40]"
        >
          Sign in with Base
        </button>
        
        <p className="text-xs text-center text-gray-500">
          By continuing, you agree to our{' '}
          <button className="text-[#0066FF] underline">Terms</button> and{' '}
          <button className="text-[#0066FF] underline">Privacy Policy</button>
        </p>
      </div>
    </div>
  );
}