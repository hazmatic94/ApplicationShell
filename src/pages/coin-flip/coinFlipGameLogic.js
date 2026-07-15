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

export function getCoinFlipOddsOptions(betAmount, roundsToWin = String(coinFlipMaxWins)) {
  const maxRounds = Number(roundsToWin) || coinFlipMaxWins;
  const targetMultiplier = calculateCoinFlipMultiplier(maxRounds);
  const targetProfit = calculateCoinFlipProfit(betAmount, maxRounds);
  const oddsLabel =
    Number(betAmount) > 0 ? formatJkcAmount(targetProfit) : formatCoinFlipMultiplier(targetMultiplier);

  return [
    { value: "heads", label: "Bet Heads", sideIcon: "heads", odds: oddsLabel },
    { value: "tails", label: "Bet Tails", sideIcon: "tails", odds: oddsLabel },
  ];
}
