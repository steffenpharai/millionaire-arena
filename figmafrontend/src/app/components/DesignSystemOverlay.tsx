interface DesignSystemOverlayProps {
  onClose: () => void;
}

export function DesignSystemOverlay({ onClose }: DesignSystemOverlayProps) {
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-[#0F0F1A]">
      <div className="min-h-screen p-6 pb-20">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Millionaire Arena</h1>
            <p className="text-gray-400">Design System & Component Library</p>
          </div>
          <button 
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-[#ffffff08] hover:bg-[#ffffff12] flex items-center justify-center"
          >
            ✕
          </button>
        </div>

        {/* Color Palette */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Color Palette</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            <div className="space-y-2">
              <div className="h-20 bg-[#0066FF] rounded-xl flex items-center justify-center text-sm font-semibold">
                Base Blue
              </div>
              <div className="text-xs text-gray-400">#0066FF</div>
            </div>
            <div className="space-y-2">
              <div className="h-20 bg-[#7C3AED] rounded-xl flex items-center justify-center text-sm font-semibold">
                Purple
              </div>
              <div className="text-xs text-gray-400">#7C3AED</div>
            </div>
            <div className="space-y-2">
              <div className="h-20 bg-[#0F0F1A] border border-[#ffffff30] rounded-xl flex items-center justify-center text-sm font-semibold">
                Dark BG
              </div>
              <div className="text-xs text-gray-400">#0F0F1A</div>
            </div>
            <div className="space-y-2">
              <div className="h-20 bg-[#00D084] rounded-xl flex items-center justify-center text-sm font-semibold text-black">
                Success
              </div>
              <div className="text-xs text-gray-400">#00D084</div>
            </div>
            <div className="space-y-2">
              <div className="h-20 bg-[#FF3B30] rounded-xl flex items-center justify-center text-sm font-semibold">
                Warning
              </div>
              <div className="text-xs text-gray-400">#FF3B30</div>
            </div>
            <div className="space-y-2">
              <div className="h-20 bg-gradient-to-r from-[#FFD700] to-[#FFA500] rounded-xl flex items-center justify-center text-sm font-semibold text-black">
                Gold
              </div>
              <div className="text-xs text-gray-400">#FFD700</div>
            </div>
          </div>
        </section>

        {/* Typography */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Typography</h2>
          <div className="space-y-4 bg-[#1A1A2E] rounded-2xl p-6">
            <div>
              <div className="text-5xl font-bold mb-2">Heading 1</div>
              <div className="text-xs text-gray-400">48px • Bold (700) • Inter</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">Heading 2</div>
              <div className="text-xs text-gray-400">36px • Bold (700) • Inter</div>
            </div>
            <div>
              <div className="text-2xl font-semibold mb-2">Heading 3</div>
              <div className="text-xs text-gray-400">24px • Semibold (600) • Inter</div>
            </div>
            <div>
              <div className="text-xl font-semibold mb-2">Heading 4</div>
              <div className="text-xs text-gray-400">20px • Semibold (600) • Inter</div>
            </div>
            <div>
              <div className="text-base mb-2">Body Text</div>
              <div className="text-xs text-gray-400">16px • Regular (400) • Inter</div>
            </div>
            <div>
              <div className="text-sm mb-2">Small Text</div>
              <div className="text-xs text-gray-400">14px • Regular (400) • Inter</div>
            </div>
          </div>
        </section>

        {/* Buttons */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Buttons</h2>
          <div className="space-y-4">
            <div>
              <button className="w-full bg-gradient-to-r from-[#0066FF] to-[#7C3AED] text-white font-semibold py-4 rounded-2xl">
                Primary Button
              </button>
              <div className="text-xs text-gray-400 mt-2">Gradient • Rounded-2xl • Font-semibold</div>
            </div>
            <div>
              <button className="w-full bg-[#ffffff08] hover:bg-[#ffffff12] text-white font-medium py-4 rounded-2xl">
                Secondary Button
              </button>
              <div className="text-xs text-gray-400 mt-2">Glass effect • Hover state</div>
            </div>
            <div>
              <button className="w-full bg-gradient-to-r from-[#FFD700] to-[#FFA500] text-black font-bold py-4 rounded-2xl">
                Gold CTA Button
              </button>
              <div className="text-xs text-gray-400 mt-2">Gold gradient • High emphasis</div>
            </div>
          </div>
        </section>

        {/* Cards */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Cards</h2>
          <div className="space-y-4">
            <div className="bg-gradient-to-br from-[#1A1A2E] to-[#0F0F1A] rounded-3xl p-6 border border-[#ffffff15]">
              <h3 className="font-bold mb-2">Standard Card</h3>
              <p className="text-sm text-gray-400">Glassmorphism effect with subtle gradient and border</p>
            </div>
            <div className="bg-[#0066FF15] border border-[#0066FF30] rounded-2xl p-4">
              <h3 className="font-semibold text-sm mb-1">Info Card</h3>
              <p className="text-xs text-gray-400">Colored background for emphasis</p>
            </div>
          </div>
        </section>

        {/* Components */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Components</h2>
          
          <div className="space-y-6">
            {/* Badges */}
            <div>
              <h3 className="font-semibold mb-3">Badges</h3>
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 bg-[#00D08420] text-[#00D084] text-sm rounded-full font-medium">
                  LIVE
                </span>
                <span className="px-3 py-1 bg-[#0066FF20] text-[#0066FF] text-sm rounded-full font-medium">
                  AI
                </span>
                <span className="px-3 py-1 bg-[#FF3B3020] text-[#FF3B30] text-sm rounded-full font-medium">
                  Starting
                </span>
              </div>
            </div>

            {/* Progress Bars */}
            <div>
              <h3 className="font-semibold mb-3">Progress Bars</h3>
              <div className="space-y-2">
                <div className="h-2 bg-[#ffffff08] rounded-full overflow-hidden">
                  <div className="h-full w-3/4 bg-gradient-to-r from-[#0066FF] to-[#7C3AED] rounded-full" />
                </div>
                <div className="flex gap-1">
                  {[...Array(15)].map((_, i) => (
                    <div 
                      key={i}
                      className={`h-2 flex-1 rounded-full ${
                        i < 8 ? 'bg-[#00D084]' : 'bg-[#ffffff15]'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Avatars */}
            <div>
              <h3 className="font-semibold mb-3">Avatars</h3>
              <div className="flex gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#0066FF] to-[#7C3AED] flex items-center justify-center">
                  <span className="text-xl">😎</span>
                </div>
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#FFD700] to-[#FFA500] flex items-center justify-center">
                  <span className="text-xl">💎</span>
                </div>
                <div className="w-12 h-12 rounded-full bg-[#ffffff08] flex items-center justify-center">
                  <span className="text-xl">🤖</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Animations */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Animations</h2>
          <div className="bg-[#1A1A2E] rounded-2xl p-6 space-y-4">
            <div>
              <div className="text-sm font-medium mb-2">Pulse Animation</div>
              <div className="w-12 h-12 bg-[#0066FF] rounded-full animate-pulse" />
            </div>
            <div>
              <div className="text-sm font-medium mb-2">Scale on Hover</div>
              <button className="px-6 py-3 bg-[#7C3AED] rounded-xl hover:scale-110 active:scale-95 transition-transform">
                Hover Me
              </button>
            </div>
            <div>
              <div className="text-sm font-medium mb-2">Gradient Animation</div>
              <div className="text-2xl font-bold bg-gradient-to-r from-[#0066FF] via-[#7C3AED] to-[#0066FF] bg-clip-text text-transparent">
                Animated Text
              </div>
            </div>
          </div>
        </section>

        {/* Accessibility */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Accessibility</h2>
          <div className="bg-[#1A1A2E] rounded-2xl p-6 space-y-3 text-sm">
            <div className="flex items-center gap-3">
              <span className="text-[#00D084]">✓</span>
              <span>WCAG AA compliant (4.5:1 contrast minimum)</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-[#00D084]">✓</span>
              <span>Focus states on all interactive elements</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-[#00D084]">✓</span>
              <span>Screen reader labels and ARIA attributes</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-[#00D084]">✓</span>
              <span>Dark mode optimized for reduced eye strain</span>
            </div>
          </div>
        </section>

        {/* Screens */}
        <section>
          <h2 className="text-2xl font-bold mb-4">Screen Flows</h2>
          <div className="bg-[#1A1A2E] rounded-2xl p-6">
            <ol className="space-y-2 text-sm">
              <li className="flex items-center gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[#0066FF] flex items-center justify-center text-xs">1</span>
                <span>Discovery Card → Chat embed preview</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[#0066FF] flex items-center justify-center text-xs">2</span>
                <span>Onboarding → Sign in with Base</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[#0066FF] flex items-center justify-center text-xs">3</span>
                <span>Lobby → Browse and join arenas</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[#0066FF] flex items-center justify-center text-xs">4</span>
                <span>Gameplay → Answer questions with lifelines</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[#0066FF] flex items-center justify-center text-xs">5</span>
                <span>Milestone → Q5, Q10, Q15 celebrations</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[#0066FF] flex items-center justify-center text-xs">6</span>
                <span>Elimination → Stats recap and rematch</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[#0066FF] flex items-center justify-center text-xs">7</span>
                <span>Victory → Claim prize and share</span>
              </li>
            </ol>
          </div>
        </section>
      </div>
    </div>
  );
}
