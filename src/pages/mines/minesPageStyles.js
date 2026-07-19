export function getMinesPageStyles(gameRoundEndStyles) {
  return `
.joker-mines-stage {
  display: grid;
  width: 100%;
  height: 100%;
  min-height: 0;
  overflow: hidden;
  background: var(--joker-black-800);
}

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

@media (min-width: 1000px) {
  .joker-game-shell--mines .joker-game-shell-betting {
    overflow-y: hidden;
  }
}

.joker-mines-dynamite-option {
  display: inline-flex;
  min-width: 0;
  align-items: center;
  gap: var(--spacing-8);
  line-height: var(--text-body-line-height);
}

.joker-mines-dynamite-option > span {
  display: inline-flex;
  min-width: 0;
  align-items: center;
}

.joker-mines-dynamite-option img {
  display: block;
  align-self: center;
  flex: 0 0 var(--icon-size-md);
  width: var(--icon-size-md);
  height: var(--icon-size-md);
  object-fit: contain;
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

.joker-mines-frame-footer {
  display: grid;
  grid-column: 1 / -1;
  grid-template-columns: auto minmax(0, 1fr) auto;
  align-items: center;
  min-height: calc(var(--spacing-64) - var(--spacing-8));
  border-top: var(--border-width-default) solid var(--joker-black-300);
  background: var(--joker-black-600);
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
  transition:
    color var(--motion-fast) var(--ease-standard),
    transform var(--motion-fast) var(--ease-standard);
}

.joker-mines-footer-button:hover {
  color: var(--joker-white-50);
  transform: translateY(calc(var(--border-width-default) * -1));
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

.joker-mines-grid.is-round-lost .joker-mines-grid-cell:not(.is-revealed) .joker-mines-grid-tile {
  opacity: 0.34;
  filter: saturate(0.48);
  pointer-events: none;
}

.joker-mines-grid-cell.is-shield-blocked .joker-loss-tile-icon {
  opacity: 0.2;
}

.joker-mines-shield-badge {
  position: absolute;
  top: 50%;
  left: 50%;
  z-index: 6;
  display: grid;
  width: clamp(calc(var(--spacing-64) + var(--spacing-16)), 68%, calc(var(--spacing-64) + var(--spacing-64)));
  aspect-ratio: 1;
  place-items: center;
  border: 0;
  border-radius: 0;
  background: transparent;
  box-shadow: none;
  transform: translate(-50%, -50%);
  pointer-events: none;
}

.joker-mines-shield-badge img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: contain;
  filter:
    drop-shadow(0 var(--spacing-8) var(--spacing-16) rgb(0 0 0 / 0.36))
    drop-shadow(0 0 var(--spacing-16) color-mix(in srgb, var(--joker-gold-400) 22%, transparent));
}

.joker-mines-grid-cell.is-shield-blocked.is-fresh-reveal .joker-mines-shield-badge {
  opacity: 0;
  transform: translate(-50%, -50%) scale(0.72);
  animation: joker-mines-shield-block 980ms var(--ease-standard) both;
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

@keyframes joker-mines-shield-block {
  0% {
    opacity: 0;
    transform: translate(-50%, -50%) scale(0.72);
    filter: drop-shadow(0 0 0 transparent);
  }

  34% {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1.1);
    filter: drop-shadow(0 0 var(--spacing-24) color-mix(in srgb, var(--joker-gold-400) 54%, transparent));
  }

  72% {
    opacity: 0.92;
    transform: translate(-50%, -50%) scale(0.96);
    filter: drop-shadow(0 0 var(--spacing-16) color-mix(in srgb, var(--joker-gold-400) 34%, transparent));
  }

  100% {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1);
    filter: drop-shadow(0 var(--spacing-4) var(--spacing-12) rgb(0 0 0 / 0.42));
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
