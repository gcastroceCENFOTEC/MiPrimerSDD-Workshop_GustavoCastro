---

description: "Task list for Curso-PSWE-07 To-Do List implementation"

---

# Tasks: Curso-PSWE-07 To-Do List

**Input**: Design documents from `specs/001-todo-list/`

**Prerequisites**: `plan.md`, `spec.md`, `research.md`, `data-model.md`, `contracts/ui.md`,
`quickstart.md`

**Testing approach**: Tests are required by the project constitution. Write each unit and
acceptance test before the production behavior it verifies; confirm the new test fails before
implementing that behavior.

## Format

- `[P]` marks a task that can be done in parallel with other marked tasks in the same phase.
- `[US1]`, `[US2]`, and `[US3]` map to the prioritized user stories in `spec.md`.
- Every task has an exact repository file path and a sequential task ID.

## Phase 1: Setup

**Purpose**: Initialize the client-side TypeScript web project and test tooling.

- [X] T001 Create `package.json` with Vite development/build scripts, Vitest unit-test script, Playwright acceptance-test script, and TypeScript, Vite, Vitest, and Playwright development dependencies, then run `npm install` to generate `package-lock.json`.
- [X] T002 Configure TypeScript and Vite in `tsconfig.json` and `vite.config.ts`, and configure Vitest and Playwright in `vitest.config.ts` and `playwright.config.ts`; ensure `npm test` runs unit tests and `npm run test:e2e` runs browser tests.

## Phase 2: Foundational

**Purpose**: Establish replaceable local persistence, required before stories integrate task data.

- [X] T003 Write a failing unit test in `tests/unit/local-storage-task-repository.test.ts` for saving and loading an ordered task collection, including an empty collection and round-tripped task fields.
- [X] T004 Define the `Task` and `TaskRepository` contracts in `src/application/task-repository.ts` and implement the browser `localStorage` adapter in `src/persistence/local-storage-task-repository.ts`; satisfy T003 and expose no storage access to UI modules.

## Phase 3: User Story 1 - Capture and organize tasks (Priority: P1) 🎯 MVP

**Goal**: Add titled tasks, show them oldest first, open a task, and filter the list.

**Independent Test**: In a fresh browser profile, add tasks with and without descriptions, confirm
they appear Pending in oldest-first order, verify All/Pending/Done filters and empty states, and
open a listed task.

### Tests for User Story 1

> Write tests first and verify they fail before implementing the corresponding behavior.

- [X] T005 [P] [US1] Write failing Playwright acceptance scenarios in `tests/acceptance/todo-list.spec.ts` for the empty-list state, adding tasks with optional descriptions, oldest-first order, all three filters and active-filter indication, no-match state, and opening a task; assert the document title and list header are `Curso-PSWE-07`, completed titles are struck through and muted using a seeded Done task, and the Add task target is at least 44 by 44 px.
- [X] T006 [P] [US1] Write unit tests in `tests/unit/tasks.test.ts` for rejecting blank or whitespace-only titles, creating Pending tasks with optional descriptions, preserving oldest-first order, and filtering All/Pending/Done.

### Implementation for User Story 1

- [X] T007 [US1] Implement task creation, non-whitespace title validation, creation ordering, and completion filtering in `src/application/tasks.ts`, using `TaskRepository` from `src/application/task-repository.ts` and satisfying T006.
- [X] T008 [US1] Implement the application composition root, visible app header, task list, empty states, add-task form, and row navigation in `index.html`, `src/app.ts`, and `src/ui/task-list.ts` and `src/ui/task-form.ts`; wire UI only to application logic, use the persistence adapter through the repository interface, and satisfy T005.
- [X] T009 [US1] Style the list, active All/Pending/Done filter, status indicators, completed-task strikethrough and muted title, form, and primary Add task action in `src/styles/app.css` using the specified light background, whitespace, single sans-serif family, and single accent color, making the failing visual assertions from T005 pass.

## Phase 4: User Story 2 - Review and manage a task (Priority: P2)

**Goal**: Review task details and edit, complete/reopen, or delete a task with confirmation.

**Independent Test**: Open a task, verify its title, description or “No description”, and status;
edit and save it; reject a blank title; cancel an edit; toggle status both ways; cancel a delete and
then confirm deletion.

### Tests for User Story 2

> Write tests first and verify they fail before implementing the corresponding behavior.

- [X] T010 [P] [US2] Add failing Playwright acceptance scenarios to `tests/acceptance/todo-list.spec.ts` for detail content, empty-description placeholder, prefilled edit, save/cancel, invalid title, both status transitions and labels, and confirmed/cancelled deletion; assert Delete uses a distinct warning color and all detail/form action targets are at least 44 by 44 px.
- [X] T011 [P] [US2] Add unit tests to `tests/unit/tasks.test.ts` for editing while retaining task ID and status, changing Pending to Done and Done to Pending, and deleting only the selected task.

### Implementation for User Story 2

