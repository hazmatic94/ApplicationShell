export const GAME_WIN_MODAL_OVERLAY_STYLES = `
  .joker-game-win-modal-overlay {
    position: absolute;
    inset: 0;
    z-index: 40;
    display: grid;
    place-items: center;
    padding: var(--spacing-24);
    pointer-events: auto;
    background: rgb(0 0 0 / 0.42);
    backdrop-filter: blur(6px);
    -webkit-backdrop-filter: blur(6px);
    animation: joker-game-win-modal-overlay-in 280ms var(--ease-standard) both;
  }

  .joker-game-win-modal-overlay > * {
    position: relative;
    z-index: 1;
    max-width: min(500px, calc(100% - var(--spacing-48)));
    box-shadow: 0 var(--spacing-24) var(--spacing-64) rgb(0 0 0 / 0.48);
  }

  @keyframes joker-game-win-modal-overlay-in {
    from {
      opacity: 0;
    }

    to {
      opacity: 1;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .joker-game-win-modal-overlay {
      animation: none;
    }
  }
`;

export function GameWinModalOverlay({ className = "", children, ...props }) {
  return (
    <div
      className={["joker-game-win-modal-overlay", className].filter(Boolean).join(" ")}
      {...props}
    >
      {children}
    </div>
  );
}
