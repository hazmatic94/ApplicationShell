import { describe, expect, it } from "vitest";
import {
  clampFourDMinesAmount,
  countFourDSafeReveals,
  createFourDMineTiles,
  createFourDMinesAmountOptions,
  getFourDTileContent,
  hasUniqueFourDDigits,
} from "./fourDMinesGameLogic.js";

describe("fourDMinesGameLogic", () => {
  it("builds mine-count select options", () => {
    const options = createFourDMinesAmountOptions();

    expect(options).toHaveLength(23);
    expect(options[0]).toEqual({ value: "1", label: "1 Mine" });
    expect(options[1].label).toBe("2 Mines");
  });

  it("clamps mine count to configured bounds", () => {
    expect(clampFourDMinesAmount("x")).toBe(1);
    expect(clampFourDMinesAmount(0)).toBe(1);
    expect(clampFourDMinesAmount(99)).toBe(23);
    expect(clampFourDMinesAmount(4)).toBe(4);
  });

  it("requires four unique digits for a valid 4D number", () => {
    expect(hasUniqueFourDDigits("1234")).toBe(true);
    expect(hasUniqueFourDDigits("1123")).toBe(false);
    expect(hasUniqueFourDDigits("12")).toBe(false);
  });

  it("creates tile ids for the board", () => {
    expect(createFourDMineTiles(5)).toEqual([1, 2, 3, 4, 5]);
  });

  it("counts safe reveals and resolves tile content", () => {
    const board = [
      { id: 1, content: "win" },
      { id: 2, content: "dynamite" },
      { id: 3, content: "joker" },
    ];

    expect(countFourDSafeReveals(board, [1, 2, 3])).toBe(2);
    expect(getFourDTileContent(board[0])).toBe("win");
    expect(getFourDTileContent(undefined)).toBe("safe");
  });
});
