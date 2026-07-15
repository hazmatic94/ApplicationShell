import { describe, expect, it } from "vitest";
import {
  blockTileWithShield,
  calculateMultiplier,
  clampTileAmount,
  countSafeReveals,
  createMineTiles,
  getTileContent,
} from "./minesGameLogic.jsx";

describe("minesGameLogic", () => {
  it("creates sequential tile ids", () => {
    expect(createMineTiles(3)).toEqual([1, 2, 3]);
  });

  it("clamps dynamite count to valid range", () => {
    expect(clampTileAmount("abc", 10)).toBe(2);
    expect(clampTileAmount(1, 10)).toBe(2);
    expect(clampTileAmount(99, 10)).toBe(10);
    expect(clampTileAmount(5, 10)).toBe(5);
  });

  it("returns 1x before any reveals", () => {
    expect(calculateMultiplier(25, 5, 0)).toBe(1);
  });

  it("applies RTP to fair multiplier after reveals", () => {
    expect(calculateMultiplier(25, 5, 1)).toBeCloseTo(1.2);
  });

  it("counts only non-dynamite reveals toward safe streak", () => {
    const board = [
      { id: 1, content: "gold" },
      { id: 2, content: "dynamite" },
      { id: 3, content: "gold" },
    ];

    expect(countSafeReveals(board, [1, 2, 3])).toBe(2);
    expect(getTileContent(board[0])).toBe("gold");
    expect(getTileContent(undefined)).toBe("gold");
  });

  it("marks a tile as shield-blocked", () => {
    const board = [
      { id: 1, content: "gold", blockedByShield: false },
      { id: 2, content: "gold", blockedByShield: false },
    ];

    const updated = blockTileWithShield(board, 2);

    expect(updated[1].blockedByShield).toBe(true);
    expect(board[1].blockedByShield).toBe(false);
  });
});
