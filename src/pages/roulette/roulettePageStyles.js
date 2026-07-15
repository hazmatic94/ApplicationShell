import {
  ROULETTE_DESKTOP_WHEEL_LAYOUT,
  ROULETTE_MOBILE_WHEEL_SCALE,
  ROULETTE_WHEEL_NATIVE_SIZE,
  ROULETTE_WIN_CHIP_SIZE,
} from "./rouletteConfig.js";

export function getRoulettePageStyles(gameRoundEndStyles) {
  return `

  .joker-game-shell--roulette .joker-game-inner-canvas {
    min-height: 0;
    height: 100%;
  }

  .joker-game-shell--roulette .joker-game-shell-empty-stage {
    min-height: 0;
    overflow: visible;
  }

  .joker-game-shell--roulette .joker-game-shell-empty-stage > .joker-roulette-stage {
    min-height: 0;
    height: 100%;
  }

  .joker-roulette-stage {
    container-type: size;
    position: relative;
    display: grid;
    width: 100%;
    height: 100%;
    min-height: 0;
    box-sizing: border-box;
    --roulette-betting-divider-offset: calc(
      var(--spacing-32) + calc(var(--body-12) * var(--text-body-line-height)) +
        var(--spacing-8) + var(--input-control-height) + var(--spacing-24)
    );
    --roulette-sync-streak-rail-height: var(--roulette-betting-divider-offset);
    --roulette-streak-inset: var(--spacing-24);
    --roulette-sync-top-band-height: calc(
      var(--roulette-sync-streak-rail-height) + var(--roulette-streak-inset)
    );
    --roulette-sync-divider-band: var(--roulette-sync-top-band-height);
    --roulette-wheel-native-size: ${ROULETTE_WHEEL_NATIVE_SIZE.desktop}px;
    --roulette-wheel-visible-scale: 1;
    --roulette-wheel-scale-boost: 1.4;
    --roulette-wheel-scale-max: 1.34;
    --roulette-wheel-lift: 35%;
    --roulette-wheel-lift-offset: 0px;
    --roulette-wheel-push-down: 0px;
    --roulette-wheel-vignette-size: 200px;
    padding: 0;
    grid-template-rows: minmax(0, 1fr);
    overflow: visible;
    background: var(--joker-black-800);
  }

  .joker-roulette-main-area {
    container-type: size;
    display: flex;
    width: 100%;
    height: 100%;
    min-width: 0;
    min-height: 0;
    align-items: stretch;
    justify-content: flex-start;
    overflow: visible;
    padding: 0;
  }

  .joker-roulette-game-frame {
    position: relative;
    display: flex;
    width: 100%;
    height: 100%;
    max-height: 100cqh;
    box-sizing: border-box;
    min-width: 0;
    min-height: 0;
    flex-direction: column;
    align-items: stretch;
    justify-content: flex-start;
    gap: 0;
    overflow: visible;
    padding: 0;
    margin-inline: auto;
  }

  .joker-roulette-game-frame__top {
    display: flex;
    width: 100%;
    flex: 0 0 auto;
    flex-direction: column;
    align-items: stretch;
    border-bottom: 0;
    box-sizing: border-box;
    padding: var(--spacing-16) var(--spacing-24);
    overflow: visible;
    background: transparent;
  }

  @media (min-width: 1024px) {
    .joker-roulette-game-frame__top {
      position: relative;
      flex: 0 0 auto;
      height: var(--roulette-sync-divider-band);
      min-height: var(--roulette-sync-divider-band);
      max-height: var(--roulette-sync-divider-band);
      padding: var(--roulette-streak-inset) 0 0 var(--roulette-streak-inset);
    }

    .joker-roulette-streak-rail {
      display: flex;
      height: var(--roulette-sync-streak-rail-height);
      max-height: var(--roulette-sync-streak-rail-height);
      flex: 0 0 auto;
      align-items: center;
      justify-content: flex-start;
      min-height: 0;
      padding-block: 0;
      box-sizing: border-box;
    }

    .joker-roulette-streak-rail .joker-win-streak-row__track {
      display: flex;
      width: max-content;
      min-width: 100%;
      height: 100%;
      min-height: 0;
      align-items: center;
      justify-content: flex-start;
      padding-inline-start: 0;
      box-sizing: border-box;
    }

    .joker-roulette-streak-rail .joker-win-streak-row__slot {
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }

  .joker-roulette-streak-rail {
    position: relative;
    z-index: 2;
    width: 100%;
    min-width: 0;
    flex: 0 0 auto;
    --win-streak-row-gap: var(--spacing-12);
    --win-streak-row-chip-size: ${ROULETTE_WIN_CHIP_SIZE}px;
    overflow-x: auto;
    overflow-y: visible;
    scroll-behavior: smooth;
    scroll-padding-inline-end: var(--spacing-24);
    scroll-padding-inline-start: var(--spacing-24);
    scrollbar-width: none;
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

  .joker-roulette-streak-rail::-webkit-scrollbar {
    display: none;
  }

  .joker-roulette-streak-rail--empty {
    min-height: var(--roulette-sync-streak-rail-height);
  }

  .joker-roulette-game-frame__bottom {
    display: flex;
    width: 100%;
    flex: 1 1 auto;
    flex-direction: column;
    align-items: stretch;
    justify-content: stretch;
    gap: 0;
    min-height: 0;
    height: 100%;
    padding: 0;
    box-sizing: border-box;
    overflow: hidden;
    background: var(--joker-black-800);
  }

  .joker-roulette-wheel-viewport {
    position: relative;
    display: flex;
    width: 100%;
    height: 100%;
    min-height: 0;
    flex: 1 1 auto;
    align-items: flex-end;
    justify-content: center;
    overflow: hidden;
    background: var(--joker-black-800);
    container-type: size;
    container-name: roulette-wheel;
    --roulette-wheel-visible-scale: min(
      calc((100cqw * 1.22) / var(--roulette-wheel-native-size)),
      calc((100cqh * 2.35) / var(--roulette-wheel-native-size)),
      var(--roulette-wheel-scale-max)
    );
  }

  .joker-roulette-wheel-vignette {
    position: absolute;
    inset: 0;
    z-index: 3;
    pointer-events: none;
    background:
      linear-gradient(
        90deg,
        #151515 0%,
        rgb(21 21 21 / 80%) 49%,
        rgb(21 21 21 / 0%) 100%
      )
      left center / var(--roulette-wheel-vignette-size) 100% no-repeat,
      linear-gradient(
        270deg,
        #151515 0%,
        rgb(21 21 21 / 80%) 49%,
        rgb(21 21 21 / 0%) 100%
      )
      right center / var(--roulette-wheel-vignette-size) 100% no-repeat,
      linear-gradient(
        0deg,
        #151515 0%,
        rgb(21 21 21 / 80%) 49%,
        rgb(21 21 21 / 0%) 100%
      )
      center bottom / 100% var(--roulette-wheel-vignette-size) no-repeat;
  }

  .joker-roulette-wheel-mount {
    position: relative;
    z-index: 1;
    display: flex;
    flex: 0 0 auto;
    width: var(--roulette-wheel-native-size);
    height: var(--roulette-wheel-native-size);
    align-items: center;
    justify-content: center;
    overflow: visible;
    transform: translateY(var(--roulette-wheel-push-down, 0px))
      scale(
        var(
          --roulette-wheel-total-scale,
          calc(var(--roulette-wheel-visible-scale, 1) * var(--roulette-wheel-scale-boost, 1.4))
        )
      );
    transform-origin: center bottom;
  }

  .joker-roulette-wheel-stage {
    display: flex;
    width: 100%;
    height: 100%;
    align-items: center;
    justify-content: center;
    overflow: visible;
  }

  .joker-roulette-wheel-stage .joker-roulette-wheel-composition {
    overflow: visible;
  }

  .joker-roulette-wheel-viewport,
  .joker-roulette-wheel-stage .joker-roulette-wheel {
    overflow: hidden;
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
    .joker-roulette-stage {
      --roulette-wheel-lift: 0px;
      --roulette-wheel-lift-offset: 0px;
    }

    .joker-roulette-wheel-viewport {
      --roulette-wheel-desired-visible-scale: min(
        calc(
          (100cqw * ${ROULETTE_DESKTOP_WHEEL_LAYOUT.visibleScaleWidthFactor}) /
            var(--roulette-wheel-native-size)
        ),
        calc(
          (100cqh * ${ROULETTE_DESKTOP_WHEEL_LAYOUT.visibleScaleHeightFactor}) /
            var(--roulette-wheel-native-size)
        )
      );
      --roulette-wheel-max-total-scale: min(
        calc(
          (100cqh * (1 - ${ROULETTE_DESKTOP_WHEEL_LAYOUT.topInsetRatio})) /
            (
              var(--roulette-wheel-native-size) *
                (1 - ${ROULETTE_DESKTOP_WHEEL_LAYOUT.pushDownScaledRatio})
            )
        ),
        calc(
          (100cqw * 2) / var(--roulette-wheel-native-size)
        )
      );
      --roulette-wheel-total-scale: min(
        calc(
          var(--roulette-wheel-desired-visible-scale) *
            ${ROULETTE_DESKTOP_WHEEL_LAYOUT.scaleBoost}
        ),
        var(--roulette-wheel-max-total-scale)
      );
      --roulette-wheel-push-down: calc(
        var(--roulette-wheel-native-size) * var(--roulette-wheel-total-scale) *
          ${ROULETTE_DESKTOP_WHEEL_LAYOUT.pushDownScaledRatio}
      );
    }
  }

  @media (max-width: 1023px) {
    .joker-game-shell--roulette .joker-game-shell-empty-stage {
      overflow: visible;
    }

    .joker-roulette-stage {
      --roulette-wheel-native-size: ${ROULETTE_WHEEL_NATIVE_SIZE.mobile}px;
      --roulette-wheel-scale-boost: ${ROULETTE_MOBILE_WHEEL_SCALE.scaleBoost};
      --roulette-wheel-scale-max: ${ROULETTE_MOBILE_WHEEL_SCALE.scaleMax};
      --roulette-wheel-lift: ${ROULETTE_MOBILE_WHEEL_SCALE.lift}%;
      --roulette-wheel-vignette-size: 120px;
      padding: 0;
      overflow: visible;
    }

    .joker-game-shell--roulette .joker-navigation-mobile-content .joker-roulette-stage {
      height: 100%;
      min-height: 100%;
      overflow: visible;
    }

    .joker-game-shell--roulette .joker-navigation-mobile-content .joker-roulette-main-area {
      display: flex;
      align-items: stretch;
      justify-content: flex-start;
      width: 100%;
      height: 100%;
      min-height: 0;
      padding: 0;
    }

    .joker-game-shell--roulette
      .joker-navigation-mobile-content
      .joker-roulette-main-area
      > .joker-roulette-game-frame {
      flex: 1 1 auto;
      width: 100%;
      min-width: 0;
    }

    .joker-roulette-game-frame {
      position: relative;
      display: flex;
      flex-direction: column;
      width: 100%;
      min-width: 0;
      height: 100%;
      max-height: 100cqh;
      gap: 0;
      padding-bottom: 0;
      box-sizing: border-box;
    }

    .joker-roulette-game-frame__top {
      display: flex;
      flex-direction: column;
      justify-content: center;
      padding: var(--spacing-12) 0;
      gap: var(--spacing-12);
    }

    .joker-roulette-streak-rail {
      align-items: center;
      justify-content: flex-start;
      flex: 0 0 auto;
      padding-block: 0;
      padding-inline: var(--spacing-24);
    }

    .joker-roulette-streak-rail .joker-win-streak-row__track {
      align-items: center;
    }

    .joker-roulette-streak-rail .joker-win-streak-row__slot {
      align-items: center;
      justify-content: center;
    }

    .joker-roulette-game-frame__bottom {
      position: relative;
      display: flex;
      flex: 1 1 auto;
      flex-direction: column;
      align-items: stretch;
      justify-content: stretch;
      width: 100%;
      min-width: 0;
      min-height: 0;
      padding: 0;
      overflow: hidden;
    }

    .joker-roulette-wheel-viewport {
      align-items: stretch;
      --roulette-wheel-visible-scale: min(
        calc(
          (min(100svw, 100cqw) * ${ROULETTE_MOBILE_WHEEL_SCALE.widthFactor}) /
            var(--roulette-wheel-native-size)
        ),
        calc(
          (min(100svh, 100cqh) * ${ROULETTE_MOBILE_WHEEL_SCALE.heightFactor}) /
            var(--roulette-wheel-native-size)
        ),
        var(--roulette-wheel-scale-max)
      );
    }

    .joker-roulette-wheel-mount {
      align-self: center;
      margin-top: auto;
      --roulette-wheel-push-down: var(--roulette-wheel-lift, 35%);
      --roulette-wheel-visible-scale: max(
        ${ROULETTE_MOBILE_WHEEL_SCALE.minVisibleScale},
        var(--roulette-wheel-visible-scale, 1)
      );
    }
  }
${gameRoundEndStyles}
  `;
}
