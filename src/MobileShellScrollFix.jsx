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
          grid-template-rows: minmax(0, 1fr);
        }

        .joker-game-shell > .joker-navigation-shell {
          min-height: 0;
          height: 100%;
        }

        .joker-game-shell .joker-navigation {
          min-height: 0;
          height: 100%;
          grid-template-rows: auto minmax(0, 1fr);
        }

        .joker-game-shell
          > .joker-navigation-shell[data-navigation-mode='desktop']
          .joker-navigation-body,
        .joker-game-shell
          > .joker-navigation-shell[data-navigation-mode='compact']
          .joker-navigation-body,
        .joker-game-shell
          > .joker-navigation-shell[data-navigation-mode='desktop']
          .joker-navigation-content,
        .joker-game-shell
          > .joker-navigation-shell[data-navigation-mode='compact']
          .joker-navigation-content {
          min-height: 0;
          height: 100%;
          overflow: hidden;
        }

        .joker-game-shell
          > .joker-navigation-shell[data-navigation-mode='desktop']
          .joker-page-wrapper,
        .joker-game-shell
          > .joker-navigation-shell[data-navigation-mode='compact']
          .joker-page-wrapper {
          display: flex;
          flex-direction: column;
          min-height: 0;
          height: 100%;
        }

        .joker-game-shell
          > .joker-navigation-shell[data-navigation-mode='desktop']
          .joker-page-wrapper
          > .joker-game-inner-frame,
        .joker-game-shell
          > .joker-navigation-shell[data-navigation-mode='compact']
          .joker-page-wrapper
          > .joker-game-inner-frame,
        .joker-game-shell
          > .joker-navigation-shell[data-navigation-mode='desktop']
          .joker-page-wrapper
          > .joker-game-inner,
        .joker-game-shell
          > .joker-navigation-shell[data-navigation-mode='compact']
          .joker-page-wrapper
          > .joker-game-inner {
          flex: 1 1 0;
          width: 100%;
          height: 100%;
          min-height: 0;
          align-self: stretch;
        }

        .joker-game-shell
          > .joker-navigation-shell[data-navigation-mode='desktop']
          .joker-game-inner,
        .joker-game-shell
          > .joker-navigation-shell[data-navigation-mode='compact']
          .joker-game-inner,
        .joker-game-shell
          > .joker-navigation-shell[data-navigation-mode='desktop']
          .joker-game-inner-layout,
        .joker-game-shell
          > .joker-navigation-shell[data-navigation-mode='compact']
          .joker-game-inner-layout,
        .joker-game-shell
          > .joker-navigation-shell[data-navigation-mode='desktop']
          .joker-game-shell-play-area,
        .joker-game-shell
          > .joker-navigation-shell[data-navigation-mode='compact']
          .joker-game-shell-play-area,
        .joker-game-shell
          > .joker-navigation-shell[data-navigation-mode='desktop']
          .joker-game-inner-canvas,
        .joker-game-shell
          > .joker-navigation-shell[data-navigation-mode='compact']
          .joker-game-inner-canvas,
        .joker-game-shell
          > .joker-navigation-shell[data-navigation-mode='desktop']
          .joker-game-shell-empty-stage,
        .joker-game-shell
          > .joker-navigation-shell[data-navigation-mode='compact']
          .joker-game-shell-empty-stage {
          min-height: 0;
          height: 100%;
        }

        .joker-game-shell
          > .joker-navigation-shell[data-navigation-mode='mobile'] {
          display: grid;
          grid-template-rows: auto minmax(0, 1fr);
        }

        .joker-game-shell
          > .joker-navigation-shell[data-navigation-mode='mobile']
          .joker-navigation-mobile-content {
          overflow-y: auto;
          -webkit-overflow-scrolling: touch;
          min-height: 0;
          height: 100%;
        }

        .joker-game-shell
          > .joker-navigation-shell[data-navigation-mode='mobile']
          .joker-page-wrapper {
          display: flex;
          flex-direction: column;
          height: auto;
          min-height: min-content;
          overflow: visible;
        }

        .joker-game-shell
          > .joker-navigation-shell[data-navigation-mode='mobile']
          .joker-page-wrapper
          > .joker-game-inner-frame,
        .joker-game-shell
          > .joker-navigation-shell[data-navigation-mode='mobile']
          .joker-page-wrapper
          > .joker-game-inner {
          flex: 0 0 auto;
          width: 100%;
          height: auto;
          min-height: min-content;
          overflow: visible;
        }

        .joker-game-shell
          > .joker-navigation-shell[data-navigation-mode='mobile']
          .joker-game-inner,
        .joker-game-shell
          > .joker-navigation-shell[data-navigation-mode='mobile']
          .joker-game-inner-betting,
        .joker-game-shell
          > .joker-navigation-shell[data-navigation-mode='mobile']
          .joker-game-shell-betting {
          height: auto;
          min-height: 0;
          overflow: visible;
        }

        .joker-game-shell
          > .joker-navigation-shell[data-navigation-mode='mobile']
          .joker-game-inner-layout,
        .joker-game-shell
          > .joker-navigation-shell[data-navigation-mode='mobile']
          .joker-game-shell-play-area {
          display: contents;
        }

        .joker-game-shell
          > .joker-navigation-shell[data-navigation-mode='mobile']
          .joker-game-inner-canvas,
        .joker-game-shell
          > .joker-navigation-shell[data-navigation-mode='mobile']
          .joker-game-shell-empty-stage {
          height: var(--game-shell-mobile-stage-height);
          min-height: var(--game-shell-mobile-stage-height);
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

        .joker-hilo-betting-panel.is-mobile > .joker-betting-main,
        .joker-navigation-mobile-content
          .joker-hilo-betting-panel
          > .joker-betting-main,
        .joker-mobile-game-betting
          .joker-hilo-betting-panel
          > .joker-betting-main {
          order: 3;
        }

        .joker-navigation-mobile-content
          .joker-hilo-betting-panel
          .joker-betting-main {
          gap: var(--spacing-16);
        }
      `}
    </style>
  );
}
