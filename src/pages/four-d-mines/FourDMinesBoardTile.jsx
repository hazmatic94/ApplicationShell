import { useEffect, useState } from "react";
import {
  FourDMinesTile,
  FourDMinesWinTile,
  isFourDNumberPermutationMatch,
  LossTile,
  SafeTile,
} from "@joker/design-system";
import { getFourDTileContent } from "./fourDMinesGameLogic.js";

export function FourDMinesBoardTile({
  cellStyle,
  freshReveal,
  gameActive,
  multiplier,
  onClick,
  playerFourDNumber,
  revealed,
  stackIndex,
  tile,
  tileData,
}) {
  const [showRevealed, setShowRevealed] = useState(revealed && !freshReveal);
  const tileContent = getFourDTileContent(tileData);
  const tileClassName = "joker-mines-grid-tile";

  useEffect(() => {
    if (!revealed) {
      setShowRevealed(false);
      return;
    }

    if (freshReveal) {
      setShowRevealed(false);
      const frameId = window.requestAnimationFrame(() => {
        setShowRevealed(true);
      });
      return () => window.cancelAnimationFrame(frameId);
    }

    setShowRevealed(true);
  }, [freshReveal, revealed]);

  const cellClassName = [
    "joker-mines-grid-cell",
    revealed ? "is-revealed" : "",
    freshReveal ? "is-fresh-reveal" : "",
  ]
    .filter(Boolean)
    .join(" ");

  if (!revealed) {
    return (
      <div className={cellClassName} style={cellStyle}>
        <FourDMinesTile
          aria-hidden={false}
          aria-label={`Reveal tile ${tile}`}
          className={tileClassName}
          onClick={gameActive ? onClick : undefined}
          role="button"
          selected={gameActive}
          stackIndex={stackIndex}
          tabIndex={gameActive ? 0 : -1}
        />
      </div>
    );
  }

  const revealProps = {
    "aria-hidden": false,
    "aria-label": `Tile ${tile}: ${tileContent}`,
    className: tileClassName,
    defaultRevealed: false,
    revealed: showRevealed,
    stackIndex,
  };

  let tileNode;
  if (tileContent === "dynamite") {
    tileNode = <LossTile {...revealProps} soundOnReveal />;
  } else if (tileContent === "win") {
    const tileNumber = tileData?.fourDNumber ?? "0000";
    const isPermutationMatch = isFourDNumberPermutationMatch(tileNumber, playerFourDNumber);

    tileNode = (
      <FourDMinesWinTile
        {...revealProps}
        number={playerFourDNumber || tileNumber}
        displayNumber={tileNumber}
        multiplier={
          freshReveal && isPermutationMatch ? `${multiplier.toFixed(2)}x` : undefined
        }
      />
    );
  } else {
    tileNode = <SafeTile {...revealProps} />;
  }

  return (
    <div className={cellClassName} style={cellStyle}>
      {tileNode}
    </div>
  );
}