- [X] T012 [US2] Implement task editing, status transitions, and deletion in `src/application/tasks.ts`, preserving task ID and status during edits and satisfying T011.
- [X] T013 [US2] Implement the detail view, back control, Edit/Save/Cancel flow, status-dependent action label, and delete confirmation in `src/ui/task-detail.ts`, `src/ui/task-form.ts`, and `src/app.ts`; display “No description” for an empty description and satisfy T010.
- [X] T014 [US2] Style detail hierarchy, status label, minimum 44 by 44 px action targets, and distinct warning-colored Delete action in `src/styles/app.css`, making the failing visual assertions from T010 pass.

## Phase 5: User Story 3 - Return to tasks with a usable, consistent interface (Priority: P3)

**Goal**: Retain saved task state across application restarts and keep the interface usable on
mobile and desktop.

**Independent Test**: Save tasks with distinct titles, descriptions, and statuses, reload the app,
and verify all values and order remain; at mobile and desktop viewports verify the list, detail,
and form have no horizontal overflow, primary actions remain usable, targets are at least 44 by
44 px, and text meets WCAG AA contrast.

### Tests for User Story 3

> Write tests first and verify they fail before implementing any unmet cross-cutting behavior.

- [X] T015 [US3] Add Playwright acceptance tests in `tests/acceptance/todo-list.spec.ts` for persistence of titles, descriptions, statuses, and order after reload, and for mobile/desktop overflow, primary-action visibility, 44 by 44 px minimum targets, and WCAG AA contrast ratios of 4.5:1 for normal text and 3:1 for large text.

### Implementation for User Story 3

- [X] T016 [US3] Adjust responsive layouts and accessible contrast, target sizing, and focus/interaction styling in `src/styles/app.css` and `src/ui/task-list.ts`, `src/ui/task-detail.ts`, and `src/ui/task-form.ts` until T015 passes; keep saved state managed through the repository adapter.

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Verify the completed feature and keep runnable validation instructions aligned.

- [X] T017 [P] Update `specs/001-todo-list/quickstart.md` with the implemented install, development, unit-test, acceptance-test, and expected-result commands from `package.json`.
- [X] T018 Run `npm test`, `npm run test:e2e`, and `npm run build`; resolve feature regressions in the relevant `src/` and `tests/` files without adding out-of-scope behavior.

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: Starts immediately; T002 depends on T001.
- **Foundational (Phase 2)**: Depends on Setup; T004 depends on the failing persistence test T003 and blocks story integration.
- **User Story 1 (Phase 3)**: Depends on the foundational repository; T007 follows failing unit tests in T006, T008 integrates the list/form acceptance flow in T005, and T009 applies styles after T005's visual assertions and the UI markup in T008.
- **User Story 2 (Phase 4)**: Depends on User Story 1's list navigation and task form; T012 follows failing unit tests in T011, T013 integrates detail/form behavior after T010 and T012, and T014 applies styles after T010's visual assertions and the UI markup in T013.
- **User Story 3 (Phase 5)**: Depends on the app flows from User Stories 1 and 2; T016 follows T015.
- **Polish (Phase 6)**: Depends on all desired user stories.

### User Story Dependencies

- **User Story 1 (P1)**: Begins after Phase 2; no dependency on another story.
- **User Story 2 (P2)**: Begins after User Story 1 provides the list-to-detail navigation and shared task form.
- **User Story 3 (P3)**: Begins after User Stories 1 and 2 provide all screens and task actions to validate.

### Parallel Opportunities

- T001 and T002 are sequential because the project scripts and dependencies in `package.json` must exist before the test and build configuration can be verified.
- T003/T004 are sequential by TDD and cannot run in parallel.
- In User Story 1, T005 and T006 can run in parallel because they are separate test files. After both fail as expected, T007 follows T006, T008 integrates the acceptance-tested UI after T005 and T007, and T009 styles the markup after T008.
- In User Story 2, T010 and T011 can run in parallel because they are separate test files. T012 follows T011, T013 integrates detail behavior after T010 and T012, and T014 styles the markup after T013 using the failing visual assertions from T010.
- User Story 3 test T015 can begin after the story 1 and 2 screens exist; T016 follows T015. It is not parallel to story implementation because it validates their final shared layout.
- T017 can run in parallel with final test execution once script names in `package.json` are stable; T018 is the final verification gate.

### Parallel Example: User Story 1

```text
In parallel after Phase 2:
- T005: Write list-flow acceptance tests in tests/acceptance/todo-list.spec.ts
- T006: Write task-rule unit tests in tests/unit/tasks.test.ts

Then:
- T007: Implement application behavior after T006 fails
- T008: Integrate list and add-task UI after T005 fails and T007 is complete
- T009: Implement list styling after T005's visual assertions fail and T008 provides the markup
```

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1 setup.
2. Complete Phase 2 persistence foundation.
3. Write and run the failing User Story 1 tests, then implement Phase 3.
4. Run the User Story 1 tests independently and verify the quickstart flow.
5. Stop for review: the MVP supports creating, listing, filtering, and opening tasks.

### Incremental Delivery

1. Complete Setup and Foundational phases.
2. Deliver User Story 1 as the list-and-create MVP.
3. Deliver User Story 2 to make listed tasks editable, completable, and deletable.
4. Deliver User Story 3 to verify restart persistence and responsive accessibility.
5. Complete cross-cutting validation in Phase 6.
