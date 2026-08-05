import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import {
  Coin,
  CoinProgression,
  GameShell,
  getCoinReceiverLossTotalMs,
} from "@joker/design-system";
import {
  GAME_ROUND_END_STYLES,
  GameRoundEndTransition,
} from "../../shared/gameRoundEnd.jsx";
import { formatBalance, formatJkcAmount } from "../../shared/formatting.js";
import { playCashoutSound, playLossSound, playPlaceBetSound } from "../../shared/gameSounds.js";
import { GameWinModalCard } from "../../shared/GameWinModalCard.jsx";
import { GameWinModalOverlay } from "../../shared/GameWinModalOverlay.jsx";
import { useGameShellBettingPanelLayout } from "../../shared/hooks.js";
import { MobileOddsGroup } from "./MobileOddsGroup.jsx";
import { PackagedCoinFlipBettingPanel } from "./PackagedCoinFlipBettingPanel.jsx";
import {
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
  getCoinFlipProgressionStepCount,
} from "./coinFlipGameLogic.js";
import { getCoinFlipPageStyles } from "./coinFlipPageStyles.js";

export function CoinFlipPage({ onGameChange }) {
  const bettingPanelLayout = useGameShellBettingPanelLayout();
  const [betAmount, setBetAmount] = useState("");
  const [balance] = useState(150000);
  const [selectedSide, setSelectedSide] = useState("heads");
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
  const coinLossResetTimeoutRef = useRef(null);
  const lossResetHandledRef = useRef(false);
  const coinWinModalResetRef = useRef(false);
  const pendingTossRef = useRef(null);
  const selectedSideRef = useRef(selectedSide);
  const hasCoinBetAmount = Number(betAmount) > 0;
  const hasActiveCoinRound = coinRoundStatus === "active";
  const isCoinCashedOut = coinRoundStatus === "cashedOut";
  const settledCoinCount = coinHistory.filter((coin) => coin.didWin).length;
  const coinProgressionStepCount = hasActiveCoinRound
    ? getCoinFlipProgressionStepCount(settledCoinCount)
    : coinFlipMaxWins;
  const isRoundLocked = hasActiveCoinRound;
  const canStartCoinFlip =
    hasCoinBetAmount &&
    !isCoinFlipping &&
    progressionLockingIndex == null &&
    progressionLosingIndex == null &&
    (coinRoundStatus === "idle" || coinRoundStatus === "cashedOut");
  const canFlipCoin = canStartCoinFlip;
  const coinProgressionSteps = useMemo(
    () =>
      Array.from({ length: coinProgressionStepCount }, (_, index) => ({
        multiplier: formatCoinFlipMultiplier(calculateCoinFlipMultiplier(index + 1)),
      })),
    [coinProgressionStepCount],
  );
  const currentCoinMultiplier = calculateCoinFlipMultiplier(settledCoinCount);
  const currentCoinProfit = calculateCoinFlipProfit(betAmount, settledCoinCount);
  const coinFlipStageRef = useRef(null);
  const coinHistoryRailRef = useRef(null);

  useLayoutEffect(() => {
    const rail = coinHistoryRailRef.current;
    if (!rail) {
      return;
    }

    rail.scrollLeft = Math.max(0, rail.scrollWidth - rail.clientWidth);
  }, [coinHistory, coinProgressionStepCount]);

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
      if (coinLossResetTimeoutRef.current) {
        window.clearTimeout(coinLossResetTimeoutRef.current);
      }
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

  function clearCoinLossResetTimer() {
    if (coinLossResetTimeoutRef.current) {
      window.clearTimeout(coinLossResetTimeoutRef.current);
      coinLossResetTimeoutRef.current = null;
    }
  }

  function resetCoinRound() {
    clearCoinLossResetTimer();
    lossResetHandledRef.current = false;
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

  function resetCoinRoundAfterLoss() {
    if (lossResetHandledRef.current) {
      return;
    }

    lossResetHandledRef.current = true;
    clearCoinLossResetTimer();
    resetCoinRound();
  }

  function scheduleCoinLossReset() {
    clearCoinLossResetTimer();
    coinLossResetTimeoutRef.current = window.setTimeout(() => {
      coinLossResetTimeoutRef.current = null;
      resetCoinRoundAfterLoss();
    }, getCoinReceiverLossTotalMs());
  }

  const handleProgressionLockComplete = useCallback((index) => {
    setProgressionCompletedThrough(index);
    setProgressionActiveIndex(index + 1);
    setProgressionLockingIndex(null);
  }, []);

  const handleProgressionLossComplete = useCallback(() => {
    resetCoinRoundAfterLoss();
  }, []);

  function closeCoinWinModal() {
    const shouldResetRound = coinWinModalResetRef.current;

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
  }

  function handleCoinWinModalClose() {
    closeCoinWinModal();
  }

  function startCoinFlipRound() {
    setCoinWinModal(null);
    coinWinModalResetRef.current = false;
    setCoinResult(null);
    setCoinHistory([]);
    setCoinSide(selectedSideRef.current);
    setProgressionActiveIndex(0);
    setProgressionCompletedThrough(-1);
    setProgressionLockingIndex(null);
    setProgressionLosingIndex(null);
    setProgressionLossIndex(null);
    setCoinProgressionKey((currentKey) => currentKey + 1);
    setCoinRoundStatus("active");
    playPlaceBetSound();
    window.setTimeout(() => runCoinFlipAnimation(true), 60);
  }

  function handleBetAction() {
    if (isCoinCashedOut) {
      resetCoinRound();
    }

    if (!canStartCoinFlip) return;

    startCoinFlipRound();
  }

  function handleCoinCashout() {
    if (isCoinFlipping || !hasActiveCoinRound || settledCoinCount <= 0) return;

    const cashoutProfit = calculateCoinFlipProfit(betAmount, settledCoinCount);

    playCashoutSound();
    setCoinRoundStatus("cashedOut");
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
    }

    if (!didWin) {
      playLossSound();
      setProgressionLosingIndex(lockIndex);
      scheduleCoinLossReset();
    }
  }

  function runCoinFlipAnimation(forceStart = false) {
    const isAllowedToFlip =
      hasCoinBetAmount &&
      !isCoinFlipping &&
      tossPhase !== "tossing" &&
      (hasActiveCoinRound || forceStart);

    if (!isAllowedToFlip) return;

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
      if (isCoinCashedOut) {
        resetCoinRound();
      }

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
      setCoinProgressionKey((currentKey) => currentKey + 1);
      runCoinFlipAnimation(true);
      return;
    }

    runCoinFlipAnimation();
  }, [canFlipCoin, hasActiveCoinRound, isCoinCashedOut, tossPhase]);

  return (
    <>
      <style>{getCoinFlipPageStyles(GAME_ROUND_END_STYLES)}</style>
      <GameShell
        balance={formatBalance(
          coinWinModal ? balance + coinWinModal.profit : balance
        )}
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
            oddsOptions={getCoinFlipOddsOptions(betAmount, settledCoinCount)}
            roundLocked={isRoundLocked}
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
                              tapHint="Tap to flip"
                              tapHintVisible={tapHintVisible && canFlipCoin && !isPageLoadEnter}
                              soundEnabled={false}
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
                    options={getCoinFlipOddsOptions(betAmount, settledCoinCount)}
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
                <GameWinModalOverlay className="joker-coin-flip-result-card" role="status" aria-live="polite">
                  <GameWinModalCard
                    title={coinWinModal.title}
                    amountWon={`+${formatJkcAmount(coinWinModal.profit)}`}
                    balance={balance}
                    profit={coinWinModal.profit}
                    onClose={handleCoinWinModalClose}
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
