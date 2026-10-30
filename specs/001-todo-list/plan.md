# Implementation Plan: Curso-PSWE-07 To-Do List

**Branch**: `001-todo-list` | **Date**: 2026-10-22 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `specs/001-todo-list/spec.md`

## Summary

Build a small, responsive browser-based to-do list with list, detail, and task-form views. Use
TypeScript without a UI framework, keep task operations in the application layer, and persist
tasks locally through a replaceable storage interface. Use test-first development with unit tests
for task behavior and browser acceptance tests for the three user stories.

## Technical Context

**Language/Version**: TypeScript on the current Node.js LTS for development and testing

**Primary Dependencies**: Vite for development/build, Vitest for unit tests, Playwright for browser
acceptance tests; no UI framework or runtime library

**Storage**: Browser `localStorage` through a small persistence interface; stored task-array order
preserves oldest-first creation order

**Testing**: Vitest unit tests and Playwright acceptance tests; tests are written before production
code in Red-Green-Refactor order

**Target Platform**: Current desktop and mobile browsers; no native application or installable-app
requirement

**Project Type**: Client-side web application

**Performance Goals**: No quantified latency or throughput target is specified. Task operations
apply to one user's local task collection and should feel immediate.

**Constraints**: No accounts, categories, due dates, priorities, search, synchronization, or remote
service. Meet WCAG AA text contrast thresholds in the spec, 44 by 44 px minimum targets, and
responsive layout requirements.

**Scale/Scope**: One local user; two screens plus the shared task form; task list has no specified
maximum size.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### Before Phase 0

- **Simplicity first**: Pass. A framework, server, account system, and remote storage are not
  required by the specification and are excluded.
- **Simple, clear design**: Pass. The plan uses focused UI, application, and storage modules without
  speculative abstractions.
- **Structured architecture**: Pass. Dependencies flow UI → application logic → persistence;
  storage access is isolated behind a small interface.
- **Test-driven development**: Pass. Unit and browser acceptance tests are part of the plan and
  must be written before the corresponding production code.
- **Spec is the source of truth**: Pass. Planned screens, task behaviors, accessibility, and
  persistence trace to the approved specification.

### After Phase 1

- **Simplicity first**: Pass. No non-spec user-facing capabilities or remote services are added.
- **Simple, clear design**: Pass. Task operations and persistence each have one focused
  responsibility; no UI framework or extra abstraction is planned.
- **Structured architecture**: Pass. The composition root wires UI to application logic and the
  persistence adapter; UI modules never read or write storage directly.
- **Test-driven development**: Pass. Every user story has browser acceptance coverage, and
  task/business rules have fast, independent unit coverage.
- **Spec is the source of truth**: Pass. The internal task identifier and browser-test tooling
  support required edit/delete, ordering, and acceptance coverage; they do not add user-facing
  scope.

No constitution violations identified.

## Project Structure

### Documentation (this feature)

```text
specs/001-todo-list/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   └── ui.md
└── tasks.md
```

### Source Code (repository root)

```text
index.html
src/
├── app.ts                         # Composition root
├── application/
│   ├── task-repository.ts         # Persistence interface
│   └── tasks.ts                   # Task validation and operations
├── persistence/
│   └── local-storage-task-repository.ts
├── styles/
│   └── app.css
└── ui/
    ├── task-list.ts
    ├── task-detail.ts
    └── task-form.ts
tests/
├── unit/
│   └── tasks.test.ts
└── acceptance/
    └── todo-list.spec.ts
```

**Structure Decision**: Use one client-side web project. The composition root supplies the
persistence interface to application logic and the UI; list, detail, and form modules render and
forward user actions without accessing browser storage. Unit tests use a fake repository. Browser
acceptance tests cover each user story and persistence across reload.

## Complexity Tracking

No constitution exceptions. Vite, Vitest, and Playwright are development dependencies: Vite
provides the browser development/build workflow, Vitest supports fast isolated unit tests, and
Playwright supplies the browser acceptance tests required by the constitution. No UI framework or
runtime dependency is planned.
