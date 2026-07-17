export const rouletteNavigationPreset = {
  defaultValue: "roulette",
  game: { label: "Roulette", icon: "roulette" },
  openMenuLabel: "Originals",
  selectedValue: "roulette",
};

export const ROULETTE_WIN_CHIP_SIZE = 72;
export const ROULETTE_WIN_STREAK_GAP = Math.round(ROULETTE_WIN_CHIP_SIZE * 0.34);
// RouletteWinChip enter + multiplier pop + ring (480 + 400 + 320 ms).
export const ROULETTE_WIN_STREAK_LOCK_MS = 1200;

export const ROULETTE_SPIN_DURATION_MS = 5800;
export const ROULETTE_SPIN_STALL_RECOVERY_MS = ROULETTE_SPIN_DURATION_MS + 1200;
export const ROULETTE_CELEBRATION_MS = 880;
