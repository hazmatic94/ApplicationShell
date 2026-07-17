import { ROULETTE_WIN_CHIP_SIZE } from "./rouletteConfig.js";

export function getRoulettePageStyles(gameRoundEndStyles) {
  return `

  .joker-game-shell--roulette .joker-game-inner-canvas,
  .joker-game-shell--roulette .joker-game-shell-empty-stage,
  .joker-game-shell--roulette .joker-game-shell-stage {
    min-height: 0;
    height: 100%;
    overflow: hidden;
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
    overflow: hidden;
    background: var(--joker-black-800);
    --roulette-betting-divider-offset: calc(
      var(--spacing-32) + calc(var(--body-12) * var(--text-body-line-height)) +
        var(--spacing-8) + var(--input-control-height) + var(--spacing-24)
    );
    --roulette-sync-streak-rail-height: var(--roulette-betting-divider-offset);
    --roulette-win-streak-chip-size: ${ROULETTE_WIN_CHIP_SIZE}px;
    --roulette-streak-rail-content-height: calc(
      28px + var(--roulette-win-streak-chip-size) + 54px + 24px
    );
    --roulette-celebration-bleed-top: 96px;
  }

  .joker-roulette-game-frame__top {
    display: flex;
    width: 100%;
    flex: 0 0 auto;
    flex-direction: column;
    align-items: stretch;
    justify-content: flex-start;
    position: relative;
    z-index: 4;
    border-bottom: 0;
    box-sizing: border-box;
    padding: var(--spacing-24) 0 0 var(--spacing-24);
    overflow: visible;
    background: transparent;
    min-height: calc(var(--spacing-24) + var(--roulette-streak-rail-content-height));
  }

  .joker-roulette-streak-rail {
    position: relative;
    z-index: 2;
    display: flex;
    width: 100%;
    min-width: 0;
    flex: 0 0 auto;
    align-items: flex-start;
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

  .joker-roulette-wheel-edge-fade {
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    width: 140px;
    z-index: 2;
    pointer-events: none;
    display: none;
    background: linear-gradient(
      to right,
      var(--joker-black-800) 0%,
      color-mix(in srgb, var(--joker-black-800) 80%, transparent) 49%,
      transparent 100%
    );
  }

  .joker-roulette-wheel-edge-fade--right {
    left: auto;
    right: 0;
    background: linear-gradient(
      to right,
      transparent 0%,
      color-mix(in srgb, var(--joker-black-800) 80%, transparent) 51%,
      var(--joker-black-800) 100%
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
      transparent 0%,
      color-mix(in srgb, var(--joker-black-800) 80%, transparent) 51%,
      var(--joker-black-800) 100%
    );
  }

  .joker-roulette-streak-rail::-webkit-scrollbar {
    display: none;
  }

  .joker-roulette-streak-track {
    display: flex;
    width: max-content;
    min-width: 100%;
    min-height: var(--roulette-streak-rail-content-height);
    align-items: flex-start;
    justify-content: flex-start;
    padding-inline-start: 0;
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

  .joker-roulette-streak-rail .joker-win-streak-row {
    width: auto;
  }

  .joker-roulette-streak-rail .joker-win-streak-row__track {
    align-items: flex-start;
    justify-content: flex-start;
    margin: 0;
    padding: 28px 20px 24px 0;
  }

  .joker-roulette-streak-rail .joker-win-streak-row__slot {
    align-items: flex-start;
    min-height: calc(var(--win-streak-row-chip-size, var(--roulette-win-streak-chip-size)) + 54px);
  }

  .joker-roulette-streak-rail .joker-roulette-win-chip {
    --roulette-win-chip-size: var(--roulette-win-streak-row-chip-size);
  }

  .joker-roulette-game-frame.is-celebrating-loss .joker-roulette-game-frame__top,
  .joker-roulette-game-frame.is-celebrating-win .joker-roulette-game-frame__top {
    z-index: 2;
    pointer-events: none;
  }

  .joker-roulette-game-frame.is-celebrating-loss .game-area-wheel.is-celebrating-loss,
  .joker-roulette-game-frame.is-celebrating-win .game-area-wheel.is-celebrating-win {
    z-index: 5;
    overflow: hidden;
    margin-top: calc(-1 * var(--roulette-celebration-bleed-top));
    padding-top: var(--roulette-celebration-bleed-top);
    box-sizing: border-box;
  }

  .joker-roulette-game-frame.is-celebrating-loss .game-area-wheel.is-celebrating-loss .joker-roulette-wrapper,
  .joker-roulette-game-frame.is-celebrating-win .game-area-wheel.is-celebrating-win .joker-roulette-wrapper {
    overflow: visible;
  }

  .game-area-wheel {
    position: relative;
    z-index: 1;
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

  .joker-roulette-result-overlay .joker-roulette-result-card {
    pointer-events: auto;
  }

  @media (min-width: 1024px) {
    .joker-roulette-game-frame__top {
      position: relative;
      flex: 0 0 auto;
      min-height: var(--roulette-sync-streak-rail-height);
      padding: var(--spacing-24) 0 0 var(--spacing-24);
      justify-content: flex-start;
      overflow: visible;
    }

    .joker-roulette-streak-rail {
      display: flex;
      height: auto;
      max-height: none;
      flex: 0 0 auto;
      align-items: flex-start;
      justify-content: flex-start;
      min-height: 0;
      padding-block: 0;
      box-sizing: border-box;
    }

    .joker-roulette-streak-track {
      display: flex;
      width: max-content;
      min-width: 100%;
      min-height: var(--roulette-streak-rail-content-height);
      align-items: flex-start;
      justify-content: flex-start;
      padding-inline-start: 0;
      box-sizing: border-box;
    }

    .joker-roulette-wheel-edge-fade:not(.joker-roulette-wheel-edge-fade--bottom) {
      display: block;
    }
  }

  @media (max-width: 1023px) {
    .joker-game-shell--roulette .joker-navigation-mobile-content .joker-game-shell-empty-stage {
      overflow: hidden;
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
      position: relative;
      z-index: 1;
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      padding: var(--spacing-24) 0 0 var(--spacing-24);
      gap: 0;
    }

    .joker-roulette-streak-rail {
      z-index: 2;
      align-items: flex-start;
      justify-content: flex-start;
      flex: 0 0 auto;
      padding-block: 0;
      padding-inline: 0;
    }

    .joker-roulette-streak-track {
      display: flex;
      width: max-content;
      min-width: 100%;
      min-height: var(--roulette-streak-rail-content-height);
      align-items: flex-start;
      justify-content: flex-start;
      padding-inline-start: 0;
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
    }
  }
${gameRoundEndStyles}
  `;
}
