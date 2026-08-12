export function MobileShellScrollFix() {
  return (
    <style>
      {`
        html,
        body,
        #root {
          width: 100%;
          height: 100%;
          min-height: 100dvh;
          margin: 0;
          overflow: hidden;
          scrollbar-width: none;
          -ms-overflow-style: none;
        }

        html::-webkit-scrollbar,
        body::-webkit-scrollbar,
        #root::-webkit-scrollbar {
          display: none;
        }

        .joker-game-shell {
          width: 100%;
          height: 100dvh;
          min-height: 100vh;
        }

        .joker-game-shell .joker-page-wrapper {
          width: 100%;
          height: 100%;
          min-height: 0;
          padding: 0;
        }

        .joker-game-shell .joker-page-wrapper > .joker-game-inner-frame,
        .joker-game-shell .joker-page-wrapper > .joker-game-inner {
          width: 100%;
          max-width: none;
          height: 100%;
          min-height: 0;
          margin-inline: 0;
          align-self: stretch;
          border: 0;
          border-radius: 0;
        }

        .joker-game-shell,
        .joker-game-shell * {
          scrollbar-width: none;
          -ms-overflow-style: none;
        }

        .joker-game-shell *::-webkit-scrollbar {
          display: none;
        }

        .joker-game-shell .joker-game-shell-empty-stage > * {
          min-height: 100%;
        }
      `}
    </style>
  );
}
