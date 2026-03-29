# Local Test Instance Plan

This file is a starting point for running the current frontend as user `ilyag` in an interactive shell before turning it into a fuller installation.

It is based on branch `feat/react-poc-shell`.

## Repo Review Summary

- this branch contains a Vite + React proof of concept
- the app renders a static `DeskScene` shell and currently passes an empty `notifications` array
- there is no backend integration, auth flow, routing, or environment-variable contract yet
- there are no automated tests in the repo today
- the existing `SERVER-RUNBOOK.md` is useful, but it is server-oriented; this file is narrower and aimed at a first local shell run under the current user

## Goal

Run a disposable test instance from your shell as `ilyag` so you can confirm:

- dependencies install cleanly
- the branch builds
- the app serves locally
- the current placeholder UI is reachable in a browser

## Assumptions

- working directory: `/home/ilyag/arkos-frontend`
- branch to validate: `feat/react-poc-shell`
- user account: `ilyag`
- Node.js and npm are already installed for this user
- local validation port: `4173`
- initial binding should stay private on `127.0.0.1`

## Recommended First-Pass Commands

Run these in order from your shell:

```bash
cd /home/ilyag/arkos-frontend
git switch feat/react-poc-shell
git pull --ff-only origin feat/react-poc-shell
node --version
npm --version
npm install
npm run build
npm run preview -- --host 127.0.0.1 --port 4173
```

Then validate from a second shell:

```bash
curl -I http://127.0.0.1:4173
```

Open the app locally at:

```text
http://127.0.0.1:4173
```

Stop the test instance with `Ctrl+C`.

## If You Want It To Stay Up Briefly

For a temporary background process in the current user account:

```bash
cd /home/ilyag/arkos-frontend
nohup npm run preview -- --host 127.0.0.1 --port 4173 > preview.log 2>&1 &
```

Check it:

```bash
tail -f /home/ilyag/arkos-frontend/preview.log
curl -I http://127.0.0.1:4173
```

Stop it later with:

```bash
pkill -f "vite preview --host 127.0.0.1 --port 4173"
```

## What Success Looks Like

The test run is good enough to proceed if:

- `npm install` completes without dependency errors
- `npm run build` creates `dist/`
- `npm run preview` stays up without immediate crash
- `curl -I http://127.0.0.1:4173` returns an HTTP success status
- the browser shows the desk-scene shell with the `0 notifications loaded` status line

## Immediate Gaps Before Treating This As An Install

These are the main repo-level gaps I found during review:

1. There is no automated test suite yet, so `build` is the only meaningful non-UI verification step.
2. There is no environment-specific configuration model yet, which is fine for the current PoC but not enough for a production install.
3. The runtime path is still `vite preview`, which is acceptable for validation but should be reconsidered for long-lived deployment.
4. There is no service definition tied to this branch yet; `SERVER-RUNBOOK.md` provides the next step once the manual run works.

## Recommended Next Step After The Manual Run

If the shell run succeeds, the next practical move is:

1. confirm the exact target host and deploy path
2. decide whether this should remain a user-run preview or become a `systemd` service
3. create a server-specific install note derived from `SERVER-RUNBOOK.md`
4. only then wire gateway or reverse-proxy access if external reachability is needed

## Failure Triage

If the first pass fails, start here:

- `node: command not found` or `npm: command not found`: install Node.js for `ilyag` first
- `npm install` fails: resolve dependency or network access issues before proceeding
- `npm run build` fails: treat that as a code or toolchain issue on this branch
- `port 4173 already in use`: switch to another local port, for example `4174`
- preview runs but browser is blank: inspect the browser console and `preview.log`

## Notes

- for active development, `npm start` is the normal dev server command
- for this validation pass, `npm run preview` is the better fit because it exercises the built output
- keep the first test instance bound to `127.0.0.1` unless you explicitly need network exposure
