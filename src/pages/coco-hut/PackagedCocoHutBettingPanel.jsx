import { CocoHutBettingPanel as JokerCocoHutBettingPanel } from "@joker/design-system";

export function PackagedCocoHutBettingPanel({
  betAmount,
  difficulty,
  layout = "desktop",
  onBetAmountChange,
  onDifficultyChange,
  onPlaceBet,
}) {
  function handleBetAmountChange(event) {
    onBetAmountChange(event.currentTarget.value.replace(/[^\d.]/g, ""));
  }

  return (
    <JokerCocoHutBettingPanel
      layout={layout}
      betAmount={betAmount}
      difficulty={difficulty}
      onBetAmountChange={handleBetAmountChange}
      onDifficultyChange={onDifficultyChange}
      onPlaceBet={onPlaceBet}
      disablePlaceBetUntilBetAmount
    />
  );
}
