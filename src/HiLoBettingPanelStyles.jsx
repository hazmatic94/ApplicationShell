export function HiLoBettingPanelStyles() {
  return (
    <style>
      {`
        .joker-hilo-betting-panel.is-hilo-pre-game .joker-hilo-betting-actions {
          cursor: not-allowed;
        }

        .joker-hilo-betting-panel .joker-hilo-betting-actions button {
          display: flex;
          align-items: center;
          justify-content: center;
        }

        @media (min-width: 1000px) {
          .joker-hilo-betting-panel.is-hilo-pre-game:not(.is-hilo-pre-game-ready)
            .joker-hilo-betting-actions {
            opacity: 0.56;
            pointer-events: none;
            cursor: not-allowed;
          }

          .joker-hilo-betting-panel.is-hilo-pre-game.is-awaiting-hilo-choice
            .joker-betting-submit-group
            .joker-button {
            pointer-events: none;
            cursor: not-allowed;
            opacity: 0.45;
          }
        }

        @media (max-width: 999px) {
          .joker-hilo-betting-panel.is-hilo-pre-game.is-awaiting-hilo-choice
            .joker-betting-submit-group
            .joker-button {
            pointer-events: none;
            cursor: not-allowed;
            opacity: 0.45;
          }
        }
      `}
    </style>
  );
}
