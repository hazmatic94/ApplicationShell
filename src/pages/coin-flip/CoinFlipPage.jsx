import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import {
  Coin,
  CoinProgression,
  GameShell,
  WinModalCard,
} from "@joker/design-system";
import coinFlipSound from "../../../assets/coin-flip.mp3?url";
import minesCashoutSound from "../../../assets/mines-cashout.mp3?url";
import {
  GAME_ROUND_END_STYLES,
  GameRoundEndTransition,
} from "../../shared/gameRoundEnd.jsx";
import { formatBalance, formatJkcAmount } from "../../shared/formatting.js";
import { useGameShellBettingPanelLayout } from "../../shared/hooks.js";
import { playSound } from "../../shared/sounds.js";
import { MobileOddsGroup } from "./MobileOddsGroup.jsx";
import { PackagedCoinFlipBettingPanel } from "./PackagedCoinFlipBettingPanel.jsx";
import {
  COIN_FLIP_LOSS_RESET_MS,
  COIN_FLIP_LOSS_SEALED_HOLD_MS,
  COIN_FLIP_PAGE_LOAD_ANIMATION_MS,
  COIN_FLIP_PROGRESSION_COIN_SIZE,
  COIN_FLIP_PROGRESSION_RECEIVER_SIZE,
  coinFlipFairProbability,
  coinFlipMaxWins,
  coinFlipNavigationPreset,
} from "./coinFlipConfig.js";
import {
  calculateCoinFlipMultiplier,
  calculateCoinFlipProfit,
  formatCoinFlipMultiplier,
  getCoinFlipOddsOptions,
} from "./coinFlipGameLogic.js";
import { getCoinFlipPageStyles } from "./coinFlipPageStyles.js";

