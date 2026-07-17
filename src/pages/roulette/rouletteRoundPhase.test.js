import { describe, expect, it } from "vitest";
import {
  ROULETTE_ROUND_PHASE,
  getRouletteCelebrationVariant,
  isRouletteRoundEnding,
  isRouletteRoundLocked,
  isRouletteSpinLocked,
} from "./rouletteRoundPhase.js";

describe("rouletteRoundPhase", () => {
  it("maps celebration variants from round phase", () => {
    expect(getRouletteCelebrationVariant(ROULETTE_ROUND_PHASE.IDLE)).toBeNull();
    expect(getRouletteCelebrationVariant(ROULETTE_ROUND_PHASE.SPINNING)).toBeNull();
    expect(getRouletteCelebrationVariant(ROULETTE_ROUND_PHASE.CELEBRATE_WIN)).toBe("win");
    expect(getRouletteCelebrationVariant(ROULETTE_ROUND_PHASE.CELEBRATE_LOSS)).toBe("lose");
  });

  it("locks the round for the full loss phase", () => {
    expect(isRouletteRoundLocked(ROULETTE_ROUND_PHASE.CELEBRATE_LOSS)).toBe(true);
    expect(isRouletteRoundLocked(ROULETTE_ROUND_PHASE.CELEBRATE_WIN)).toBe(false);
    expect(isRouletteRoundEnding(ROULETTE_ROUND_PHASE.CELEBRATE_LOSS)).toBe(true);
  });

  it("blocks spins while spinning or ending a loss round", () => {
    expect(isRouletteSpinLocked(ROULETTE_ROUND_PHASE.IDLE, false)).toBe(false);
    expect(isRouletteSpinLocked(ROULETTE_ROUND_PHASE.SPINNING, false)).toBe(true);
    expect(isRouletteSpinLocked(ROULETTE_ROUND_PHASE.CELEBRATE_LOSS, false)).toBe(true);
    expect(isRouletteSpinLocked(ROULETTE_ROUND_PHASE.IDLE, true)).toBe(true);
  });
});
