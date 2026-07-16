import { ROULETTE_WIN_CHIP_SIZE } from "./rouletteConfig.js";

export function getRoulettePageStyles(gameRoundEndStyles) {
  return `

  .joker-game-shell--roulette .joker-game-inner-canvas,
  .joker-game-shell--roulette .joker-game-shell-empty-stage {
    min-height: 0;
    height: 100%;
  }

  .joker-game-shell--roulette .joker-game-shell-empty-stage > .joker-roulette-game-frame {
    height: 100%;
    min-height: 0;
  }

  .joker-roulette-game-frame {
    position: relative;
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
    min-width: 0;
    min-height: 0;
    box-sizing: border-box;
    --roulette-betting-divider-offset: calc(
      var(--spacing-32) + calc(var(--body-12) * var(--text-body-line-height)) +
        var(--spacing-8) + var(--input-control-height) + var(--spacing-24)
    );
    --roulette-sync-streak-rail-height: var(--roulette-betting-divider-offset);
    --roulette-streak-inset: var(--spacing-24);
    --roulette-sync-divider-band: calc(
      var(--roulette-sync-streak-rail-height) + var(--roulette-streak-inset)
    );
  }

  .joker-roulette-game-frame__top {
    position: relative;
    z-index: 2;
    display: flex;
    flex: 0 0 auto;
    flex-direction: column;
    width: 100%;
    min-width: 0;
    overflow: hidden;
    box-sizing: border-box;
    padding: var(--spacing-16) var(--spacing-24);
  }

  .joker-roulette-streak-rail {
    width: 100%;
    min-width: 0;
    flex: 0 0 auto;
    --win-streak-row-gap: var(--spacing-12);
    --win-streak-row-chip-size: ${ROULETTE_WIN_CHIP_SIZE}px;
    overflow-x: auto;
    overflow-y: visible;
    scroll-behavior: smooth;
    scrollbar-width: none;
  }

  .joker-roulette-streak-rail::-webkit-scrollbar {
    display: none;
  }

  .joker-roulette-streak-rail .joker-win-streak-row__track {
    width: max-content;
    min-width: 100%;
    align-items: center;
  }

  .joker-roulette-streak-rail .joker-win-streak-row__slot {
    align-items: center;
    justify-content: center;
  }

  .joker-roulette-result-overlay {
    position: absolute;
    inset: 0;
    z-index: 40;
    display: grid;
    place-items: center;
    padding: var(--spacing-24);
    pointer-events: none;
  }

  .joker-roulette-result-overlay .joker-win-modal-card {
    pointer-events: auto;
  }

  @media (min-width: 1024px) {
    .joker-roulette-game-frame__top {
      height: var(--roulette-sync-divider-band);
      min-height: var(--roulette-sync-divider-band);
      max-height: var(--roulette-sync-divider-band);
      padding: var(--roulette-streak-inset) 0 0 var(--roulette-streak-inset);
    }

    .joker-roulette-streak-rail {
      display: flex;
      height: var(--roulette-sync-streak-rail-height);
      max-height: var(--roulette-sync-streak-rail-height);
      align-items: center;
      justify-content: flex-start;
    }

    .joker-roulette-streak-rail--empty {
      min-height: var(--roulette-sync-streak-rail-height);
    }
  }

  @media (max-width: 1023px) {
    .joker-roulette-game-frame__top {
      padding: var(--spacing-12) 0;
    }

    .joker-roulette-streak-rail {
      padding-inline: var(--spacing-24);
    }

    .joker-roulette-streak-rail--empty {
      min-height: 0;
    }
  }
${gameRoundEndStyles}
  `;
}
