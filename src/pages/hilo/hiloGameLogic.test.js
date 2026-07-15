import { describe, expect, it } from "vitest";
import {
  calculateHiloOdds,
  calculateHiloPayout,
  calculateProjectedHiloMultiplier,
  createHiloDeck,
  createHiloHistoryEntry,
  formatHiloPercent,
  getHiloHistoryChipVariant,
  getHiloHistoryConnectorVariant,
  resolveHiloPrediction,
  updateHiloHistory,
} from "./hiloGameLogic.js";

const card = (rank, value, suit = "hearts") => ({
  rank,
  value,
  suit,
  tone: "red",
  id: `${suit}-${rank}`,
});

describe("hiloGameLogic", () => {
  it("builds a full 52-card deck", () => {
    expect(createHiloDeck()).toHaveLength(52);
  });

  it("calculates higher/lower odds from remaining deck", () => {
    const current = card("7", 7);
    const deck = [card("2", 2), card("K", 13)];

    const odds = calculateHiloOdds(current, deck);

    expect(odds.lowerPercent).toBe(50);
    expect(odds.higherPercent).toBe(50);
  });

  it("derives payout from probability with house edge", () => {
    expect(calculateHiloPayout(0)).toBe(1);
    expect(calculateHiloPayout(0.5)).toBeCloseTo(1.92);
    expect(calculateHiloPayout(0.01)).toBeGreaterThanOrEqual(1.01);
  });

  it("projects the next multiplier from current streak", () => {
    expect(calculateProjectedHiloMultiplier(2, 0.5)).toBeCloseTo(3.84);
  });

  it("resolves higher and lower predictions inclusively", () => {
    const low = card("5", 5);
    const high = card("9", 9);
    const equal = card("7", 7);

    expect(resolveHiloPrediction("higher", low, high)).toBe(true);
    expect(resolveHiloPrediction("higher", high, low)).toBe(false);
    expect(resolveHiloPrediction("lower", high, low)).toBe(true);
    expect(resolveHiloPrediction("higher", equal, equal)).toBe(true);
    expect(resolveHiloPrediction("lower", equal, equal)).toBe(true);
  });

  it("formats history chips and connectors", () => {
    const entry = createHiloHistoryEntry(card("A", 1), "Win");

    expect(entry.chip).toBe("Win");
    expect(getHiloHistoryChipVariant("start")).toBe("start");
    expect(getHiloHistoryConnectorVariant("up")).toBe("higher");
    expect(formatHiloPercent(12.345)).toBe("12.35%");
  });

  it("links history entries with direction", () => {
    const history = [
      createHiloHistoryEntry(card("A", 1), "Start", "start"),
      createHiloHistoryEntry(card("5", 5), "Higher", "win"),
    ];
    const next = createHiloHistoryEntry(card("9", 9), "Higher", "win");

    const updated = updateHiloHistory(history, "up", next);

    expect(updated[1].next).toBe("up");
    expect(updated[2]).toEqual(next);
  });
});
