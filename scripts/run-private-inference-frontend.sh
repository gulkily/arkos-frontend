#!/usr/bin/env bash

set -euo pipefail

HOST="${HOST:-127.0.0.1}"
PORT="${PORT:-3001}"
API_BASE="${ARKOS_API_BASE:-http://127.0.0.1:30000/v1}"
TIMEOUT_MS="${ARKOS_QUERY_TIMEOUT_MS:-30000}"

require_cmd() {
  if ! command -v "$1" >/dev/null 2>&1; then
    echo "Required command not found: $1" >&2
    exit 1
  fi
}

echo_step() {
  printf '\n[%s] %s\n' "arkos" "$1"
}

require_cmd node
require_cmd npm
require_cmd curl

echo_step "Node: $(node --version)"
echo_step "npm: $(npm --version)"
echo_step "Using upstream API: $API_BASE"

echo_step "Installing dependencies with npm ci"
npm ci

echo_step "Building production assets"
npm run build

echo_step "Checking upstream model API availability"
curl --fail --silent "$API_BASE/models" >/dev/null

echo_step "Starting private frontend runtime on http://$HOST:$PORT"
echo "Press Ctrl+C to stop."

export NODE_ENV=production
export ARKOS_API_BASE="$API_BASE"
export ARKOS_SERVER_PORT="$PORT"
export ARKOS_QUERY_TIMEOUT_MS="$TIMEOUT_MS"

exec npm run api
