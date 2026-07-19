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
      var(--roulette-win-streak-chip-size) + 54px
    );
    --roulette-mobile-top-band-height: calc(
      var(--spacing-24) + var(--roulette-streak-rail-content-height)
    );
    --roulette-celebration-bleed-top: 96px;
    --roulette-win-streak-layer: 8;
    --roulette-mobile-odds-layer: 20;
  }

  .joker-roulette-game-frame__stage {
    position: relative;
    display: flex;
    flex: 1 1 auto;
    flex-direction: column;
    width: 100%;
    min-width: 0;
    min-height: 0;
    height: 100%;
    box-sizing: border-box;
  }

  .joker-roulette-game-frame .joker-roulette-game-frame__stage.is-round-ending {
    animation: none;
  }

  .joker-roulette-game-frame__top {
    display: flex;
    width: 100%;
    flex: 0 0 auto;
    flex-direction: column;
    align-items: stretch;
    justify-content: flex-start;
    position: relative;
    z-index: var(--roulette-win-streak-layer);
    border-bottom: 0;
    box-sizing: border-box;
    padding: var(--spacing-24) 0 0 var(--spacing-24);
    overflow: hidden;
    background: transparent;
    flex-shrink: 0;
    min-height: var(--roulette-mobile-top-band-height);
    max-height: var(--roulette-mobile-top-band-height);
  }

  .joker-roulette-streak-rail {
    position: relative;
    z-index: 1;
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
    z-index: 6;
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
    padding: 0 var(--spacing-20) 0 0;
  }

  .joker-roulette-streak-rail .joker-win-streak-row__slot {
    align-items: flex-start;
    min-height: calc(var(--win-streak-row-chip-size, var(--roulette-win-streak-chip-size)) + 14px + 30px);
  }

  .joker-roulette-streak-rail .joker-roulette-win-chip {
    --roulette-win-chip-size: var(--roulette-win-streak-row-chip-size);
    position: relative;
    z-index: 1;
  }

  .joker-roulette-streak-rail .joker-roulette-win-chip__multiplier {
    z-index: 2;
  }

  .joker-roulette-game-frame.is-celebrating-loss .joker-roulette-game-frame__top {
    z-index: var(--roulette-win-streak-layer);
    pointer-events: none;
  }

  .joker-roulette-game-frame.is-celebrating-win .joker-roulette-game-frame__top {
    z-index: var(--roulette-win-streak-layer);
    pointer-events: none;
    overflow: visible;
  }

  .joker-roulette-game-frame.is-celebrating-win .joker-roulette-streak-rail {
    position: relative;
    z-index: 1;
    overflow-y: visible;
  }

  .joker-roulette-game-frame.is-celebrating-loss .game-area-wheel.is-celebrating-loss {
    z-index: 5;
    overflow: hidden;
    clip-path: inset(calc(-1 * var(--roulette-celebration-bleed-top)) 0 0 0);
    box-sizing: border-box;
  }

  .joker-roulette-game-frame.is-celebrating-win .game-area-wheel.is-celebrating-win {
    z-index: 3;
    overflow: hidden;
    clip-path: inset(calc(-1 * var(--roulette-celebration-bleed-top)) 0 0 0);
    box-sizing: border-box;
  }

  .joker-roulette-game-frame.is-celebrating-win .joker-roulette-wheel-composition__wheel {
    animation: none !important;
    transform: none !important;
  }

  .game-area-wheel {
    position: relative;
    z-index: 1;
    flex: 1 1 0%;
    min-height: 0;
    width: 100%;
    padding: 0;
    margin: 0;
    overflow: hidden;
    box-sizing: border-box;
    --roulette-wheel-native-width: 1111px;
    --roulette-wheel-native-height: 1162px;
    --roulette-wheel-native-inset-top: 40px;
  }

  .game-area-wheel .joker-roulette-wrapper {
    width: 100%;
    height: 100%;
    min-width: 0;
    min-height: 0;
  }

  .game-area-wheel .joker-roulette-wrapper__wheel-slot > .joker-roulette-wheel-composition {
    --roulette-wheel-size: var(--roulette-wheel-native-width);
    width: var(--roulette-wheel-native-width);
    height: var(--roulette-wheel-native-height);
  }

  .joker-roulette-game-frame.is-page-load-enter .joker-roulette-wrapper__wheel-slot > .joker-roulette-wheel-composition {
    transform-origin: center center;
    animation: joker-roulette-load-wheel-enter 480ms var(--ease-out) both;
  }

  @keyframes joker-roulette-load-wheel-enter {
    from {
      opacity: 0;
      transform: rotate(-16deg) scale(0.94);
    }

    to {
      opacity: 1;
      transform: rotate(0deg) scale(1);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .joker-roulette-game-frame.is-page-load-enter .joker-roulette-wrapper__wheel-slot > .joker-roulette-wheel-composition {
      animation: none;
      opacity: 1;
      transform: none;
    }
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

  @media (min-width: 1000px) {
    .joker-roulette-game-frame__top {
      position: relative;
      flex: 0 0 auto;
      flex-shrink: 0;
      min-height: var(--roulette-sync-streak-rail-height);
      max-height: var(--roulette-sync-streak-rail-height);
      padding: var(--spacing-24) 0 0 var(--spacing-24);
      justify-content: flex-start;
      overflow: hidden;
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

  @media (max-width: 999px) {
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
      z-index: var(--roulette-win-streak-layer);
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      flex: 0 0 auto;
      flex-shrink: 0;
      height: var(--roulette-mobile-top-band-height);
      min-height: var(--roulette-mobile-top-band-height);
      max-height: var(--roulette-mobile-top-band-height);
      padding: 0 0 0 var(--spacing-24);
      gap: 0;
      box-sizing: border-box;
      overflow: hidden;
    }

    .joker-roulette-game-frame.is-celebrating-win .joker-roulette-game-frame__top {
      overflow: visible;
    }

    .joker-roulette-streak-rail {
      z-index: 1;
      flex: 0 0 auto;
      min-height: 0;
      align-items: flex-start;
      justify-content: flex-start;
      padding-block: 0;
      padding-inline: 0;
    }

    .joker-roulette-streak-rail .joker-win-streak-row {
      margin-top: var(--spacing-24);
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

    .joker-roulette-game-frame__stage {
      position: relative;
      z-index: 7;
    }

    .joker-roulette-mobile-odds {
      position: absolute;
      left: 0;
      right: 0;
      bottom: 0;
      width: 100%;
      max-width: none;
      margin: 0;
      padding: var(--spacing-4) var(--spacing-24) var(--spacing-16);
      box-sizing: border-box;
      z-index: var(--roulette-mobile-odds-layer);
      pointer-events: none;
      background: none;
    }

    .joker-roulette-mobile-odds .joker-mobile-odds-group,
    .joker-roulette-mobile-odds .joker-mobile-roulette-odds-group,
    .joker-roulette-mobile-odds .joker-odds-button-group {
      background: none;
    }

    .joker-roulette-mobile-odds .joker-odds-button-group.is-inline {
      gap: var(--spacing-8);
      pointer-events: auto;
    }

    .joker-roulette-game-frame .joker-roulette-wheel-edge-fade:not(.joker-roulette-wheel-edge-fade--bottom) {
      display: none;
    }

    .joker-roulette-game-frame .joker-roulette-wheel-edge-fade--bottom {
      display: block;
      z-index: 5;
    }
  }
${gameRoundEndStyles}
  `;
}
