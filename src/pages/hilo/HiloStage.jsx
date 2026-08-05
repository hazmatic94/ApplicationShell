import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { HigherCard, LowerCard, MobileHiLoOddsGroup } from "@joker/design-system";
import { GameWinModalCard } from "../../shared/GameWinModalCard.jsx";
import { GameWinModalOverlay } from "../../shared/GameWinModalOverlay.jsx";
import { GameRoundEndTransition } from "../../shared/gameRoundEnd.jsx";
import { formatCurrency } from "../../shared/formatting.js";
import { hiloRanks, hiloSuits, HILO_PAGE_LOAD_ANIMATION_MS } from "./hiloConfig.js";
import { HiloHistoryEntry } from "./HiloHistoryEntry.jsx";
import { HiloMainCard } from "./HiloMainCard.jsx";
import { HiloChoiceCard } from "./HiloChoiceCard.jsx";

export function HiloStage({
  bettingPanelLayout = "desktop",
  cardsRemaining = 0,
  currentCard,
  hasBetAmount = false,
  higherMultiplier,
  higherOdds,
  history,
  lowerMultiplier,
  lowerOdds,
  onHigherSame,
  onLowerSame,
  onSkipCard,
  balance,
  onWinModalClose,
  onWinCoinsLand,
  pendingPrediction,
  roundStatus,
  skipAvailable,
  winModal,
}) {
  const cardTotal =
    roundStatus === "pre-game" ? hiloRanks.length * hiloSuits.length : history.length + cardsRemaining;
  const choiceInteractive =
    roundStatus === "active" || (roundStatus === "pre-game" && hasBetAmount);
  const historyRailRef = useRef(null);
  const historyLengthRef = useRef(history.length);
  const [isPageLoadEnter, setIsPageLoadEnter] = useState(true);
  const [enteringHistoryIndex, setEnteringHistoryIndex] = useState(null);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setIsPageLoadEnter(false);
    }, HILO_PAGE_LOAD_ANIMATION_MS);

    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (isPageLoadEnter) {
      historyLengthRef.current = history.length;
      return;
    }

    if (history.length <= historyLengthRef.current) {
      historyLengthRef.current = history.length;
      return;
    }

    const nextIndex = history.length - 1;
    historyLengthRef.current = history.length;
    setEnteringHistoryIndex(nextIndex);

    const timer = window.setTimeout(() => {
      setEnteringHistoryIndex((currentIndex) => (currentIndex === nextIndex ? null : currentIndex));
    }, 600);

    return () => window.clearTimeout(timer);
  }, [history.length, isPageLoadEnter]);

  useLayoutEffect(() => {
    const rail = historyRailRef.current;
    if (!rail) {
      return;
    }

    const maxScrollLeft = Math.max(0, rail.scrollWidth - rail.clientWidth);
    rail.scrollLeft = maxScrollLeft;
  }, [history]);

  return (
    <section className="joker-hilo-stage" aria-label="Hilo game board">
      <div className="joker-hilo-main-area">
        <div
          className={[
            "joker-hilo-game-frame",
            "joker-game-round-end-canvas",
            isPageLoadEnter ? "is-page-load-enter" : "",
            roundStatus === "loss" ? "is-round-ending" : "",
          ]
            .filter(Boolean)
            .join(" ")}
          aria-label="Hilo game area"
        >
          <div className="joker-hilo-game-frame__top">
            <div
              className="joker-hilo-history-rail"
              aria-label="Previous cards"
              ref={historyRailRef}
            >
              <div className="joker-hilo-history-track">
                {history.map((card, index) => (
                  <HiloHistoryEntry
                    card={card}
                    chipIndex={index}
                    className={enteringHistoryIndex === index ? "is-latest" : ""}
                    isPageLoadEnter={isPageLoadEnter}
                    key={`${card.id}-${index}`}
                  />
                ))}
              </div>
            </div>
            <span className="joker-betting-divider" aria-hidden="true" />
          </div>
          <div className="joker-hilo-game-frame__bottom">
            <div className="joker-hilo-game-frame__play-stack">
              <div className="joker-hilo-game-frame__play">
                <div className="joker-hilo-game-frame__play-inner">
                <HiloChoiceCard
                  Card={LowerCard}
                  className="joker-hilo-prediction-group--lower"
                  disabled={!choiceInteractive}
                  multiplier={lowerMultiplier}
                  onClick={onLowerSame}
                  selected={pendingPrediction === "lower"}
                  support="Ace = lowest"
                />
                <div className="joker-hilo-main-card-column">
                  <HiloMainCard
                    card={currentCard}
                    key={currentCard.id}
                    onSkipCard={onSkipCard}
                    showSkipButton={
                      bettingPanelLayout === "mobile" || (roundStatus === "active" && skipAvailable)
                    }
                    skipDisabled={
                      roundStatus === "pre-game" ? false : roundStatus !== "active" || !skipAvailable
                    }
                  >
                    <p className="joker-hilo-game-frame__status">
                      CARD <strong>{history.length}</strong> OF <strong>{cardTotal}</strong>
                    </p>
                  </HiloMainCard>
                </div>
                <HiloChoiceCard
                  Card={HigherCard}
                  className="joker-hilo-prediction-group--higher"
                  disabled={!choiceInteractive}
                  multiplier={higherMultiplier}
                  onClick={onHigherSame}
                  selected={pendingPrediction === "higher"}
                  support="King = highest"
                />
                </div>
              </div>
            </div>
          </div>
          {bettingPanelLayout === "mobile" && (
            <div className="joker-hilo-mobile-odds">
              <MobileHiLoOddsGroup
                key={`hilo-mobile-odds-${history.length}`}
                disabled={!choiceInteractive}
                lowerOdds={lowerOdds}
                higherOdds={higherOdds}
                onLowerSame={onLowerSame}
                onHigherSame={onHigherSame}
                value={pendingPrediction}
              />
            </div>
          )}
          <GameRoundEndTransition
            active={roundStatus === "loss"}
            animationKey={`hilo-loss-${history.length}`}
          />
        </div>
      </div>
      {winModal && (
        <GameWinModalOverlay className="joker-hilo-result-card" role="status" aria-live="polite">
          <GameWinModalCard
            title={winModal.title}
            amountWon={formatCurrency(winModal.profit)}
            balance={balance}
            profit={winModal.profit}
            onCoinsLand={onWinCoinsLand}
            onClose={onWinModalClose}
          />
        </GameWinModalOverlay>
      )}
    </section>
  );
}

