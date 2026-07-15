import { describe, expect, it } from "vitest";
import {
  createCrashRound,
  formatCrashAxisMultiplier,
  formatCrashMultiplier,
  getCrashGraphPoint,
  getCrashIntensity,
  getCrashMultiplierAt,
} from "./crashGameLogic.js";

describe("crashGameLogic", () => {
  it("starts multiplier at 1x", () => {
    expect(getCrashMultiplierAt(0)).toBe(1);
  });

  it("grows exponentially over elapsed time", () => {
    expect(getCrashMultiplierAt(1000)).toBeCloseTo(Math.exp(0.3));
  });

  it("creates an active round within configured bounds", () => {
    const round = createCrashRound();

    expect(round.status).toBe("active");
    expect(round.multiplier).toBe(1);
    expect(round.crashPoint).toBeGreaterThanOrEqual(1);
    expect(round.crashPoint).toBeLessThanOrEqual(100);
    expect(round.crashTimeMs).toBeGreaterThan(0);
  });

  it("formats multipliers for HUD and axis labels", () => {
    expect(formatCrashMultiplier(2.456)).toBe("2.46x");
    expect(formatCrashAxisMultiplier(12.3)).toBe("12x");
    expect(formatCrashAxisMultiplier(4.2)).toBe("4.2x");
  });

  it("ramps visual intensity with multiplier", () => {
    expect(getCrashIntensity(1)).toBe(0);
    expect(getCrashIntensity(1.5)).toBeGreaterThan(0);
    expect(getCrashIntensity(15)).toBeGreaterThan(getCrashIntensity(5));
  });

  it("maps elapsed time to graph coordinates", () => {
    const point = getCrashGraphPoint(0, 5);

    expect(point.x).toBe(0);
    expect(point.y).toBeGreaterThan(0);
  });
});
