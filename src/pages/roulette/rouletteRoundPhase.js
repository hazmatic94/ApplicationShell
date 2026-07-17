export const ROULETTE_ROUND_PHASE = {
  IDLE: "idle",
  SPINNING: "spinning",
  CELEBRATE_WIN: "celebrate-win",
  CELEBRATE_LOSS: "celebrate-loss",
};

export function getRouletteCelebrationVariant(roundPhase) {
  if (roundPhase === ROULETTE_ROUND_PHASE.CELEBRATE_WIN) {
    return "win";
  }

  if (roundPhase === ROULETTE_ROUND_PHASE.CELEBRATE_LOSS) {
    return "lose";
  }

  return null;
}

export function isRouletteRoundLocked(roundPhase) {
  return roundPhase === ROULETTE_ROUND_PHASE.CELEBRATE_LOSS;
}

export function isRouletteSpinLocked(roundPhase, isWheelSpinning) {
  return roundPhase === ROULETTE_ROUND_PHASE.SPINNING || isWheelSpinning || isRouletteRoundLocked(roundPhase);
}

export function isRouletteRoundEnding(roundPhase) {
  return roundPhase === ROULETTE_ROUND_PHASE.CELEBRATE_LOSS;
}
