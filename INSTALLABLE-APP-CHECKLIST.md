# Installable App Checklist

This checklist describes what is still needed to move the current `feat/react-poc-shell` branch from a local PoC into something that can reasonably be installed, operated, and updated.

## 1. Baseline Runtime Contract

- [ ] Declare the supported Node.js and npm versions in `package.json`
- [ ] Add an `.nvmrc` or equivalent version pin for local and server consistency
- [ ] Decide whether install steps should standardize on `npm ci` instead of `npm install`
- [ ] Document the canonical branch, tag, or release flow for installs

## 2. Application Configuration

- [ ] Define whether the app has any runtime configuration needs
- [ ] If configuration is needed, introduce a documented `.env` contract
- [ ] Add an `.env.example` file for required variables
- [ ] Decide which values are build-time only versus environment-specific

## 3. Verification And Quality Gates

- [ ] Add at least one automated test command, even if minimal
- [ ] Add a lint command
- [ ] Add a CI-safe verification path such as `npm run check` or `npm test`
- [ ] Ensure `npm run build` is part of the required validation path
- [ ] Decide what must pass before an install is considered valid

## 4. Packaging And Repo Hygiene

- [ ] Add a real `README` with install, run, and update instructions
- [ ] Keep `SERVER-RUNBOOK.md` aligned with the actual deployment approach
- [ ] Decide where install helper scripts should live, for example `scripts/`
- [ ] Confirm `.gitignore` covers generated runtime artifacts such as logs and `dist/`

## 5. Runtime Mode Decision

- [ ] Decide whether long-lived installs will use `vite preview` or a dedicated static file server
- [ ] If staying with Vite only for validation, state that clearly in docs
- [ ] Choose the default host binding and port policy
- [ ] Decide whether the app should be private behind `127.0.0.1` or externally reachable

## 6. Service Management

- [ ] Add a documented `systemd` unit or equivalent service definition for durable installs
- [ ] Confirm the correct `ExecStart` path for npm on the target host
- [ ] Define restart behavior and logging expectations
- [ ] Document the stop, restart, and log-inspection commands

## 7. Delivery And Update Workflow

- [ ] Define how the repo gets onto the target machine
- [ ] Define the exact install/update sequence for the chosen branch or release
- [ ] Decide whether updates are manual, scripted, or service-managed
- [ ] Document rollback expectations if a new build fails

## 8. Access And Exposure

- [ ] Decide whether a reverse proxy or gateway is required
- [ ] If external access is needed, document the final browser URL shape
- [ ] Confirm firewall and port exposure expectations on the target host
- [ ] Decide whether TLS termination happens outside this app

## 9. Observability And Operations

- [ ] Decide what logs are required for first-line troubleshooting
- [ ] Add a basic health-check verification step
- [ ] Document how to confirm that the served app matches the expected branch or build
- [ ] Document the most likely failure modes and their first response steps

## 10. Current Branch-Specific Gaps

- [ ] Replace the placeholder-only UI status with real application behavior when available
- [ ] Introduce the next functional slice beyond the static shell
- [ ] Add a clearer distinction between development mode and installable runtime mode
- [ ] Revisit whether this branch should become the install target or remain a PoC branch

## Minimum Practical Threshold

Before calling this repo "installable," the minimum practical bar should be:

- [ ] pinned Node.js expectation
- [ ] documented install and update steps
- [ ] reproducible dependency install path
- [ ] successful production build
- [ ] browser-reachable local preview path
- [ ] at least one automated verification command
- [ ] a durable runtime approach for the target host
