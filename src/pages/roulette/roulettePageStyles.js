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
    background: var(--joker-black-800);
    --roulette-betting-divider-offset: calc(
      var(--spacing-32) + calc(var(--body-12) * var(--text-body-line-height)) +
        var(--spacing-8) + var(--input-control-height) + var(--spacing-24)
    );
    --roulette-sync-streak-rail-height: var(--roulette-betting-divider-offset);
    --roulette-win-streak-chip-size: ${ROULETTE_WIN_CHIP_SIZE}px;
    --roulette-mobile-top-band-height: calc(
      var(--spacing-24) + var(--roulette-win-streak-chip-size) + 54px
    );
  }

  .joker-roulette-game-frame__top {
    position: relative;
    z-index: 2;
    display: flex;
    flex: 0 0 auto;
    flex-shrink: 0;
    flex-direction: column;
    align-items: stretch;
    justify-content: flex-start;
    width: 100%;
    min-width: 0;
    overflow: visible;
    border-bottom: 0;
    box-sizing: border-box;
    padding: var(--spacing-24) 0 0;
    background: transparent;
  }

  .joker-roulette-wheel-edge-fade {
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    z-index: 1;
    pointer-events: none;
    display: none;
    background: linear-gradient(
      to right,
      rgb(21 21 21 / 100%) 0%,
      rgb(21 21 21 / 80%) 49%,
      rgb(21 21 21 / 0%) 100%
    );
  }

  .joker-roulette-wheel-edge-fade--right {
    left: auto;
    right: 0;
    background: linear-gradient(
      to right,
      rgb(21 21 21 / 0%) 0%,
      rgb(21 21 21 / 80%) 51%,
      rgb(21 21 21 / 100%) 100%
    );
  }

  .joker-roulette-wheel-edge-fade--bottom {
    display: block;
    top: auto;
    left: 0;
    right: 0;
    bottom: 0;
    width: auto;
    height: 140px;
    background: linear-gradient(
      to bottom,
      rgb(21 21 21 / 0%) 0%,
      rgb(21 21 21 / 80%) 51%,
      rgb(21 21 21 / 100%) 100%
    );
  }

  .joker-roulette-streak-rail {
    position: relative;
    z-index: 2;
    display: flex;
    width: 100%;
    min-width: 0;
    flex: 0 0 auto;
    align-items: center;
    justify-content: flex-start;
    padding-block: 0;
    padding-inline: 0;
    overflow-x: auto;
    overflow-y: visible;
    scroll-behavior: smooth;
    scroll-padding-inline-end: var(--spacing-24);
    scroll-padding-inline-start: var(--spacing-24);
    scrollbar-width: none;
  }

  .joker-roulette-streak-rail::-webkit-scrollbar {
    display: none;
  }

  .joker-roulette-streak-track {
    display: flex;
    width: max-content;
    min-width: 100%;
    align-items: center;
    justify-content: flex-start;
    padding-inline-start: var(--spacing-24);
    overflow: visible;
    box-sizing: border-box;
  }

  .joker-roulette-streak-track::after {
    content: "";
    display: block;
    flex: 0 0 var(--spacing-24);
    width: var(--spacing-24);
    height: 1px;
  }

  .joker-roulette-streak-rail .joker-roulette-win-streak-row {
    width: auto;
  }

  .joker-roulette-streak-rail .joker-roulette-win-streak-row__track {
    align-items: flex-start;
    justify-content: flex-start;
    margin: 0;
    padding: 0;
  }

  .joker-roulette-streak-rail .joker-roulette-win-streak-row__slot {
    align-items: flex-start;
    min-height: calc(var(--roulette-win-streak-row-chip-size) + 54px);
  }

  .joker-roulette-streak-rail .joker-roulette-win-chip {
    --roulette-win-chip-size: var(--roulette-win-streak-row-chip-size);
  }

  .game-area-wheel {
    flex: 1 1 auto;
    min-height: 0;
    width: 100%;
    padding: 0;
    margin: 0;
    overflow: hidden;
  }

  .game-area-wheel .joker-roulette-wrapper {
    --roulette-wheel-native-inset-top: 0px;
    width: 100%;
    height: 100%;
    padding-top: 0;
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
      flex: 0 0 auto;
      height: var(--roulette-sync-streak-rail-height);
      min-height: var(--roulette-sync-streak-rail-height);
      max-height: var(--roulette-sync-streak-rail-height);
      padding: var(--spacing-24) 0 0;
    }

    .joker-roulette-streak-rail {
      display: flex;
      height: auto;
      max-height: none;
      flex: 0 0 auto;
      align-items: center;
      justify-content: flex-start;
      min-height: 0;
      padding-block: 0;
      box-sizing: border-box;
    }

    .joker-roulette-streak-track {
      display: flex;
      width: max-content;
      min-width: 100%;
      min-height: 0;
      align-items: center;
      justify-content: flex-start;
      padding-inline-start: var(--spacing-24);
      box-sizing: border-box;
    }
  }

  @media (max-width: 1023px) {
    .joker-game-shell--roulette .joker-navigation-mobile-content .joker-game-shell-empty-stage {
      overflow: visible;
    }

    .joker-game-shell--roulette .joker-navigation-mobile-content .joker-roulette-game-frame {
      display: flex;
      flex-direction: column;
      width: 100%;
      min-width: 0;
      height: 100%;
      max-height: 100cqh;
      box-sizing: border-box;
    }

    .joker-roulette-game-frame__top {
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      flex: 0 0 auto;
      flex-shrink: 0;
      height: var(--roulette-mobile-top-band-height);
      min-height: var(--roulette-mobile-top-band-height);
      max-height: var(--roulette-mobile-top-band-height);
      padding: var(--spacing-24) 0 0;
      gap: 0;
      box-sizing: border-box;
    }

    .joker-roulette-streak-rail {
      flex: 1 1 auto;
      min-height: 0;
      align-items: center;
      justify-content: flex-start;
      padding-block: 0;
      padding-inline: 0;
    }

    .joker-roulette-streak-track {
      display: flex;
      width: max-content;
      min-width: 100%;
      min-height: calc(var(--roulette-win-streak-chip-size) + 54px);
      align-items: center;
      justify-content: flex-start;
      margin-inline: 0;
      padding-inline-start: var(--spacing-24);
      box-sizing: border-box;
    }

    .joker-roulette-mobile-odds {
      position: relative;
      flex: 0 0 auto;
      left: auto;
      right: auto;
      bottom: auto;
      width: 100%;
      max-width: none;
      margin-top: 0;
      padding: var(--spacing-4) var(--spacing-24) var(--spacing-16);
      box-sizing: border-box;
      z-index: 4;
      pointer-events: auto;
    }

    .joker-roulette-mobile-odds .joker-odds-button-group.is-inline {
      gap: var(--spacing-8);
    }

    .joker-roulette-wheel-edge-fade:not(.joker-roulette-wheel-edge-fade--bottom) {
      display: block;
      width: 80px;
    }
  }
${gameRoundEndStyles}
  `;
}
