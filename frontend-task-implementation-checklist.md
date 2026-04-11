# Frontend Task Implementation Checklist

This checklist is derived from `frontend-task-status-review.md` and is meant to be updated as work lands.

## Usage

- mark each item `[x]` when complete
- keep tasks small enough to finish in one focused change
- if scope changes, add a new unchecked item rather than rewriting completed history
- note blockers or deviations inline under the relevant section

## Task 1: React Shell Hardening

Goal:
Close the remaining acceptance gaps on the React shell and `DeskScene` work.

### Phase 1: Import and mount path verification

- [x] import `NotificationPopup` into the live frontend code path so repo-local import resolution is exercised during build/dev
- [x] decide whether `NotificationPopup` should render immediately with mock data or stay mounted behind an empty-state path
- [x] confirm `DeskScene` remains the primary visible shell after the import change

Exit criteria:

- `NotificationPopup` is no longer only barrel-exported; it is imported by active frontend code
- the app still builds and starts cleanly

### Phase 2: Browser verification

- [x] run `npm start` and verify the app loads through the normal local workflow
- [ ] verify `DeskScene` renders without browser console errors
- [ ] verify the `notifications={[]}` path is exercised without runtime warnings
- [x] record the verification result in a repo doc if any non-obvious behavior appears

Exit criteria:

- Task 1 acceptance is backed by direct dev-run verification, not only by a production build

## Task 2: NotificationPopup Implementation

Goal:
Implement the actual notification UI required by the second task.

### Phase 3: Component contract

- [x] define the notification item shape the component expects via props
- [x] update `src/components/NotificationPopup.jsx` to accept a `notifications` prop
- [x] decide whether dismiss behavior is internal state only, callback-based, or both
- [x] document any prop assumptions in code comments or a nearby doc if needed

Exit criteria:

- `NotificationPopup` has a clear public prop contract

### Phase 4: Notification list rendering

- [x] render a visible popup container instead of returning `null`
- [x] render one list item per notification
- [x] show enough notification content to distinguish items clearly
- [x] handle the empty list path cleanly

Exit criteria:

- passing mock notifications produces a visible list in the UI

### Phase 5: Dismiss behavior

- [x] add a dismiss button for each notification
- [x] implement removal behavior so dismissing an item removes it from the rendered list
- [ ] verify repeated dismisses work until the list is empty
- [x] ensure dismiss behavior does not mutate props directly

Exit criteria:

- dismissing a notification removes it from the on-screen list

### Phase 6: Styling and placement

- [x] add minimal styling so the popup is readable on top of `DeskScene`
- [x] choose a placement that does not interfere with the current main panel
- [ ] verify the popup remains readable with multiple notifications
- [ ] verify the empty state does not create awkward unused chrome if the component is mounted with no items

Exit criteria:

- `NotificationPopup` is visually usable in the current shell

### Phase 7: Mock integration

- [x] add mock notification data in the local app
- [x] mount `NotificationPopup` from `App` or `DeskScene` using the mock data path
- [x] confirm `DeskScene` and `NotificationPopup` render together cleanly
- [x] keep real-time wiring, backend calls, and WebSockets out of scope

Exit criteria:

- `npm start` demonstrates the component with mock notifications

### Phase 8: Export and verification

- [x] confirm `NotificationPopup` remains exported from `src/components/index.js`
- [x] run `npm run build`
- [x] run `npm start`
- [ ] verify no browser console errors after mounting the popup

Exit criteria:

- Task 2 acceptance is satisfied in the local app flow

## Planning Follow-Up

Goal:
Bring the written plans in line with the current implementation work.

### Phase 9: Plan updates

- [x] add a dedicated implementation plan or checklist for `NotificationPopup`
- [x] update any existing plan docs that still describe `NotificationPopup` as deferred-only work
- [x] update `frontend-task-status-review.md` after major implementation milestones

Exit criteria:

- the docs match the actual project state and next steps

## Suggested Working Order

1. Phase 3: Component contract
2. Phase 4: Notification list rendering
3. Phase 5: Dismiss behavior
4. Phase 6: Styling and placement
5. Phase 7: Mock integration
6. Phase 8: Export and verification
7. Phase 2: Browser verification
8. Phase 9: Plan updates

## Blockers

- none currently identified

## Notes

- Storybook is optional based on the task wording; `npm start` with mock data is enough to satisfy the stated acceptance test
- the existing `ModelQueryPanel` is not part of these tasks, so avoid broad UI refactors unless popup placement forces a small adjustment
- direct browser console inspection is still pending because this terminal-only pass did not include a browser session
