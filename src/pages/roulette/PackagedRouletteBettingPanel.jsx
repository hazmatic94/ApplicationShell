import { playPlaceBetSound } from "../../shared/gameSounds.js";
import {
  RouletteBettingPanel as JokerRouletteBettingPanel,
} from "@joker/design-system";

export function PackagedRouletteBettingPanel({
  betAmount,
  inGame = false,
  isSpinning = false,
  layout = "desktop",
  oddsOptions,
  onBetAmountChange,
  onCashout,
  onOddsChange,
  onPlaceBet,
  selectedOdds,
}) {
  function handleBetAmountChange(event) {
    if (inGame || isSpinning) return;

    onBetAmountChange(event.currentTarget.value.replace(/\D/g, ""));
  }

  function handleOddsChange(value, option) {
    if (isSpinning) return;

    onOddsChange?.(value, option);
  }

  function handlePlaceBet(event) {
    if (isSpinning) return;

    playPlaceBetSound();
    onPlaceBet?.(event);
  }

  function handleCashout(event) {
    if (isSpinning) return;

    onCashout?.(event);
  }

  return (
    <JokerRouletteBettingPanel
      layout={layout}
      betAmount={betAmount}
      selectedOddsValue={selectedOdds}
      defaultSelectedOddsValue="red"
      onBetAmountChange={handleBetAmountChange}
      onOddsValueChange={handleOddsChange}
      onPlaceBet={handlePlaceBet}
      onCashout={handleCashout}
      oddsOptions={oddsOptions}
      oddsLayout="stacked"
      showOdds
      inGame={inGame}
      disablePlaceBetUntilBetAmount
    />
  );
}
