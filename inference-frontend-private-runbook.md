# Inference Frontend Private Runbook

This document describes how to run and validate the custom ARKOS inference frontend privately before any gateway or public exposure work.

It is intended for the first custom-frontend rollout path, not the earlier Open WebUI path.

## Goal

Start the custom frontend as a separate runtime, point it at the existing inference API, and validate prompt and response behavior through the local proxy.

## Current Runtime Shape

The custom frontend currently consists of:

- a React frontend built by Vite
- a small Node/Express runtime in `server/index.js`
- a browser-facing query path under `/api/*`
- an upstream OpenAI-compatible inference dependency configured through `ARKOS_API_BASE`

In production mode, the Node runtime serves both:

- the built frontend assets from `dist/`
- the backend proxy routes such as `/api/health`, `/api/models`, and `/api/query`

## Preconditions

Before starting, confirm:

- Node.js and npm are installed for the target user
- the repo is checked out on the intended branch or commit
- the host can reach the intended inference API

## Required Environment Variables

The main runtime variables are:

- `ARKOS_API_BASE`
- `ARKOS_SERVER_PORT`
- `ARKOS_QUERY_TIMEOUT_MS`
- `ARKOS_MODEL` if explicit model selection is needed
- `NODE_ENV=production`

Typical first-pass values:

```bash
export NODE_ENV=production
export ARKOS_API_BASE=http://127.0.0.1:30000/v1
export ARKOS_SERVER_PORT=3001
export ARKOS_QUERY_TIMEOUT_MS=30000
```

If model auto-discovery does not work cleanly, also set:

```bash
export ARKOS_MODEL=Qwen/Qwen3-8B
```

Adjust that value to match the actual upstream model if needed.

## Private Start Path

The preferred private-start helper is:

```bash
bash scripts/run-private-inference-frontend.sh
```

That helper:

- runs `npm ci`
- builds the app
- checks upstream model API availability
- starts the production-mode runtime

You can override values inline, for example:

```bash
ARKOS_API_BASE=http://127.0.0.1:30000/v1 PORT=3001 bash scripts/run-private-inference-frontend.sh
```

## Manual Start Path

If you want to run the steps directly:

```bash
npm ci
npm run build
NODE_ENV=production \
ARKOS_API_BASE=http://127.0.0.1:30000/v1 \
ARKOS_SERVER_PORT=3001 \
ARKOS_QUERY_TIMEOUT_MS=30000 \
npm run api
```

## Validation Path

After the runtime is up, run:

```bash
bash scripts/validate-private-inference-frontend.sh
```

By default this checks:

- the frontend root
- `/api/health`
- `/api/models`
- `/api/query`

If the frontend is bound to a different base URL:

```bash
APP_BASE=http://127.0.0.1:3001 bash scripts/validate-private-inference-frontend.sh
```

## What Success Looks Like

Private validation is good enough to proceed when:

- the app starts without crashing
- `/api/health` reports `ok: true`
- `/api/models` returns the upstream model list
- `/api/query` returns a real model response
- the browser can load the app and submit a prompt successfully

## Stop And Restart

If the runtime is running in the foreground:

- stop with `Ctrl+C`

If it is managed by `systemd` later:

```bash
sudo systemctl restart arkos-frontend.service
sudo systemctl status arkos-frontend.service
```

## Known Limits Of This Phase

- this runbook covers private validation, not Kong exposure
- it assumes the existing inference backend is already running and reachable
- it does not normalize the live inference deployment itself
- it does not solve authentication or broader production hardening

## Recommended Next Step After Private Validation

Once private validation succeeds on the real host:

1. record the exact working env vars and host assumptions
2. update service or deployment definitions if needed
3. only then move to Kong or other gateway exposure
