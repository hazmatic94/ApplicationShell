import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { flushSync } from "react-dom";
import {
  GameShell,
  MobileRouletteOddsGroup,
  RouletteGameHeaderRail,
  WinModalCard,
  getPocketColor,
} from "@joker/design-system";
import minesCashoutSound from "../../../assets/mines-cashout.mp3?url";
import {
  GAME_ROUND_END_STYLES,
  GameRoundEndTransition,
} from "../../shared/gameRoundEnd.jsx";
import { formatBalance, formatCurrency } from "../../shared/formatting.js";
import { useDeferredWinCredit, useGameShellBettingPanelLayout } from "../../shared/hooks.js";
import { playSound } from "../../shared/sounds.js";
import { PackagedRouletteBettingPanel } from "./PackagedRouletteBettingPanel.jsx";
import { RouletteGameAreaSlot } from "./RouletteGameAreaSlot.jsx";
import { RouletteStreakChip } from "./RouletteStreakChip.jsx";
import {
  ROULETTE_CELEBRATION_MS,
  ROULETTE_PAGE_LOAD_ANIMATION_MS,
  ROULETTE_SPIN_STALL_RECOVERY_MS,
  ROULETTE_WIN_CHIP_SIZE,
  ROULETTE_WIN_STREAK_GAP,
  rouletteNavigationPreset,
} from "./rouletteConfig.js";
import {
  calculateRouletteStreakProfit,
  didRouletteBetWin,
  formatRouletteStreakWinMultiplier,
  getRouletteOddsOptions,
} from "./rouletteGameLogic.js";
import { getRoulettePageStyles } from "./roulettePageStyles.js";
import {
  ROULETTE_ROUND_PHASE,
  getRouletteCelebrationVariant,
  isRouletteRoundEnding,
  isRouletteRoundLocked,
  isRouletteSpinLocked,
} from "./rouletteRoundPhase.js";
import "@joker/design-system/styles/win-streak-row.css";
import "@joker/design-system/styles/roulette-win-chip.css";

