import { getPocketColor } from "@joker/design-system";
import { formatJkcAmount } from "../../shared/formatting.js";

const rouletteRtp = 0.96;

export function getRouletteFairBaseMultiplier(betType) {
  return betType === "green" ? 36 : 2;
}

export function getRouletteWinBaseMultiplier(betType) {
  return getRouletteFairBaseMultiplier(betType) * rouletteRtp;
}

export function formatRouletteStreakWinMultiplier(betType, winIndex) {
  const multiplier = getRouletteWinBaseMultiplier(betType) * 2 ** winIndex;
  return `${multiplier.toFixed(2)}x`;
}

export function calculateRouletteStreakProfit(stake, streakWins) {
  const numericStake = Number(stake) || 0;

  if (numericStake <= 0 || streakWins.length === 0) {
    return 0;
  }

  return streakWins.reduce((total, win, index) => {
    const base = getRouletteWinBaseMultiplier(win.betColor);
    return total + Math.round(numericStake * base * 2 ** index);
  }, 0);
}

export function getRouletteOddsOptions(betAmount, streakWinCount = 0) {
  const stake = Number(betAmount) || 0;
  const nextWinIndex = streakWinCount;

  return [
    {
      value: "red",
      label: "Bet Red",
      sideIcon: "red",
      odds:
        stake > 0
          ? formatJkcAmount(stake * getRouletteWinBaseMultiplier("red") * 2 ** nextWinIndex)
          : "1:1",
    },
    {
      value: "black",
      label: "Bet Black",
      sideIcon: "black",
      odds:
        stake > 0
          ? formatJkcAmount(stake * getRouletteWinBaseMultiplier("black") * 2 ** nextWinIndex)
          : "1:1",
    },
    {
      value: "green",
      label: "Bet Green",
      sideIcon: "green",
      odds:
        stake > 0
          ? formatJkcAmount(stake * getRouletteWinBaseMultiplier("green") * 2 ** nextWinIndex)
          : "35:1",
    },
  ];
}

export function didRouletteBetWin(betType, resultNumber) {
  if (betType === "green") {
    return resultNumber === 0;
  }

  return getPocketColor(resultNumber) === betType;
}

export function formatRouletteResultLabel(resultNumber, resultColor) {
  if (resultNumber === 0) {
    return "0";
  }

  return `${resultNumber} ${resultColor}`;
}
