#!/usr/bin/env bash

set -euo pipefail

APP_BASE="${APP_BASE:-http://127.0.0.1:3001}"
PROMPT="${PROMPT:-Reply with the single word READY.}"

require_cmd() {
  if ! command -v "$1" >/dev/null 2>&1; then
    echo "Required command not found: $1" >&2
    exit 1
  fi
}

echo_step() {
  printf '\n[%s] %s\n' "arkos" "$1"
}

require_cmd curl

echo_step "Checking frontend root"
curl --fail --silent --show-error -I "$APP_BASE" >/dev/null

echo_step "Checking proxy health"
curl --fail --silent --show-error "$APP_BASE/api/health"
printf '\n'

echo_step "Checking model listing"
curl --fail --silent --show-error "$APP_BASE/api/models"
printf '\n'

echo_step "Checking prompt-response flow"
curl --fail --silent --show-error \
  -X POST "$APP_BASE/api/query" \
  -H 'Content-Type: application/json' \
  -d "$(printf '{"prompt":"%s"}' "$PROMPT")"
printf '\n'

echo_step "Private validation completed"
