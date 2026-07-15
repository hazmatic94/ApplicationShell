import { CoinFlipBettingPanel as JokerCoinFlipBettingPanel } from "@joker/design-system";

export function PackagedCoinFlipBettingPanel({
  betAmount,
  inGame = false,
  isFlipping,
  layout = "desktop",
  oddsOptions,
  onBetAmountChange,
  onCashout,
  onFlipCoin,
  onPlaceBet,
  onRoundsToWinChange,
  onSideChange,
  roundLocked = false,
  roundsToWinValue,
  defaultRoundsToWinValue = "4",
  selectedSide,
}) {
  function handleBetAmountChange(event) {
    if (roundLocked) return;

    onBetAmountChange(event.currentTarget.value.replace(/\D/g, ""));
  }

  function handleOddsValueChange(value, option) {
    if (isFlipping) return;

    onSideChange(value, option);
  }

  function handleRoundsToWinChange(value, option) {
    if (roundLocked) return;

    onRoundsToWinChange?.(value, option);
  }

  function handlePlaceBet(event) {
    if (isFlipping) return;

    onPlaceBet(event);
  }

  function handleFlipCoin(event) {
    if (isFlipping) return;

    onFlipCoin(event);
  }

  function handleCashout(event) {
    if (isFlipping) return;

    onCashout(event);
  }

  return (
    <JokerCoinFlipBettingPanel
      layout={layout}
      className={[isFlipping ? "is-coin-flipping" : "", roundLocked ? "is-round-locked" : ""]
        .filter(Boolean)
        .join(" ")}
      betAmount={betAmount}
      inGame={inGame}
      selectedOddsValue={selectedSide}
      defaultSelectedOddsValue="heads"
      onBetAmountChange={handleBetAmountChange}
      onOddsValueChange={handleOddsValueChange}
      onPlaceBet={inGame ? handleFlipCoin : handlePlaceBet}
      onCashout={handleCashout}
      onRoundsToWinChange={handleRoundsToWinChange}
      oddsOptions={oddsOptions}
      roundsToWinValue={roundsToWinValue}
      defaultRoundsToWinValue={defaultRoundsToWinValue}
      submitLabel="Flip Coin"
      flipCoinLabel="Flip Coin"
      cashoutLabel="Cashout"
      disablePlaceBetUntilBetAmount
    />
  );
}
