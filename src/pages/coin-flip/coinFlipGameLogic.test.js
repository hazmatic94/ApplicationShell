import { describe, expect, it } from "vitest";
import {
  calculateCoinFlipMultiplier,
  calculateCoinFlipProfit,
  formatCoinFlipMultiplier,
  getCoinFlipOddsOptions,
  getCoinFlipProgressionStepCount,
} from "./coinFlipGameLogic.js";

describe("coinFlipGameLogic", () => {
  it("returns base multiplier before any wins", () => {
    expect(calculateCoinFlipMultiplier(0)).toBe(1);
  });

  it("doubles payout per win with RTP applied", () => {
    expect(calculateCoinFlipMultiplier(1)).toBeCloseTo(1.92);
    expect(calculateCoinFlipMultiplier(4)).toBeCloseTo(15.36);
  });

  it("calculates profit from stake and win streak", () => {
    expect(calculateCoinFlipProfit(100, 0)).toBe(0);
    expect(calculateCoinFlipProfit(100, 2)).toBe(384);
  });

  it("formats multipliers for display", () => {
    expect(formatCoinFlipMultiplier(1.92)).toBe("1.92x");
  });

  it("grows progression steps with streak length", () => {
    expect(getCoinFlipProgressionStepCount(0)).toBe(4);
    expect(getCoinFlipProgressionStepCount(4)).toBe(5);
    expect(getCoinFlipProgressionStepCount(7)).toBe(8);
  });

  it("shows next win payout from current streak", () => {
    const idleOptions = getCoinFlipOddsOptions(100, 0);
    expect(idleOptions[0].odds).toBe("192");

    const streakOptions = getCoinFlipOddsOptions(100, 2);
    expect(streakOptions[0].odds).toBe("768");
  });
});
