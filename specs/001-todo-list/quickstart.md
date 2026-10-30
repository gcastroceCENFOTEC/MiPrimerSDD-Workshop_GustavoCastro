# Quickstart: Curso-PSWE-07 To-Do List

This guide documents the commands supported by the implemented application and its package scripts.

## Prerequisites

- Node.js current LTS and npm.
- A supported desktop or mobile browser. Playwright's configured browser must be installed for
  acceptance tests.

## Install and start

1. Install locked project dependencies with `npm ci`.
2. Start the development server with `npm run dev`.
3. Open the local URL printed by the development server. Confirm the browser title and list header
   both read `Curso-PSWE-07`.

## Automated validation

- Run `npm test` for fast unit tests of title validation, task operations, status transitions,
  filtering, ordering, and repository behavior. Expected result: all tests pass.
- Run `npm run test:e2e` for browser acceptance tests. Expected result: the list, edit, completion,
  deletion confirmation, and reload-persistence flows pass at mobile and desktop viewports.
- Acceptance coverage maps to all three user stories: capture/filter/open tasks; review/edit/toggle/
  delete; persist across reload and verify responsive accessibility requirements.

## Manual acceptance spot check

1. Add two tasks and confirm the older task appears first.
2. Filter Pending and Done, open a task, edit it, and verify its updated details in the list.
3. Toggle completion in both directions. Cancel one deletion, then confirm another.
4. Reload the page and confirm remaining tasks retain their titles, descriptions, and statuses.
5. At mobile and desktop widths, verify no horizontal overflow, all primary actions remain usable,
   each touch/click target is at least 44 by 44 px, and text contrast meets the thresholds in the
   specification.
