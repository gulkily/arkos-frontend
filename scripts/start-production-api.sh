#!/usr/bin/env bash

set -euo pipefail

if [[ -n "${NVM_DIR:-}" && -s "$NVM_DIR/nvm.sh" ]]; then
  # Load nvm if the service environment provides it.
  # This keeps the runtime compatible with nvm-managed Node installs.
  # shellcheck disable=SC1090
  . "$NVM_DIR/nvm.sh"
fi

if ! command -v npm >/dev/null 2>&1; then
  echo "npm not found in PATH. Set PATH or NVM_DIR for the service user." >&2
  exit 1
fi

exec npm run api