export function RoulettePage({ onGameChange }) {
  const bettingPanelLayout = useGameShellBettingPanelLayout();
  const [betAmount, setBetAmount] = useState("");
  const [lockedBetAmount, setLockedBetAmount] = useState("");
  const [selectedOdds, setSelectedOdds] = useState("red");
  const [balance, setBalance] = useState(150000);
  const { deferWinCredit, applyDeferredWinCredit } = useDeferredWinCredit(setBalance);
  const [inGame, setInGame] = useState(false);
  const [isWheelSpinning, setIsWheelSpinning] = useState(false);
  const [roundPhase, setRoundPhase] = useState(ROULETTE_ROUND_PHASE.IDLE);
  const [spinRequestId, setSpinRequestId] = useState(0);
  const [lossResult, setLossResult] = useState(null);
  const [streakWins, setStreakWins] = useState([]);
  const [rouletteWinModal, setRouletteWinModal] = useState(null);
  const [wheelSessionKey, setWheelSessionKey] = useState(0);
  const [isPageLoadEnter, setIsPageLoadEnter] = useState(true);
  const winStreakRailRef = useRef(null);
  const spinRequestIdRef = useRef(0);
  const resolvedSpinRequestRef = useRef(0);
  const activeStakeRef = useRef(0);
  const activeOddsRef = useRef("red");
  const roundPhaseRef = useRef(roundPhase);

  const celebrationVariant = getRouletteCelebrationVariant(roundPhase);
  const celebrationActive = celebrationVariant != null;
  const isRoundEnding = isRouletteRoundEnding(roundPhase);
  const isRoundLocked = isRouletteRoundLocked(roundPhase);
  const spinLocked = isRouletteSpinLocked(roundPhase, isWheelSpinning) || isPageLoadEnter;

  const numericBetAmount = Number(betAmount) || 0;
  const hasBetAmount = numericBetAmount > 0;
  const displayBetAmount = inGame ? lockedBetAmount : betAmount;
  const hasDisplayBetAmount = Number(displayBetAmount) > 0;
  const canCashOut =
    inGame &&
    streakWins.length > 0 &&
    !spinLocked &&
    !rouletteWinModal;
  const rouletteOddsOptions = useMemo(
    () =>
      hasDisplayBetAmount
        ? getRouletteOddsOptions(displayBetAmount, streakWins.length)
        : undefined,
    [displayBetAmount, hasDisplayBetAmount, streakWins.length],
  );

  const handleWheelSpinningChange = useCallback((wheelIsSpinning) => {
    setIsWheelSpinning(wheelIsSpinning);
  }, []);

  const clearWheelSession = useCallback(() => {
    setSpinRequestId(0);
    setIsWheelSpinning(false);
    setWheelSessionKey((currentKey) => currentKey + 1);
  }, []);

  const resetRouletteRound = useCallback(() => {
    spinRequestIdRef.current = 0;
    resolvedSpinRequestRef.current = 0;
    setRoundPhase(ROULETTE_ROUND_PHASE.IDLE);
    roundPhaseRef.current = ROULETTE_ROUND_PHASE.IDLE;
    setLossResult(null);
    setInGame(false);
    setStreakWins([]);
    setRouletteWinModal(null);
    setLockedBetAmount("");
    activeStakeRef.current = 0;
    clearWheelSession();
  }, [clearWheelSession]);

  const finishLossSequence = useCallback(() => {
    roundPhaseRef.current = ROULETTE_ROUND_PHASE.IDLE;
    setRoundPhase(ROULETTE_ROUND_PHASE.IDLE);
    setLossResult(null);
    setLockedBetAmount("");
    activeStakeRef.current = 0;
    clearWheelSession();
  }, [clearWheelSession]);

  const recoverStalledSpin = useCallback(() => {
    resolvedSpinRequestRef.current = spinRequestIdRef.current;
    roundPhaseRef.current = ROULETTE_ROUND_PHASE.IDLE;
    setRoundPhase(ROULETTE_ROUND_PHASE.IDLE);
    clearWheelSession();
  }, [clearWheelSession]);

  const requestSpin = useCallback(() => {
    const nextSpinRequestId = spinRequestIdRef.current + 1;
    spinRequestIdRef.current = nextSpinRequestId;
    setLossResult(null);
    roundPhaseRef.current = ROULETTE_ROUND_PHASE.SPINNING;
    setRoundPhase(ROULETTE_ROUND_PHASE.SPINNING);
    setSpinRequestId(nextSpinRequestId);
  }, []);

  const handleSpinComplete = useCallback(
    (resultNumber, completedSpinId) => {
      if (!Number.isInteger(resultNumber) || !Number.isInteger(completedSpinId)) {
        return;
      }

      if (completedSpinId < 1 || completedSpinId <= resolvedSpinRequestRef.current) {
        return;
      }

      if (roundPhaseRef.current !== ROULETTE_ROUND_PHASE.SPINNING) {
        return;
      }

      resolvedSpinRequestRef.current = completedSpinId;

      const betType = activeOddsRef.current;
      const resultColor = getPocketColor(resultNumber);
      const didWin = didRouletteBetWin(betType, resultNumber);

      if (didWin) {
        flushSync(() => {
          setStreakWins((currentStreak) => [
            ...currentStreak,
            {
              id: completedSpinId,
              betColor: betType,
              multiplier: formatRouletteStreakWinMultiplier(betType, currentStreak.length),
            },
          ]);
          roundPhaseRef.current = ROULETTE_ROUND_PHASE.CELEBRATE_WIN;
          setRoundPhase(ROULETTE_ROUND_PHASE.CELEBRATE_WIN);
        });
        return;
      }

      flushSync(() => {
        setStreakWins([]);
        setInGame(false);
        setLockedBetAmount("");
        setLossResult({
          number: resultNumber,
          color: resultColor,
        });
        roundPhaseRef.current = ROULETTE_ROUND_PHASE.CELEBRATE_LOSS;
        setRoundPhase(ROULETTE_ROUND_PHASE.CELEBRATE_LOSS);
        setSpinRequestId(0);
      });
    },
    [],
  );

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setIsPageLoadEnter(false);
    }, ROULETTE_PAGE_LOAD_ANIMATION_MS);

    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    roundPhaseRef.current = roundPhase;
  }, [roundPhase]);

  useLayoutEffect(() => {
    const rail = winStreakRailRef.current;
    if (!rail) {
      return;
    }

    rail.scrollLeft = Math.max(0, rail.scrollWidth - rail.clientWidth);
  }, [streakWins]);

  useEffect(() => {
    if (roundPhase !== ROULETTE_ROUND_PHASE.CELEBRATE_WIN) {
      return undefined;
    }

    const timer = window.setTimeout(() => {
      setRoundPhase(ROULETTE_ROUND_PHASE.IDLE);
    }, ROULETTE_CELEBRATION_MS);

    return () => window.clearTimeout(timer);
  }, [roundPhase]);

  useEffect(() => {
    if (!lossResult) {
      return undefined;
    }

    const timer = window.setTimeout(() => {
      finishLossSequence();
    }, ROULETTE_CELEBRATION_MS);

    return () => window.clearTimeout(timer);
  }, [lossResult, finishLossSequence]);

  useEffect(() => {
    if (roundPhase !== ROULETTE_ROUND_PHASE.SPINNING) {
      return undefined;
    }

    const timer = window.setTimeout(() => {
      if (roundPhaseRef.current !== ROULETTE_ROUND_PHASE.SPINNING) {
        return;
      }

      recoverStalledSpin();
    }, ROULETTE_SPIN_STALL_RECOVERY_MS);

    return () => window.clearTimeout(timer);
  }, [roundPhase, spinRequestId, recoverStalledSpin]);

  function handlePlaceBet() {
    if (!hasBetAmount || !selectedOdds || inGame || spinLocked || isRoundLocked) {
      return;
    }

    if (numericBetAmount > balance) {
      return;
    }

    activeStakeRef.current = numericBetAmount;
    activeOddsRef.current = selectedOdds;
    setLockedBetAmount(betAmount);
    setBalance((currentBalance) => currentBalance - numericBetAmount);
    setInGame(true);
    requestSpin();
  }

  function handleContinueSpin() {
    if (
      !inGame ||
      spinLocked ||
      !selectedOdds ||
      rouletteWinModal ||
      isRoundLocked
    ) {
      return;
    }

    activeOddsRef.current = selectedOdds;
    requestSpin();
  }

  function handleRouletteCashout() {
    if (!canCashOut) {
      return;
    }

    const cashoutProfit = calculateRouletteStreakProfit(lockedBetAmount, streakWins);

    playSound(minesCashoutSound);
    deferWinCredit(cashoutProfit);
    setRouletteWinModal({ profit: cashoutProfit });
  }

  function handleRouletteCashoutClose() {
    setRouletteWinModal(null);
    resetRouletteRound();
  }

  function handleOddsChange(value) {
    if (spinLocked) {
      return;
    }

    setSelectedOdds(value);
  }

  return (
    <>
      <style>{getRoulettePageStyles(GAME_ROUND_END_STYLES)}</style>
      <GameShell
        balance={formatBalance(balance)}
        className="joker-game-shell--roulette"
        defaultValue={rouletteNavigationPreset.defaultValue}
        game={rouletteNavigationPreset.game}
        gameHeaderRail={<RouletteGameHeaderRail />}
        onValueChange={onGameChange}
        value={rouletteNavigationPreset.selectedValue}
        bettingPanel={
          <PackagedRouletteBettingPanel
            betAmount={displayBetAmount}
            inGame={inGame}
            isSpinning={spinLocked}
            layout={bettingPanelLayout}
            oddsOptions={rouletteOddsOptions}
            onBetAmountChange={setBetAmount}
            onCashout={handleRouletteCashout}
            onOddsChange={handleOddsChange}
            onPlaceBet={inGame ? handleContinueSpin : handlePlaceBet}
            selectedOdds={selectedOdds}
          />
        }
      >
        <div
          className={[
            "joker-roulette-game-frame",
            isPageLoadEnter ? "is-page-load-enter" : "",
            celebrationVariant === "lose"
              ? "is-celebrating-loss"
              : celebrationVariant === "win"
                ? "is-celebrating-win"
                : "",
          ]
            .filter(Boolean)
            .join(" ")}
          aria-label="Roulette game area"
        >
          <div className="joker-roulette-wheel-edge-fade" aria-hidden="true" />
          <div className="joker-roulette-wheel-edge-fade joker-roulette-wheel-edge-fade--right" aria-hidden="true" />
          <div className="joker-roulette-wheel-edge-fade joker-roulette-wheel-edge-fade--bottom" aria-hidden="true" />
          <div
            className={[
              "joker-roulette-game-frame__stage",
              "joker-game-round-end-canvas",
              isRoundEnding ? "is-round-ending" : "",
            ]
              .filter(Boolean)
              .join(" ")}
          >
            <div className="joker-roulette-game-frame__top">
              <div
                className="joker-roulette-streak-rail"
                aria-label="Roulette win streak"
                ref={winStreakRailRef}
              >
                <div className="joker-roulette-streak-track">
                  {streakWins.length > 0 ? (
                    <div
                      className="joker-win-streak-row"
                      style={{
                        "--win-streak-row-gap": `${ROULETTE_WIN_STREAK_GAP}px`,
                        "--win-streak-row-chip-size": `${ROULETTE_WIN_CHIP_SIZE}px`,
                      }}
                    >
                      <ol
                        className="joker-win-streak-row__track"
                        aria-label={`${streakWins.length} win streak`}
                      >
                        {streakWins.map((win) => (
                          <li key={win.id} className="joker-win-streak-row__slot">
                            <RouletteStreakChip
                              betColor={win.betColor}
                              multiplier={win.multiplier}
                              chipSize={ROULETTE_WIN_CHIP_SIZE}
                            />
                          </li>
                        ))}
                      </ol>
                    </div>
                  ) : null}
                </div>
              </div>
            </div>
          <RouletteGameAreaSlot
            key={wheelSessionKey}
            celebrationActive={celebrationActive}
            celebrationVariant={celebrationVariant ?? "win"}
            onSpinComplete={handleSpinComplete}
            onSpinningChange={handleWheelSpinningChange}
            spinRequestId={spinRequestId}
            wheelSessionKey={wheelSessionKey}
          />
          {bettingPanelLayout === "mobile" ? (
            <div className="joker-roulette-mobile-odds">
              <MobileRouletteOddsGroup
                value={inGame ? selectedOdds || "red" : hasDisplayBetAmount ? selectedOdds : ""}
                onValueChange={handleOddsChange}
                disabled={(!hasDisplayBetAmount && !inGame) || spinLocked || isRoundLocked}
              />
            </div>
          ) : null}
          <GameRoundEndTransition
            active={isRoundEnding}
            animationKey={
              isRoundEnding && lossResult
                ? `roulette-loss-${String(lossResult.number)}`
                : "roulette-loss-idle"
            }
          />
          {rouletteWinModal ? (
            <div className="joker-roulette-result-overlay" role="status" aria-live="polite">
              <WinModalCard
                className="joker-roulette-result-card"
                title="Cashout Successful"
                amountWon={formatCurrency(rouletteWinModal.profit)}
                currency={null}
                message="Your winnings from this round have been added to your balance."
                closeLabel="Close"
                onCoinsLand={applyDeferredWinCredit}
                onClose={handleRouletteCashoutClose}
              />
            </div>
          ) : null}
          </div>
        </div>
      </GameShell>
    </>
  );
}
