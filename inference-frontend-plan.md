# Inference Frontend Plan

Date: 2026-03-28 UTC
Host: `/home/ilyag`

## What is running now

Primary inference server:
- Runtime: `sglang` in Docker
- Image: `lmsysorg/sglang:latest`
- Launch mode: manual `docker run` from user `nmorgan`, not `systemd`
- Process evidence:
  - `docker run --gpus "device=0" --shm-size 32g -p 30000:30000 ... lmsysorg/sglang:latest python3 -m sglang.launch_server --model-path Qwen/Qwen3-8B --reasoning-parser qwen3 --host 0.0.0.0 --port 30000`
  - container process is visible under `docker-<id>.scope`
- API:
  - `http://127.0.0.1:30000/v1/models` responds successfully
  - model reported: `Qwen/Qwen3-8B`
  - port `30001` also responds with the same model metadata

Secondary inference service:
- Runtime: Hugging Face Text Embeddings Inference in Docker
- Launch mode: manual `docker run` from user `nmorgan`
- Exposed port: `4444`
- Model argument: `Alibaba-NLP/gte-Qwen2-1.5B-instruct`

Related gateway/auth:
- Kong/OpenResty is listening on `8443` and `8000`
- Both return `Unauthorized` without credentials

Relevant local files already present:
- `/home/ilyag/openwebui.env`
  - `OPENAI_API_BASE=http://ark-backend.internal:30000/v1`
  - `OPENAI_API_KEY=ark-placeholder-key`
- `/home/ilyag/arkos/docker-compose.yml`
  - contains an `sglang` service and a `tei` service, but it does not match live production exactly
- `/home/ilyag/arkos/model_module/run.sh`
- `/home/ilyag/arkos/model_module/run_tei.sh`

## Important production constraints

1. The live LLM service is not managed declaratively.
   It is running from a manual `docker run` invocation owned by `nmorgan`. That means frontend work must not assume `systemd`, Compose, or a reproducible deploy path already exists.

2. We should not modify or restart the live inference container during frontend work.
   The frontend must be deployed as a separate service with read-only dependency on the existing API.

3. There is configuration drift between local scaffolding and production.
   The checked-in Compose file defaults to `Qwen/Qwen2.5-7B-Instruct` and maps TEI to `8081`, while production is currently `Qwen/Qwen3-8B` and embeddings on `4444`.

4. Secrets are exposed in process arguments today.
   The live `docker run` command includes an `HF_TOKEN` in the process list. That should be corrected in a later hardening pass, but not as part of the first frontend rollout unless explicitly approved.

## Recommendation

Use a separate frontend deployment that targets the existing OpenAI-compatible `sglang` endpoint on `http://127.0.0.1:30000/v1`.

Fastest safe path:
- Start with Open WebUI, because there is already an `openwebui.env` file on this host and the backend already exposes a compatible `/v1` API.
- Put the frontend behind the existing gateway layer only after local validation.
- Keep inference traffic server-side. Do not call `:30000` directly from browser JavaScript.

Alternative:
- Build a custom frontend only if product requirements exceed what Open WebUI can provide. If that is the direction, still deploy a thin backend proxy on this host rather than exposing the inference server directly to browsers.

## Proposed implementation plan

### Phase 1: Confirm routing and ownership

Goal:
- Identify the intended public hostname and who owns the current Kong configuration.

Tasks:
- Confirm whether `ark-backend.internal` is only an internal alias or the expected upstream name for frontend traffic.
- Determine whether the new frontend should be exposed through Kong on `8443`, a new virtual host, or an internal-only port first.
- Confirm with the service owner whether `nmorgan`'s manually started containers are the accepted production source of truth for now.

Exit criteria:
- One documented frontend hostname or private URL for first access.
- One documented owner for gateway changes and inference service changes.

### Phase 2: Stand up a frontend without touching inference

Goal:
- Deploy the UI as an isolated service.

Recommended path:
- Run Open WebUI in its own container or service.
- Configure it with:
  - `OPENAI_API_BASE=http://127.0.0.1:30000/v1` if the UI shares the same host/network namespace, or the correct internal hostname if containerized separately
  - placeholder API key only if required by the UI client
  - authentication enabled
  - telemetry disabled

Tasks:
- Create a dedicated deployment definition for the frontend only.
- Do not fold the live `sglang` container into a new Compose stack during the first rollout.
- Bind the frontend to localhost or a private port first.
- Verify chat completions against `Qwen/Qwen3-8B`.

Exit criteria:
- A local operator can open the frontend and complete a successful prompt/response round trip without restarting `sglang`.

### Phase 3: Add a thin server-side proxy if needed

Goal:
- Prevent browser clients from coupling directly to raw inference endpoints.

Tasks:
- If Open WebUI is used as-is, validate that it already provides the required server-side mediation.
- If a custom frontend is built, add a small backend service that:
  - forwards requests to `http://127.0.0.1:30000/v1`
  - applies request timeouts
  - redacts internal errors
  - centralizes auth and rate limiting

Exit criteria:
- No browser code depends directly on the raw inference host/port.

### Phase 4: Production exposure through Kong

Goal:
- Expose the frontend safely.

Tasks:
- Add a dedicated route in Kong for the frontend.
- Keep the raw inference ports unadvertised externally.
- Reuse existing auth where appropriate, or add Basic Auth/SSO before public exposure.
- Validate TLS routing via `8443`.

Exit criteria:
- The frontend is reachable through the approved hostname and is protected by auth.

### Phase 5: Hardening and cleanup

Goal:
- Reduce operational risk after the first usable release.

Tasks:
- Move the manual `docker run` definitions into a reproducible deployment spec.
- Remove secrets from process arguments and store them in a safer mechanism.
- Align checked-in config with reality or clearly separate dev and prod values.
- Add health checks, logs, and restart policy documentation for the frontend.
- Document model names, ports, owners, and rollback steps.

Exit criteria:
- A second operator can understand and reproduce the deployment without reverse-engineering running processes.

## Concrete build order

1. Treat the current `sglang` instance on `:30000` as the fixed backend.
2. Reuse `/home/ilyag/openwebui.env` as the seed configuration, but point it at the correct reachable upstream for the frontend runtime.
3. Deploy the frontend on a private port first.
4. Validate prompt/response behavior and model listing.
5. Only then add public routing and auth at Kong.
6. Only after the frontend is stable, normalize the inference deployment itself.

## Risks to account for

- The live inference service is manually started and may not come back the same way after host reboot or operator intervention.
- `sglang:latest` is mutable; recreating that container later may not produce the same behavior.
- Port `30001` is exposed and should be understood before public rollout.
- The local repo in `/home/ilyag/arkos` should not be treated as an exact production manifest without reconciliation.

## Suggested next execution step

If we proceed, the next practical step is:
- create a frontend-only deployment in `/home/ilyag` that targets the existing `sglang` API on port `30000`
- validate it locally
- then wire it through Kong without changing the live model container
