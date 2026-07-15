import { getCoinReceiverLossTotalMs } from "@joker/design-system";

export const coinFlipRtp = 0.96;
export const coinFlipMaxWins = 4;
export const coinFlipFairProbability = 0.5;

export const coinFlipNavigationPreset = {
  defaultValue: "coin-flip",
  game: { label: "Coin Flip", icon: "coin-flip" },
  openMenuLabel: "Originals",
  selectedValue: "coin-flip",
};

export const COIN_FLIP_PROGRESSION_RECEIVER_SIZE = 72;
export const COIN_FLIP_PROGRESSION_COIN_SIZE = Math.round(COIN_FLIP_PROGRESSION_RECEIVER_SIZE * 0.76);
export const COIN_FLIP_PAGE_LOAD_ANIMATION_MS = 480;
export const COIN_FLIP_LOSS_RESET_MS = getCoinReceiverLossTotalMs() + 240;
export const COIN_FLIP_LOSS_SEALED_HOLD_MS = 400;
