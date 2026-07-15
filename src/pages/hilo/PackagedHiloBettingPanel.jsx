import { HiLoBettingPanel as JokerHiLoBettingPanel } from "@joker/design-system";

export function PackagedHiloBettingPanel({
  awaitingHiloChoice = false,
  betAmount,
  gameInPlay,
  hasBetAmount = false,
  higherOdds,
  layout = "desktop",
  lowerOdds,
  onBetAmountChange,
  onCashout,
  onHigherSame,
  onLowerSame,
  onPlaceBet,
  onSkipCard,
  selectedOddsValue,
  skipAvailable,
}) {
  const isMobileLayout = layout === "mobile";

  function handleBetAmountChange(event) {
    onBetAmountChange(event.currentTarget.value.replace(/[^\d.]/g, ""));
  }

  const panelClassName = [
    gameInPlay ? "" : "is-hilo-pre-game",
    !gameInPlay && hasBetAmount ? "is-hilo-pre-game-ready" : "",
    awaitingHiloChoice ? "is-awaiting-hilo-choice" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <JokerHiLoBettingPanel
      layout={layout}
      betAmount={betAmount}
      className={panelClassName}
      onBetAmountChange={handleBetAmountChange}
      onPlaceBet={onPlaceBet}
      onCashout={onCashout}
      onLowerSame={onLowerSame}
      onHigherSame={onHigherSame}
      onSkipCard={!isMobileLayout && gameInPlay && skipAvailable ? onSkipCard : undefined}
      inGame={gameInPlay}
      cashoutLabel="Cashout"
      lowerLabel="Lower / Same"
      higherLabel="Higher / Same"
      lowerOdds={lowerOdds}
      higherOdds={higherOdds}
      selectedOddsValue={selectedOddsValue}
      skipLabel={skipAvailable ? "Skip Card" : "Skip Used"}
      disablePlaceBetUntilBetAmount
    />
  );
}
