export const crashNavigationPreset = {
  defaultValue: "crash",
  game: { label: "Crash", icon: "crash" },
  openMenuLabel: "Originals",
  selectedValue: "crash",
};

export const crashGraphWidth = 1000;
export const crashGraphHeight = 640;
export const crashGraphDurationSeconds = 8;
export const crashGrowthRate = 0.3;
export const crashGraphBottom = 620;
export const crashGraphTop = 52;
export const crashResetDurationMs = 5000;
export const crashRtp = 0.96;
export const crashMaxMultiplier = 100;
export const crashSocialEvents = [
  { name: "James", multiplier: 1.62 },
  { name: "Mia", multiplier: 2.24 },
  { name: "Noah", multiplier: 3.08 },
  { name: "Michael", multiplier: 4.42 },
  { name: "Sofia", multiplier: 6.15 },
  { name: "Alex", multiplier: 8.74 },
  { name: "Kai", multiplier: 12.36 },
  { name: "Lena", multiplier: 18.52 },
];
export const crashParticles = Array.from({ length: 16 }, (_, index) => ({
  delay: `${index * 190}ms`,
  duration: `${3800 + (index % 5) * 620}ms`,
  size: `${2 + (index % 3)}px`,
  x: `${8 + ((index * 17) % 84)}%`,
  y: `${12 + ((index * 23) % 74)}%`,
}));
