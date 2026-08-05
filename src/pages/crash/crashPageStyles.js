import { GAME_WIN_MODAL_OVERLAY_STYLES } from "../../shared/GameWinModalOverlay.jsx";

export function getCrashPageStyles(gameRoundEndStyles) {
  return `
${GAME_WIN_MODAL_OVERLAY_STYLES}
.joker-crash-stage {
  width: 100%;
  height: 100%;
  min-height: 0;
  display: grid;
  padding: 0;
  background: var(--joker-black-800);
  overflow: hidden;
}

.joker-game-shell--crash .joker-crash-betting-panel {
  height: 100%;
  min-height: 0;
  grid-template-rows: auto minmax(0, 1fr) auto auto;
}

.joker-game-shell--crash .joker-crash-betting-panel .joker-betting-submit-spacer {
  min-height: 0;
}

.joker-crash-chart {
  position: relative;
  width: 100%;
  height: 100%;
  min-width: 0;
  min-height: 0;
  --crash-atmosphere: 0;
  background:
    radial-gradient(
      circle at calc(58% + (var(--crash-atmosphere) * 12%)) calc(48% - (var(--crash-atmosphere) * 8%)),
      color-mix(in srgb, #E6D0A4 calc(8% + (var(--crash-atmosphere) * 14%)), transparent) 0%,
      transparent 48%
    ),
    var(--joker-black-800);
  overflow: hidden;
  isolation: isolate;
  transition: background 240ms var(--ease-standard);
}

.joker-crash-chart-grid {
  position: absolute;
  inset: 0;
  display: block;
  z-index: 1;
}

.joker-crash-chart::after {
  position: absolute;
  inset: 0;
  z-index: 0;
  background:
    linear-gradient(115deg, transparent 0%, rgb(255 255 255 / 0.018) 44%, transparent 52%),
    radial-gradient(circle at 70% 35%, rgb(230 208 164 / 0.045), transparent 34%);
  content: "";
  opacity: calc(0.18 + var(--crash-atmosphere) * 0.32);
  transform: translate3d(calc(var(--crash-atmosphere) * -14px), calc(var(--crash-atmosphere) * 8px), 0);
  transition:
    opacity 240ms var(--ease-standard),
    transform 240ms var(--ease-standard);
  pointer-events: none;
}

.joker-crash-y-axis,
.joker-crash-x-axis {
  color: var(--joker-black-50);
  font-family: var(--font);
  font-size: var(--text-body-14);
  font-weight: var(--text-body-weight);
  line-height: var(--text-body-line-height);
}

.joker-crash-y-axis {
  position: absolute;
  top: 0;
  bottom: 56px;
  left: 0;
  width: 56px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  padding: 48px 0;
  border-right: var(--border-width-default) solid var(--joker-black-300);
}

.joker-crash-y-axis span {
  display: grid;
  width: 100%;
  min-height: 56px;
  place-items: center;
}

.joker-crash-x-axis {
  position: absolute;
  right: 0;
  bottom: 0;
  left: 0;
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 48px 0 calc(56px + 48px);
  border-top: var(--border-width-default) solid var(--joker-black-300);
}

.joker-crash-x-axis span {
  display: grid;
  min-width: 56px;
  height: 100%;
  place-items: center;
}

.joker-crash-axis-corner {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 56px;
  height: 56px;
  border-top: var(--border-width-default) solid var(--joker-black-300);
  border-right: var(--border-width-default) solid var(--joker-black-300);
}

.joker-crash-plot {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 56px;
  left: 56px;
  overflow: hidden;
}

.joker-crash-camera {
  position: absolute;
  inset: 0;
  transform:
    translate3d(var(--crash-camera-x, 0), var(--crash-camera-y, 0), 0)
    scale(var(--crash-camera-scale, 1));
  transform-origin: 64% 60%;
  transition: transform 120ms linear;
  will-change: transform;
}

.joker-crash-graph {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
}

.joker-crash-graph-fill {
  fill: url("#joker-crash-fill");
  transition: fill 180ms var(--ease-standard);
}

.joker-crash-graph-trail {
  fill: none;
  stroke: #E6D0A4;
  stroke-width: 14;
  stroke-linecap: round;
  stroke-linejoin: round;
  opacity: var(--crash-line-trail-opacity, 0.06);
  filter: blur(10px);
  transition:
    opacity 160ms var(--ease-standard),
    stroke 180ms var(--ease-standard);
}

.joker-crash-graph-line {
  fill: none;
  stroke: #E6D0A4;
  stroke-width: var(--crash-line-width, 4px);
  stroke-linecap: round;
  stroke-linejoin: round;
  filter: drop-shadow(0 0 calc(var(--spacing-8) * var(--crash-atmosphere, 0)) rgb(230 208 164 / 0.2));
  transition:
    stroke 180ms var(--ease-standard),
    stroke-width 160ms var(--ease-standard),
    filter 160ms var(--ease-standard);
}

.joker-crash-multiplier {
  position: absolute;
  top: 54%;
  left: 48%;
  transform: translate(-50%, -50%);
  color: var(--joker-white-50);
  font-family: var(--font-heading);
  font-size: var(--text-display-d1, var(--display-d1));
  font-weight: var(--text-display-weight);
  line-height: var(--text-display-line-height-compact);
  letter-spacing: 0;
  pointer-events: none;
  text-shadow: 0 var(--spacing-8) var(--spacing-32) rgb(0 0 0 / 0.34);
}

.joker-crash-multiplier-value {
  display: inline-block;
  transform-origin: center;
  animation: joker-crash-multiplier-pulse var(--crash-multiplier-pulse-duration, 220ms) cubic-bezier(0.17, 0.89, 0.32, 1.28) both;
}

.joker-crash-multiplier.is-crashed {
  color: var(--joker-red-500, #e24a4a);
}

.joker-crash-rocket {
  position: absolute;
  width: 56px;
  height: 56px;
  transform:
    translate(-50%, -50%)
    rotate(var(--crash-rocket-angle, -32deg))
    scale(var(--crash-rocket-scale, 1));
  transform-origin: center;
  pointer-events: none;
  z-index: 2;
}

.joker-crash-rocket-body {
  position: relative;
  display: grid;
  place-items: center;
  width: 100%;
  height: 100%;
  animation: joker-crash-rocket-pulse var(--crash-rocket-pulse-duration, 520ms) ease-in-out infinite;
}

.joker-crash-rocket-body svg {
  display: block;
  width: 100%;
  height: 100%;
  filter: drop-shadow(0 0 10px rgb(230 208 164 / 0.42));
}

.joker-crash-rocket-glow {
  position: absolute;
  inset: -18px;
  border-radius: 9999px;
  background: radial-gradient(circle, rgb(230 208 164 / 0.34) 0%, transparent 72%);
  opacity: var(--crash-rocket-glow-opacity, 0.24);
  animation: joker-crash-rocket-glow var(--crash-rocket-pulse-duration, 520ms) ease-in-out infinite;
  pointer-events: none;
}

.joker-crash-rocket-flame {
  position: absolute;
  top: 58%;
  left: 8%;
  width: 18px;
  height: 10px;
  border-radius: 9999px 0 9999px 9999px;
  background: linear-gradient(90deg, #ff8a3d, #ffd56a 58%, transparent);
  opacity: calc(0.55 + var(--crash-atmosphere, 0) * 0.45);
  transform:
    translateY(-50%)
    rotate(calc(var(--crash-rocket-angle, -32deg) * -1 + 188deg))
    scaleX(var(--crash-flame-scale, 1));
  transform-origin: right center;
  filter: blur(0.4px);
  animation: joker-crash-rocket-flame var(--crash-rocket-pulse-duration, 520ms) ease-in-out infinite;
}

.joker-crash-chart.is-crashed .joker-crash-rocket-body svg {
  filter: drop-shadow(0 0 12px rgb(226 74 74 / 0.5));
}

.joker-crash-chart.is-crashed .joker-crash-rocket-body svg .joker-crash-rocket-fill {
  fill: var(--joker-red-500, #e24a4a);
}

.joker-crash-chart.is-crashed .joker-crash-rocket-body svg .joker-crash-rocket-window {
  fill: color-mix(in srgb, var(--joker-red-500, #e24a4a) 72%, #fff);
}

.joker-crash-chart.is-crashed .joker-crash-rocket-flame {
  background: linear-gradient(90deg, #ff4d4d, #ff9b7a 58%, transparent);
  animation: joker-crash-rocket-burst 420ms var(--ease-standard) both;
}

.joker-crash-chart.is-crashed .joker-crash-rocket-glow {
  background: radial-gradient(circle, rgb(226 74 74 / 0.42) 0%, transparent 72%);
  animation: joker-crash-rocket-burst 420ms var(--ease-standard) both;
}

.joker-crash-particles {
  position: absolute;
  inset: 0;
  z-index: 1;
  overflow: hidden;
  pointer-events: none;
}

.joker-crash-particle {
  position: absolute;
  left: var(--particle-x);
  top: var(--particle-y);
  width: var(--particle-size);
  height: var(--particle-size);
  border-radius: var(--radius-pill);
  background: #E6D0A4;
  opacity: calc(var(--crash-atmosphere, 0) * 0.24);
  filter: blur(0.4px);
  animation: joker-crash-particle-drift var(--particle-duration) linear infinite;
  animation-delay: var(--particle-delay);
  transform: translate3d(0, 0, 0);
}

.joker-crash-social {
  position: absolute;
  top: var(--spacing-24);
  right: var(--spacing-24);
  z-index: 2;
  display: grid;
  gap: var(--spacing-8);
  min-width: 190px;
  color: var(--joker-black-50);
  font-family: var(--font);
  font-size: var(--text-body-12);
  line-height: var(--text-body-line-height);
  pointer-events: none;
}

.joker-crash-live-count {
  justify-self: end;
  border: var(--border-width-default) solid color-mix(in srgb, var(--joker-black-300) 76%, transparent);
  border-radius: var(--radius-sm);
  background: color-mix(in srgb, var(--joker-black-700) 72%, transparent);
  color: color-mix(in srgb, var(--joker-white-50) 74%, transparent);
  padding: var(--spacing-4) var(--spacing-8);
}

.joker-crash-cashout-feed {
  display: grid;
  gap: var(--spacing-4);
  justify-items: end;
  min-height: 64px;
}

.joker-crash-cashout-feed span {
  color: color-mix(in srgb, var(--joker-white-50) 54%, transparent);
  opacity: 0.84;
  text-transform: uppercase;
  letter-spacing: 0.02em;
  animation: joker-crash-social-enter 360ms var(--ease-standard) both;
}

.joker-crash-chart.is-crashed .joker-crash-graph-line {
  stroke: var(--joker-red-500, #e24a4a);
  filter: none;
}

.joker-crash-chart.is-crashed .joker-crash-graph-trail {
  stroke: var(--joker-red-500, #e24a4a);
  opacity: 0.12;
}

.joker-crash-chart.is-crashed .joker-crash-graph-fill {
  fill: url("#joker-crash-fill-red");
}

.joker-crash-chart.is-crashed .joker-crash-camera {
  transition: none;
}

.joker-game-shell--crash .joker-crash-betting-panel.is-crash-active .joker-bet-submit {
  position: relative;
}

.joker-game-shell--crash .joker-crash-betting-panel.is-crash-active .joker-bet-submit > span {
  color: transparent;
}

.joker-game-shell--crash .joker-crash-betting-panel.is-crash-active .joker-bet-submit > span::after {
  content: "Cashout";
  position: absolute;
  inset: 0;
  display: grid;
  place-items: center;
  color: var(--button-primary-text);
  font: inherit;
  text-transform: inherit;
}

.joker-crash-result-overlay > * {
  animation: joker-crash-result-pop 420ms var(--ease-standard) both;
}

.joker-crash-reset-timer {
  position: absolute;
  right: var(--spacing-32);
  bottom: calc(56px + var(--spacing-24));
  left: calc(56px + var(--spacing-32));
  z-index: 7;
  display: grid;
  gap: var(--spacing-8);
  pointer-events: none;
}

.joker-crash-reset-copy {
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: color-mix(in srgb, var(--joker-white-50) 62%, transparent);
  font-family: var(--font);
  font-size: var(--text-body-12);
  line-height: var(--text-body-line-height);
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.joker-crash-reset-track {
  height: var(--spacing-4);
  overflow: hidden;
  border-radius: var(--radius-pill);
  background: color-mix(in srgb, var(--joker-black-300) 46%, transparent);
}

.joker-crash-reset-fill {
  width: 100%;
  height: 100%;
  border-radius: inherit;
  background: linear-gradient(90deg, color-mix(in srgb, #E6D0A4 64%, transparent), #E6D0A4);
  transform-origin: left;
  animation: joker-crash-reset-fill ${crashResetDurationMs}ms linear both;
}

@keyframes joker-crash-result-pop {
  0% {
    opacity: 0;
    transform: scale(0.92) translateY(var(--spacing-12));
  }

  68% {
    opacity: 1;
    transform: scale(1.03) translateY(0);
  }

  100% {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

@keyframes joker-crash-multiplier-pulse {
  0% {
    transform: translateY(var(--crash-multiplier-drift, 0)) scale(0.985);
  }

  52% {
    transform: translateY(var(--crash-multiplier-drift, 0)) scale(1.035);
  }

  100% {
    transform: translateY(var(--crash-multiplier-drift, 0)) scale(1);
  }
}

@keyframes joker-crash-rocket-pulse {
  0%, 100% {
    transform: scale(1);
  }

  50% {
    transform: scale(1.12);
  }
}

@keyframes joker-crash-rocket-glow {
  0%, 100% {
    opacity: calc(var(--crash-rocket-glow-opacity, 0.24) * 0.72);
    transform: scale(0.92);
  }

  50% {
    opacity: var(--crash-rocket-glow-opacity, 0.24);
    transform: scale(1.08);
  }
}

@keyframes joker-crash-rocket-flame {
  0%, 100% {
    opacity: calc(0.5 + var(--crash-atmosphere, 0) * 0.35);
    transform: translateY(-50%) rotate(calc(var(--crash-rocket-angle, -32deg) * -1 + 188deg)) scaleX(calc(var(--crash-flame-scale, 1) * 0.88));
  }

  50% {
    opacity: calc(0.72 + var(--crash-atmosphere, 0) * 0.28);
    transform: translateY(-50%) rotate(calc(var(--crash-rocket-angle, -32deg) * -1 + 188deg)) scaleX(calc(var(--crash-flame-scale, 1) * 1.18));
  }
}

@keyframes joker-crash-rocket-burst {
  0% {
    opacity: 1;
    transform: scale(1);
  }

  100% {
    opacity: 0;
    transform: scale(2.4);
  }
}

@keyframes joker-crash-particle-drift {
  0% {
    transform: translate3d(0, var(--spacing-16), 0);
    opacity: 0;
  }

  18% {
    opacity: calc(var(--crash-atmosphere, 0) * 0.24);
  }

  100% {
    transform: translate3d(calc(var(--crash-atmosphere, 0) * -26px), calc(var(--spacing-40) * -1), 0);
    opacity: 0;
  }
}

@keyframes joker-crash-social-enter {
  0% {
    opacity: 0;
    transform: translateY(var(--spacing-4));
  }

  100% {
    opacity: 0.84;
    transform: translateY(0);
  }
}

@keyframes joker-crash-reset-fill {
  0% {
    transform: scaleX(0);
  }

  100% {
    transform: scaleX(1);
  }
}
`;
}
