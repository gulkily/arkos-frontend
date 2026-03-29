#!/usr/bin/env bash

set -euo pipefail

REPO_DIR="/home/ilyag/arkos-frontend"
DEFAULT_BRANCH="feat/react-poc-shell"
HOST="${HOST:-127.0.0.1}"
PORT="${PORT:-4173}"
SYNC_BRANCH="${SYNC_BRANCH:-0}"

require_cmd() {
  if ! command -v "$1" >/dev/null 2>&1; then
    echo "Required command not found: $1" >&2
    exit 1
  fi
}

echo_step() {
  printf '\n[%s] %s\n' "arkos" "$1"
}

require_cmd git
require_cmd node
require_cmd npm

cd "$REPO_DIR"

echo_step "Repository: $REPO_DIR"
echo_step "Node: $(node --version)"
echo_step "npm: $(npm --version)"

current_branch="$(git rev-parse --abbrev-ref HEAD)"
if [[ "$current_branch" != "$DEFAULT_BRANCH" ]]; then
  echo_step "Switching to $DEFAULT_BRANCH"
  git switch "$DEFAULT_BRANCH"
fi

if [[ "$SYNC_BRANCH" == "1" ]]; then
  echo_step "Updating branch from origin/$DEFAULT_BRANCH"
  git pull --ff-only origin "$DEFAULT_BRANCH"
fi

echo_step "Installing dependencies with npm ci"
npm ci

echo_step "Building production assets"
npm run build

echo_step "Starting preview server on http://$HOST:$PORT"
echo "Press Ctrl+C to stop."

exec npm run preview -- --host "$HOST" --port "$PORT"
