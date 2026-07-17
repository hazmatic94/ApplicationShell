import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import {
  GameShell,
  MobileRouletteOddsGroup,
  RouletteGameHeaderRail,
  WinStreakRow,
  WinModalCard,
  getPocketColor,
} from "@joker/design-system";
import minesCashoutSound from "../../../assets/mines-cashout.mp3?url";
import {
  GAME_ROUND_END_RESET_MS,
  GAME_ROUND_END_STYLES,
  GameRoundEndTransition,
} from "../../shared/gameRoundEnd.jsx";
import { formatBalance, formatCurrency } from "../../shared/formatting.js";
import { useDeferredWinCredit, useGameShellBettingPanelLayout } from "../../shared/hooks.js";
import { playSound } from "../../shared/sounds.js";
import { PackagedRouletteBettingPanel } from "./PackagedRouletteBettingPanel.jsx";
import { RouletteGameAreaSlot } from "./RouletteGameAreaSlot.jsx";
import {
  ROULETTE_CELEBRATION_MS,
  ROULETTE_SPIN_STALL_RECOVERY_MS,
  ROULETTE_WIN_CHIP_SIZE,
  ROULETTE_WIN_STREAK_GAP,
  ROULETTE_WIN_STREAK_LOCK_MS,
  rouletteNavigationPreset,
} from "./rouletteConfig.js";
import {
  calculateRouletteStreakProfit,
  didRouletteBetWin,
  formatRouletteStreakWinMultiplier,
  getRouletteOddsOptions,
} from "./rouletteGameLogic.js";
import { getRoulettePageStyles } from "./roulettePageStyles.js";

