import { Chip, GameCardMini, GameCardMiniFace, HiLoEllipseButton } from "@joker/design-system";
import { HILO_PAGE_LOAD_CHIP_STAGGER_MS } from "./hiloConfig.js";
import { getHiloHistoryChipVariant, getHiloHistoryConnectorVariant } from "./hiloGameLogic.js";

export function HiloHistoryEntry({ card, chipIndex = 0, className = "", isPageLoadEnter = false }) {
  const chipVariant = getHiloHistoryChipVariant(card.chipTone);
  const chipLabel = chipVariant === "start" || chipVariant === "skip" ? undefined : card.chip;
  const loadStyle = isPageLoadEnter
    ? {
        "--hilo-load-chip-delay": `${200 + chipIndex * HILO_PAGE_LOAD_CHIP_STAGGER_MS}ms`,
      }
    : undefined;

  return (
    <div
      className={["joker-hilo-history-entry", className].filter(Boolean).join(" ")}
      style={loadStyle}
    >
      <Chip className="joker-hilo-history-chip" variant={chipVariant}>
        {chipLabel}
      </Chip>
      <div className="joker-hilo-history-card-wrap">
        <GameCardMini
          aria-label={`${card.rank} of ${card.suit}`}
          className="joker-hilo-mini-card"
        >
          <GameCardMiniFace color={card.tone} rank={card.rank} suit={card.suit} />
        </GameCardMini>
        {card.next ? (
          <HiLoEllipseButton
            aria-hidden="true"
            className="joker-hilo-history-connector"
            disabled
            tabIndex={-1}
            type="button"
            variant={getHiloHistoryConnectorVariant(card.next)}
          />
        ) : null}
      </div>
    </div>
  );
}

