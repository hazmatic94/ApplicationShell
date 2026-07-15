import { useEffect, useState } from "react";
import { WinModalCard } from "@joker/design-system";
import { GameRoundEndTransition } from "../../shared/gameRoundEnd.jsx";
import { formatCurrency } from "../../shared/formatting.js";
import {
  MINES_PAGE_LOAD_ANIMATION_MS,
  MINES_PAGE_LOAD_ROW_BASE_DELAY_MS,
  MINES_PAGE_LOAD_ROW_STAGGER_MS,
} from "../mines/minesConfig.js";
import { FourDMinesBoardTile } from "./FourDMinesBoardTile.jsx";

export function FourDMinesGrid({
  board,
  cashoutResult,
  columns,
  freshRevealedTiles,
  lossResult,
  multiplier,
  onResultClose,
  onWinCoinsLand,
  onTileClick,
  playerFourDNumber,
  revealedTiles,
  roundStatus,
  rows,
  tiles,
}) {
  const gameActive = roundStatus === "active";
  const [isPageLoadEnter, setIsPageLoadEnter] = useState(true);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setIsPageLoadEnter(false);
    }, MINES_PAGE_LOAD_ANIMATION_MS);

    return () => window.clearTimeout(timer);
  }, []);

  return (
    <section className="joker-mines-stage" aria-label="4D Mines game board">
      <div
        className={[
          "joker-mines-board-area",
          "joker-game-round-end-canvas",
          isPageLoadEnter ? "is-page-load-enter" : "",
          roundStatus === "lost" ? "is-round-ending" : "",
        ]
          .filter(Boolean)
          .join(" ")}
        style={{
          "--mines-grid-columns": columns,
          "--mines-grid-rows": rows,
        }}
      >
        <div
          className={[
            "joker-mines-grid",
            gameActive ? "is-round-active" : "",
            roundStatus === "lost" ? "is-round-lost" : "",
            isPageLoadEnter ? "is-page-load-enter" : "",
          ]
            .filter(Boolean)
            .join(" ")}
        >
          {tiles.map((tile, index) => {
            const revealed = revealedTiles.includes(tile);
            const freshReveal = freshRevealedTiles.includes(tile);
            const tileData = board[index];
            const rowIndex = Math.floor(index / columns);
            const cellStyle = isPageLoadEnter
              ? {
                  "--mines-load-row-delay": `${MINES_PAGE_LOAD_ROW_BASE_DELAY_MS + rowIndex * MINES_PAGE_LOAD_ROW_STAGGER_MS}ms`,
                }
              : undefined;

            return (
              <FourDMinesBoardTile
                key={tile}
                cellStyle={cellStyle}
                freshReveal={freshReveal}
                gameActive={gameActive}
                multiplier={multiplier}
                onClick={() => onTileClick(tile)}
                playerFourDNumber={playerFourDNumber}
                revealed={revealed}
                stackIndex={tiles.length - index}
                tile={tile}
                tileData={tileData}
              />
            );
          })}
        </div>
        <GameRoundEndTransition
          active={roundStatus === "lost"}
          animationKey={`4d-mines-loss-${revealedTiles.join("-")}`}
        />
        {cashoutResult && (
          <div className="joker-mines-result-card" role="status" aria-live="polite">
            <WinModalCard
              title="Cashout Successful"
              amountWon={formatCurrency(cashoutResult.profit)}
              currency={null}
              message="Your winnings from this round have been added to your balance."
              closeLabel="Close"
              onCoinsLand={onWinCoinsLand}
              onClose={onResultClose}
            />
          </div>
        )}
      </div>
    </section>
  );
}

