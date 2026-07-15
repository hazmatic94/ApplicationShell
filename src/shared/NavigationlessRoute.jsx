const NAVIGATIONLESS_ROUTE_STYLES = `
  .joker-navigationless-route {
    width: 100%;
    min-height: 100vh;
    min-height: 100dvh;
  }

  .joker-navigationless-route .joker-top-rail-demo,
  .joker-navigationless-route .joker-product-rail,
  .joker-navigationless-route .joker-mobile-nav,
  .joker-navigationless-route .joker-mobile-nav-backdrop {
    display: none !important;
  }

  .joker-navigationless-route .joker-navigation,
  .joker-navigationless-route .joker-navigation-body,
  .joker-navigationless-route .joker-navigation-content,
  .joker-navigationless-route .joker-navigation-mobile-content {
    width: 100%;
    min-height: 0;
    height: 100%;
  }

  .joker-navigationless-route .joker-game-shell {
    grid-template-rows: minmax(0, 1fr) !important;
  }

  .joker-navigationless-route .joker-navigation {
    grid-template-rows: minmax(0, 1fr) !important;
  }

  .joker-navigationless-route .joker-navigation-body {
    grid-template-columns: minmax(0, 1fr) !important;
  }
`;

export function NavigationlessRoute({ children }) {
  return (
    <div className="joker-navigationless-route">
      <style>{NAVIGATIONLESS_ROUTE_STYLES}</style>
      {children}
    </div>
  );
}
