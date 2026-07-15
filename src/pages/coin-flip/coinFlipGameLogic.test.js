import { describe, expect, it } from "vitest";
import {
  calculateCoinFlipMultiplier,
  calculateCoinFlipProfit,
  formatCoinFlipMultiplier,
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
});
