# Inference Frontend Implementation Checklist

This document translates `inference-frontend-development-plan.md` into a concrete execution checklist for the first inference-frontend rollout.

## Implementation Goal

Stand up a separate inference frontend that:

- runs independently of the live model container
- can query the existing OpenAI-compatible backend on port `30000`
- is validated privately before any public exposure
- is documented well enough to operate and troubleshoot

## Locked Decisions For This Phase

- treat the current `sglang` container on `:30000` as a fixed backend dependency
- do not restart or recompose the live inference container during this rollout
- deploy the frontend as a separate service
- validate on a private or localhost-bound port first
- keep inference traffic server-side
- defer broad production hardening work that is not required for first successful use

## Execution Workflow

- implement this checklist work on a dedicated branch rather than directly on `main`
- complete one phase at a time in order
- update this checklist document after each phase to mark that phase complete
- make a commit after each phase is finished so progress is easy to review and recover
- keep commit scope aligned with the phase boundaries in this document

## Deployment Shape For The First Pass

Use a minimal rollout shape:

- one frontend runtime
- one known upstream inference API
- one private validation path
- one documented operator flow

Avoid introducing additional moving parts unless the chosen frontend runtime requires them.

## Build Sequence

### Phase 1: Confirm ownership and access assumptions

Checklist:

- identify the owner of Kong or gateway changes
- identify the intended first-access path for the frontend
- confirm whether `ark-backend.internal` is only internal or part of the expected runtime path
- confirm the live manually started inference container is the accepted baseline for now

Completion check:

- one owner and one first-access path are documented

### Phase 2: Lock the initial frontend runtime choice [completed]

Checklist:

- choose the fastest acceptable frontend runtime for the first rollout
- record why that runtime was chosen
- confirm the runtime can target an OpenAI-compatible backend
- confirm whether it already mediates requests server-side

Completion check:

- one concrete frontend runtime is selected and documented

### Phase 3: Create the frontend-only runtime path [completed]

Checklist:

- create a deployment definition or launch command for the frontend only
- configure it to target the existing inference API
- bind it to localhost or a private port first
- ensure it can start without changing the inference container

Completion check:

- the frontend starts independently on the host

### Phase 4: Validate prompt and response behavior privately

Checklist:

- confirm model listing works
- confirm a prompt can be submitted
- confirm the model returns a response
- confirm the response is rendered correctly in the frontend
- confirm the live `sglang` container did not need restart or modification

Completion check:

- a local operator can complete a prompt and response round trip

### Phase 5: Add mediation if required [completed]

Checklist:

- determine whether the chosen frontend already prevents direct browser access to raw inference ports
- if not, add a thin proxy or mediation layer
- apply request timeouts
- ensure internal errors are not exposed directly to browser clients
- keep the added layer minimal

Completion check:

- browser clients do not depend directly on the raw inference endpoint

### Phase 6: Document the working private runtime

Checklist:

- document the exact start command or deployment definition
- document the exact upstream API base used
- document validation commands
- document stop and restart steps
- document any host-specific assumptions discovered during rollout

Completion check:

- another operator can repeat the private validation path

### Phase 7: Expose through Kong only after private validation

Checklist:

- add the frontend route in Kong or the approved gateway layer
- keep raw inference ports unadvertised externally
- attach existing auth or a minimum protective layer
- validate TLS or approved external routing behavior

Completion check:

- the frontend is reachable through the intended gateway path

### Phase 8: Capture residual risks and cleanup needs

Checklist:

- record config drift between checked-in files and production
- record any secrets exposure concerns still present
- record whether the frontend runtime path is durable enough for continued use
- record what still needs follow-up after the first rollout

Completion check:

- the first rollout is documented with known gaps instead of leaving them implicit

## Exact Execution Order

Work in this order:

1. confirm routing and ownership assumptions
2. choose the frontend runtime
3. stand it up privately
4. point it at the current `sglang` API
5. validate prompt and response flow
6. add mediation only if needed
7. document the private working path
8. only then expose it through Kong
9. record residual risks and follow-up items

## Acceptance Notes

Interpret the rollout goal conservatively:

- “frontend deployment” means a separately operated runtime, not a rebuild of the live inference container
- “working against inference” means successful prompt and response behavior against the real backend
- “private validation” means localhost or otherwise controlled access before public routing
- “gateway exposure” should happen only after the private path is proven

## Out-of-Scope Guardrails

Do not add these during the first rollout unless a blocker forces it:

- inference container replacement
- model changes
- full platform rearchitecture
- wide secret-management cleanup
- public exposure before private validation
- unrelated frontend feature work

## Definition Of Done For This Implementation Pass

This phase is done when:

- a separate frontend runtime is running
- it can query the existing inference backend successfully
- it was validated privately first
- it can be routed safely through the approved gateway path if required
- the operator workflow is documented
- the live inference container was not disturbed during rollout

## Recommended Next Step After This Checklist

Begin execution from this checklist. If the chosen frontend runtime is still undecided, resolve that first and then continue phase by phase without broadening scope.
