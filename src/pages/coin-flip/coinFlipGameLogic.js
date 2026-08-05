import { formatJkcAmount } from "../../shared/formatting.js";
import { coinFlipMaxWins, coinFlipRtp } from "./coinFlipConfig.js";

export function calculateCoinFlipMultiplier(winCount) {
  if (winCount <= 0) {
    return 1;
  }

  return coinFlipRtp * 2 ** winCount;
}

export function calculateCoinFlipProfit(betAmount, winCount) {
  const stake = Number(betAmount) || 0;

  if (stake <= 0 || winCount <= 0) {
    return 0;
  }

  return Math.round(stake * calculateCoinFlipMultiplier(winCount));
}

export function formatCoinFlipMultiplier(multiplier) {
  return `${multiplier.toFixed(2)}x`;
}

export function getCoinFlipProgressionStepCount(streakWinCount = 0) {
  return Math.max(coinFlipMaxWins, streakWinCount + 1);
}

export function getCoinFlipOddsOptions(betAmount, streakWinCount = 0) {
  const stake = Number(betAmount) || 0;
  const nextWinCount = streakWinCount + 1;
  const nextMultiplier = calculateCoinFlipMultiplier(nextWinCount);
  const oddsLabel =
    stake > 0 ? formatJkcAmount(calculateCoinFlipProfit(betAmount, nextWinCount)) : formatCoinFlipMultiplier(nextMultiplier);

  return [
    { value: "heads", label: "Bet Heads", sideIcon: "heads", odds: oddsLabel },
    { value: "tails", label: "Bet Tails", sideIcon: "tails", odds: oddsLabel },
  ];
}
