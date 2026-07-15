import { useEffect, useState } from "react";
import { LossTile, MinesTile, SafeTile, WinTile } from "@joker/design-system";
import shieldIcon from "../../../assets/mines-shield.png?url";

export function MinesBoardTile({
  blockedByShield,
  cellStyle,
  freshReveal,
  gameActive,
  multiplier,
  onClick,
  revealed,
  stackIndex,
  tile,
  tileContent,
}) {
  const [showRevealed, setShowRevealed] = useState(revealed && !freshReveal);

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
    blockedByShield ? "is-shield-blocked" : "",
  ]
    .filter(Boolean)
    .join(" ");
  const tileClassName = "joker-mines-grid-tile";

  if (!revealed) {
    return (
      <div className={cellClassName} style={cellStyle}>
        <MinesTile
          aria-hidden={false}
          aria-label={`Reveal tile ${tile}`}
          className={tileClassName}
          onClick={gameActive ? onClick : undefined}
          playClickSound={tileContent === "gold"}
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
  if (tileContent === "gold") {
    tileNode = (
      <WinTile
        {...revealProps}
        multiplier={freshReveal ? `${multiplier.toFixed(2)}x` : undefined}
      />
    );
  } else if (tileContent === "dynamite") {
    tileNode = <LossTile {...revealProps} soundOnReveal={!blockedByShield} />;
  } else {
    tileNode = <SafeTile {...revealProps} />;
  }

  return (
    <div className={cellClassName} style={cellStyle}>
      {tileNode}
      {blockedByShield ? (
        <span className="joker-mines-shield-badge" aria-hidden="true">
          <img src={shieldIcon} alt="" />
        </span>
      ) : null}
    </div>
  );
}

