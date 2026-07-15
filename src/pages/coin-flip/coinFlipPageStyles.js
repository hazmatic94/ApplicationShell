export function getCoinFlipPageStyles(gameRoundEndStyles) {
  return `
.joker-game-shell--coin-flip .joker-game-shell-empty-stage {
  position: relative;
  min-height: 0;
}

.joker-game-shell--coin-flip .joker-game-shell-empty-stage > .joker-coin-flip-stage {
  min-height: 0;
  height: 100%;
}

.joker-coin-flip-stage {
  container-type: size;
  position: relative;
  display: grid;
  width: 100%;
  height: 100%;
  min-height: 0;
  box-sizing: border-box;
  --coin-flip-betting-divider-offset: calc(
    var(--spacing-32) + calc(var(--body-12) * var(--text-body-line-height)) +
      var(--spacing-8) + var(--input-control-height) + var(--spacing-24)
  );
  --coin-flip-history-inset: var(--spacing-24);
  --coin-flip-sync-history-rail-height: var(--coin-flip-betting-divider-offset);
  --coin-flip-sync-top-band-height: calc(
    var(--coin-flip-sync-history-rail-height) + var(--coin-flip-history-inset)
  );
  --coin-flip-play-native-width: 548px;
  --coin-flip-play-native-height: 500px;
  --coin-flip-play-scale-bias: 1.08;
  --coin-flip-play-scale-max: 1.32;
  --coin-flip-play-gap: var(--spacing-24);
  --coin-flip-coin-native-size: 256px;
  --coin-flip-stage-native-size: 400px;
  --coin-pull-scale-x: 1;
  --coin-pull-scale-y: 1;
  --coin-shadow-scale: 1;
  --coin-shadow-opacity: 0.28;
  padding: 0;
  overflow: visible;
  background: var(--joker-black-800);
}

.joker-coin-flip-main-area {
  container-type: size;
  display: flex;
  width: 100%;
  height: 100%;
  min-width: 0;
  min-height: 0;
  align-items: stretch;
  justify-content: flex-start;
  overflow: visible;
}

.joker-coin-flip-game-frame {
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

.joker-coin-flip-game-frame__top {
  display: flex;
  width: 100%;
  flex: 0 0 auto;
  flex-direction: column;
  align-items: flex-start;
  box-sizing: border-box;
  padding: var(--coin-flip-history-inset) 0 0 var(--coin-flip-history-inset);
  overflow: visible;
  background: var(--joker-black-800);
}

@media (min-width: 1024px) {
  .joker-coin-flip-game-frame__top {
    position: relative;
    flex: 0 0 auto;
    height: var(--coin-flip-sync-top-band-height);
    min-height: var(--coin-flip-sync-top-band-height);
    max-height: var(--coin-flip-sync-top-band-height);
    padding: var(--coin-flip-history-inset) 0 0 var(--coin-flip-history-inset);
    justify-content: flex-start;
  }

  .joker-coin-flip-history-rail {
    display: flex;
    height: auto;
    max-height: none;
    flex: 0 0 auto;
    align-items: flex-start;
    justify-content: flex-start;
    min-height: 0;
    padding: 0;
    box-sizing: border-box;
  }
}

.joker-coin-flip-history-rail {
  position: relative;
  z-index: 2;
  display: flex;
  width: 100%;
  min-width: 0;
  flex: 0 0 auto;
  align-items: flex-start;
  justify-content: flex-start;
  padding: 0;
  overflow-x: auto;
  overflow-y: visible;
  scroll-behavior: smooth;
  scroll-padding-inline-end: var(--spacing-24);
  scroll-padding-inline-start: var(--spacing-24);
  scrollbar-width: none;
}

.joker-coin-flip-history-rail .joker-coin-progression {
  width: auto;
}

.joker-coin-flip-history-rail .joker-coin-progression__track {
  align-items: flex-start;
  justify-content: flex-start;
  margin: 0;
  padding: 0;
}

.joker-coin-flip-history-rail::-webkit-scrollbar {
  display: none;
}

.joker-coin-flip-game-frame.is-page-load-enter .joker-coin-toss__playfield {
  animation: joker-coin-flip-load-coin-land 420ms cubic-bezier(0.22, 1, 0.36, 1) both;
}

.joker-coin-flip-game-frame.is-page-load-enter .joker-coin-toss-rings__ring--outer,
.joker-coin-flip-game-frame.is-page-load-enter .joker-coin-toss-rings__ring--inner {
  animation: joker-coin-flip-load-ring-expand 360ms var(--ease-out) 100ms both;
}

.joker-coin-flip-game-frame.is-page-load-enter .joker-coin-toss-rings__particles {
  opacity: 0;
  animation: joker-coin-flip-load-fade-in 260ms var(--ease-out) 300ms forwards;
}

.joker-coin-flip-game-frame.is-page-load-enter .joker-coin-toss-rings__coin-shadow {
  animation: none;
  opacity: 0.3;
}

.joker-coin-flip-game-frame.is-page-load-enter .joker-coin-receiver__active-fx {
  opacity: 0;
}

.joker-coin-flip-game-frame.is-page-load-enter .joker-coin-progression__step {
  opacity: 0;
  transform: translateY(8px);
  animation: joker-coin-flip-load-progression-step 300ms var(--ease-out) var(--coin-flip-load-step-delay, 220ms) both;
}

.joker-coin-flip-game-frame.is-page-load-enter .joker-coin-progression__step:nth-child(1) {
  --coin-flip-load-step-delay: 220ms;
}

.joker-coin-flip-game-frame.is-page-load-enter .joker-coin-progression__step:nth-child(2) {
  --coin-flip-load-step-delay: 260ms;
}

.joker-coin-flip-game-frame.is-page-load-enter .joker-coin-progression__step:nth-child(3) {
  --coin-flip-load-step-delay: 300ms;
}

.joker-coin-flip-game-frame.is-page-load-enter .joker-coin-progression__step:nth-child(4) {
  --coin-flip-load-step-delay: 340ms;
}

.joker-coin-flip-game-frame.is-page-load-enter .joker-coin-progression__step:nth-child(5) {
  --coin-flip-load-step-delay: 380ms;
}

.joker-coin-flip-game-frame.is-page-load-enter .joker-coin-progression__step:nth-child(6) {
  --coin-flip-load-step-delay: 420ms;
}

.joker-coin-flip-game-frame.is-page-load-enter .joker-coin-toss-demo__hint {
  opacity: 0;
  animation: none;
}

.joker-coin-flip-game-frame.is-page-load-enter .joker-coin-toss__tap-target {
  pointer-events: none;
}

@keyframes joker-coin-flip-load-coin-land {
  0% {
    transform: translateX(-50%) translateY(-30px);
  }

  74% {
    transform: translateX(-50%) translateY(3px);
  }

  88% {
    transform: translateX(-50%) translateY(-2px);
  }

  100% {
    transform: translateX(-50%) translateY(0);
  }
}

@keyframes joker-coin-flip-load-ring-expand {
  from {
    opacity: 0.55;
    transform: translate(-50%, -50%) scale(0.8);
  }

  to {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1);
  }
}

@keyframes joker-coin-flip-load-fade-in {
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
}

@keyframes joker-coin-flip-load-progression-step {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (prefers-reduced-motion: reduce) {
  .joker-coin-flip-game-frame.is-page-load-enter .joker-coin-toss__playfield,
  .joker-coin-flip-game-frame.is-page-load-enter .joker-coin-toss-rings__ring--outer,
  .joker-coin-flip-game-frame.is-page-load-enter .joker-coin-toss-rings__ring--inner,
  .joker-coin-flip-game-frame.is-page-load-enter .joker-coin-toss-rings__particles,
  .joker-coin-flip-game-frame.is-page-load-enter .joker-coin-progression__step,
  .joker-coin-flip-game-frame.is-page-load-enter .joker-coin-toss-demo__hint {
    animation: none;
    opacity: 1;
    transform: none;
  }

  .joker-coin-flip-game-frame.is-page-load-enter .joker-coin-toss__playfield {
    transform: translateX(-50%);
  }

  .joker-coin-flip-game-frame.is-page-load-enter .joker-coin-toss-rings__ring--outer,
  .joker-coin-flip-game-frame.is-page-load-enter .joker-coin-toss-rings__ring--inner {
    transform: translate(-50%, -50%) scale(1);
  }
}

.joker-coin-flip-game-frame__bottom {
  display: flex;
  width: 100%;
  flex: 1 1 auto;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0;
  min-height: 0;
  padding-block: var(--spacing-24);
  padding-inline: var(--spacing-24);
  box-sizing: border-box;
}

.joker-coin-flip-play-stack {
  display: flex;
  width: 100%;
  flex: 1 1 auto;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 0;
  margin-inline: auto;
  container-type: size;
  container-name: coin-flip-play;
}

.joker-coin-flip-play {
  position: relative;
  z-index: 2;
  display: flex;
  flex: 0 0 auto;
  width: 100%;
  box-sizing: border-box;
  min-width: 0;
  align-items: center;
  justify-content: center;
  overflow: visible;
  padding-inline: var(--spacing-12);
}

.joker-coin-flip-play-inner {
  display: flex;
  width: var(--coin-flip-play-native-width);
  height: var(--coin-flip-play-native-height);
  box-sizing: border-box;
  flex: 0 0 auto;
  align-items: center;
  justify-content: center;
  transform-origin: center center;
  --coin-size: var(--coin-flip-coin-native-size);
  --coin-toss-stage-size: var(--coin-flip-stage-native-size);
}

@media (min-width: 1024px) {
  .joker-coin-flip-play-stack {
    width: 100%;
    max-width: 900px;
  }

  .joker-coin-flip-play-inner {
    --coin-flip-play-scale: min(
      calc((100cqw - (2 * var(--coin-flip-play-gap))) / var(--coin-flip-play-native-width)),
      calc((100cqh - var(--coin-flip-play-gap)) / var(--coin-flip-play-native-height)),
      var(--coin-flip-play-scale-max)
    );
    --coin-flip-play-scale: max(
      0.55,
      calc(var(--coin-flip-play-scale) * var(--coin-flip-play-scale-bias))
    );
    transform: scale(var(--coin-flip-play-scale));
  }
}

.joker-coin-flip-coin-stage {
  position: relative;
  display: flex;
  width: 100%;
  height: 100%;
  align-items: center;
  justify-content: center;
  overflow: visible;
}

.joker-coin-flip-coin-zone {
  position: relative;
  display: flex;
  width: 100%;
  height: 100%;
  align-items: center;
  justify-content: center;
}

.joker-coin-flip-result-card {
  position: absolute;
  inset: 0;
  z-index: 40;
  display: grid;
  place-items: center;
  padding: var(--spacing-24);
  pointer-events: auto;
  transform: scale(0.96);
  animation: joker-coin-flip-result-pop 420ms var(--ease-standard) both;
}

.joker-coin-flip-result-card > * {
  max-width: min(500px, calc(100% - var(--spacing-48)));
  box-shadow: 0 var(--spacing-24) var(--spacing-64) rgb(0 0 0 / 0.42);
}

@keyframes joker-coin-flip-result-pop {
  0% {
    opacity: 0;
    transform: translateY(var(--spacing-24)) scale(0.86);
  }

  48% {
    opacity: 1;
    transform: translateY(calc(var(--spacing-4) * -1)) scale(1.06);
  }

  72% {
    opacity: 1;
    transform: translateY(var(--spacing-2, 2px)) scale(0.98);
  }

  100% {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.joker-coin-flip-betting-panel.is-coin-flipping {
  pointer-events: none;
  opacity: 0.72;
  transition: opacity 220ms ease;
}

.joker-coin-flip-betting-panel.is-round-locked .joker-rounds-to-win-field,
.joker-coin-flip-betting-panel.is-round-locked .joker-bet-field {
  opacity: 0.45;
  pointer-events: none;
  transition: opacity 220ms ease;
}

.joker-coin-flip-betting-panel.is-round-locked .joker-rounds-to-win-option,
.joker-coin-flip-betting-panel.is-round-locked .joker-bet-amount-stepper-button {
  cursor: not-allowed;
}

.joker-jkc-amount {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  vertical-align: middle;
}

.joker-jkc-amount__icon {
  display: block;
  width: 14px;
  height: 14px;
  flex: 0 0 auto;
}

.joker-jkc-amount__icon--mask {
  background-color: currentColor;
  -webkit-mask-size: contain;
  mask-size: contain;
  -webkit-mask-repeat: no-repeat;
  mask-repeat: no-repeat;
  -webkit-mask-position: center;
  mask-position: center;
}

.joker-jkc-amount__value {
  color: inherit;
  font-size: inherit;
  font-weight: inherit;
  line-height: inherit;
}

@media (max-width: 1023px) {
  .joker-coin-flip-stage {
    --coin-flip-mobile-odds-reserve: 80px;
    --coin-flip-mobile-play-scale-bias: 0.9;
    --coin-flip-play-native-width: 360px;
    --coin-flip-play-native-height: 400px;
    --coin-flip-coin-native-size: 208px;
    --coin-flip-stage-native-size: 320px;
  }

  .joker-game-shell--coin-flip .joker-coin-flip-betting-panel.is-mobile .joker-odds-button-group-field {
    display: none;
  }

  .joker-coin-flip-game-frame {
    position: relative;
    min-height: 0;
  }

  .joker-coin-flip-game-frame__bottom {
    flex: 1 1 auto;
    justify-content: flex-start;
    min-height: 0;
    padding-block: var(--spacing-12) calc(var(--spacing-24) + var(--coin-flip-mobile-odds-reserve));
  }

  .joker-coin-flip-play-stack {
    flex: 1 1 auto;
    justify-content: center;
    min-height: 0;
    padding-bottom: var(--spacing-8);
  }

  .joker-coin-flip-play {
    flex: 1 1 auto;
    min-height: 0;
    align-items: center;
    justify-content: center;
  }

  .joker-coin-flip-play-inner {
    width: var(--coin-flip-play-native-width);
    height: var(--coin-flip-play-native-height);
    --coin-flip-play-scale: min(
      calc(100cqw / var(--coin-flip-play-native-width)),
      calc((100cqh - var(--coin-flip-mobile-odds-reserve)) / var(--coin-flip-play-native-height)),
      1
    );
    --coin-flip-play-scale: max(
      0.48,
      calc(var(--coin-flip-play-scale) * var(--coin-flip-mobile-play-scale-bias))
    );
    transform: scale(var(--coin-flip-play-scale));
  }

  .joker-coin-flip-mobile-odds {
    position: absolute;
    left: var(--spacing-24);
    right: var(--spacing-24);
    bottom: var(--spacing-24);
    z-index: 4;
    pointer-events: auto;
  }

  .joker-coin-flip-mobile-odds .joker-odds-button-group.is-inline {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: var(--spacing-8);
  }
}

@media (max-width: 760px) {
  .joker-coin-flip-stage {
    --coin-flip-mobile-odds-reserve: 84px;
    --coin-flip-mobile-play-scale-bias: 0.84;
    --coin-flip-play-native-width: 320px;
    --coin-flip-play-native-height: 360px;
    --coin-flip-coin-native-size: 184px;
    --coin-flip-stage-native-size: 288px;
  }

  .joker-coin-flip-play-inner {
    width: var(--coin-flip-play-native-width);
    height: var(--coin-flip-play-native-height);
  }
}

${gameRoundEndStyles}
  `;
}
