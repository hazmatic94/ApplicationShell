const GAME_ROUND_END_TRANSITION_MS = 300;
export const GAME_ROUND_END_RESET_MS = 2000;

export const GAME_ROUND_END_STYLES = `
  .joker-game-round-end-canvas.is-round-ending {
    animation: joker-game-round-end-canvas ${GAME_ROUND_END_TRANSITION_MS}ms cubic-bezier(0.4, 0, 0.15, 1) forwards;
    transform-origin: center center;
  }

  .joker-game-round-end-dim {
    position: absolute;
    inset: 0;
    z-index: 35;
    pointer-events: none;
    background: rgb(0 0 0 / 0.12);
    opacity: 0;
    animation: joker-game-round-end-dim ${GAME_ROUND_END_TRANSITION_MS}ms ease-in-out forwards;
  }

  @keyframes joker-game-round-end-dim {
    0% {
      opacity: 0;
    }

    50% {
      opacity: 1;
    }

    100% {
      opacity: 0;
    }
  }

  @keyframes joker-game-round-end-canvas {
    0% {
      transform: scale(1) translateY(0);
    }

    22% {
      transform: scale(0.99) translateY(-2px);
    }

    44% {
      transform: scale(0.99) translateY(2px);
    }

    66% {
      transform: scale(0.995) translateY(-1px);
    }

    100% {
      transform: scale(1) translateY(0);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .joker-game-round-end-canvas.is-round-ending {
      animation: none;
    }

    .joker-game-round-end-dim {
      animation: none;
      opacity: 0;
    }
  }
`;

export function GameRoundEndTransition({ active, animationKey = "round-end" }) {
  if (!active) {
    return null;
  }

  return (
    <div
      key={animationKey}
      className="joker-game-round-end-dim"
      aria-hidden="true"
    />
  );
}
