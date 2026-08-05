import { useEffect, useState } from "react";
import { GameRoundEndTransition } from "../../shared/gameRoundEnd.jsx";
import { GameWinModalCard } from "../../shared/GameWinModalCard.jsx";
import { GameWinModalOverlay } from "../../shared/GameWinModalOverlay.jsx";
import { formatCurrency } from "../../shared/formatting.js";
import {
  MINES_PAGE_LOAD_ANIMATION_MS,
  MINES_PAGE_LOAD_ROW_BASE_DELAY_MS,
  MINES_PAGE_LOAD_ROW_STAGGER_MS,
} from "./minesConfig.js";
import { getTileContent } from "./minesGameLogic.jsx";
import { MinesBoardTile } from "./MinesBoardTile.jsx";

export function MinesGrid({
  balance,
  board,
  cashoutResult,
  columns,
  freshRevealedTiles,
  lossResult,
  multiplier,
  onResultClose,
  onWinCoinsLand,
  onTileClick,
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
    <section className="joker-mines-stage" aria-label="Mines game board">
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
            const tileContent = getTileContent(tileData);
            const blockedByShield = Boolean(tileData?.blockedByShield);
            const rowIndex = Math.floor(index / columns);
            const cellStyle = isPageLoadEnter
              ? {
                  "--mines-load-row-delay": `${MINES_PAGE_LOAD_ROW_BASE_DELAY_MS + rowIndex * MINES_PAGE_LOAD_ROW_STAGGER_MS}ms`,
                }
              : undefined;

            return (
              <MinesBoardTile
                key={tile}
                blockedByShield={blockedByShield}
                cellStyle={cellStyle}
                freshReveal={freshReveal}
                gameActive={gameActive}
                multiplier={multiplier}
                onClick={() => onTileClick(tile)}
                revealed={revealed}
                stackIndex={tiles.length - index}
                tile={tile}
                tileContent={tileContent}
              />
            );
          })}
        </div>
        <GameRoundEndTransition
          active={roundStatus === "lost"}
          animationKey={`mines-loss-${revealedTiles.join("-")}`}
        />
        {cashoutResult && (
          <GameWinModalOverlay className="joker-mines-result-card" role="status" aria-live="polite">
            <GameWinModalCard
              title="Cashout Successful"
              amountWon={formatCurrency(cashoutResult.profit)}
              balance={balance}
              profit={cashoutResult.profit}
              onCoinsLand={onWinCoinsLand}
              onClose={onResultClose}
            />
          </GameWinModalOverlay>
        )}
      </div>
    </section>
  );
}

