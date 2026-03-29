# Model Query Phase Plan

This document defines the next phase of ARKOS frontend work after the current React shell proof of concept. The goal of this phase is to turn the placeholder UI into a minimal, usable interface for querying the model and displaying responses.

## Objective

Add the smallest practical end-to-end query flow that allows a user to:

- enter a prompt
- send that prompt to a backend API
- receive a model response
- see the response rendered in the frontend

This phase should prove that the frontend can talk to the existing inference stack without overcommitting to a full product UI.

## Scope

In scope:

- prompt input UI
- submit action
- backend API call from the frontend
- loading state
- error state
- response rendering
- basic request configuration for the current model endpoint

Out of scope:

- authentication
- routing
- streaming responses unless trivially supported
- conversation history persistence
- rich chat UX
- notification feature work
- production hardening beyond what is needed for a functional demo

## Key Constraints From Existing Findings

- frontend work should remain separate from the live inference deployment
- browser code should not be tightly coupled to raw internal inference ports long term
- the existing inference service appears to expose an OpenAI-compatible API on port `30000`
- Kong already exists, but should not block initial local or private validation

## Recommended Technical Direction

Build a thin server-side proxy for model requests rather than calling the raw inference endpoint directly from browser code.

Reasoning:

- it avoids baking internal host and port details into the browser
- it gives one place to later add auth, timeouts, redaction, and rate limits
- it aligns with the earlier findings document recommendation to keep inference traffic server-side

For this phase, the proxy can be minimal. It only needs to forward one prompt request shape and return one response shape the frontend can render.

## Proposed Architecture

### Frontend

Add a simple query panel to the current app shell:

- prompt text area
- submit button
- loading indicator
- response panel
- error message area

This can live alongside or layered over the current `DeskScene` so the existing visual shell remains useful.

### Backend

Add a small local backend service or route layer that:

- accepts prompt requests from the frontend
- forwards them to the existing model API
- returns normalized JSON to the frontend
- applies a request timeout
- hides raw backend error details from the browser

The backend can be lightweight. It does not need to solve long-term architecture in this phase.

## Suggested API Shape

Frontend to local backend:

- `POST /api/query`

Request body:

```json
{
  "prompt": "Explain the current system status."
}
```

Response body:

```json
{
  "output": "Model response text here."
}
```

Error body:

```json
{
  "error": "Request failed."
}
```

Keep this interface narrow until a second use case forces expansion.

## Execution Workflow

- implement this phase on a dedicated branch rather than directly on `main`
- complete one phase at a time in order
- update this plan or its follow-on checklist after each phase to mark that phase complete
- make a commit after each phase is finished so progress is easy to review and recover
- keep commit scope aligned with the phase boundaries in this document

## Implementation Phases

### Phase 1: Confirm backend call strategy

Goal:
- lock the request path before UI work expands

Tasks:

- decide whether the proxy lives inside the same app runtime or as a small adjacent service
- confirm the upstream inference URL to target in the current environment
- confirm the exact request format expected by the model API
- confirm whether a non-secret placeholder API key is required for the upstream call

Exit criteria:

- one documented frontend-to-backend request path
- one documented backend-to-model request format

### Phase 2: Add the backend query endpoint

Goal:
- provide a single safe API the frontend can call

Tasks:

- implement `POST /api/query`
- map frontend prompt input to the upstream model request
- parse the upstream response into a simplified `output` field
- add timeout handling
- add minimal error handling

Exit criteria:

- local API requests return model output or a clean error payload

### Phase 3: Add the query UI

Goal:
- allow a user to submit a prompt from the frontend

Tasks:

- add prompt input state
- add submit button
- disable repeated submissions while a request is in flight
- show loading state during the request

Exit criteria:

- a user can enter and submit a prompt from the UI

### Phase 4: Render model responses

Goal:
- make the round trip visible and usable

Tasks:

- render the response text in a dedicated output panel
- render errors in a separate message area
- clear or replace old output predictably on each submission

Exit criteria:

- successful queries display model output
- failed queries display a readable error state

### Phase 5: Validate against the live inference stack

Goal:
- prove end-to-end functionality in the real environment

Tasks:

- verify the backend can reach the configured inference endpoint
- verify a real prompt returns a real model response
- validate the UI path from input to rendered output
- confirm the frontend does not call the raw inference host directly from browser code

Exit criteria:

- an operator can submit a prompt and see a model response in the app

## UI Guidance

Keep the first query UI plain and functional:

- one text area
- one submit button
- one output area
- one error area

Do not attempt a polished chat product yet. The goal is working interaction, not a finished assistant interface.

The current `DeskScene` should remain visible if possible, but functionality should take priority over aesthetic purity in this phase.

## Risks

- if the frontend calls the raw inference host directly, later hardening work will be messier
- if the upstream API shape is assumed incorrectly, UI work will stall on integration
- if streaming is attempted too early, complexity may rise faster than value
- if conversation state is introduced now, the phase may expand into a chat application rewrite

## Definition Of Done

This phase is complete when:

- the UI includes a prompt input
- the frontend can submit to a backend API
- the backend can query the model
- the UI renders model responses
- errors are handled cleanly
- the implementation remains narrow and easy to extend

## Recommended Next Artifact

After this plan, write a concrete implementation checklist similar to the current React PoC checklist, with:

- locked request path
- exact files to add or change
- exact API route shape
- exact verification steps
- branch and commit workflow per phase
