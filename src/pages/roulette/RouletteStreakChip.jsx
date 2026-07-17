import { useCallback, useState } from "react";
import { RouletteWinChip } from "@joker/design-system";

export function RouletteStreakChip({ betColor, multiplier, chipSize }) {
  const [active, setActive] = useState(true);
  const [settled, setSettled] = useState(false);

  const handleAnimationComplete = useCallback(() => {
    setActive(false);
    setSettled(true);
  }, []);

  return (
    <RouletteWinChip
      active={active}
      settled={settled}
      betColor={betColor}
      multiplier={multiplier}
      size={chipSize}
      onAnimationComplete={handleAnimationComplete}
    />
  );
}
