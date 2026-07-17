import { describe, expect, it } from "vitest";
import {
  calculateRouletteStreakProfit,
  didRouletteBetWin,
  formatRouletteResultLabel,
  formatRouletteStreakWinMultiplier,
  getRouletteFairBaseMultiplier,
  getRouletteOddsOptions,
  getRouletteWinBaseMultiplier,
} from "./rouletteGameLogic.js";

describe("rouletteGameLogic", () => {
  it("uses higher fair odds for green bets", () => {
    expect(getRouletteFairBaseMultiplier("red")).toBe(2);
    expect(getRouletteFairBaseMultiplier("green")).toBe(36);
  });

  it("applies RTP to base multipliers", () => {
    expect(getRouletteWinBaseMultiplier("red")).toBeCloseTo(1.92);
    expect(getRouletteWinBaseMultiplier("green")).toBeCloseTo(34.56);
  });

  it("compounds streak multipliers for display", () => {
    expect(formatRouletteStreakWinMultiplier("red", 2)).toBe("7.68x");
  });

  it("sums streak profits across wins", () => {
    const profit = calculateRouletteStreakProfit(100, [
      { betColor: "red" },
      { betColor: "black" },
    ]);

    expect(profit).toBe(576);
  });

  it("resolves bet outcomes from wheel results", () => {
    expect(didRouletteBetWin("green", 0)).toBe(true);
    expect(didRouletteBetWin("green", 7)).toBe(false);
    expect(didRouletteBetWin("red", 1)).toBe(true);
    expect(didRouletteBetWin("black", 1)).toBe(false);
    expect(didRouletteBetWin("red", 0)).toBe(false);
    expect(didRouletteBetWin("black", 0)).toBe(false);
  });

  it("formats result labels", () => {
    expect(formatRouletteResultLabel(0, "green")).toBe("0");
    expect(formatRouletteResultLabel(7, "red")).toBe("7 red");
  });

  it("doubles displayed odds for each streak win", () => {
    const firstSpin = getRouletteOddsOptions("100", 0);
    const secondSpin = getRouletteOddsOptions("100", 1);

    expect(firstSpin[0].odds).toBe("192");
    expect(secondSpin[0].odds).toBe("384");
  });
});
