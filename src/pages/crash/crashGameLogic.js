import {
  crashGraphBottom,
  crashGraphDurationSeconds,
  crashGraphHeight,
  crashGraphTop,
  crashGraphWidth,
  crashGrowthRate,
  crashMaxMultiplier,
  crashRtp,
} from "./crashConfig.js";

export function createCrashRound() {
  const random = Math.random();
  const rawCrash = crashRtp / (1 - random);
  const crashPoint = Number(Math.min(crashMaxMultiplier, Math.max(1, rawCrash)).toFixed(2));
  const calculatedCrashTimeMs = (Math.log(Math.max(crashPoint, 1.0001)) / crashGrowthRate) * 1000;
  const crashTimeMs = Math.min(
    crashGraphDurationSeconds * 1000,
    Math.max(crashPoint <= 1.01 ? 720 : 0, calculatedCrashTimeMs),
  );

  return {
    status: "active",
    elapsedMs: 0,
    multiplier: 1,
    crashPoint,
    crashTimeMs,
  };
}

export function getCrashMultiplierAt(elapsedMs) {
  return Math.max(1, Math.exp(crashGrowthRate * (elapsedMs / 1000)));
}

export function formatCrashMultiplier(multiplier) {
  return `${multiplier.toFixed(2)}x`;
}

export function formatCrashAxisMultiplier(multiplier) {
  return `${multiplier >= 10 ? multiplier.toFixed(0) : multiplier.toFixed(1)}x`;
}

export function getCrashIntensity(multiplier) {
  if (multiplier < 2) return Math.max(0, (multiplier - 1) / 1) * 0.24;
  if (multiplier < 5) return 0.24 + ((multiplier - 2) / 3) * 0.3;
  if (multiplier < 10) return 0.54 + ((multiplier - 5) / 5) * 0.32;
  return Math.min(1, 0.86 + ((multiplier - 10) / 3) * 0.14);
}

export function getCrashGraphPoint(elapsedMs, crashPoint) {
  const seconds = elapsedMs / 1000;
  const multiplier = getCrashMultiplierAt(elapsedMs);
  const maxMultiplier = Math.max(1.82, crashPoint * 1.12);
  const x = Math.min(crashGraphWidth, (seconds / crashGraphDurationSeconds) * crashGraphWidth);
  const normalizedMultiplier = Math.min(1, (multiplier - 1) / (maxMultiplier - 1));
  const y = crashGraphBottom - normalizedMultiplier * (crashGraphBottom - crashGraphTop);

  return { x, y };
}

export function getCrashRocketAngle(elapsedMs, crashPoint) {
  const current = getCrashGraphPoint(elapsedMs, crashPoint);
  const previous = getCrashGraphPoint(Math.max(0, elapsedMs - 48), crashPoint);
  const dx = current.x - previous.x || 1;
  const dy = current.y - previous.y;
  return (Math.atan2(dy, dx) * 180) / Math.PI;
}

export function buildCrashGraphPaths(elapsedMs, crashPoint) {
  const clampedElapsed = Math.max(0, elapsedMs);
  const samples = Math.max(2, Math.ceil(clampedElapsed / 40));
  const points = Array.from({ length: samples }, (_, index) => {
    const sampleElapsed = (clampedElapsed / (samples - 1)) * index;
    return getCrashGraphPoint(sampleElapsed, crashPoint);
  });
  const linePath = points.reduce((path, point, index) => {
    if (index === 0) {
      return `M${point.x.toFixed(2)} ${point.y.toFixed(2)}`;
    }

    const previousPoint = points[index - 1];
    const controlX = ((previousPoint.x + point.x) / 2).toFixed(2);
    return `${path} Q${controlX} ${previousPoint.y.toFixed(2)} ${point.x.toFixed(2)} ${point.y.toFixed(2)}`;
  }, "");
  const endPoint = points[points.length - 1];
  const fillPath = `${linePath} L${endPoint.x.toFixed(2)} ${crashGraphHeight} L0 ${crashGraphHeight} Z`;

  return { linePath, fillPath, endPoint };
}
