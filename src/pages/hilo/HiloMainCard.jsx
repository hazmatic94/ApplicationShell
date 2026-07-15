import { Chip, GameCardFace, GameCardMini, GameCardMiniFace, GameCardStack, HiLoEllipseButton, HiloMainCardGlow, SkipButton } from "@joker/design-system";

export function HiloMainCard({ card, children, onSkipCard, showSkipButton, skipDisabled }) {
  return (
    <div className="joker-hilo-main-card-wrap">
      {showSkipButton && (
        <div className="joker-hilo-main-card-skip-slot">
          <div className="joker-hilo-main-card-skip-scale">
            <SkipButton
              aria-label="Skip Card"
              className="joker-hilo-main-card-skip"
              disabled={skipDisabled}
              onClick={onSkipCard}
            />
          </div>
        </div>
      )}
      <div className="joker-hilo-main-card-stack-slot">
        <HiloMainCardGlow className="joker-hilo-main-card-glow" />
        <div className="joker-hilo-main-card-scale">
          <div className="joker-hilo-main-card-anchor">
            <GameCardStack
              aria-label={`${card.rank} of ${card.suit}`}
              className="joker-hilo-main-card-stack"
            >
              <GameCardFace color={card.tone} rank={card.rank} suit={card.suit} />
            </GameCardStack>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

