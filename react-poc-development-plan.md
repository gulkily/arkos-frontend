# React PoC Development Plan

This document expands on `react-poc-plan.md` and turns it into a development-oriented execution plan for the first ARKOS frontend proof-of-concept.

## Objective

Create the first local React frontend shell for ARKOS so there is a place to mount current and future user-facing UI. For this task, the shell only needs to boot locally, render a placeholder `DeskScene`, and establish the minimum component contract needed to continue development.

## Working Assumptions

- there is currently no frontend shell in this repo
- `DeskScene` does not already exist and must be created as part of the PoC
- `DeskScene` is a visual concept, not a precise asset spec
- `NotificationPopup` is not part of this implementation task and should only be considered as near-term future context
- the scaffold should be React-first and optimized for speed of delivery
- `npm start` should be the normal local boot command to satisfy acceptance expectations

## Success Criteria

The PoC is successful when:

- a React app boots locally with `npm start`
- the main view renders a `DeskScene` component without console errors
- `DeskScene` accepts a `notifications` prop, even if it receives an empty array
- the codebase structure leaves a clear place for future notification UI work

## Non-Goals

Do not include the following in this phase:

- real notification data
- backend API integration
- routing
- authentication
- persistent state management
- production deployment work
- pixel-art polish beyond what is needed to show visible progress

## Recommended Technical Direction

Use the lightest React setup that supports a clean `npm start` workflow with minimal configuration overhead. The goal of this phase is not framework selection for the long term. The goal is to establish a working frontend shell quickly and leave the code in a state that can be evolved later.

The app structure should stay small:

- app entrypoint
- top-level `App`
- `components/DeskScene`
- shared placeholder data or prop types only if needed

Avoid introducing extra abstraction until a second component or data flow requires it.

## Visual Direction for the PoC

The `DeskScene` should be treated as a lightweight visual placeholder with the following properties:

- friendly and engaging
- not distracting
- pixel-art-inspired rather than highly detailed
- slightly vaporwave in tone, but restrained
- clearly usable as a background or host surface for future notification UI

This does not require full art production. A simple static composition is enough for the PoC if it establishes the intended direction.

## Implementation Phases

### Phase 1: Scaffold the frontend shell

Goal:
- create a local React app that starts reliably with `npm start`

Tasks:
- initialize the project scaffold
- add the minimal package scripts needed for local development
- create the root application entrypoint
- create a top-level `App` that renders a single scene container

Exit criteria:
- `npm start` launches the app locally
- the browser shows a mounted React page without runtime failure

### Phase 2: Define the initial component contract

Goal:
- establish the minimum interface for `DeskScene`

Tasks:
- create a `DeskScene` component
- define a `notifications` prop on `DeskScene`
- pass an empty array from `App`
- keep the prop shape loose unless a stricter type adds immediate value

Exit criteria:
- `DeskScene` renders through the app shell
- the `notifications` prop is present in the component contract

### Phase 3: Build the placeholder scene

Goal:
- render something visually intentional enough to demo progress

Tasks:
- implement a static desk-scene composition
- choose a restrained vaporwave-leaning palette
- keep the layout readable and stable on a normal desktop viewport
- avoid animation unless it is trivial and low-risk

Exit criteria:
- the app shows a recognizable desk-scene placeholder
- the scene is calm enough to plausibly host notifications later

### Phase 4: Preserve near-term extensibility

Goal:
- make the next notification task easier without implementing it now

Tasks:
- place `DeskScene` in a reusable component path
- keep `App` simple and easy to extend
- avoid design choices that would block overlaying notification UI later
- if useful, leave a commented placeholder or TODO for where notification rendering would attach

Exit criteria:
- the next task can add notification UI without reorganizing the entire app

### Phase 5: Verify and document

Goal:
- ensure the PoC is demonstrable and understandable

Tasks:
- run the local app with `npm start`
- check for console errors during initial render
- confirm the empty `notifications` prop path is exercised
- document the start command and current limitations

Exit criteria:
- the PoC can be shown immediately
- known limitations are documented instead of implied

## Atomic Development Breakdown

This is the likely order of actual implementation work:

1. Initialize React project files and package scripts
2. Add the application entrypoint and `App`
3. Add `DeskScene` with a `notifications` prop
4. Render `DeskScene` from `App` with `[]`
5. Add the minimum scene styling and structure
6. Run the app and remove any console or compile errors
7. Document what was built and what remains for later

## Risks and Tradeoffs

- If too much time is spent refining the art direction, the PoC will miss its real purpose, which is establishing the shell
- If the scaffold is over-engineered now, later tasks will inherit unnecessary complexity
- If `NotificationPopup` expectations are left vague, future acceptance criteria may need to be corrected or scoped explicitly
- If `DeskScene` is made too decorative, it may become a poor host for future overlays

## Recommended Next Deliverable After This Document

After this plan, the next artifact should be a phase-by-phase implementation checklist with small, executable tasks. That checklist should be written to support actual development work rather than planning discussion.
