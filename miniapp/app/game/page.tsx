"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArenaFooter } from "../components/ArenaFooter";
import { GameplayScreen } from "../components/figma/GameplayScreen";
import { MilestoneScreen } from "../components/figma/MilestoneScreen";
import { EliminationScreen } from "../components/figma/EliminationScreen";
import { VictoryScreen } from "../components/figma/VictoryScreen";
import { PotFeedOverlay } from "../components/figma/PotFeedOverlay";

type GameScreen = "gameplay" | "milestone" | "elimination" | "victory";

export default function GamePage() {
  const router = useRouter();
  const [screen, setScreen] = useState<GameScreen>("gameplay");
  const [currentLevel, setCurrentLevel] = useState(1);
  const [potAmount, setPotAmount] = useState(2500);
  const [showPotOverlay, setShowPotOverlay] = useState(false);

  const handleMilestone = (level: number) => {
    setCurrentLevel(level);
    setScreen("milestone");
  };

  const handleElimination = () => {
    setScreen("elimination");
  };

  const handleVictory = () => {
    setScreen("victory");
  };

  const handleContinueFromMilestone = () => {
    setCurrentLevel((l) => l + 1);
    setScreen("gameplay");
  };

  const handleFeedPot = (amount: number) => {
    setPotAmount((prev) => prev + amount);
    setShowPotOverlay(false);
  };

  if (screen === "milestone") {
    return (
      <main className="min-h-screen">
        <MilestoneScreen
          level={currentLevel}
          onContinue={handleContinueFromMilestone}
          onCashOut={() => router.push("/lobby")}
        />
        <div className="px-4 pb-8">
          <ArenaFooter />
        </div>
      </main>
    );
  }

  if (screen === "elimination") {
    return (
      <main className="min-h-screen">
        <EliminationScreen
          questionsAnswered={currentLevel - 1}
          rematchHref="/game"
          lobbyHref="/lobby"
        />
        <div className="px-4 pb-8">
          <ArenaFooter />
        </div>
      </main>
    );
  }

  if (screen === "victory") {
    return (
      <main className="min-h-screen">
        <VictoryScreen prizeAmount={Math.floor(potAmount / 2)} lobbyHref="/lobby" />
        <div className="px-4 pb-8">
          <ArenaFooter />
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen">
      <GameplayScreen
        level={currentLevel}
        onLevelChange={setCurrentLevel}
        potAmount={potAmount}
        onMilestone={handleMilestone}
        onElimination={handleElimination}
        onVictory={handleVictory}
        onFeedPot={() => setShowPotOverlay(true)}
      />
      {showPotOverlay && (
        <PotFeedOverlay
          onClose={() => setShowPotOverlay(false)}
          onFeed={handleFeedPot}
        />
      )}
      <div className="px-4 pb-8">
        <ArenaFooter />
      </div>
    </main>
  );
}
