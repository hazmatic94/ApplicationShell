export const rouletteNavigationPreset = {
  defaultValue: "roulette",
  game: { label: "Roulette", icon: "roulette" },
  openMenuLabel: "Originals",
  selectedValue: "roulette",
};

export const ROULETTE_WIN_CHIP_SIZE = 72;
export const ROULETTE_WIN_STREAK_GAP = Math.round(ROULETTE_WIN_CHIP_SIZE * 0.34);
export const ROULETTE_PAGE_LOAD_ANIMATION_MS = 480;
export const ROULETTE_SPIN_DURATION_MS = 5800;
export const ROULETTE_SPIN_STALL_RECOVERY_MS = ROULETTE_SPIN_DURATION_MS + 1200;
export const ROULETTE_CELEBRATION_MS = 880;
