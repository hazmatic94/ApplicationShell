export function getHiloPageStyles(gameRoundEndStyles) {
  return `
.joker-game-shell .joker-navigation-body {
  max-width: none;
  justify-self: center;
}

.joker-game-shell .joker-navigation--compact .joker-navigation-body {
  max-width: none;
}

.joker-game-shell .joker-game-inner-frame {
  width: 100%;
  justify-self: stretch;
}

.joker-hilo-betting-panel.is-hilo-pre-game .joker-hilo-betting-actions {
  cursor: not-allowed;
}

.joker-hilo-betting-panel .joker-hilo-betting-actions button {
  display: flex;
  align-items: center;
  justify-content: center;
}

.joker-hilo-betting-panel .joker-hilo-betting-actions button > span:first-child {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-8);
  min-width: 0;
  max-width: 100%;
}

.joker-hilo-betting-panel .joker-hilo-betting-actions .joker-hi-lo-odds {
  gap: var(--spacing-8);
}

@media (min-width: 1000px) {
  .joker-hilo-betting-panel.is-hilo-pre-game:not(.is-hilo-pre-game-ready) .joker-button--hi-lo {
    pointer-events: none;
    cursor: not-allowed;
    opacity: 0.56;
  }

  .joker-hilo-betting-panel.is-hilo-pre-game.is-awaiting-hilo-choice .joker-betting-submit-group .joker-button {
    pointer-events: none;
    cursor: not-allowed;
    opacity: 0.45;
  }
}

@media (max-width: 999px) {
  .joker-hilo-betting-panel.is-hilo-pre-game.is-awaiting-hilo-choice .joker-betting-submit-group .joker-button {
    pointer-events: none;
    cursor: not-allowed;
    opacity: 0.45;
  }
}

.joker-game-shell--hilo .joker-game-inner-canvas {
  min-height: 0;
  height: 100%;
}

.joker-game-shell--hilo .joker-game-shell-empty-stage {
  min-height: 0;
  overflow: visible;
}

.joker-game-shell--hilo .joker-game-shell-empty-stage > .joker-hilo-stage {
  min-height: 0;
}

.joker-hilo-stage {
  container-type: size;
  position: relative;
  display: grid;
  width: 100%;
  height: 100%;
  min-height: 0;
  box-sizing: border-box;
  --hilo-betting-divider-offset: calc(
    var(--spacing-32) + calc(var(--body-12) * var(--text-body-line-height)) +
      var(--spacing-8) + var(--input-control-height) + var(--spacing-24)
  );
  --hilo-sync-history-rail-height: var(--hilo-betting-divider-offset);
  --hilo-sync-divider-band: calc(
    var(--hilo-betting-divider-offset) + var(--border-width-default)
  );
  --hilo-board-padding: var(--spacing-24);
  --hilo-main-native-width: 296px;
  --hilo-main-native-height: 398.5px;
  --hilo-side-native-width: 164px;
  --hilo-side-to-main-ratio: 0.6;
  --hilo-play-gap: 24px;
  --hilo-play-scale-max: 1;
  --hilo-play-scale-bias: 1;
  --hilo-felt-card-scale: 0.88;
  --hilo-support-native-height: 42px;
  --hilo-skip-protrusion-native: 52px;
  --hilo-play-row-native-width: 699px;
  --hilo-play-row-native-height: 463px;
  --hilo-play-fit-native-height: 463px;
  --hilo-felt-native-width: 936px;
  --hilo-felt-native-height: 481px;
  --hilo-felt-aspect-ratio: 1.946;
  --hilo-felt-inline-padding: var(--spacing-24);
  --hilo-felt-padding-block-start: var(--spacing-24);
  --hilo-felt-padding-block-end: var(--spacing-24);
  --hilo-play-to-felt-width-ratio: 0.896;
  --hilo-play-to-felt-height-ratio: 0.84;
  --hilo-mini-scale-factor: 0.58;
  --hilo-mini-native-width: 110px;
  --hilo-mini-native-height: 76px;
  --hilo-row-content-native-width: calc(
    var(--hilo-main-native-width) * (1 + (2 * var(--hilo-side-to-main-ratio)))
  );
  --hilo-history-band-height: calc(
    (var(--spacing-8) + 18px) * var(--hilo-play-scale-bias) + 76px * 0.58 * var(--hilo-play-scale-bias) +
      var(--spacing-16)
  );
  --hilo-play-scale: min(
    (100cqw - (2 * var(--hilo-play-gap))) / var(--hilo-row-content-native-width),
    (100cqh - var(--hilo-history-band-height)) /
      calc(var(--hilo-main-native-height) + (var(--hilo-main-native-height) * 0.18)),
    var(--hilo-play-scale-max)
  );
  --hilo-play-scale: max(0.4, calc(var(--hilo-play-scale) * var(--hilo-play-scale-bias)));
  --hilo-side-scale: calc(
    var(--hilo-play-scale) * var(--hilo-side-to-main-ratio) * var(--hilo-main-native-width) /
      var(--hilo-side-native-width)
  );
  --hilo-main-slot-width: calc(var(--hilo-main-native-width) * var(--hilo-play-scale));
  --hilo-main-slot-height: calc(var(--hilo-main-native-height) * var(--hilo-play-scale));
  --hilo-side-slot-width: calc(
    var(--hilo-main-native-width) * var(--hilo-side-to-main-ratio) * var(--hilo-play-scale)
  );
  --hilo-side-slot-height: calc(
    var(--hilo-main-native-height) * var(--hilo-side-to-main-ratio) * var(--hilo-play-scale)
  );
  --hilo-mini-scale: calc(
    var(--hilo-play-scale) * var(--hilo-mini-native-width) / var(--hilo-main-native-width) *
      var(--hilo-mini-scale-factor)
  );
  --hilo-mini-card-width: calc(var(--hilo-mini-native-width) * var(--hilo-mini-scale));
  --hilo-mini-card-height: calc(var(--hilo-mini-native-height) * var(--hilo-mini-scale));
  padding: 0;
  grid-template-rows: minmax(0, 1fr);
  overflow: visible;
  background: var(--joker-black-800);
}

.joker-hilo-history-rail {
  --hilo-history-chip-room: 18px;
  --hilo-history-chip-height: 30px;
  --hilo-history-chip-overhang: calc(var(--hilo-history-chip-height) / 2);
  position: relative;
  z-index: 2;
  display: flex;
  width: 100%;
  min-width: 0;
  flex: 0 0 auto;
  align-items: center;
  padding-block: var(--spacing-12);
  padding-inline: 0;
  overflow-x: auto;
  overflow-y: visible;
  scroll-behavior: smooth;
  scroll-padding-inline-end: var(--spacing-24);
  scroll-padding-inline-start: var(--spacing-24);
  scrollbar-width: none;
}

.joker-hilo-history-rail::-webkit-scrollbar {
  display: none;
}

.joker-hilo-history-track {
  display: flex;
  width: max-content;
  min-width: 100%;
  align-items: center;
  justify-content: flex-start;
  gap: var(--spacing-8);
  padding-inline-start: var(--spacing-24);
  overflow: visible;
  box-sizing: border-box;
}

.joker-hilo-history-track::after {
  content: "";
  display: block;
  flex: 0 0 var(--spacing-24);
  width: var(--spacing-24);
  height: 1px;
}

.joker-hilo-history-entry {
  position: relative;
  display: flex;
  flex: 0 0 auto;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
  box-sizing: border-box;
  padding-top: var(--hilo-history-chip-overhang);
}

.joker-hilo-history-entry.is-latest {
  animation: joker-hilo-history-enter var(--motion-slow) var(--ease-out) both;
}

.joker-hilo-history-entry .joker-hilo-history-chip {
  position: absolute;
  top: var(--hilo-history-chip-overhang);
  left: 50%;
  z-index: 2;
  transform: translate(-50%, -50%);
}

.joker-hilo-history-card-wrap {
  position: relative;
  display: flex;
  width: var(--hilo-mini-card-width, 110px);
  height: var(--hilo-mini-card-height, 76px);
  flex: 0 0 auto;
  align-items: center;
  justify-content: center;
  overflow: visible;
}

.joker-hilo-history-entry .joker-game-card-mini {
  flex: 0 0 auto;
  transform: scale(var(--hilo-mini-scale, 1));
  transform-origin: center center;
}

.joker-hilo-history-connector {
  position: absolute;
  top: 50%;
  left: calc(100% + (var(--spacing-8) / 2));
  z-index: 3;
  margin: 0;
  transform: translate(-50%, -50%);
  opacity: 1;
  pointer-events: none;
}

.joker-hilo-history-connector:disabled {
  opacity: 1;
  cursor: default;
}

.joker-hilo-main-area {
  container-type: size;
  display: flex;
  width: 100%;
  max-width: 100%;
  height: 100%;
  box-sizing: border-box;
  min-width: 0;
  min-height: 0;
  align-items: stretch;
  justify-content: flex-start;
  overflow: visible;
  padding: 0;
}

.joker-hilo-game-frame {
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

.joker-hilo-game-frame__top {
  display: flex;
  width: 100%;
  flex: 0 0 auto;
  flex-direction: column;
  align-items: stretch;
  border-bottom: 0;
  box-sizing: border-box;
  padding: var(--spacing-16) var(--spacing-24);
  overflow: visible;
  background: var(--joker-black-800);
}

.joker-hilo-game-frame__top > .joker-betting-divider {
  width: calc(100% + (2 * var(--spacing-24)));
  margin-inline: calc(-1 * var(--spacing-24));
  flex: 0 0 auto;
}

@media (min-width: 1000px) {
  .joker-hilo-game-frame__top {
    position: relative;
    flex: 0 0 auto;
    height: var(--hilo-sync-divider-band);
    min-height: var(--hilo-sync-divider-band);
    max-height: var(--hilo-sync-divider-band);
    padding: 0;
  }

  .joker-hilo-history-rail {
    display: flex;
    height: var(--hilo-sync-history-rail-height);
    max-height: var(--hilo-sync-history-rail-height);
    flex: 0 0 auto;
    align-items: center;
    justify-content: flex-start;
    min-height: 0;
    padding-block: 0;
    box-sizing: border-box;
  }

  .joker-hilo-history-track {
    display: flex;
    width: max-content;
    min-width: 100%;
    height: 100%;
    min-height: 0;
    align-items: center;
    justify-content: flex-start;
    gap: var(--spacing-8);
    padding-inline-start: var(--spacing-24);
    box-sizing: border-box;
  }

  .joker-hilo-game-frame__top > .joker-betting-divider {
    position: absolute;
    top: var(--hilo-betting-divider-offset);
    right: 0;
    left: 0;
    width: auto;
    margin: 0;
  }
}

.joker-hilo-game-frame__bottom {
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

.joker-hilo-game-frame__play-stack {
  display: flex;
  width: 100%;
  max-width: var(--hilo-felt-native-width);
  flex: 1 1 auto;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 0;
  margin-inline: auto;
  container-type: size;
  container-name: hilo-felt;
}

.joker-hilo-game-frame__play {
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
  padding-block: calc(var(--hilo-support-native-height) * var(--hilo-side-scale) / 2 + var(--spacing-8));
  padding-inline: var(--spacing-12);
}

.joker-hilo-game-frame__play-inner {
  display: flex;
  width: var(--hilo-play-row-native-width);
  height: var(--hilo-play-fit-native-height);
  box-sizing: border-box;
  flex: 0 0 auto;
  flex-wrap: nowrap;
  align-items: center;
  justify-content: center;
  gap: var(--hilo-play-gap);
  transform: scale(
    calc(
      min(calc(100cqw / 699px), calc(100cqh / 463px)) * var(--hilo-felt-card-scale, 0.88)
    )
  );
  transform-origin: center center;
  --hilo-play-scale: 1;
  --hilo-side-scale: 1.082;
  --hilo-main-slot-width: var(--hilo-main-native-width);
  --hilo-main-slot-height: var(--hilo-main-native-height);
  --hilo-side-slot-width: calc(var(--hilo-main-native-width) * var(--hilo-side-to-main-ratio));
  --hilo-side-slot-height: calc(var(--hilo-main-native-height) * var(--hilo-side-to-main-ratio));
  --hilo-card-bottom-inset: var(--spacing-12);
  --game-card-stack-hover-shadow: 0 4px 12px rgb(0 0 0 / 0.12), 0 1px 3px rgb(0 0 0 / 0.08);
  --game-card-stack-hover-shift-factor: 0;
  --game-card-stack-hover-active: 0;
  --game-card-stack-hover-card-shadow: none;
  --game-card-stack-hover-overlay-opacity: 0.92;
}

.joker-hilo-game-frame__play-inner:has(
    .joker-hilo-prediction-group--lower .joker-hilo-prediction-card:hover
  ) {
  --game-card-stack-hover-shift-factor: -1;
  --game-card-stack-hover-active: 1;
  --game-card-stack-hover-card-shadow: var(--game-card-stack-hover-shadow);
  --game-card-stack-hover-overlay-opacity: 0.96;
}

.joker-hilo-game-frame__play-inner:has(
    .joker-hilo-prediction-group--higher .joker-hilo-prediction-card:hover
  ) {
  --game-card-stack-hover-shift-factor: 1;
  --game-card-stack-hover-active: 1;
  --game-card-stack-hover-card-shadow: var(--game-card-stack-hover-shadow);
  --game-card-stack-hover-overlay-opacity: 0.96;
}

.joker-hilo-game-frame__play-inner > .joker-hilo-prediction-group,
.joker-hilo-game-frame__play-inner > .joker-hilo-main-card-column {
  flex: 0 0 auto;
  min-width: 0;
}

.joker-hilo-game-frame__play-inner .joker-game-card-stack,
.joker-hilo-game-frame__play-inner .joker-higher-card,
.joker-hilo-game-frame__play-inner .joker-lower-card {
  flex: 0 0 auto;
  max-width: none;
}

.joker-hilo-main-card-column {
  position: relative;
  display: flex;
  flex: 0 0 auto;
  flex-direction: column;
  align-items: center;
  margin-bottom: calc(24px + 20px + var(--border-width-default));
}

.joker-hilo-main-card-anchor {
  position: relative;
  display: inline-flex;
  flex: 0 0 auto;
  flex-direction: column;
  align-items: center;
}

.joker-hilo-main-card-anchor .joker-hilo-game-frame__status {
  position: absolute;
  top: 100%;
  left: 50%;
  z-index: 4;
  margin: 0;
  flex: 0 0 auto;
  padding: 12px 16px;
  box-sizing: border-box;
  border: var(--border-width-default) solid var(--joker-black-100);
  border-top: 0;
  border-radius: 0 0 20px 20px;
  background: var(--joker-black-600);
  color: var(--joker-white-50);
  font-family: var(--font-display);
  font-size: 20px;
  font-weight: 500;
  letter-spacing: 0.06em;
  line-height: 1;
  text-align: center;
  text-transform: uppercase;
  transform: translateX(-50%);
  white-space: nowrap;
}

.joker-hilo-game-frame__status strong {
  color: var(--joker-gold-400);
  font-weight: 600;
}

.joker-hilo-main-card-wrap {
  position: relative;
  display: flex;
  width: fit-content;
  max-width: 100%;
  height: auto;
  box-sizing: border-box;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  overflow: visible;
  padding-bottom: 0;
}

.joker-hilo-main-card-wrap .joker-hilo-main-card-stack-slot {
  position: relative;
  z-index: 2;
  display: flex;
  width: var(--hilo-main-slot-width);
  height: var(--hilo-main-slot-height);
  justify-content: center;
  align-items: center;
  overflow: visible;
}

.joker-hilo-main-card-scale {
  position: relative;
  z-index: 1;
  transform: scale(var(--hilo-play-scale));
  transform-origin: center center;
}

.joker-hilo-main-card-wrap .joker-hilo-main-card-stack {
  flex: 0 0 auto;
}

.joker-hilo-main-card-skip-slot {
  position: absolute;
  top: calc(var(--spacing-16) * -1);
  right: calc(var(--spacing-24) * -1);
  z-index: 6;
  display: flex;
  width: calc(58px * var(--hilo-play-scale));
  height: calc(32px * var(--hilo-play-scale));
  align-items: center;
  justify-content: center;
  overflow: visible;
  pointer-events: none;
}

.joker-hilo-main-card-skip-scale {
  transform: scale(var(--hilo-play-scale));
  transform-origin: center center;
  pointer-events: auto;
}

.joker-hilo-main-card-wrap .joker-hilo-main-card-skip {
  flex: 0 0 auto;
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

.joker-hilo-prediction-group {
  position: relative;
  display: flex;
  width: var(--hilo-side-slot-width);
  height: var(--hilo-side-slot-height);
  box-sizing: border-box;
  flex: 0 0 auto;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.joker-hilo-prediction-card-slot {
  display: flex;
  width: 100%;
  height: 100%;
  justify-content: center;
  align-items: center;
  overflow: visible;
}

.joker-hilo-prediction-card-anchor {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  gap: 4px;
}

.joker-hilo-prediction-card-scale {
  flex: 0 0 auto;
  transform: scale(var(--hilo-side-scale));
  transform-origin: center bottom;
}

.joker-hilo-prediction-card-slot .joker-hilo-prediction-card {
  flex: 0 0 auto;
}

.joker-hilo-prediction-card-slot .joker-hilo-prediction-card.is-disabled {
  opacity: 0.62;
  cursor: default;
  pointer-events: none;
  transform: none;
}

.joker-hilo-prediction-card-slot .joker-hilo-prediction-card.is-selected {
  transform: translateY(var(--hi-lo-card-hover-lift, -2px));
}

.joker-hilo-prediction-card-slot .joker-hilo-prediction-card.is-selected.joker-lower-card,
.joker-hilo-prediction-card-slot .joker-hilo-prediction-card.is-selected.joker-higher-card {
  background: linear-gradient(180deg, var(--joker-black-500) 0%, var(--joker-black-200) 100%);
}

.joker-hilo-prediction-support {
  position: relative;
  top: auto;
  left: auto;
  width: var(--hilo-side-slot-width);
  margin-top: 0;
  flex: 0 0 auto;
  transform: none;
  color: var(--joker-white-50);
  font-family: var(--font-body);
  font-size: 12px;
  font-weight: var(--text-body-weight);
  line-height: var(--text-body-line-height);
  text-align: center;
}

.joker-hilo-result-card {
  position: absolute;
  inset: 0;
  z-index: 40;
  display: grid;
  place-items: center;
  padding: var(--spacing-24);
  pointer-events: auto;
  transform: scale(0.96);
  animation: joker-hilo-result-pop 420ms var(--ease-standard) both;
}

.joker-hilo-result-card > * {
  max-width: min(500px, calc(100% - var(--spacing-48)));
  box-shadow: 0 var(--spacing-24) var(--spacing-64) rgb(0 0 0 / 0.42);
}

@keyframes joker-hilo-result-pop {
  0% {
    opacity: 0;
    transform: scale(0.92);
  }

  100% {
    opacity: 1;
    transform: scale(0.96);
  }
}

@keyframes joker-hilo-history-enter {
  0% {
    opacity: 0;
    transform: translateY(var(--spacing-24)) scale(1.08);
  }

  100% {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.joker-hilo-game-frame.is-page-load-enter .joker-hilo-main-card-scale {
  animation: joker-hilo-load-deal-main 400ms var(--ease-out) both;
}

.joker-hilo-game-frame.is-page-load-enter .joker-hilo-main-card-glow {
  animation: joker-hilo-load-deal-glow 360ms var(--ease-out) 30ms both;
}

.joker-hilo-game-frame.is-page-load-enter .joker-hilo-prediction-group--lower .joker-hilo-prediction-card-scale {
  animation: joker-hilo-load-deal-side 380ms var(--ease-out) 70ms both;
}

.joker-hilo-game-frame.is-page-load-enter .joker-hilo-prediction-group--higher .joker-hilo-prediction-card-scale {
  animation: joker-hilo-load-deal-side 380ms var(--ease-out) 120ms both;
}

.joker-hilo-game-frame.is-page-load-enter .joker-hilo-history-chip {
  animation: joker-hilo-load-deal-chip 280ms var(--ease-out) var(--hilo-load-chip-delay, 200ms) both;
}

.joker-hilo-game-frame.is-page-load-enter .joker-hilo-history-card-wrap {
  animation: joker-hilo-load-deal-history-card 300ms var(--ease-out) var(--hilo-load-chip-delay, 200ms) both;
}

.joker-hilo-game-frame.is-page-load-enter .joker-hilo-history-entry.is-latest,
.joker-hilo-game-frame.is-page-load-enter .joker-higher-card__chevron,
.joker-hilo-game-frame.is-page-load-enter .joker-lower-card__chevron {
  animation: none;
}

@keyframes joker-hilo-load-deal-main {
  from {
    opacity: 0;
    transform: scale(var(--hilo-play-scale)) translateY(22px);
  }

  to {
    opacity: 1;
    transform: scale(var(--hilo-play-scale)) translateY(0);
  }
}

@keyframes joker-hilo-load-deal-glow {
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
}

@keyframes joker-hilo-load-deal-side {
  from {
    opacity: 0;
    transform: scale(var(--hilo-side-scale)) translateY(22px);
  }

  to {
    opacity: 1;
    transform: scale(var(--hilo-side-scale)) translateY(0);
  }
}

@keyframes joker-hilo-load-deal-chip {
  from {
    opacity: 0;
    transform: translate(-50%, calc(-50% + 10px));
  }

  to {
    opacity: 1;
    transform: translate(-50%, -50%);
  }
}

@keyframes joker-hilo-load-deal-history-card {
  from {
    opacity: 0;
    transform: translateY(10px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (prefers-reduced-motion: reduce) {
  .joker-hilo-game-frame.is-page-load-enter .joker-hilo-main-card-scale,
  .joker-hilo-game-frame.is-page-load-enter .joker-hilo-main-card-glow,
  .joker-hilo-game-frame.is-page-load-enter .joker-hilo-prediction-group--lower .joker-hilo-prediction-card-scale,
  .joker-hilo-game-frame.is-page-load-enter .joker-hilo-prediction-group--higher .joker-hilo-prediction-card-scale,
  .joker-hilo-game-frame.is-page-load-enter .joker-hilo-history-chip,
  .joker-hilo-game-frame.is-page-load-enter .joker-hilo-history-card-wrap {
    animation: none;
    opacity: 1;
    transform: none;
  }

  .joker-hilo-game-frame.is-page-load-enter .joker-hilo-history-chip {
    transform: translate(-50%, -50%);
  }
}

.joker-mines-frame-footer {
  display: grid;
  grid-column: 1 / -1;
  grid-template-columns: auto minmax(0, 1fr) auto;
  align-items: center;
  min-height: calc(var(--spacing-64) - var(--spacing-8));
  border-top: var(--border-width-default) solid var(--joker-black-300);
  background: var(--joker-black-500);
  padding: 0 var(--spacing-24);
}

.joker-mines-footer-actions {
  display: flex;
  align-items: center;
  gap: var(--spacing-8);
  min-width: 0;
}

.joker-mines-footer-button {
  display: inline-grid;
  width: var(--spacing-32);
  height: var(--spacing-32);
  place-items: center;
  border: 0;
  border-radius: var(--radius-sm);
  background: transparent;
  color: color-mix(in srgb, var(--joker-white-50) 68%, var(--joker-black-50));
  cursor: pointer;
  padding: 0;
}

.joker-mines-footer-icon {
  display: block;
  width: var(--spacing-20, calc(var(--spacing-16) + var(--spacing-4)));
  height: var(--spacing-20, calc(var(--spacing-16) + var(--spacing-4)));
  object-fit: contain;
  pointer-events: none;
}

.joker-mines-footer-logo {
  display: block;
  grid-column: 3;
  justify-self: end;
  width: clamp(calc(var(--spacing-64) + var(--spacing-8)), 7vw, calc(var(--spacing-64) + var(--spacing-40)));
  max-height: var(--spacing-24);
  opacity: 0.38;
  filter: grayscale(1);
  pointer-events: none;
  user-select: none;
}

.joker-mines-footer-spacer {
  grid-column: 2;
  grid-row: 1;
  min-width: 0;
}

@media (max-width: 999px) {
  .joker-hilo-stage {
    --hilo-history-mini-mobile-scale: 0.7;
    --hilo-mobile-odds-reserve: 52px;
    --hilo-mobile-main-status-room: 48px;
    --hilo-mobile-main-fit-height: 446.5px;
    --hilo-mobile-felt-card-scale: 0.96;
  }

  .joker-game-shell--hilo .joker-game-shell-empty-stage {
    overflow: visible;
  }

  .joker-hilo-stage {
    --hilo-board-padding: var(--spacing-24);
    padding: 0;
    overflow: visible;
  }

  .joker-hilo-history-connector {
    transform: translate(-50%, -50%) scale(calc(0.72 * var(--hilo-history-mini-mobile-scale)));
  }

  .joker-game-shell--hilo .joker-navigation-mobile-content .joker-hilo-stage {
    height: 100%;
    min-height: 100%;
    overflow: visible;
  }

  .joker-game-shell--hilo .joker-navigation-mobile-content .joker-hilo-main-area {
    display: flex;
    align-items: stretch;
    justify-content: flex-start;
    width: 100%;
    height: 100%;
    min-height: 0;
    padding: 0;
  }

  .joker-game-shell--hilo .joker-navigation-mobile-content .joker-hilo-main-area > .joker-hilo-game-frame {
    flex: 1 1 auto;
    width: 100%;
    min-width: 0;
  }

  .joker-hilo-game-frame {
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

  .joker-hilo-game-frame__top {
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: var(--spacing-12) 0;
    gap: var(--spacing-12);
  }

  .joker-hilo-game-frame__top > .joker-betting-divider {
    width: 100%;
    margin-inline: 0;
    margin-top: 0;
  }

  .joker-hilo-history-rail {
    --hilo-history-chip-height: 22px;
    align-items: center;
    justify-content: flex-start;
    flex: 0 0 auto;
    padding-block: 0;
    padding-inline: 0;
  }

  .joker-hilo-history-card-wrap {
    width: calc(var(--hilo-mini-native-width) * var(--hilo-history-mini-mobile-scale));
    height: calc(var(--hilo-mini-native-height) * var(--hilo-history-mini-mobile-scale));
  }

  .joker-hilo-history-entry {
    justify-content: flex-end;
    padding-top: var(--hilo-history-chip-overhang);
  }

  .joker-hilo-history-entry .joker-game-card-mini {
    transform: scale(var(--hilo-history-mini-mobile-scale));
    transform-origin: center center;
  }

  .joker-hilo-history-track {
    display: flex;
    width: max-content;
    min-width: 100%;
    height: calc(
      var(--hilo-history-chip-overhang) +
        (var(--hilo-mini-native-height) * var(--hilo-history-mini-mobile-scale))
    );
    min-height: 0;
    align-items: center;
    justify-content: flex-start;
    margin-inline: 0;
    gap: var(--spacing-4);
    padding-inline-start: var(--spacing-24);
    box-sizing: border-box;
  }

  .joker-hilo-history-entry .joker-hilo-history-chip {
    height: var(--hilo-history-chip-height);
    padding-inline: var(--spacing-4);
    font-size: var(--text-body-12);
    transform: translate(-50%, -50%);
  }

  .joker-hilo-game-frame__bottom {
    position: relative;
    display: flex;
    flex: 1 1 auto;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100%;
    min-width: 0;
    min-height: 0;
    padding: 0;
    overflow: hidden;
  }

  .joker-hilo-game-frame__play-stack {
    position: relative;
    display: flex;
    width: 100%;
    height: 100%;
    flex: 1 1 auto;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 0;
    padding: 0;
    box-sizing: border-box;
    container-type: size;
    container-name: hilo-mobile-felt;
  }

  .joker-hilo-game-frame__play {
    flex: 1 1 auto;
    width: 100%;
    height: 100%;
    min-height: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    padding-block: 0;
    padding-inline: 0;
  }

  .joker-hilo-game-frame__play-inner {
    display: flex;
    width: var(--hilo-main-native-width);
    height: var(--hilo-mobile-main-fit-height);
    transform: scale(
      calc(
        min(
          calc(100cqw / var(--hilo-main-native-width)),
          calc(100cqh / var(--hilo-mobile-main-fit-height)),
          1
        ) * var(--hilo-mobile-felt-card-scale, 0.96)
      )
    );
    transform-origin: center center;
    gap: 0;
    align-items: center;
    justify-content: center;
    flex: 0 0 auto;
    margin-inline: auto;
    --hilo-play-scale: 1;
  }

  .joker-hilo-game-frame__play-inner > .joker-hilo-prediction-group {
    display: none;
  }

  .joker-hilo-main-card-column {
    display: flex;
    flex: 0 0 auto;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    margin: 0;
    padding-bottom: 0;
    box-sizing: border-box;
    transform: none;
  }

  .joker-hilo-main-card-anchor .joker-hilo-game-frame__status {
    display: none;
  }

  .joker-hilo-main-card-wrap .joker-hilo-main-card-glow {
    --hilo-main-card-glow-size: min(360px, 92vw, 72cqh);
  }

  .joker-hilo-main-card-wrap {
    position: relative;
    display: block;
    width: var(--hilo-main-native-width);
    height: var(--hilo-main-native-height);
    max-width: none;
    margin: 0 auto;
    padding-bottom: 0;
  }

  .joker-hilo-main-card-wrap .joker-hilo-main-card-stack-slot {
    width: var(--hilo-main-native-width);
    height: var(--hilo-main-native-height);
  }

  .joker-hilo-main-card-scale {
    transform: none;
    transform-origin: center center;
  }

  .joker-hilo-main-card-skip-slot {
    top: calc(var(--spacing-16) * -1);
    right: calc(var(--spacing-16) * -1);
    width: calc(58px * 1.2);
    height: calc(32px * 1.2);
  }

  .joker-hilo-main-card-skip-scale {
    transform: none;
    transform-origin: center center;
  }

  .joker-hilo-main-card-wrap .joker-hilo-main-card-skip {
    --skip-button-width: calc(58px * 1.2);
    --skip-button-height: calc(32px * 1.2);
    --skip-button-chevron-size: calc(8px * 1.2);
  }

  .joker-hilo-mobile-odds {
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

  .joker-hilo-mobile-odds .joker-odds-button-group.is-inline {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: var(--spacing-8);
  }

  .joker-hilo-mobile-odds button {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .joker-hilo-mobile-odds button > span:first-child {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: var(--spacing-8);
    min-width: 0;
    max-width: 100%;
  }

  .joker-hilo-mobile-odds .joker-hi-lo-odds {
    gap: var(--spacing-8);
  }
}

${gameRoundEndStyles}
`;
}
