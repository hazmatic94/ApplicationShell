import {
  getFourDNumberPermutations,
  isFourDNumberPermutationMatch,
  isValidFourDNumber,
  normalizeFourDNumber,
} from "@joker/design-system";
import {
  fourDMinesTileCount,
  maxFourDMinesAmount,
  minFourDMinesAmount,
} from "./fourDMinesConfig.js";
import { minesRtp } from "../mines/minesConfig.js";

export function createFourDMinesAmountOptions() {
  return Array.from({ length: maxFourDMinesAmount }, (_, index) => {
    const count = index + 1;

    return {
      value: String(count),
      label: `${count} ${count === 1 ? "Mine" : "Mines"}`,
    };
  });
}

export function clampFourDMinesAmount(value) {
  const numericValue = Number(value);

  if (!Number.isFinite(numericValue)) {
    return minFourDMinesAmount;
  }

  return Math.min(Math.max(numericValue, minFourDMinesAmount), maxFourDMinesAmount);
}

export function hasUniqueFourDDigits(value) {
  const digits = normalizeFourDNumber(value).split("");

  return digits.length === 4 && new Set(digits).size === 4;
}

export function createFourDMineTiles(tileCount = fourDMinesTileCount) {
  return Array.from({ length: tileCount }, (_, index) => index + 1);
}

export function createFourDRoundBoard(mineCount, playerFourDNumber, tileCount = fourDMinesTileCount) {
  const tileIndexes = Array.from({ length: tileCount }, (_, index) => index);
  const shuffledIndexes = [...tileIndexes];

  for (let index = shuffledIndexes.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [shuffledIndexes[index], shuffledIndexes[swapIndex]] = [
      shuffledIndexes[swapIndex],
      shuffledIndexes[index],
    ];
  }

  const dynamiteIndexes = new Set(shuffledIndexes.slice(0, mineCount));
  const earlyShieldIndexes = tileIndexes.slice(0, 4);
  const availableEarlyShieldIndexes = earlyShieldIndexes.filter(
    (index) => !dynamiteIndexes.has(index)
  );
  const jokerIndexPool =
    availableEarlyShieldIndexes.length > 0
      ? availableEarlyShieldIndexes
      : shuffledIndexes.filter((index) => !dynamiteIndexes.has(index));
  const jokerIndex =
    jokerIndexPool[Math.floor(Math.random() * jokerIndexPool.length)];

  const winIndexes = tileIndexes.filter(
    (index) => !dynamiteIndexes.has(index) && index !== jokerIndex
  );
  const shuffledPermutations = [...getFourDNumberPermutations(playerFourDNumber)];

  for (let index = shuffledPermutations.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [shuffledPermutations[index], shuffledPermutations[swapIndex]] = [
      shuffledPermutations[swapIndex],
      shuffledPermutations[index],
    ];
  }

  const permutationByIndex = new Map();
  winIndexes.forEach((index, permutationIndex) => {
    permutationByIndex.set(
      index,
      shuffledPermutations[permutationIndex % shuffledPermutations.length]
    );
  });

  return tileIndexes.map((index) => {
    if (dynamiteIndexes.has(index)) {
      return {
        blockedByShield: false,
        content: "dynamite",
        fourDNumber: null,
        id: index + 1,
      };
    }

    if (index === jokerIndex) {
      return {
        blockedByShield: false,
        content: "joker",
        fourDNumber: null,
        id: index + 1,
      };
    }

    return {
      blockedByShield: false,
      content: "win",
      fourDNumber: permutationByIndex.get(index),
      id: index + 1,
    };
  });
}

export function getFourDTileContent(tile) {
  return tile?.content || "safe";
}

export function countFourDSafeReveals(board, revealedTiles) {
  return revealedTiles.filter((tile) => getFourDTileContent(board[tile - 1]) !== "dynamite")
    .length;
}

