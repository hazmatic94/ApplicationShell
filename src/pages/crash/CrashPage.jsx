import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { GameShell } from "@joker/design-system";
import { formatBalance, formatCurrency } from "../../shared/formatting.js";
import { playCashoutSound, playLossSound, playPlaceBetSound } from "../../shared/gameSounds.js";
import { GameWinModalCard } from "../../shared/GameWinModalCard.jsx";
import { GameWinModalOverlay } from "../../shared/GameWinModalOverlay.jsx";
import { useDeferredWinCredit, useGameShellBettingPanelLayout } from "../../shared/hooks.js";
import { PackagedCrashBettingPanel } from "./PackagedCrashBettingPanel.jsx";
import {
  crashGraphDurationSeconds,
  crashNavigationPreset,
  crashParticles,
  crashResetDurationMs,
  crashSocialEvents,
} from "./crashConfig.js";
import {
  buildCrashGraphPaths,
  createCrashRound,
  formatCrashAxisMultiplier,
  formatCrashMultiplier,
  getCrashIntensity,
  getCrashMultiplierAt,
  getCrashRocketAngle,
} from "./crashGameLogic.js";
import { getCrashPageStyles } from "./crashPageStyles.js";

export function CrashPage({ onGameChange }) {
  const [betAmount, setBetAmount] = useState("");
  const [bettingMode, setBettingMode] = useState("manual");
  const [balance, setBalance] = useState(150000);
  const { deferWinCredit, applyDeferredWinCredit, getDisplayBalance } = useDeferredWinCredit(setBalance);
  const [roundStatus, setRoundStatus] = useState("idle");
  const [numberOfBets, setNumberOfBets] = useState("");
  const [crashResult, setCrashResult] = useState(null);
  const [crashResetting, setCrashResetting] = useState(false);
  const [crashRound, setCrashRound] = useState(() => ({
    status: "idle",
    elapsedMs: 0,
    multiplier: 1,
    crashPoint: 1.8,
    crashTimeMs: crashGraphDurationSeconds * 1000,
  }));
  const crashStartRef = useRef(0);
  const crashFrameRef = useRef(null);
  const bettingPanelLayout = useGameShellBettingPanelLayout();
  const numericBetAmount = Number(betAmount) || 0;
  const hasBetAmount = numericBetAmount > 0;
  const crashGraph = buildCrashGraphPaths(crashRound.elapsedMs, crashRound.crashPoint);
  const crashAxisMax = Math.max(1.82, crashRound.crashPoint * 1.12);
  const crashYAxisLabels = [
    crashAxisMax,
    1 + (crashAxisMax - 1) * 0.75,
    1 + (crashAxisMax - 1) * 0.5,
    1 + (crashAxisMax - 1) * 0.25,
    1,
  ];
  const crashSpeedIntensity = getCrashIntensity(crashRound.multiplier);
  const crashLivePlayers = Math.max(3, Math.round(97 - crashSpeedIntensity * 94));
  const visibleCrashCashouts = crashSocialEvents
    .filter((event) => crashRound.multiplier >= event.multiplier)
    .slice(-3);
  const crashCameraStyle = {
    "--crash-atmosphere": crashSpeedIntensity.toFixed(3),
    "--crash-camera-scale": (1 + crashSpeedIntensity * 0.05).toFixed(3),
    "--crash-camera-x": `${(-10 * crashSpeedIntensity).toFixed(2)}px`,
    "--crash-camera-y": `${(6 * crashSpeedIntensity).toFixed(2)}px`,
    "--crash-fill-peak-opacity": (0.14 + crashSpeedIntensity * 0.16).toFixed(3),
    "--crash-line-trail-opacity": (0.06 + crashSpeedIntensity * 0.18).toFixed(3),
    "--crash-line-width": `${(4 + crashSpeedIntensity * 1.4).toFixed(2)}px`,
  };
  const crashMultiplierTick = Math.floor(crashRound.multiplier * 100);
  const crashRocketAngle = getCrashRocketAngle(crashRound.elapsedMs, crashRound.crashPoint);
  const crashRocketStyle = {
    left: `${(crashGraph.endPoint.x / crashGraphWidth) * 100}%`,
    top: `${(crashGraph.endPoint.y / crashGraphHeight) * 100}%`,
    "--crash-rocket-angle": `${crashRocketAngle}deg`,
    "--crash-rocket-scale": (1 + crashSpeedIntensity * 0.22).toFixed(2),
    "--crash-rocket-pulse-duration": `${Math.round(520 - crashSpeedIntensity * 260)}ms`,
    "--crash-flame-scale": (0.72 + crashSpeedIntensity * 0.56).toFixed(2),
    "--crash-rocket-glow-opacity": (0.18 + crashSpeedIntensity * 0.42).toFixed(2),
  };
  const crashMultiplierStyle = {
    "--crash-multiplier-pulse-duration": `${Math.round(280 - crashSpeedIntensity * 120)}ms`,
    "--crash-multiplier-drift": `${(-4 * crashSpeedIntensity).toFixed(2)}px`,
  };

  useEffect(() => {
    if (crashRound.status !== "active") return undefined;

    function tick(now) {
      const elapsedMs = Math.min(now - crashStartRef.current, crashRound.crashTimeMs);
      const nextMultiplier = Math.min(getCrashMultiplierAt(elapsedMs), crashRound.crashPoint);

      if (elapsedMs >= crashRound.crashTimeMs || nextMultiplier >= crashRound.crashPoint) {
        playLossSound();
        setCrashRound((currentRound) => ({
          ...currentRound,
          status: "crashed",
          elapsedMs: currentRound.crashTimeMs,
          multiplier: currentRound.crashPoint,
        }));
        setCrashResetting(true);
        setCrashResult({
          type: "loss",
          multiplier: crashRound.crashPoint,
        });
        setRoundStatus("crashed");
        return;
      }

      setCrashRound((currentRound) => ({
        ...currentRound,
        elapsedMs,
        multiplier: nextMultiplier,
      }));
      crashFrameRef.current = requestAnimationFrame(tick);
    }

    crashFrameRef.current = requestAnimationFrame(tick);

    return () => {
      if (crashFrameRef.current) {
        cancelAnimationFrame(crashFrameRef.current);
      }
    };
  }, [crashRound.status, crashRound.crashTimeMs, crashRound.crashPoint]);

  useEffect(() => {
    if (!crashResult || crashResult.type === "win") return undefined;

    const timer = window.setTimeout(() => {
      setCrashResult(null);
      setCrashResetting(false);
      setRoundStatus("idle");
      setCrashRound((currentRound) => ({
        ...currentRound,
        status: "idle",
        elapsedMs: 0,
        multiplier: 1,
      }));
    }, crashResetDurationMs);

    return () => window.clearTimeout(timer);
  }, [crashResult]);

  function handleCrashResultClose() {
    if (crashResult?.type === "win") {
      applyDeferredWinCredit();
    }

    setCrashResult(null);
    setCrashResetting(false);
    setRoundStatus("idle");
    setCrashRound((currentRound) => ({
      ...currentRound,
      status: "idle",
      elapsedMs: 0,
      multiplier: 1,
    }));
  }

  function handleBetAction() {
    if (!hasBetAmount) return;

    if (roundStatus === "active") {
      const payout = numericBetAmount * crashRound.multiplier;
      playCashoutSound();
      setRoundStatus("cashedOut");
      setCrashResetting(true);
      setCrashRound((currentRound) => ({
        ...currentRound,
        status: "cashedOut",
      }));
      setCrashResult({
        type: "win",
        amount: payout,
        multiplier: crashRound.multiplier,
      });
      deferWinCredit(payout);
      return;
    }

    const nextRound = createCrashRound();
    playPlaceBetSound();
    crashStartRef.current = performance.now();
    setCrashResult(null);
    setBalance((currentBalance) => Math.max(0, currentBalance - numericBetAmount));
    setCrashRound(nextRound);
    setRoundStatus("active");
  }

  return (
    <>
      <style>{getCrashPageStyles()}</style>
      <GameShell
        balance={formatBalance(getDisplayBalance(balance))}
        className="joker-game-shell--crash"
        defaultValue={crashNavigationPreset.defaultValue}
        game={crashNavigationPreset.game}
        onValueChange={onGameChange}
        value={crashNavigationPreset.selectedValue}
        bettingPanel={
          <PackagedCrashBettingPanel
            betAmount={betAmount}
            bettingMode={bettingMode}
            gameInPlay={roundStatus === "active"}
            layout={bettingPanelLayout}
            numberOfBets={numberOfBets}
            onBetAmountChange={setBetAmount}
            onModeChange={setBettingMode}
            onNumberOfBetsChange={setNumberOfBets}
            onPlaceBet={handleBetAction}
          />
        }
      >
        <section className="joker-crash-stage" aria-label="Crash game area">
          <div
            className={`joker-crash-chart ${crashRound.status === "crashed" ? "is-crashed" : ""}`.trim()}
            style={crashCameraStyle}
          >
            <div className="joker-crash-chart-grid">
              <div className="joker-crash-y-axis" aria-hidden="true">
                {crashYAxisLabels.map((label) => (
                  <span key={label}>{formatCrashAxisMultiplier(label)}</span>
                ))}
              </div>
              <div className="joker-crash-plot">
                <div className="joker-crash-camera">
                  <div className="joker-crash-particles" aria-hidden="true">
                    {crashParticles.map((particle, index) => (
                      <span
                        className="joker-crash-particle"
                        key={`${particle.x}-${particle.y}-${index}`}
                        style={{
                          "--particle-delay": particle.delay,
                          "--particle-duration": particle.duration,
                          "--particle-size": particle.size,
                          "--particle-x": particle.x,
                          "--particle-y": particle.y,
                        }}
                      />
                    ))}
                  </div>
                  <svg
                    className="joker-crash-graph"
                    viewBox={`0 0 ${crashGraphWidth} ${crashGraphHeight}`}
                    preserveAspectRatio="none"
                    aria-hidden="true"
                  >
                    <defs>
                      <linearGradient id="joker-crash-fill" x1="0" x2="0" y1="0" y2="1">
                        <stop offset="0%" stopColor="#E6D0A4" stopOpacity="var(--crash-fill-peak-opacity)" />
                        <stop offset="100%" stopColor="#E6D0A4" stopOpacity="0" />
                      </linearGradient>
                      <linearGradient id="joker-crash-fill-red" x1="0" x2="0" y1="0" y2="1">
                        <stop offset="0%" stopColor="rgba(226, 74, 74, 0.22)" />
                        <stop offset="100%" stopColor="rgba(226, 74, 74, 0)" />
                      </linearGradient>
                    </defs>
                    <path
                      className="joker-crash-graph-fill"
                      d={crashGraph.fillPath}
                    />
                    <path
                      className="joker-crash-graph-trail"
                      d={crashGraph.linePath}
                    />
                    <path
                      className="joker-crash-graph-line"
                      d={crashGraph.linePath}
                    />
                  </svg>
                  <span
                    className={`joker-crash-rocket ${crashRound.status === "crashed" ? "is-crashed" : ""}`.trim()}
                    style={crashRocketStyle}
                    aria-hidden="true"
                  >
                    <span className="joker-crash-rocket-glow" />
                    <span className="joker-crash-rocket-body">
                      <svg viewBox="0 0 32 32" aria-hidden="true" focusable="false">
                        <path
                          className="joker-crash-rocket-fill"
                          d="M16 3.5 21.5 14.5 16 12 10.5 14.5Z"
                          fill="#E6D0A4"
                        />
                        <path
                          className="joker-crash-rocket-fill"
                          d="M10.5 14.5 8 22 16 17.5 24 22 21.5 14.5Z"
                          fill="#E6D0A4"
                        />
                        <circle className="joker-crash-rocket-window" cx="16" cy="11.5" r="2.2" fill="#1a1a1a" />
                        <path
                          className="joker-crash-rocket-fill"
                          d="M13.5 22 16 28.5 18.5 22Z"
                          fill="#c9b48a"
                        />
                      </svg>
                    </span>
                    <span className="joker-crash-rocket-flame" />
                  </span>
                  <div
                    className={`joker-crash-multiplier ${crashRound.status === "crashed" ? "is-crashed" : ""}`.trim()}
                    style={crashMultiplierStyle}
                    aria-live="polite"
                  >
                    <span className="joker-crash-multiplier-value" key={crashMultiplierTick}>
                      {formatCrashMultiplier(crashRound.multiplier)}
                    </span>
                  </div>
                </div>
              </div>
              <aside className="joker-crash-social" aria-live="polite">
                <span className="joker-crash-live-count">{crashLivePlayers} players live</span>
                <div className="joker-crash-cashout-feed">
                  {visibleCrashCashouts.map((event) => (
                    <span key={`${event.name}-${event.multiplier}`}>
                      {event.name} cashed out @ {formatCrashMultiplier(event.multiplier)}
                    </span>
                  ))}
                </div>
              </aside>
              <div className="joker-crash-axis-corner" aria-hidden="true" />
              <div className="joker-crash-x-axis" aria-hidden="true">
                <span>0s</span>
                <span>2s</span>
                <span>4s</span>
                <span>6s</span>
                <span>8s</span>
              </div>
              {crashResetting && (
                <div className="joker-crash-reset-timer" aria-live="polite">
                  <div className="joker-crash-reset-copy">
                    <span>Next round</span>
                    <span>Bets opening</span>
                  </div>
                  <div className="joker-crash-reset-track" aria-hidden="true">
                    <div className="joker-crash-reset-fill" />
                  </div>
                </div>
              )}
              {crashResult?.type === "win" && (
                <GameWinModalOverlay className="joker-crash-result-overlay" role="status" aria-live="polite">
                  <GameWinModalCard
                    className="joker-crash-result-card"
                    title="Cashout Successful"
                    amountWon={formatCurrency(crashResult.amount)}
                    balance={balance}
                    profit={crashResult.amount}
                    message={`Cashed out at ${formatCrashMultiplier(crashResult.multiplier)}. Added to your balance.`}
                    messageHighlight="balance"
                    onCoinsLand={applyDeferredWinCredit}
                    onClose={handleCrashResultClose}
                  />
                </GameWinModalOverlay>
              )}
            </div>
          </div>
        </section>
      </GameShell>
    </>
  );
}
