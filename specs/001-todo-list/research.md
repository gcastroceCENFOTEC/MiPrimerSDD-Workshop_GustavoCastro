# Research: Curso-PSWE-07 To-Do List

## Decision 1: Client-side responsive web application

**Decision**: Plan a browser-based application with semantic HTML, CSS, and TypeScript, using Vite
for development and production builds. Do not add a UI framework.

**Rationale**: The specification calls for mobile and desktop layouts, an application/window title,
and same-device persistence, but no native device features, accounts, or network services. A
browser app addresses the stated use cases with less infrastructure than a native app or client/server
system. A framework is not justified for two screens and a shared form.

**Alternatives considered**:

- Native mobile application: unnecessary without native-only capabilities or app-store
  distribution requirements.
- Client/server application: adds hosting, authentication, and network behavior excluded by the
  scope.
- Framework-based frontend: possible if the interface grows, but adds complexity not currently
  required.

## Decision 2: Browser-local persistence

**Decision**: Store the task collection in browser `localStorage` behind a small task-repository
interface. Keep array order as creation order and append new tasks so the list remains oldest first.

**Rationale**: The spec asks for saved tasks to remain on the same device after closing and
reopening the app, and explicitly excludes synchronization. Browser-local storage meets that
requirement without a server. The interface keeps storage out of UI code and makes it replaceable
with a fake in tests.

**Alternatives considered**:

- IndexedDB: supports larger and more complex client-side data, but this feature stores a small,
  simple task collection and does not need its additional machinery.
- Remote database: requires network services and synchronization behavior that are out of scope.
- In-memory storage: fails the persistence requirement.

**Limitations**: Browser storage is scoped to the app's origin and browser profile. Clearing
browser data or using another browser/device is outside the stated persistence guarantee.

## Decision 3: Test-first validation tools

**Decision**: Use Vitest for fast application-logic unit tests and Playwright for browser
acceptance tests. Write each test before its corresponding production behavior.

**Rationale**: The constitution requires unit tests for business logic and at least one acceptance
test per user story. Vitest fits the Vite project and supports isolated tests. Playwright exercises
real browser flows, reload persistence, and mobile/desktop viewport behavior. These tools are
development-only dependencies; they add no runtime functionality.

**Alternatives considered**:

- Manual-only browser checks: cannot provide repeatable automated acceptance tests for each story
  as required by the constitution.
- Unit tests alone: do not verify screen navigation, responsive behavior, or persisted data after a
  browser reload.

## References

- [Vite Guide](https://vite.dev/guide/) — project setup and development/build workflow.
- [Vitest Guide](https://vitest.dev/guide/) — unit testing in a Vite project.
- [Playwright Documentation](https://playwright.dev/docs/intro) — browser-based acceptance tests
  and viewport testing.
- [MDN: `localStorage`](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage) —
  browser storage behavior and persistence scope.