export function RoulettePage({ onGameChange }) {
  const bettingPanelLayout = useGameShellBettingPanelLayout();
  const [betAmount, setBetAmount] = useState("");
  const [lockedBetAmount, setLockedBetAmount] = useState("");
  const [selectedOdds, setSelectedOdds] = useState("red");
  const [balance, setBalance] = useState(150000);
  const { deferWinCredit, applyDeferredWinCredit } = useDeferredWinCredit(setBalance);
  const [inGame, setInGame] = useState(false);
  const [isSpinning, setIsSpinning] = useState(false);
  const [spinPending, setSpinPending] = useState(false);
  const [spinRequestId, setSpinRequestId] = useState(0);
  const [roundResult, setRoundResult] = useState(null);
  const [celebrationVariant, setCelebrationVariant] = useState(null);
  const [streakWins, setStreakWins] = useState([]);
  const [streakCompletedThrough, setStreakCompletedThrough] = useState(-1);
  const [streakLockingIndex, setStreakLockingIndex] = useState(null);
  const [rouletteWinModal, setRouletteWinModal] = useState(null);
  const [wheelSessionKey, setWheelSessionKey] = useState(0);
  const winStreakRailRef = useRef(null);
  const activeSpinRequestRef = useRef(0);
  const resolvedSpinRequestRef = useRef(0);
  const roundGenerationRef = useRef(0);
  const activeStakeRef = useRef(0);
  const activeOddsRef = useRef("red");
  const celebrationTimerRef = useRef(0);
  const handleWheelSpinningChange = useCallback((wheelIsSpinning) => {
    setIsSpinning(wheelIsSpinning);
    if (wheelIsSpinning) {
      setSpinPending(false);
    }
  }, []);
  const numericBetAmount = Number(betAmount) || 0;
  const hasBetAmount = numericBetAmount > 0;
  const displayBetAmount = inGame ? lockedBetAmount : betAmount;
  const hasDisplayBetAmount = Number(displayBetAmount) > 0;
  const canCashOut =
    inGame &&
    streakWins.length > 0 &&
    streakLockingIndex == null &&
    !isSpinning &&
    !spinPending &&
    !rouletteWinModal;
  const spinLocked = isSpinning || spinPending;
  const isRoundEnding = roundResult?.type === "loss";
  const isRoundLocked = celebrationVariant === "lose";
  const rouletteOddsOptions = useMemo(
    () =>
      hasDisplayBetAmount
        ? getRouletteOddsOptions(displayBetAmount, streakWins.length)
        : undefined,
    [displayBetAmount, hasDisplayBetAmount, streakWins.length],
  );

  const streakWinSlots = useMemo(
    () =>
      streakWins.map((win) => ({
        id: win.id,
        betColor: win.betColor,
        multiplier: win.multiplier,
      })),
    [streakWins],
  );

  const handleStreakChipLockComplete = useCallback((index) => {
    setStreakCompletedThrough(index);
    setStreakLockingIndex(null);
  }, []);

  useLayoutEffect(() => {
    const rail = winStreakRailRef.current;
    if (!rail) {
      return;
    }

    rail.scrollLeft = Math.max(0, rail.scrollWidth - rail.clientWidth);
  }, [streakWins]);

  useEffect(() => {
    if (streakLockingIndex == null) {
      return undefined;
    }

    const timer = window.setTimeout(() => {
      handleStreakChipLockComplete(streakLockingIndex);
    }, ROULETTE_WIN_STREAK_LOCK_MS);

    return () => window.clearTimeout(timer);
  }, [streakLockingIndex, handleStreakChipLockComplete]);

  useEffect(() => {
    if (!isRoundEnding) {
      return undefined;
    }

    const generation = roundGenerationRef.current;
    const timer = window.setTimeout(() => {
      if (roundGenerationRef.current !== generation) {
        return;
      }

      resetRouletteRound();
    }, GAME_ROUND_END_RESET_MS);

    return () => window.clearTimeout(timer);
  }, [isRoundEnding, roundResult]);

  useEffect(() => {
    if (!spinPending) {
      return undefined;
    }

    const timer = window.setTimeout(() => {
      setSpinPending(false);
      setIsSpinning(false);
    }, ROULETTE_SPIN_STALL_RECOVERY_MS);

    return () => window.clearTimeout(timer);
  }, [spinPending, spinRequestId]);

  useEffect(() => {
    return () => {
      window.clearTimeout(celebrationTimerRef.current);
    };
  }, []);

  function resetRouletteRound() {
    window.clearTimeout(celebrationTimerRef.current);
    setRoundResult(null);
    setInGame(false);
    setCelebrationVariant(null);
    setStreakWins([]);
    setStreakCompletedThrough(-1);
    setStreakLockingIndex(null);
    setRouletteWinModal(null);
    setLockedBetAmount("");
    activeStakeRef.current = 0;
    activeSpinRequestRef.current = 0;
    resolvedSpinRequestRef.current = 0;
    setSpinRequestId(0);
    setWheelSessionKey((currentKey) => currentKey + 1);
  }

  function clearRouletteCelebrationSoon() {
    window.clearTimeout(celebrationTimerRef.current);
    celebrationTimerRef.current = window.setTimeout(() => {
      setCelebrationVariant(null);
    }, ROULETTE_CELEBRATION_MS);
  }

  function requestSpin() {
    window.clearTimeout(celebrationTimerRef.current);
    roundGenerationRef.current += 1;
    setRoundResult(null);
    setCelebrationVariant(null);
    setSpinPending(true);
    setSpinRequestId((currentRequestId) => {
      const nextRequestId = currentRequestId + 1;
      activeSpinRequestRef.current = nextRequestId;
      return nextRequestId;
    });
  }

  function triggerRouletteCelebration(variant) {
    window.clearTimeout(celebrationTimerRef.current);
    setCelebrationVariant(null);
    window.requestAnimationFrame(() => {
      setCelebrationVariant(variant);
    });
  }

  function handleSpinComplete(resultNumber) {
    if (!Number.isInteger(resultNumber)) {
      return;
    }

    const completedSpinId = activeSpinRequestRef.current;

    if (completedSpinId < 1 || completedSpinId === resolvedSpinRequestRef.current) {
      return;
    }

    resolvedSpinRequestRef.current = completedSpinId;
    setSpinPending(false);

    const betType = activeOddsRef.current;
    const resultColor = getPocketColor(resultNumber);
    const didWin = didRouletteBetWin(betType, resultNumber);

    if (didWin) {
      let lockingIndex = 0;

      setStreakWins((currentStreak) => {
        lockingIndex = currentStreak.length;

        return [
          ...currentStreak,
          {
            id: completedSpinId,
            betColor: betType,
            multiplier: formatRouletteStreakWinMultiplier(betType, lockingIndex),
          },
        ];
      });
      setStreakLockingIndex(lockingIndex);
      triggerRouletteCelebration("win");
      clearRouletteCelebrationSoon();
      return;
    }

    setStreakLockingIndex(null);
    setInGame(false);
    triggerRouletteCelebration("lose");
    clearRouletteCelebrationSoon();
    setRoundResult({
      type: "loss",
      number: resultNumber,
      color: resultColor,
    });
  }

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
      isRoundLocked ||
      streakLockingIndex != null
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
            isSpinning={spinLocked || isRoundLocked}
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
            "joker-roulette-game-frame joker-game-round-end-canvas",
            isRoundEnding ? "is-round-ending" : "",
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
          <div className="joker-roulette-game-frame__top">
            <div
              className="joker-roulette-streak-rail"
              aria-label="Roulette win streak"
              ref={winStreakRailRef}
            >
              <div className="joker-roulette-streak-track">
                {streakWins.length > 0 ? (
                  <WinStreakRow
                    wins={streakWinSlots}
                    animateOnMount={false}
                    completedThrough={streakCompletedThrough}
                    chipSize={ROULETTE_WIN_CHIP_SIZE}
                    gap={ROULETTE_WIN_STREAK_GAP}
                  />
                ) : null}
              </div>
            </div>
          </div>
          <RouletteGameAreaSlot
            key={wheelSessionKey}
            celebrationActive={celebrationVariant != null}
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
              isRoundEnding ? `roulette-loss-${String(roundResult.number)}` : "roulette-loss-idle"
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
      </GameShell>
    </>
  );
}
