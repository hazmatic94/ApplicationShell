export function MobileShellScrollFix() {
  return (
    <style>
      {`
        .joker-game-shell .joker-game-shell-empty-stage > * {
          min-height: 100%;
        }

        @media (min-width: 1024px) {
          .joker-game-shell .joker-page-wrapper {
            align-items: stretch;
            padding: var(--game-shell-page-padding);
          }

          .joker-game-shell .joker-page-wrapper > * {
            max-height: 100%;
          }
        }

        .joker-game-shell .joker-navigation-mobile-content .joker-page-wrapper::after {
          content: "";
          display: block;
          flex: 0 0 var(--game-shell-page-padding);
          width: 100%;
        }

        @media (max-width: 1023px) {
          .joker-game-shell--hilo .joker-navigation-mobile-content .joker-hilo-betting-panel {
            display: grid;
            grid-template-rows: auto auto auto;
            align-content: start;
            gap: var(--spacing-16);
            padding: var(--spacing-24);
          }

          .joker-game-shell--hilo .joker-navigation-mobile-content .joker-hilo-betting-panel > .joker-betting-submit-group {
            order: 1;
          }

          .joker-game-shell--hilo .joker-navigation-mobile-content .joker-hilo-betting-panel > .joker-hilo-betting-submit-spacer {
            display: none;
          }

          .joker-game-shell--hilo .joker-navigation-mobile-content .joker-hilo-betting-panel > .joker-betting-divider {
            order: 2;
          }

          .joker-game-shell--hilo .joker-navigation-mobile-content .joker-hilo-betting-panel > .joker-hilo-betting-main {
            order: 3;
          }

          .joker-game-shell--hilo .joker-navigation-mobile-content .joker-hilo-betting-panel .joker-hilo-betting-main {
            gap: var(--spacing-16);
          }

          .joker-game-shell--hilo .joker-navigation-mobile-content .joker-hilo-betting-panel .joker-betting-fields > .joker-button--hi-lo-skip,
          .joker-game-shell--hilo .joker-navigation-mobile-content .joker-hilo-betting-panel .joker-betting-fields > .joker-button--secondary {
            display: none;
          }

          .joker-game-shell--hilo .joker-navigation-mobile-content .joker-hilo-betting-panel .joker-betting-fields {
            gap: var(--spacing-16);
          }

          .joker-game-shell--hilo .joker-navigation-mobile-content .joker-hilo-betting-panel .joker-hilo-betting-actions,
          .joker-game-shell--hilo .joker-navigation-mobile-content .joker-hilo-betting-panel .joker-betting-fields > .joker-betting-divider:last-of-type {
            display: none;
          }

        }
      `}
    </style>
  );
}
