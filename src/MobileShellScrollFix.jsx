export function MobileShellScrollFix() {
  return (
    <style>
      {`
        html,
        body,
        #root {
          height: 100%;
          margin: 0;
          scrollbar-width: none;
          -ms-overflow-style: none;
        }

        html::-webkit-scrollbar,
        body::-webkit-scrollbar,
        #root::-webkit-scrollbar {
          display: none;
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
