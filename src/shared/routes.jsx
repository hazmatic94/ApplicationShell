/** Lazy-loaded game pages. Register new games here and in routing.js `gameRouteMap`. */
import { lazy } from "react";

function lazyPage(importFn, exportName) {
  return lazy(() => importFn().then((module) => ({ default: module[exportName] })));
}

export const gameRoutes = [
  {
    pathname: "/hilo",
    Page: lazyPage(() => import("../pages/hilo/index.js"), "HiloPage"),
  },
  {
    pathname: "/crash",
    Page: lazyPage(() => import("../pages/crash/index.js"), "CrashPage"),
  },
  {
    pathname: "/roulette",
    Page: lazyPage(() => import("../pages/roulette/index.js"), "RoulettePage"),
  },
  {
    pathname: "/coin-flip",
    Page: lazyPage(() => import("../pages/coin-flip/index.js"), "CoinFlipPage"),
  },
  {
    pathname: "/coco-hut",
    Page: lazyPage(() => import("../pages/coco-hut/index.js"), "CocoHutPage"),
  },
  {
    pathname: "/4d-mines",
    Page: lazyPage(() => import("../pages/four-d-mines/index.js"), "FourDMinesPage"),
  },
  {
    pathname: "/",
    Page: lazyPage(() => import("../pages/mines/index.js"), "MinesPage"),
  },
];

export function resolveGameRoute(pathname) {
  const navigationless = pathname === "/embed" || pathname.startsWith("/embed/");
  const gamePathname = navigationless ? pathname.slice("/embed".length) || "/" : pathname;
  const route =
    gameRoutes.find((candidate) => candidate.pathname === gamePathname) ??
    gameRoutes[gameRoutes.length - 1];

  return { ...route, navigationless };
}
