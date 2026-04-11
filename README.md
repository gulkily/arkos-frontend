# ARKOS Frontend

ARKOS Frontend is a small React + Vite app with an Express proxy for querying an OpenAI-compatible inference API. It provides a focused prompt-and-response UI, while the server handles model discovery and forwards requests to the upstream backend.

## What It Does

- Renders a single-page prompt workspace with a custom "desk scene" layout
- Sends prompts from the browser to a local `/api/query` endpoint
- Resolves an upstream model automatically from `/models` unless `ARKOS_MODEL` is set
- Forwards chat requests to an OpenAI-style `/chat/completions` API
- Can run as a two-process local dev setup or as a single production-style Node server

## Tech Stack

- React 18
- Vite 5
- Express 4
- Plain CSS
- Native `fetch` on both the client and server

## Project Structure

```text
.
├── src/
│   ├── main.jsx                  # React entrypoint
│   ├── App.jsx                   # Root app composition
│   ├── styles.css                # Global styles
│   └── components/
│       ├── DeskScene.jsx         # Visual shell/layout
│       ├── ModelQueryPanel.jsx   # Prompt and response UI
│       └── NotificationPopup.jsx # Notification overlay component
├── server/
│   └── index.js                  # Express proxy and production server
├── scripts/                      # Local/private run helpers
└── .env.example                  # Runtime configuration examples
```

## Requirements

- Node.js 18+ recommended
- npm
- Access to an OpenAI-compatible inference API that exposes:
  - `GET /models`
  - `POST /chat/completions`

## Environment Variables

Copy `.env.example` into your shell environment or an `.env` workflow of your choice.

| Variable | Default | Purpose |
| --- | --- | --- |
| `ARKOS_API_BASE` | `http://127.0.0.1:30000/v1` | Base URL of the upstream inference API |
| `ARKOS_MODEL` | unset | Optional explicit model ID; if omitted, the server uses the first model returned by `/models` |
| `ARKOS_SERVER_PORT` | `3001` | Port for the Express server |
| `ARKOS_QUERY_TIMEOUT_MS` | `30000` | Timeout used for upstream model lookup and query requests |
| `NODE_ENV` | unset | Set to `production` when serving the built frontend from Express |

## Getting Started

### Install

```bash
npm install
```

### Run In Development

```bash
npm start
```

This starts:

- Vite on `http://127.0.0.1:4173`
- Express on `http://127.0.0.1:3001`

During development, Vite proxies `/api/*` requests to the Express server, so the browser can call `/api/query` without hardcoding a backend URL.

### Run In Production Style

Build the frontend and start the Express server in production mode:

```bash
npm run build
NODE_ENV=production npm run api
```

In this mode, Express serves both:

- the built frontend from `dist/`
- the API routes under `/api/*`

By default the production-style app listens on `http://127.0.0.1:3001`.

### Preview The Built Frontend Only

```bash
npm run build
npm run preview
```

This uses Vite's preview server and is useful for static frontend checks. It does not replace the Express proxy if you need live `/api/query` behavior unless you run the API separately.

## Available Scripts

| Command | Description |
| --- | --- |
| `npm start` | Runs the Express API and Vite dev server together |
| `npm run api` | Starts the Express server only |
| `npm run build` | Builds the frontend into `dist/` |
| `npm run preview` | Serves the built frontend with Vite preview |

## API Routes

The Express runtime exposes:

| Route | Method | Purpose |
| --- | --- | --- |
| `/api/health` | `GET` | Returns a basic health payload including the configured `apiBase` |
| `/api/models` | `GET` | Returns the upstream model list |
| `/api/query` | `POST` | Accepts `{ "prompt": "..." }` and returns `{ model, output }` |

Example request:

```bash
curl -X POST http://127.0.0.1:3001/api/query \
  -H "Content-Type: application/json" \
  -d '{"prompt":"Give me a short summary of the current ARKOS frontend state."}'
```

## How The Query Flow Works

1. The browser submits a prompt from `ModelQueryPanel`.
2. The frontend sends `POST /api/query` to the local Express server.
3. The server picks `ARKOS_MODEL` or auto-discovers the first available model from `GET /models`.
4. The server forwards the prompt to `POST /chat/completions` on `ARKOS_API_BASE`.
5. The server returns the selected model ID and response text to the frontend.

## Helper Docs And Scripts

The repo also includes project-specific runbooks and helper scripts:

- `SERVER-RUNBOOK.md` for generic server deployment guidance
- `inference-frontend-private-runbook.md` for private rollout and validation
- `scripts/run-local-test-instance.sh` for a build-and-run local helper

## Current Limits

- The UI is currently a single-page prompt workspace with no routing or authentication
- There is no automated test suite configured in `package.json`
- `NotificationPopup` currently uses mock data in the local app and is not wired to real-time backend events

## License

No license file is currently present in this repository.
