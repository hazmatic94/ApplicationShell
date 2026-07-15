import { Suspense, useEffect, useState } from "react";
import { MobileShellScrollFix } from "./shared/MobileShellScrollFix.jsx";
import { gameRouteMap, normalizePathname, withBase } from "./shared/routing.js";
import { resolveGameRoute } from "./shared/routes.jsx";

export function App() {
  const [pathname, setPathname] = useState(() =>
    typeof window === "undefined" ? "/" : normalizePathname(window.location.pathname)
  );

  useEffect(() => {
    const handleLocationChange = () =>
      setPathname(normalizePathname(window.location.pathname));

    window.addEventListener("popstate", handleLocationChange);

    return () => window.removeEventListener("popstate", handleLocationChange);
  }, []);

  function navigateToGame(nextValue) {
    const normalizedNextPath = gameRouteMap[nextValue] ?? null;
    const nextPath = normalizedNextPath ? withBase(normalizedNextPath) : null;

    if (!nextPath || normalizePathname(window.location.pathname) === normalizedNextPath) {
      return;
    }

    window.history.pushState({}, "", nextPath);
    setPathname(normalizedNextPath);
  }

  const { Page } = resolveGameRoute(pathname);

  return (
    <>
      <MobileShellScrollFix />
      <Suspense fallback={null}>
        <Page onGameChange={navigateToGame} />
      </Suspense>
    </>
  );
}
