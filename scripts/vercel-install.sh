#!/usr/bin/env bash
set -euo pipefail

git config --global url."https://x-access-token:${GITHUB_TOKEN}@github.com/".insteadOf "https://github.com/"
git config --global url."https://x-access-token:${GITHUB_TOKEN}@github.com/".insteadOf "git@github.com:"
rm -rf node_modules/@joker/design-system
npm install
