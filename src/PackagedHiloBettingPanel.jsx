import { useState } from "react";
import {
  BettingPanelSurface,
  MobileHiLoOddsGroup,
  OddsButtonGroup,
} from "@joker/design-system";

export function PackagedHiloBettingPanel({ layout = "desktop" }) {
  const [betAmount, setBetAmount] = useState("");
  const [prediction, setPrediction] = useState("");
  const isMobileLayout = layout === "mobile";
  const hasBetAmount = String(betAmount).trim().length > 0;

  function handleBetAmountChange(event) {
    const nextValue = event.currentTarget.value.replace(/[^\d.]/g, "");
    setBetAmount(nextValue);

    if (!nextValue.trim()) {
      setPrediction("");
    }
  }

  const panelClassName = [
    "joker-hilo-betting-panel",
    !hasBetAmount ? "is-hilo-pre-game" : "is-hilo-pre-game-ready",
    hasBetAmount && !prediction ? "is-awaiting-hilo-choice" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <BettingPanelSurface
      ariaLabel={
        isMobileLayout ? "HiLo mobile betting panel" : "HiLo betting panel"
      }
      className={panelClassName}
      layout={layout}
      betAmount={betAmount}
      onBetAmountChange={handleBetAmountChange}
      onPlaceBet={() => {}}
      disablePlaceBetUntilBetAmount
    >
      {isMobileLayout ? (
        <MobileHiLoOddsGroup
          className="joker-hilo-betting-actions"
          value={prediction}
          onValueChange={setPrediction}
        />
      ) : (
        <OddsButtonGroup
          className="joker-hilo-betting-actions"
          ariaLabel="HiLo choice"
          layout="stacked"
          showOdds={false}
          showDirection
          value={prediction}
          onValueChange={setPrediction}
          options={[
            {
              value: "lower",
              label: "Lower / Same",
              odds: "76.39%",
              direction: "down",
            },
            {
              value: "higher",
              label: "Higher / Same",
              odds: "30.76%",
              direction: "up",
            },
          ]}
        />
      )}
    </BettingPanelSurface>
  );
}
