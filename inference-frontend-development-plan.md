# Inference Frontend Development Plan

This document expands on `inference-frontend-plan.md` and turns it into a development-oriented execution plan for standing up an inference-facing frontend without disrupting the live model service.

## Objective

Create the first usable inference frontend deployment for ARKOS by introducing a separate frontend service that can talk to the existing OpenAI-compatible inference API, validate prompt and response flow locally, and then be exposed safely through the existing gateway layer.

The priority of this phase is safe deployment and operational clarity, not broad product scope.

## Working Assumptions

- the live `sglang` inference container on port `30000` is the current source of truth
- the frontend must be deployed separately from the live inference container
- the initial rollout should not restart, recompose, or otherwise modify the running model service
- Kong already exists and can be used later for controlled exposure
- there is already evidence of Open WebUI-oriented configuration on the host
- the fastest acceptable path is the one that proves frontend access without creating unnecessary platform churn

## Success Criteria

This phase is successful when:

- a separate frontend service is running on the host
- the frontend can successfully query the existing inference backend
- the live model container remains untouched during frontend rollout
- the frontend is first validated on a private or localhost-bound port
- the deployment path is documented well enough for a second operator to follow

## Non-Goals

Do not include the following in this phase unless explicitly required:

- rebuilding or replacing the live inference container
- converting the current model runtime into Compose or `systemd`
- changing the model selection or embeddings stack
- hardening every exposed secret immediately
- broad frontend product redesign beyond what is needed for a usable inference UI
- public exposure before private validation succeeds

## Recommended Technical Direction

Treat the inference service as a fixed dependency and build the frontend around it as a separate runtime.

The default recommendation remains:

- prefer a frontend that can already speak the OpenAI-compatible backend with minimal glue
- keep inference traffic server-side
- avoid direct browser dependency on `:30000`
- postpone gateway exposure until the local validation path is stable

If Open WebUI satisfies the immediate need, use it for the first deployment pass. If product requirements require a custom frontend, still preserve the same operational principle: a thin mediation layer between the browser and the raw inference port.

## Operational Direction

The rollout should be staged:

- private first
- public later
- deployment isolation first
- runtime normalization later

This matters because the live inference service is manually managed and not yet represented by a clean, authoritative deployment spec.

## Implementation Phases

### Phase 1: Confirm deployment ownership and routing assumptions

Goal:
- remove ambiguity before any service is introduced

Tasks:
- confirm the intended first-access path for the frontend
- identify who owns Kong configuration changes
- confirm whether `ark-backend.internal` is an internal alias only or part of the intended frontend routing story
- confirm whether the manually started inference containers are the accepted production baseline for now

Exit criteria:
- one documented owner for gateway-related changes
- one documented private or public access path for the first validation pass

### Phase 2: Prepare a frontend-only runtime

Goal:
- create a frontend deployment path that does not disturb inference

Tasks:
- choose the initial frontend runtime, preferably the fastest compatible option
- create a frontend-only deployment definition or launch path
- configure the frontend to target the existing inference API through the correct local or internal address
- bind the frontend to localhost or another private address first

Exit criteria:
- the frontend can start independently of the model container
- the frontend is not coupled to a new inference deployment path

### Phase 3: Validate prompt and response flow locally

Goal:
- prove the frontend actually works against the real model backend

Tasks:
- confirm model listing works against the live API
- confirm a prompt can be submitted successfully
- confirm the response is rendered correctly in the frontend
- confirm the frontend path does not require restarting `sglang`
- document any runtime flags, env vars, or host assumptions needed for this to work

Exit criteria:
- a local operator can complete a successful prompt and response round trip through the frontend

### Phase 4: Add mediation or proxy behavior if required

Goal:
- avoid long-term direct browser coupling to the raw inference endpoint

Tasks:
- validate whether the chosen frontend already mediates inference traffic server-side
- if not, introduce a thin proxy layer
- ensure request timeouts are applied
- ensure internal errors are not surfaced directly to browser clients
- keep auth and rate-limiting hooks centralized if that layer is introduced

Exit criteria:
- browser clients do not depend directly on the raw inference host and port

### Phase 5: Expose the frontend through Kong

Goal:
- make the validated frontend reachable through the approved gateway path

Tasks:
- add a dedicated Kong route for the frontend
- keep raw inference ports unadvertised externally
- attach existing auth or a minimal protective layer before wider exposure
- validate routing through `8443`

Exit criteria:
- the frontend is reachable through the intended gateway path and protected appropriately

### Phase 6: Capture the deployment as an operator-ready workflow

Goal:
- reduce the risk that only one person can operate the rollout

Tasks:
- document the exact frontend runtime path
- document how to start, stop, and validate it
- document model endpoint assumptions
- document rollback expectations
- document the known drift between checked-in config and live production

Exit criteria:
- another operator can understand and reproduce the frontend rollout without reverse-engineering the host

## Atomic Development Breakdown

This is the likely order of actual execution work:

1. confirm ownership and routing assumptions
2. choose the frontend runtime
3. stand it up privately on the host
4. point it at the existing `sglang` endpoint
5. validate model listing and prompt-response behavior
6. add a server-side mediation layer if the frontend does not already provide one
7. document the working runtime path
8. only then wire Kong exposure

## Risks and Tradeoffs

- If frontend rollout is tied too early to inference deployment cleanup, progress will slow and risk will rise.
- If the frontend is exposed publicly before private validation, operational debugging will become noisier and harder.
- If the raw inference endpoint is exposed directly to browsers, later hardening work will be more painful.
- If checked-in config is treated as authoritative without reconciling it to production, operators may deploy the wrong model or ports.
- If mutable images such as `sglang:latest` are recreated casually, behavior may drift unexpectedly.

## Recommended Next Deliverable After This Document

After this plan, the next artifact should be an `inference-frontend-implementation-checklist.md` that:

- locks the initial frontend runtime choice
- records the branch and commit workflow for implementation
- defines exact validation steps
- defines exact rollout steps for the private-first deployment
- provides phase-by-phase checkboxes that can be marked complete during execution
