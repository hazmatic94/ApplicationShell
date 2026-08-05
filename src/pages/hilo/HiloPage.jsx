import { useEffect, useRef, useState } from "react";
import { GameShell } from "@joker/design-system";
import hiloCardDrawSound from "../../../assets/hilo-card-draw.mp3?url";
import hiloNextSound from "../../../assets/hilo-next.mp3?url";
import {
  GAME_ROUND_END_RESET_MS,
  GAME_ROUND_END_STYLES,
} from "../../shared/gameRoundEnd.jsx";
import { formatBalance } from "../../shared/formatting.js";
import { playCashoutSound, playLossSound, playPlaceBetSound } from "../../shared/gameSounds.js";
import { GameWinModalCard } from "../../shared/GameWinModalCard.jsx";
import { useDeferredWinCredit, useGameShellBettingPanelLayout, useOpenGameMenu } from "../../shared/hooks.js";
import { playSound } from "../../shared/sounds.js";
import { HiloStage } from "./HiloStage.jsx";
import { PackagedHiloBettingPanel } from "./PackagedHiloBettingPanel.jsx";
import { hiloNavigationPreset } from "./hiloConfig.js";
import {
  calculateHiloOdds,
  calculateProjectedHiloMultiplier,
  createHiloHistoryEntry,
  createHiloPreviewState,
  createHiloRound,
  formatHiloPercent,
  getHiloDisplayOdds,
  getInitialHiloPreview,
  runHiloPrediction,
  updateHiloHistory,
} from "./hiloGameLogic.js";
import { getHiloPageStyles } from "./hiloPageStyles.js";

