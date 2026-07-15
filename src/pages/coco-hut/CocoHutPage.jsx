import { useState } from "react";
import { GameShell } from "@joker/design-system";
import cocoHutBackground from "../../../assets/cocohut-bg.png?url";
import { formatBalance } from "../../shared/formatting.js";
import { useGameShellBettingPanelLayout } from "../../shared/hooks.js";
import { PackagedCocoHutBettingPanel } from "./PackagedCocoHutBettingPanel.jsx";
import { cocoHutNavigationPreset } from "./cocoHutConfig.js";

export function CocoHutPage({ onGameChange }) {
  const [betAmount, setBetAmount] = useState("");
  const [balance] = useState(150000);
  const [difficulty, setDifficulty] = useState("tourist");
  const bettingPanelLayout = useGameShellBettingPanelLayout();

  function handleBetAction() {
    // Coco Hut gameplay will be wired here without touching the other games.
  }

  return (
    <>
      <style>
        {`
          .joker-coco-hut-stage {
            min-height: 100%;
            background:
              linear-gradient(180deg, rgba(0, 0, 0, 0.08), rgba(0, 0, 0, 0.16)),
              url("${cocoHutBackground}") center / cover no-repeat;
          }
        `}
      </style>
      <GameShell
        balance={formatBalance(balance)}
        className="joker-game-shell--coco-hut"
        defaultValue={cocoHutNavigationPreset.defaultValue}
        game={cocoHutNavigationPreset.game}
        onValueChange={onGameChange}
        value={cocoHutNavigationPreset.selectedValue}
        bettingPanel={
          <PackagedCocoHutBettingPanel
            betAmount={betAmount}
            difficulty={difficulty}
            layout={bettingPanelLayout}
            onBetAmountChange={setBetAmount}
            onDifficultyChange={setDifficulty}
            onPlaceBet={handleBetAction}
          />
        }
      >
        <section className="joker-coco-hut-stage" aria-label="Coco Hut game area" />
      </GameShell>
    </>
  );
}
