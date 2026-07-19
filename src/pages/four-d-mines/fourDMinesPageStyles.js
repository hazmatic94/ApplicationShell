export function getFourDMinesPageStyles(gameRoundEndStyles) {
  return `
.joker-mines-stage {
  display: grid;
  width: 100%;
  height: 100%;
  min-height: 0;
  overflow: hidden;
  background: var(--joker-black-800);
}

@media (min-width: 1000px) {
  .joker-game-shell--4d-mines .joker-game-shell-betting {
    overflow-y: hidden;
  }
}

.joker-mines-board-area {
  --mines-board-padding: 32px;
  --mines-grid-gap: var(--spacing-8);
  position: relative;
  display: grid;
  height: 100%;
  min-height: 0;
  align-items: stretch;
  justify-items: stretch;
  padding: var(--mines-board-padding);
  overflow: hidden;
  container-type: size;
  container-name: mines-board;
}

.joker-mines-grid {
  display: grid;
  width: 100%;
  height: 100%;
  min-width: 0;
  min-height: 0;
  grid-template-columns: repeat(var(--mines-grid-columns, 5), minmax(0, 1fr));
  grid-template-rows: repeat(var(--mines-grid-rows, 5), minmax(0, 1fr));
  gap: var(--mines-grid-gap);
  overflow: visible;
}

.joker-game-shell .joker-navigation-mobile-content .joker-mines-stage {
  height: 100%;
  min-height: 100%;
  overflow: visible;
}

.joker-game-shell .joker-navigation-mobile-content .joker-mines-board-area {
  height: 100%;
  min-height: 0;
  overflow: visible;
}

@media (min-width: 1000px) {
  .joker-mines-board-area {
    --mines-board-padding: 40px;
    place-items: center;
  }

  .joker-mines-grid {
    --mines-grid-fit: min(100cqw, 100cqh);
    width: var(--mines-grid-fit);
    height: var(--mines-grid-fit);
    max-width: 100%;
    max-height: 100%;
  }
}

@media (min-width: 1280px) {
  .joker-mines-board-area {
    --mines-board-padding: 48px;
  }
}

@media (max-width: 999px) {
  .joker-mines-board-area {
    --mines-board-padding: 8px;
  }
}

.joker-mines-grid-cell {
  position: relative;
  display: grid;
  width: 100%;
  height: 100%;
  min-width: 0;
  min-height: 0;
  overflow: visible;
  place-items: stretch;
}

.joker-mines-grid-tile {
  --game-tile-size: 100%;
  width: 100%;
  height: 100%;
  max-width: 100%;
  max-height: 100%;
}

.joker-mines-grid-cell .joker-mines-grid-tile {
  align-self: stretch;
  justify-self: stretch;
}

.joker-mines-grid.is-round-lost .joker-mines-grid-cell:not(.is-revealed) .joker-mines-grid-tile {
  opacity: 0.34;
  filter: saturate(0.48);
  pointer-events: none;
}

.joker-mines-result-card {
  position: absolute;
  inset: 0;
  z-index: 40;
  display: grid;
  place-items: center;
  padding: var(--spacing-24);
  pointer-events: auto;
  transform: scale(0.96);
  animation: joker-mines-cashout-pop 420ms var(--ease-standard) both;
}

.joker-mines-result-card > * {
  max-width: min(500px, calc(100cqw - var(--spacing-48)));
  box-shadow: 0 var(--spacing-24) var(--spacing-64) rgb(0 0 0 / 0.42);
}

@keyframes joker-mines-cashout-pop {
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

.joker-mines-board-area.is-page-load-enter {
  animation: joker-mines-load-board-fade 200ms var(--ease-out) both;
}

.joker-mines-grid.is-page-load-enter .joker-mines-grid-cell {
  animation: joker-mines-load-tile-reveal 320ms var(--ease-out) var(--mines-load-row-delay, 32ms) both;
}

.joker-mines-grid.is-page-load-enter .joker-mines-grid-tile:hover {
  transform: none;
}

@keyframes joker-mines-load-board-fade {
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
}

@keyframes joker-mines-load-tile-reveal {
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
  .joker-mines-board-area.is-page-load-enter,
  .joker-mines-grid.is-page-load-enter .joker-mines-grid-cell {
    animation: none;
    opacity: 1;
    transform: none;
  }
}

${gameRoundEndStyles}
`;
}
