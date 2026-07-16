import {
  RouletteWheelAnimated,
  ROULETTE_WHEEL_FILL_CONTAINER_SIZE,
} from "@joker/design-system";
import "@joker/design-system/styles/roulette.css";

export function RouletteWheelSlot({
  onSpinComplete,
  onSpinningChange,
  spinRequestId,
}) {
  return (
    <div className="game-area-wheel" style={{ flex: 1, minHeight: 0 }}>
      <RouletteWheelAnimated
        size={ROULETTE_WHEEL_FILL_CONTAINER_SIZE}
        fillContainer
        showSpinButton={false}
        showResultText={false}
        soundEnabled={false}
        spinRequestId={spinRequestId}
        onSpinningChange={onSpinningChange}
        onSpinComplete={onSpinComplete}
      />
    </div>
  );
}
