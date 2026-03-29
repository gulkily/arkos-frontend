# React PoC Plan

The findings document in this repo is deployment-focused, but it gives one useful constraint for this PoC: treat the frontend as a separate shell and do not assume any real backend, auth, or routing work yet. Given the assigned task, this proof-of-concept should focus on establishing the minimal React host app, mounting `DeskScene`, and proving the local developer loop works cleanly.

## Existing Infrastructure Note

The findings document indicates that Kong is already present on the server. Kong is an API gateway, meaning it sits in front of backend services and handles concerns such as routing, auth, TLS termination, and limiting direct exposure of internal service ports.

In the current environment:

- `Kong/OpenResty` is already listening on ports `8443` and `8000`
- those endpoints return `Unauthorized` without credentials
- Kong is therefore existing infrastructure, not a new third-party component being proposed as part of this React PoC

For this proof-of-concept, Kong is relevant only as future deployment context. It should not be part of the initial local React scaffold work.

## Plan

1. Define the PoC boundary.
   The app only needs to boot locally, render a placeholder scene, accept a `notifications` prop, and prove `NotificationPopup` is importable from this repo. Keep backend, auth, routing, and live notification wiring out of scope.

2. Choose the scaffold strategy.
   Pick the fastest React scaffold that matches team expectations, preferably the one already used elsewhere in ARKOS if there is one. The acceptance test says `npm start`, so the scaffold should support that directly or be adjusted so that `npm start` is the standard local entrypoint.

3. Create the app shell.
   Add a minimal React entrypoint and top-level `App` component that mounts a single scene-focused page. This shell should exist only to host future UI, not to introduce app architecture prematurely.

4. Integrate `DeskScene` as the placeholder UI.
   Import or stub `DeskScene` in the app shell and pass `notifications={[]}` initially. If `DeskScene` does not exist yet in a React-ready form, define a temporary adapter component so the prop contract is established now without blocking the scaffold.

5. Validate repo-local imports.
   Confirm that `NotificationPopup` can be imported from the same repo, even if it is not rendered yet. This should be part of the initial compile path so import breakage is caught immediately.

6. Keep the surface area intentionally small.
   Avoid routing, global state, API clients, auth, and notification polling. If styling is needed, add only enough to present `DeskScene` cleanly and avoid console or runtime noise.

7. Add a minimal verification pass.
   Run `npm start`, confirm the app serves locally, verify `DeskScene` renders without console errors, and confirm `NotificationPopup` import resolution succeeds. Capture any known gaps if placeholders or adapters were required.

8. Document the handoff.
   Record the exact app start command, the temporary component contract for `DeskScene`, and what remains for later phases: real notification data, layout expansion, and backend integration.

## Questions

1. Where is the actual findings document you want this based on? The only file in this repo is `inference-frontend-plan.md`, and it is about deployment and inference infrastructure rather than this React PoC. A: It's just that file and this file. We should come up with everything else.

2. Does `DeskScene` already exist somewhere in this repo or another ARKOS repo, or is part of the task to create the first React version of it? A: I think this is just a term for a friendly and engaging but non-distracting design that's a "desk scene" made with some nice pixel art, maybe a bit of a vaporwave vibe. 

3. Does `NotificationPopup` already exist, and if so where does it live? A: This will be the next task after this one, we just need to be aware that it's on the horizon. For this PoC, we should not let that future component expand scope beyond what is necessary to begin development.

4. Should this be written as a task breakdown for your ticket or standup, or as an implementation plan another engineer could execute directly? A: We should write a more detailed development plan based on this document that we can then base a plan with atomic development phases on, and finally doing the actual development in phases.

5. Is there an agreed scaffold choice already, or should the plan treat that as open between `create-react-app`, Vite with an `npm start` wrapper, or another team standard? A: No agreed-on choice. Keep this React-first and optimize for the fastest path to a local bootable placeholder app.

## Clarifications Added After Review

- `DeskScene` should be treated as a new component to create for this PoC, not an existing component to integrate
- the visual target is the minimum necessary to show progress: friendly, engaging, non-distracting, pixel-art-inspired, and slightly vaporwave in tone
- `NotificationPopup` is future-facing context, not a reason to enlarge the scope of this task
- the next planning artifact should be a more detailed development plan that turns this document into concrete implementation phases