export function CoinFlipPage({ onGameChange }) {
  const bettingPanelLayout = useGameShellBettingPanelLayout();
  const [betAmount, setBetAmount] = useState("");
  const [balance] = useState(150000);
  const [selectedSide, setSelectedSide] = useState("heads");
  const [roundsToWin, setRoundsToWin] = useState("4");
  const [coinSide, setCoinSide] = useState("heads");
  const [tossPhase, setTossPhase] = useState("idle");
  const [tossOutcome, setTossOutcome] = useState("heads");
  const [tapHintVisible, setTapHintVisible] = useState(true);
  const [isCoinFlipping, setIsCoinFlipping] = useState(false);
  const [coinRoundStatus, setCoinRoundStatus] = useState("idle");
  const [coinResult, setCoinResult] = useState(null);
  const [coinHistory, setCoinHistory] = useState([]);
  const [displayedCoinProfit, setDisplayedCoinProfit] = useState(0);
  const [coinWinModal, setCoinWinModal] = useState(null);
  const [progressionActiveIndex, setProgressionActiveIndex] = useState(0);
  const [progressionCompletedThrough, setProgressionCompletedThrough] = useState(-1);
  const [progressionLockingIndex, setProgressionLockingIndex] = useState(null);
  const [progressionLosingIndex, setProgressionLosingIndex] = useState(null);
  const [progressionLossIndex, setProgressionLossIndex] = useState(null);
  const [coinProgressionKey, setCoinProgressionKey] = useState(0);
  const [isPageLoadEnter, setIsPageLoadEnter] = useState(true);
  const coinProfitAnimationRef = useRef(null);
  const coinWinModalTimeoutRef = useRef(null);
  const coinLossResetTimeoutRef = useRef(null);
  const coinWinModalResetRef = useRef(false);
  const pendingTossRef = useRef(null);
  const selectedSideRef = useRef(selectedSide);
  const hasCoinBetAmount = Number(betAmount) > 0;
  const hasActiveCoinRound = coinRoundStatus === "active";
  const maxRoundsToWin = Number(roundsToWin) || coinFlipMaxWins;
  const settledCoinCount = coinHistory.filter((coin) => coin.didWin).length;
  const canCashOut =
    hasActiveCoinRound && settledCoinCount > 0 && !isCoinFlipping && !coinWinModal;
  const isRoundLocked = hasActiveCoinRound;
  const canStartCoinFlip =
    hasCoinBetAmount &&
    coinHistory.length < maxRoundsToWin &&
    !isCoinFlipping &&
    !coinWinModal &&
    progressionLosingIndex == null;
  const canFlipCoin = canStartCoinFlip;
  const coinProgressionSteps = useMemo(
    () =>
      Array.from({ length: maxRoundsToWin }, (_, index) => ({
        multiplier: formatCoinFlipMultiplier(calculateCoinFlipMultiplier(index + 1)),
      })),
    [maxRoundsToWin],
  );
  const currentCoinMultiplier = calculateCoinFlipMultiplier(settledCoinCount);
  const nextCoinMultiplier = calculateCoinFlipMultiplier(Math.min(maxRoundsToWin, settledCoinCount + 1));
  const currentCoinProfit = calculateCoinFlipProfit(betAmount, settledCoinCount);
  const nextCoinProfit = calculateCoinFlipProfit(betAmount, Math.min(maxRoundsToWin, settledCoinCount + 1));
  const coinFlipStageRef = useRef(null);
  const coinHistoryRailRef = useRef(null);

  useLayoutEffect(() => {
    const rail = coinHistoryRailRef.current;
    if (!rail) {
      return;
    }

    rail.scrollLeft = Math.max(0, rail.scrollWidth - rail.clientWidth);
  }, [coinHistory, maxRoundsToWin]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setIsPageLoadEnter(false);
    }, COIN_FLIP_PAGE_LOAD_ANIMATION_MS);

    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    return () => {
      if (coinProfitAnimationRef.current) {
        window.cancelAnimationFrame(coinProfitAnimationRef.current);
      }
      if (coinWinModalTimeoutRef.current) {
        window.clearTimeout(coinWinModalTimeoutRef.current);
      }
      clearCoinLossResetTimer();
    };
  }, []);

  useEffect(() => {
    selectedSideRef.current = selectedSide;
  }, [selectedSide]);

  useEffect(() => {
    const fromProfit = displayedCoinProfit;
    const toProfit = currentCoinProfit;

    if (coinProfitAnimationRef.current) {
      window.cancelAnimationFrame(coinProfitAnimationRef.current);
    }

    if (fromProfit === toProfit) return;

    const startTime = performance.now();
    const duration = 560;

    function easeOutQuart(value) {
      return 1 - Math.pow(1 - value, 4);
    }

    function animateProfit(now) {
      const progress = Math.min(1, (now - startTime) / duration);
      const easedProgress = easeOutQuart(progress);

      setDisplayedCoinProfit(fromProfit + (toProfit - fromProfit) * easedProgress);

      if (progress < 1) {
        coinProfitAnimationRef.current = window.requestAnimationFrame(animateProfit);
        return;
      }

      coinProfitAnimationRef.current = null;
    }

    coinProfitAnimationRef.current = window.requestAnimationFrame(animateProfit);
  }, [currentCoinProfit]);

  function clearCoinWinModalTimer() {
    if (coinWinModalTimeoutRef.current) {
      window.clearTimeout(coinWinModalTimeoutRef.current);
      coinWinModalTimeoutRef.current = null;
    }
  }

  function clearCoinLossResetTimer() {
    if (coinLossResetTimeoutRef.current) {
      window.clearTimeout(coinLossResetTimeoutRef.current);
      coinLossResetTimeoutRef.current = null;
    }
  }

  function resetCoinRound() {
    clearCoinLossResetTimer();
    setCoinRoundStatus("idle");
    setCoinResult(null);
    setCoinHistory([]);
    setDisplayedCoinProfit(0);
    setCoinWinModal(null);
    setCoinSide(selectedSideRef.current);
    setTossPhase("idle");
    setTapHintVisible(true);
    pendingTossRef.current = null;
    setProgressionActiveIndex(0);
    setProgressionCompletedThrough(-1);
    setProgressionLockingIndex(null);
    setProgressionLosingIndex(null);
    setProgressionLossIndex(null);
    setCoinProgressionKey((currentKey) => currentKey + 1);
  }

  function scheduleCoinLossReset(delayMs = COIN_FLIP_LOSS_RESET_MS) {
    clearCoinLossResetTimer();
    coinLossResetTimeoutRef.current = window.setTimeout(() => {
      resetCoinRound();
    }, delayMs);
  }

  const handleProgressionLockComplete = useCallback((index) => {
    setProgressionCompletedThrough(index);
    setProgressionActiveIndex(index + 1);
    setProgressionLockingIndex(null);
  }, []);

  const handleProgressionLossComplete = useCallback((index) => {
    setProgressionLossIndex(index);
    setProgressionLosingIndex(null);
    scheduleCoinLossReset(COIN_FLIP_LOSS_SEALED_HOLD_MS);
  }, []);

  function closeCoinWinModal() {
    const shouldResetRound = coinWinModalResetRef.current;

    clearCoinWinModalTimer();
    setCoinWinModal(null);
    coinWinModalResetRef.current = false;

    if (shouldResetRound) {
      resetCoinRound();
    }
  }

  function showCoinWinModal({ title, profit, multiplier, resetOnClose }) {
    coinWinModalResetRef.current = resetOnClose;
    setCoinWinModal({
      title,
      profit,
      multiplier,
      resetOnClose,
    });
    clearCoinWinModalTimer();
    coinWinModalTimeoutRef.current = window.setTimeout(closeCoinWinModal, 3000);
  }

  function handleCoinWinModalClose() {
    closeCoinWinModal();
  }

  function handleBetAction() {
    if (!canStartCoinFlip) return;

    clearCoinWinModalTimer();
    setCoinWinModal(null);
    coinWinModalResetRef.current = false;
    setCoinResult(null);
    if (!hasActiveCoinRound) {
      setCoinHistory([]);
      setCoinSide(selectedSideRef.current);
      setProgressionActiveIndex(0);
      setProgressionCompletedThrough(-1);
      setProgressionLockingIndex(null);
      setProgressionLosingIndex(null);
      setProgressionLossIndex(null);
    }
    setCoinRoundStatus("active");
    window.setTimeout(() => runCoinFlipAnimation(true), 60);
  }

  function handleCoinCashout() {
    if (isCoinFlipping || !hasActiveCoinRound || settledCoinCount <= 0) return;

    const cashoutProfit = calculateCoinFlipProfit(betAmount, settledCoinCount);

    playSound(minesCashoutSound);
    showCoinWinModal({
      title: "Cashout Successful",
      profit: cashoutProfit,
      multiplier: currentCoinMultiplier,
      resetOnClose: true,
    });
  }

  function handleCoinSideChange(side) {
    if (isCoinFlipping) return;

    selectedSideRef.current = side;
    setSelectedSide(side);
    setCoinResult(null);
    setCoinSide(side);
  }

  function handleTossEnd() {
    const pending = pendingTossRef.current;
    if (!pending) {
      setTossPhase("idle");
      setIsCoinFlipping(false);
      setTapHintVisible(true);
      return;
    }

    const { didWin, result } = pending;
    pendingTossRef.current = null;
    const lockIndex = coinHistory.length;

    setCoinSide(result);
    setTossPhase("idle");
    setIsCoinFlipping(false);
    setTapHintVisible(true);
    setCoinResult(didWin ? "win" : "loss");
    setCoinHistory((currentHistory) => [
      ...currentHistory,
      {
        id: `${result}-${Date.now()}`,
        didWin,
        result,
      },
    ]);

    if (didWin) {
      setProgressionLockingIndex(lockIndex);
      const nextWinCount = lockIndex + 1;

      if (nextWinCount >= maxRoundsToWin) {
        const winMultiplier = calculateCoinFlipMultiplier(nextWinCount);
        const winProfit = calculateCoinFlipProfit(betAmount, nextWinCount);

        playSound(minesCashoutSound);
        showCoinWinModal({
          title: "Cashout Successful",
          profit: winProfit,
          multiplier: winMultiplier,
          resetOnClose: true,
        });
      }
    }

    if (!didWin) {
      setProgressionLosingIndex(lockIndex);
      scheduleCoinLossReset();
    }
  }

  function runCoinFlipAnimation(forceStart = false) {
    const isAllowedToFlip =
      hasCoinBetAmount &&
      coinHistory.length < maxRoundsToWin &&
      !isCoinFlipping &&
      tossPhase !== "tossing" &&
      (hasActiveCoinRound || forceStart);

    if (!isAllowedToFlip) return;

    playSound(coinFlipSound);

    const activeSelectedSide = selectedSideRef.current;
    const didWin = Math.random() < coinFlipFairProbability;
    const result = didWin ? activeSelectedSide : activeSelectedSide === "heads" ? "tails" : "heads";

    pendingTossRef.current = { didWin, result };
    setIsCoinFlipping(true);
    setCoinResult(null);
    setTapHintVisible(false);
    setTossOutcome(result);
    setTossPhase("tossing");
  }

  const flipCoin = useCallback(() => {
    if (tossPhase === "tossing" || !canFlipCoin) return;

    if (!hasActiveCoinRound) {
      clearCoinWinModalTimer();
      setCoinWinModal(null);
      coinWinModalResetRef.current = false;
      setCoinResult(null);
      setCoinHistory([]);
      setCoinRoundStatus("active");
      setProgressionActiveIndex(0);
      setProgressionCompletedThrough(-1);
      setProgressionLockingIndex(null);
      setProgressionLosingIndex(null);
      setProgressionLossIndex(null);
      runCoinFlipAnimation(true);
      return;
    }

    runCoinFlipAnimation();
  }, [canFlipCoin, hasActiveCoinRound, tossPhase]);

  return (
    <>
      <style>{getCoinFlipPageStyles(GAME_ROUND_END_STYLES)}</style>
      <GameShell
        balance={formatBalance(balance)}
        className="joker-game-shell--coin-flip"
        defaultValue={coinFlipNavigationPreset.defaultValue}
        game={coinFlipNavigationPreset.game}
        onValueChange={onGameChange}
        value={coinFlipNavigationPreset.selectedValue}
        bettingPanel={
          <PackagedCoinFlipBettingPanel
            betAmount={betAmount}
            inGame={hasActiveCoinRound}
            isFlipping={isCoinFlipping}
            layout={bettingPanelLayout}
            onBetAmountChange={setBetAmount}
            onCashout={handleCoinCashout}
            onFlipCoin={flipCoin}
            onPlaceBet={handleBetAction}
            onSideChange={handleCoinSideChange}
            onRoundsToWinChange={setRoundsToWin}
            oddsOptions={getCoinFlipOddsOptions(betAmount, roundsToWin)}
            roundLocked={isRoundLocked}
            roundsToWinValue={roundsToWin}
            defaultRoundsToWinValue="4"
            selectedSide={selectedSide}
          />
        }
      >
        <section className="joker-coin-flip-stage" aria-label="Coin Flip game board">
          <div className="joker-coin-flip-main-area">
            <div
              ref={coinFlipStageRef}
              className={[
                "joker-coin-flip-game-frame",
                "joker-game-round-end-canvas",
                isPageLoadEnter ? "is-page-load-enter" : "",
                coinResult === "loss" ? "is-round-ending" : "",
              ]
                .filter(Boolean)
                .join(" ")}
              aria-label="Coin Flip game area"
            >
              <div className="joker-coin-flip-game-frame__top">
                <div
                  className="joker-coin-flip-history-rail"
                  aria-label="Coin Flip win streak"
                  ref={coinHistoryRailRef}
                >
                  <div className="joker-coin-flip-history-track">
                    <CoinProgression
                      key={coinProgressionKey}
                      steps={coinProgressionSteps}
                      activeIndex={progressionActiveIndex}
                      completedThrough={progressionCompletedThrough}
                      lockingIndex={progressionLockingIndex}
                      losingIndex={progressionLosingIndex}
                      lossIndex={progressionLossIndex}
                      receiverSize={COIN_FLIP_PROGRESSION_RECEIVER_SIZE}
                      onLockComplete={handleProgressionLockComplete}
                      onLossComplete={handleProgressionLossComplete}
                      renderCoin={(index) => {
                        const historyItem = coinHistory[index];
                        const isLossSlot =
                          progressionLosingIndex === index || progressionLossIndex === index;
                        if (!historyItem && !isLossSlot) return null;
                        return (
                          <Coin
                            side={historyItem?.result ?? coinSide}
                            style={{ "--coin-size": `${COIN_FLIP_PROGRESSION_COIN_SIZE}px` }}
                          />
                        );
                      }}
                    />
                  </div>
                </div>
              </div>
              <div className="joker-coin-flip-game-frame__bottom">
                <div className="joker-coin-flip-play-stack">
                  <div className="joker-coin-flip-play">
                    <div className="joker-coin-flip-play-inner">
                      <div className="joker-coin-flip-coin-stage">
                        <div className="joker-coin-flip-coin-zone">
                          <button
                            type="button"
                            className="joker-coin-toss__tap-target"
                            onClick={flipCoin}
                            disabled={!canFlipCoin || tossPhase === "tossing"}
                            aria-label="Flip coin"
                          >
                            <Coin
                              side={coinSide}
                              tossPhase={tossPhase}
                              tossOutcome={tossOutcome}
                              onTossEnd={handleTossEnd}
                              tapHint="tap to flip"
                              tapHintVisible={tapHintVisible && canFlipCoin && !isPageLoadEnter}
                            />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {bettingPanelLayout === "mobile" && (
                <div className="joker-coin-flip-mobile-odds">
                  <MobileOddsGroup
                    options={getCoinFlipOddsOptions(betAmount, roundsToWin)}
                    value={hasCoinBetAmount ? selectedSide : ""}
                    onValueChange={(value) => handleCoinSideChange(value)}
                    disabled={!hasCoinBetAmount || isCoinFlipping}
                  />
                </div>
              )}
              <GameRoundEndTransition
                active={coinResult === "loss"}
                animationKey={`coin-loss-${coinHistory.length}`}
              />
              {coinWinModal && (
                <div className="joker-coin-flip-result-card" role="status" aria-live="polite">
                  <WinModalCard
                    title={coinWinModal.title}
                    amountWon={`+${formatJkcAmount(coinWinModal.profit)}`}
                    currency={null}
                    message="Your winnings from this round have been added to your balance."
                    closeLabel="Close"
                    onClose={handleCoinWinModalClose}
                  />
                </div>
              )}
            </div>
          </div>
        </section>
      </GameShell>
    </>
  );
}
