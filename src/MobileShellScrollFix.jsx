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

        .joker-game-shell > .joker-navigation-shell,
        .joker-game-shell .joker-navigation-body,
        .joker-game-shell .joker-navigation-content {
          min-height: 0;
          height: 100%;
        }

        .joker-game-shell .joker-page-wrapper {
          min-height: 0;
          height: 100%;
        }

        .joker-game-shell .joker-page-wrapper > .joker-game-inner-frame,
        .joker-game-shell .joker-page-wrapper > .joker-game-inner {
          flex: 1 1 0;
          height: 100%;
          min-height: 0;
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
