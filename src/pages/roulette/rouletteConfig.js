export const rouletteNavigationPreset = {
  defaultValue: "roulette",
  game: { label: "Roulette", icon: "roulette" },
  openMenuLabel: "Originals",
  selectedValue: "roulette",
};

export const ROULETTE_WHEEL_NATIVE_SIZE = {
  desktop: 760,
  mobile: 440,
};

export const ROULETTE_WIN_CHIP_SIZE = 72;

export const ROULETTE_MOBILE_WHEEL_SCALE = {
  widthFactor: 1.58,
  heightFactor: 3.35,
  scaleBoost: 1.72,
  scaleMax: 2.65,
  lift: 36,
  minVisibleScale: 1.05,
};

export const ROULETTE_DESKTOP_WHEEL_LAYOUT = {
  visibleScaleWidthFactor: 1.18,
  visibleScaleHeightFactor: 1.697,
  scaleBoost: 1.4,
  pushDownScaledRatio: 0.48,
  topInsetRatio: 0.02,
};

export const ROULETTE_SPIN_DURATION_MS = 5800;
export const ROULETTE_SPIN_STALL_RECOVERY_MS = ROULETTE_SPIN_DURATION_MS + 1200;
export const ROULETTE_CELEBRATION_MS = 880;