export function HiloPage({ onGameChange }) {
  const [betAmount, setBetAmount] = useState("");
  const [balance, setBalance] = useState(150000);
  const { deferWinCredit, applyDeferredWinCredit, getDisplayBalance } = useDeferredWinCredit(setBalance);
  const [currentCard, setCurrentCard] = useState(() => getInitialHiloPreview().currentCard);
  const [deck, setDeck] = useState([]);
  const [history, setHistory] = useState(() => getInitialHiloPreview().history);
  const [multiplier, setMultiplier] = useState(1);
  const [roundStatus, setRoundStatus] = useState("pre-game");
  const [pendingPrediction, setPendingPrediction] = useState("");
  const [skipAvailable, setSkipAvailable] = useState(true);
  const [hiloWinModal, setHiloWinModal] = useState(null);
  const hiloRoundResetTimeoutRef = useRef(null);
  const hiloHistoryLengthRef = useRef(history.length);

  const bettingPanelLayout = useGameShellBettingPanelLayout();
  const numericBetAmount = Number(betAmount) || 0;
  const hasBetAmount = numericBetAmount > 0;
  const gameInPlay = roundStatus === "active";
  const gameOdds = calculateHiloOdds(currentCard, deck);
  const displayOdds = getHiloDisplayOdds(currentCard, deck);
  const lowerMultiplier = calculateProjectedHiloMultiplier(
    multiplier,
    gameOdds.lowerProbability
  );
  const higherMultiplier = calculateProjectedHiloMultiplier(
    multiplier,
    gameOdds.higherProbability
  );
  const currentProfit = multiplier > 1 ? numericBetAmount * multiplier : 0;

  useOpenGameMenu(hiloNavigationPreset.openMenuLabel);

  useEffect(() => {
    return () => {
      if (hiloRoundResetTimeoutRef.current) {
        window.clearTimeout(hiloRoundResetTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!gameInPlay) {
      hiloHistoryLengthRef.current = history.length;
      return;
    }

    if (history.length > hiloHistoryLengthRef.current) {
      setPendingPrediction("");
    }

    hiloHistoryLengthRef.current = history.length;
  }, [gameInPlay, history.length]);

  function clearHiloRoundResetTimer() {
    if (hiloRoundResetTimeoutRef.current) {
      window.clearTimeout(hiloRoundResetTimeoutRef.current);
      hiloRoundResetTimeoutRef.current = null;
    }
  }

  function resetHiloRound() {
    clearHiloRoundResetTimer();
    const preview = createHiloPreviewState();
    setCurrentCard(preview.currentCard);
    setDeck([]);
    setHistory(preview.history);
    setMultiplier(1);
    setRoundStatus("pre-game");
    setPendingPrediction("");
    setSkipAvailable(true);
    setHiloWinModal(null);
  }

  function scheduleHiloRoundReset() {
    clearHiloRoundResetTimer();
    hiloRoundResetTimeoutRef.current = window.setTimeout(() => {
      hiloRoundResetTimeoutRef.current = null;
      resetHiloRound();
    }, GAME_ROUND_END_RESET_MS);
  }

  function closeHiloWinModal() {
    clearHiloRoundResetTimer();
    applyDeferredWinCredit();
    setHiloWinModal(null);
    resetHiloRound();
  }

  function showHiloWinModal({ title, profit }) {
    setHiloWinModal({ title, profit });
  }

  function handleHiloWinModalClose() {
    closeHiloWinModal();
  }

  function handleBetAmountChange(nextValue) {
    setBetAmount(nextValue);

    if (!Number(nextValue)) {
      setPendingPrediction("");
    }
  }

  function handleHiloChoiceSelection(choice) {
    if (gameInPlay) {
      setPendingPrediction(choice);
      handlePrediction(choice);
      return;
    }

    if (roundStatus === "pre-game" && hasBetAmount) {
      setPendingPrediction(choice);
    }
  }

  function handlePlaceBet() {
    if (gameInPlay) return;

    if (!hasBetAmount || numericBetAmount > balance || !pendingPrediction) {
      return;
    }

    clearHiloRoundResetTimer();
    setHiloWinModal(null);

    playPlaceBetSound();

    const nextRound = createHiloRound(currentCard);

    setBalance((currentBalance) => currentBalance - numericBetAmount);
    setSkipAvailable(true);

    if (pendingPrediction) {
      const choice = pendingPrediction;
      const roundOdds = calculateHiloOdds(nextRound.currentCard, nextRound.deck);
      const result = runHiloPrediction(choice, {
        currentCard: nextRound.currentCard,
        deck: nextRound.deck,
        history: nextRound.history,
        multiplier: 1,
        odds: roundOdds,
        stake: numericBetAmount,
      });

      setPendingPrediction("");

      if (result) {
        setCurrentCard(result.currentCard);
        setDeck(result.deck);
        setHistory(result.history);
        setMultiplier(result.multiplier);
        setRoundStatus(result.roundStatus);

        if (result.roundStatus === "win") {
          deferWinCredit(result.winProfit);
          playCashoutSound();
          showHiloWinModal({
            title: "You Won",
            profit: result.winProfit,
          });
          return;
        }

        if (result.roundStatus === "loss") {
          playLossSound();
          scheduleHiloRoundReset();
          return;
        }

        return;
      }
    }

    setCurrentCard(nextRound.currentCard);
    setDeck(nextRound.deck);
    setHistory(nextRound.history);
    setMultiplier(1);
    setRoundStatus("active");
  }

  function handleCashout() {
    if (!gameInPlay || currentProfit <= 0) {
      return;
    }

    deferWinCredit(currentProfit);
    setRoundStatus("cash-out");
    playCashoutSound();
    showHiloWinModal({
      title: "Cashout Successful",
      profit: currentProfit,
    });
  }

  function handlePrediction(choice) {
    if (!gameInPlay || deck.length === 0) {
      return;
    }

    playSound(hiloCardDrawSound);

    const result = runHiloPrediction(choice, {
      currentCard,
      deck,
      history,
      multiplier,
      odds: gameOdds,
      stake: numericBetAmount,
    });

    if (!result) {
      return;
    }

    setCurrentCard(result.currentCard);
    setDeck(result.deck);
    setHistory(result.history);
    setMultiplier(result.multiplier);
    setRoundStatus(result.roundStatus);

    if (result.roundStatus === "win") {
      deferWinCredit(result.winProfit);
      playCashoutSound();
      showHiloWinModal({
        title: "You Won",
        profit: result.winProfit,
      });
      return;
    }

    if (result.roundStatus === "loss") {
      playLossSound();
      scheduleHiloRoundReset();
    }
  }

  function handleSkipCard() {
    if (roundStatus === "pre-game") {
      playSound(hiloNextSound);
      const preview = createHiloPreviewState();
      setCurrentCard(preview.currentCard);
      setHistory(preview.history);
      return;
    }

    if (!gameInPlay || !skipAvailable || deck.length === 0) {
      return;
    }

    playSound(hiloNextSound);

    const [nextCard, ...remainingDeck] = deck;

    setCurrentCard(nextCard);
    setDeck(remainingDeck);
    setHistory((currentHistory) =>
      updateHiloHistory(
        currentHistory,
        "skip",
        createHiloHistoryEntry(nextCard, "Skip", "skip")
      )
    );
    setSkipAvailable(false);

    if (remainingDeck.length === 0 && currentProfit > 0) {
      deferWinCredit(currentProfit);
      setRoundStatus("win");
      playCashoutSound();
      showHiloWinModal({
        title: "You Won",
        profit: currentProfit,
      });
    }
  }

  return (
    <>
      <style>{getHiloPageStyles(GAME_ROUND_END_STYLES)}</style>
      <GameShell
        balance={formatBalance(getDisplayBalance(balance))}
        className="joker-game-shell--hilo"
        defaultValue={hiloNavigationPreset.defaultValue}
        game={hiloNavigationPreset.game}
        onValueChange={onGameChange}
        value={hiloNavigationPreset.selectedValue}
        bettingPanel={
          <PackagedHiloBettingPanel
            awaitingHiloChoice={!gameInPlay && hasBetAmount && !pendingPrediction}
            betAmount={betAmount}
            gameInPlay={gameInPlay}
            hasBetAmount={hasBetAmount}
            higherOdds={formatHiloPercent(displayOdds.higherPercent)}
            layout={bettingPanelLayout}
            lowerOdds={formatHiloPercent(displayOdds.lowerPercent)}
            onBetAmountChange={handleBetAmountChange}
            onCashout={handleCashout}
            onPlaceBet={handlePlaceBet}
            onHigherSame={() => handleHiloChoiceSelection("higher")}
            onLowerSame={() => handleHiloChoiceSelection("lower")}
            onSkipCard={handleSkipCard}
            selectedOddsValue={pendingPrediction}
            skipAvailable={skipAvailable}
          />
        }
      >
        <HiloStage
          bettingPanelLayout={bettingPanelLayout}
          cardsRemaining={deck.length}
          currentCard={currentCard}
          hasBetAmount={hasBetAmount}
          higherMultiplier={higherMultiplier}
          higherOdds={formatHiloPercent(displayOdds.higherPercent)}
          history={history}
          lowerMultiplier={lowerMultiplier}
          lowerOdds={formatHiloPercent(displayOdds.lowerPercent)}
          onHigherSame={() => handleHiloChoiceSelection("higher")}
          onLowerSame={() => handleHiloChoiceSelection("lower")}
          onSkipCard={handleSkipCard}
          balance={balance}
          onWinModalClose={handleHiloWinModalClose}
          onWinCoinsLand={applyDeferredWinCredit}
          pendingPrediction={pendingPrediction}
          roundStatus={roundStatus}
          skipAvailable={skipAvailable}
          winModal={hiloWinModal}
        />
      </GameShell>
    </>
  );
}
