#!/usr/bin/env bash
set -euo pipefail

if [ -z "${GITHUB_TOKEN:-}" ]; then
  echo "GITHUB_TOKEN is required to install the private @joker/design-system package." >&2
  exit 1
fi

auth_url="https://x-access-token:${GITHUB_TOKEN}@github.com/"
git config --global url."${auth_url}".insteadOf "https://github.com/"
rm -rf node_modules/@joker/design-system
npm install
