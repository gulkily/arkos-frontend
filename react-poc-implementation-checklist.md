# React PoC Implementation Checklist

This document translates `react-poc-development-plan.md` into a concrete build checklist for the first development pass.

## Implementation Goal

Build the smallest possible React app that:

- starts with `npm start`
- renders a placeholder `DeskScene`
- passes `notifications={[]}` into `DeskScene`
- leaves the codebase ready for future notification UI work

## Locked Decisions For This Phase

- use a React-first scaffold
- optimize for fastest local delivery over long-term framework selection
- support `npm start` as the standard local command
- create `DeskScene` as a new component in this repo
- do not implement `NotificationPopup` yet
- do not add routing, auth, backend integration, or real notifications

## Execution Workflow

- implement this checklist work on a dedicated branch rather than directly on `main`
- complete one phase at a time in order
- update this checklist document after each phase to mark that phase complete
- make a commit after each phase is finished so progress is easy to review and recover
- keep commit scope aligned with the phase boundaries in this document

## Proposed Initial File Structure

Use a minimal structure along these lines:

- `package.json`
- `public/index.html`
- `src/index.js` or `src/main.jsx`
- `src/App.jsx`
- `src/components/DeskScene.jsx`
- `src/styles.css` or component-local CSS file

Exact naming can vary slightly depending on scaffold choice, but the structure should stay this small unless a concrete need appears.

## Build Sequence

### Phase 1: Create the app scaffold [completed]

Checklist:

- initialize the project with a React scaffold that supports `npm start`
- confirm `package.json` includes a working `start` script
- install only the minimum dependencies needed to boot the app
- verify the app starts before adding custom UI

Completion check:

- `npm start` serves a default React page successfully

### Phase 2: Replace the default app shell [completed]

Checklist:

- remove scaffold boilerplate that is irrelevant to the PoC
- create a minimal `App` component
- make `App` render a single root scene container
- keep the page structure intentionally simple

Completion check:

- the app renders a blank or minimally styled shell with no compile errors

### Phase 3: Create `DeskScene` [completed]

Checklist:

- add `src/components/DeskScene.jsx`
- define `DeskScene` as a React component that accepts a `notifications` prop
- pass `notifications={[]}` from `App`
- render the prop safely even if it is unused internally for now

Completion check:

- `DeskScene` renders from `App`
- there are no prop-related errors or warnings

### Phase 4: Add the placeholder visual design [completed]

Checklist:

- create a simple static composition that reads as a desk scene
- use a restrained pixel-art-inspired style
- choose a calm palette with slight vaporwave influence
- keep the design non-distracting and demoable
- prefer CSS shapes, blocks, and layout over time-consuming art production

Completion check:

- a viewer can clearly see that the app is no longer just scaffold output
- the scene looks intentional enough to present as task progress

### Phase 5: Prepare for future notification work [completed]

Checklist:

- keep `DeskScene` layout compatible with future overlays or popups
- avoid hard-coding design choices that block notification placement
- if useful, leave a short TODO comment where future notification UI would attach
- do not create `NotificationPopup` unless the acceptance criteria are later enforced literally

Completion check:

- the next task can add notification UI without refactoring the whole shell

### Phase 6: Verify the acceptance path

Checklist:

- run `npm start`
- verify the app boots locally
- verify `DeskScene` renders without console errors
- verify `notifications={[]}` is part of the live render path
- note that `NotificationPopup` is intentionally deferred unless task scope changes

Completion check:

- the current task can be demonstrated locally with a clean explanation of what is complete

## Exact Development Order

Work in this order:

1. Create the scaffold and confirm `npm start`
2. Replace boilerplate with a minimal `App`
3. Add `DeskScene`
4. Pass `notifications={[]}`
5. Add minimal styling and visual structure
6. Run and verify
7. Document any deliberate omissions

## Acceptance Notes

Interpret the assigned task conservatively:

- “React app boots locally” means the app starts and serves in a normal developer environment
- “DeskScene renders” means the component is visibly mounted and does not throw runtime or compile errors
- “accepts a notifications prop” means the prop is part of the public component interface even if unused
- `NotificationPopup` should be treated as future-facing unless the task owner explicitly insists on a placeholder export in this phase

## Out-of-Scope Guardrails

Do not add these during the first build unless a blocker forces it:

- routing libraries
- API clients
- auth flows
- global state stores
- server rendering work
- asset pipelines for detailed art
- notification logic

## Definition of Done For This Implementation Pass

This phase is done when:

- the repo contains a runnable React shell
- `npm start` works
- `App` renders `DeskScene`
- `DeskScene` accepts `notifications`
- the UI is presentable enough to show progress on the task
- no extra architecture has been added without need

## Recommended Next Step After This Checklist

Begin implementation directly from this checklist. If any blocked decision appears during setup, record it briefly and choose the smallest option that preserves momentum.
