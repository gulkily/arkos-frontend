# Server Runbook

This document explains how to install and run the ARKOS frontend on a server:

1. manually as your user for initial validation
2. as a `systemd` service for a more durable setup

These instructions assume the repo is available on the server and Node.js plus npm are already installed.

## Intended Use Of This Document

This runbook is intentionally generic. The preferred deployment workflow is:

1. use this document as the initial operating guide
2. run Codex on the actual target server
3. let Codex inspect the live environment and tailor the final commands, paths, ports, service definitions, and gateway integration based on what is really present there

That is the safer path because the production server may already have:

- an existing Node.js installation pattern
- a preferred application directory
- existing reverse proxy or Kong routing
- a service naming convention
- firewall rules
- a non-default `systemd` environment
- another static file server that is a better fit than Vite preview

This document should therefore be treated as a starting point, not the final environment-specific deployment spec.

## What Codex Should Verify On The Server

When Codex runs on the actual server, it should inspect and confirm at least the following before finalizing deployment steps:

- current hostname and intended access path
- current user account and preferred deploy directory
- whether the repo already exists on disk
- current git branch and remote state
- installed Node.js and npm versions
- exact `npm` binary path for service use
- whether `systemd` is available and used for app services
- whether another service manager is preferred
- whether port `4173` is free or if another local port is more appropriate
- whether Kong or another gateway should route to this frontend
- whether the frontend should bind to `127.0.0.1` only
- whether an existing web server should serve `dist/` instead of using `npm run preview`
- which branch, tag, or commit should be deployed

## Preferred Outcome Of A Codex-On-Server Pass

After inspecting the live server, Codex should update this document or create a server-specific deployment note that includes:

- the exact repo path
- the exact service user
- the exact branch or commit to deploy
- the exact install and build commands used
- the exact runtime command used
- the exact service file contents, if `systemd` is used
- the exact port binding and exposure model
- the exact validation commands used after deployment
- any production-specific caveats discovered during inspection

## Current App Behavior

- the frontend is a React app built with Vite
- local development entrypoint: `npm start`
- production build command: `npm run build`
- static preview command: `npm run preview`

For server use, prefer building the app and serving the built files through Vite preview or a dedicated static web server. Do not use `npm start` as the long-running production process.

## Install As Your User

Use this first so you can validate the app before creating a service.

### 1. Get the code onto the server

If the repo is not already present:

```bash
git clone https://github.com/gulkily/arkos-frontend.git
cd arkos-frontend
```

If the repo already exists:

```bash
cd /path/to/arkos-frontend
git fetch origin
git checkout feat/react-poc-shell
git pull --ff-only origin feat/react-poc-shell
```

If you plan to run from `main` later, replace the branch name accordingly.

### 2. Install dependencies

```bash
npm install
```

### 3. Build the app

```bash
npm run build
```

This creates the production assets in `dist/`.

### 4. Run a local preview server

```bash
npm run preview -- --host 127.0.0.1 --port 4173
```

If you want it reachable from other machines on the network:

```bash
npm run preview -- --host 0.0.0.0 --port 4173
```

### 5. Validate it

From the same server:

```bash
curl -I http://127.0.0.1:4173
```

From another machine, if you used `0.0.0.0`, open:

```text
http://server-ip:4173
```

### 6. Stop it

If you started it in the foreground, use `Ctrl+C`.

If you want to leave it running temporarily in your shell session:

```bash
nohup npm run preview -- --host 127.0.0.1 --port 4173 > preview.log 2>&1 &
```

That is acceptable for quick validation, but not for long-term operation.

## Install As A Service

Use this after the manual run works.

These steps assume:

- repo path: `/home/your-user/arkos-frontend`
- service user: `your-user`
- listen port: `4173`

Adjust those values if your layout is different.

### 1. Build the app as the service user

```bash
cd /home/your-user/arkos-frontend
npm install
npm run build
```

### 2. Create a systemd unit

Create:

`/etc/systemd/system/arkos-frontend.service`

with:

```ini
[Unit]
Description=ARKOS Frontend
After=network.target

[Service]
Type=simple
User=your-user
Group=your-user
WorkingDirectory=/home/your-user/arkos-frontend
ExecStart=/usr/bin/npm run preview -- --host 127.0.0.1 --port 4173
Restart=on-failure
RestartSec=5
Environment=NODE_ENV=production

[Install]
WantedBy=multi-user.target
```

If `npm` is not at `/usr/bin/npm`, check it with:

```bash
which npm
```

and update `ExecStart` accordingly.

### 3. Reload systemd and start the service

```bash
sudo systemctl daemon-reload
sudo systemctl enable --now arkos-frontend.service
```

### 4. Check service status

```bash
sudo systemctl status arkos-frontend.service
```

### 5. Check logs

```bash
journalctl -u arkos-frontend.service -f
```

### 6. Validate the service

```bash
curl -I http://127.0.0.1:4173
```

## Updating The Service

When new code is deployed:

```bash
cd /home/your-user/arkos-frontend
git fetch origin
git checkout <branch-or-tag>
git pull --ff-only origin <branch-or-tag>
npm install
npm run build
sudo systemctl restart arkos-frontend.service
```

Then confirm:

```bash
sudo systemctl status arkos-frontend.service
curl -I http://127.0.0.1:4173
```

## Recommended Deployment Shape

For the current PoC:

- run the frontend on `127.0.0.1:4173`
- keep it private first
- put Kong or another gateway in front of it later if needed

That matches the earlier findings that Kong already exists on the server and should be treated as separate infrastructure rather than part of the initial frontend bootstrap.

## Notes And Caveats

- `npm start` is the development server and is appropriate for local development, not service deployment
- `npm run preview` is sufficient for a proof of concept, but a dedicated static file server is a better long-term production choice
- if Node.js is missing on the server, install an LTS version before attempting these steps
- if the server uses a firewall, ensure the chosen port is only exposed intentionally
