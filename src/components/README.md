# Legacy components (unused)

This folder predates the current architecture. GameShell now uses:

- **`@joker/design-system`** — `GameShell`, betting panels, game tiles, etc.
- **`src/pages/<game>/`** — per-game pages and play-area UI

No file under `src/` imports from `src/components/`. Safe to ignore when working on games.

If you need shell or betting primitives, check the design-system package first. These local copies are not kept in sync and may be removed in a future cleanup.
