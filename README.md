# GameShell

Showroom app for Joker Originals games. Each game is a self-contained page module wired into a shared shell from `@joker/design-system` (navigation, wallet, betting panel primitives).

**Base path:** `/showroom/gameshell/` (configured in `vite.config.js`)

## Getting started

```bash
yarn install
yarn dev
```

Open the URL Vite prints (often `http://localhost:5173/showroom/gameshell/`).

```bash
yarn test      # unit tests for pure game logic
yarn build     # production build
yarn preview   # serve dist locally
```

CI runs `yarn test` then `yarn build` on PRs to `main` / `dev` (see `.github/workflows/ci-gameshell.yml`).

## Folder structure

```text
src/
  App.jsx                 # pathname routing + lazy-loaded game pages
  main.jsx                # entry; imports design-system global styles
  pages/
    <game>/               # one folder per game (see below)
    coco-hut/             # STUB — shell only, no gameplay yet
  shared/
    routes.jsx            # React.lazy route table
    routing.js            # pathname ↔ game id map, base URL helpers
    hooks.js              # layout, deferred win credit, open game menu
    formatting.js         # balance / JKC display helpers
    sounds.js             # shared audio playback
    gameRoundEnd.jsx      # win/loss round-end overlay
    MobileShellScrollFix.jsx
  data/
    navigationData.js
assets/                   # images, audio (referenced from page modules)
```

## Per-game module convention

Each playable game under `src/pages/<game>/` follows the same layout:

| File | Role |
|------|------|
| `<Game>Page.jsx` | Round state, `GameShell` wiring, handlers |
| `<game>GameLogic.js` | Pure rules / payout math (unit-tested) |
| `<game>Config.js` | RTP, nav preset, timing constants |
| `Packaged<Game>BettingPanel.jsx` | Thin adapter around design-system betting panel |
| `*Grid.jsx`, `*Stage.jsx`, … | Game-specific play area UI |
| `<game>PageStyles.js` | Co-located CSS-in-JS for the page |
| `index.js` | Re-exports the page component |

**Games today:** Mines (default `/`), Hilo, Crash, Roulette, Coin Flip, 4D Mines.

**Coco Hut** (`src/pages/coco-hut/`) is a placeholder: background + betting panel shell only. No `cocoHutGameLogic.js` or play flow yet. Disabled in product nav until gameplay is built.

## Adding a new game

1. Copy an existing folder under `src/pages/` (Mines is the smallest reference).
2. Register the route in `src/shared/routes.jsx` (lazy import) and `src/shared/routing.js` (`gameRouteMap`).
3. Wrap the design-system betting panel in a `Packaged*` component.
4. Put payout / odds in `<game>GameLogic.js` and add `<game>GameLogic.test.js`.
5. Enable the game in design-system / product navigation when ready.

`App.jsx` should stay thin — only routing and `Suspense`. Game logic stays in the page module.

## Shared code

Import cross-game utilities from `src/shared/`:

- **`useGameShellBettingPanelLayout`** — `"desktop"` vs `"mobile"` panel layout
- **`useDeferredWinCredit`** — credit balance after animations finish
- **`useOpenGameMenu`** — open the Originals rail menu on mount (Mines, Hilo, 4D Mines)
- **`gameRouteMap` / `withBase`** — link games from the shell nav

## Design system

UI shell and packaged betting panels come from `@joker/design-system` (GitHub dependency). Page modules compose those components.
