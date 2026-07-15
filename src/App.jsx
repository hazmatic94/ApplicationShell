import { useEffect, useState } from "react";
import { CocoHutPage } from "./pages/coco-hut/index.js";
import { CoinFlipPage } from "./pages/coin-flip/index.js";
import { CrashPage } from "./pages/crash/index.js";
import { FourDMinesPage } from "./pages/four-d-mines/index.js";
import { HiloPage } from "./pages/hilo/index.js";
import { MinesPage } from "./pages/mines/index.js";
import { RoulettePage } from "./pages/roulette/index.js";
import { MobileShellScrollFix } from "./shared/MobileShellScrollFix.jsx";
import { gameRouteMap, normalizePathname, withBase } from "./shared/routing.js";

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

  if (pathname === "/hilo") {
    return (
      <>
        <MobileShellScrollFix />
        <HiloPage onGameChange={navigateToGame} />
      </>
    );
  }

  if (pathname === "/crash") {
    return (
      <>
        <MobileShellScrollFix />
        <CrashPage onGameChange={navigateToGame} />
      </>
    );
  }

  if (pathname === "/roulette") {
    return (
      <>
        <MobileShellScrollFix />
        <RoulettePage onGameChange={navigateToGame} />
      </>
    );
  }

  if (pathname === "/coin-flip") {
    return (
      <>
        <MobileShellScrollFix />
        <CoinFlipPage onGameChange={navigateToGame} />
      </>
    );
  }

  if (pathname === "/coco-hut") {
    return (
      <>
        <MobileShellScrollFix />
        <CocoHutPage onGameChange={navigateToGame} />
      </>
    );
  }

  if (pathname === "/4d-mines") {
    return (
      <>
        <MobileShellScrollFix />
        <FourDMinesPage onGameChange={navigateToGame} />
      </>
    );
  }

  return (
    <>
      <MobileShellScrollFix />
      <MinesPage onGameChange={navigateToGame} />
    </>
  );
}
