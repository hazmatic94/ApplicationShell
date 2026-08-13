#!/usr/bin/env bash
set -euo pipefail

auth_url="https://x-access-token:${GITHUB_TOKEN}@github.com/"
git config --global url."${auth_url}".insteadOf "https://github.com/"
git config --global url."${auth_url}".insteadOf "ssh://git@github.com/"
git config --global url."${auth_url}".insteadOf "git@github.com:"
rm -rf node_modules/@joker/design-system
npm install
