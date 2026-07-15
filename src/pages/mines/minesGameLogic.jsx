import dynamiteIcon from "../../../assets/mines-bomb.png?url";
import { minTileAmount, minesRtp } from "./minesConfig.js";

export function createMinesAmountOptions(maxTileAmount) {
  return Array.from({ length: maxTileAmount - minTileAmount + 1 }, (_, index) => {
    const count = minTileAmount + index;

    return {
      value: String(count),
      label: (
        <span className="joker-mines-dynamite-option">
          <img src={dynamiteIcon} alt="" />
          <span>{count} Dynamite</span>
        </span>
      ),
    };
  });
}

export function createMineTiles(tileCount) {
  return Array.from({ length: tileCount }, (_, index) => index + 1);
}

export function clampTileAmount(value, maxTileAmount) {
  const numericValue = Number(value);

  if (!Number.isFinite(numericValue)) {
    return minTileAmount;
  }

  return Math.min(Math.max(numericValue, minTileAmount), maxTileAmount);
}

export function calculateMultiplier(totalTiles, mines, revealedCount) {
  if (revealedCount <= 0) {
    return 1;
  }

  const safeTiles = totalTiles - mines;
  const effectiveReveals = Math.min(revealedCount, safeTiles);

  let fairMultiplier = 1;

  for (let index = 0; index < effectiveReveals; index += 1) {
    fairMultiplier *= (totalTiles - index) / (totalTiles - mines - index);
  }

  return fairMultiplier * minesRtp;
}

export function createRoundBoard(minesCount, mineTiles) {
  const tileIndexes = mineTiles.map((tile) => tile - 1);
  const shuffledIndexes = [...tileIndexes];

  for (let index = shuffledIndexes.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [shuffledIndexes[index], shuffledIndexes[swapIndex]] = [
      shuffledIndexes[swapIndex],
      shuffledIndexes[index],
    ];
  }

  const dynamiteIndexes = new Set(shuffledIndexes.slice(0, minesCount));
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

  return tileIndexes.map((index) => {
    let content = "gold";

    if (dynamiteIndexes.has(index)) content = "dynamite";
    if (index === jokerIndex) content = "joker";

    return {
      blockedByShield: false,
      content,
      id: index + 1,
    };
  });
}

export function getTileContent(tile) {
  return tile?.content || "gold";
}

export function countSafeReveals(board, revealedTiles) {
  return revealedTiles.filter((tile) => getTileContent(board[tile - 1]) !== "dynamite")
    .length;
}

export function blockTileWithShield(board, tileId) {
  return board.map((tile) =>
    tile.id === tileId ? { ...tile, blockedByShield: true } : tile
  );
}
