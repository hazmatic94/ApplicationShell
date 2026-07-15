import { FourDMinesBettingPanel, normalizeFourDNumber } from "@joker/design-system";
import { formatCurrency } from "../../shared/formatting.js";
import { minFourDMinesAmount } from "./fourDMinesConfig.js";
import { clampFourDMinesAmount } from "./fourDMinesGameLogic.js";

export function PackagedFourDMinesBettingPanel({
  betAmount,
  currentProfit,
  gameInPlay,
  layout = "desktop",
  mines,
  minesAmountOptions,
  multiplier,
  nextMultiplier,
  nextProfit,
  onBetAmountChange,
  onFourDNumberChange,
  onMinesChange,
  onPlaceBet,
}) {
  function handleBetAmountChange(event) {
    onBetAmountChange(event.currentTarget.value.replace(/[^\d.]/g, ""));
  }

  function handleMinesAmountChange(nextValue) {
    onMinesChange(String(clampFourDMinesAmount(nextValue)));
  }

  function handleFourDNumberChange(nextValue) {
    onFourDNumberChange(normalizeFourDNumber(nextValue));
  }

  return (
    <FourDMinesBettingPanel
      layout={layout}
      onPlaceBet={onPlaceBet}
      onCashout={onPlaceBet}
      inGame={gameInPlay}
      cashoutLabel="Cashout"
      inGameCardProps={{
        currentProfit: formatCurrency(currentProfit),
        nextValue: formatCurrency(nextProfit),
        currentMultiplier: `${multiplier.toFixed(2)}x`,
        nextMultiplier: `${nextMultiplier.toFixed(2)}x`,
      }}
      betAmount={betAmount}
      onBetAmountChange={handleBetAmountChange}
      disablePlaceBetUntilBetAmount
      minesAmountOptions={minesAmountOptions}
      defaultMinesAmount={String(minFourDMinesAmount)}
      minesAmount={mines}
      onMinesAmountChange={handleMinesAmountChange}
      onFourDNumberChange={handleFourDNumberChange}
    />
  );
}

