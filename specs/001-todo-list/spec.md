# Feature Specification: Curso-PSWE-07 To-Do List

**Feature Branch**: `001-todo-list`

**Created**: 2026-10-22

**Status**: Draft

**Input**: User description: "Build a simple to-do list application named "Curso-PSWE-07" that helps users organize and track their daily tasks. The To-Do List screen shows tasks and lets users add and open tasks, and filter by All, Pending, or Done. The To-Do Detail screen displays a selected task and lets users edit it, change its completion status, and delete it with confirmation. Tasks have a required title, optional description, and done/not-done status, and remain after closing and reopening the application. The app name appears in the list header and application/window title. The design is clean, minimal, responsive, and high-contrast, with a sans-serif font, a single accent color, 44x44 px minimum touch/click targets, clear task hierarchy, active filter, completed-task styling, visible add/edit/status/delete actions, and friendly empty states. Edit mode reuses the task form, offers Save and Cancel, and validates an empty title. Do not include accounts, categories, due dates, priorities, search, or sync."

## Clarifications

### Session 2026-10-22

- Q: In what order should the To-Do List show tasks? → A: Oldest tasks first.
- Q: What minimum contrast standard should text meet against its background? → A: WCAG AA (4.5:1 for normal text; 3:1 for large text).
- Q: Where should Curso-PSWE-07 run: in a web browser or as a native app installed on devices? → A: Responsive web app in mobile and desktop browsers.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Capture and organize tasks (Priority: P1)

As a user, I want to add tasks and see them in a clear list so that I can keep track of what I need to do.

**Why this priority**: Creating and viewing tasks is the essential value of a to-do list and provides a usable starting point.

**Independent Test**: Add a titled task with and without a description, confirm both appear in the list, and verify the list can be filtered by All, Pending, and Done.

**Acceptance Scenarios**:

1. **Given** the task list is empty, **When** the user opens the list, **Then** a friendly empty state and a clearly visible Add task action are shown.
2. **Given** the user is on the task list, **When** they add a task with a non-empty title and optional description, **Then** the task appears in the list as Pending.
3. **Given** tasks include both Pending and Done items, **When** the user selects All, Pending, or Done, **Then** the list shows all tasks, only pending tasks, or only completed tasks respectively, and the selected filter is visibly active.
4. **Given** the active filter has no matching tasks, **When** the list is displayed, **Then** a friendly empty state explains that there are no matching tasks.
5. **Given** a task is listed, **When** the user opens it, **Then** its detail screen is displayed.

---

### User Story 2 - Review and manage a task (Priority: P2)

As a user, I want to review a task’s details, edit it, change its completion status, or remove it so that my list stays accurate.

**Why this priority**: The task list remains useful over time only if users can update, complete, and remove tasks.

**Independent Test**: Open an existing task, inspect its title, description, and status, edit and save it, toggle its status in both directions, then delete it after confirming.

**Acceptance Scenarios**:

1. **Given** a task exists, **When** the user opens it, **Then** the detail screen shows its title, description or muted “No description” text, current Done or Pending status, and a back control.
2. **Given** the user is viewing a task, **When** they choose Edit, **Then** the task form is populated with its current title and description and offers Save and Cancel.
3. **Given** the user edits a task, **When** they try to save with an empty title, **Then** a validation message is shown and the task is not saved.
4. **Given** the user edits a task with a valid title, **When** they choose Save, **Then** the updated values are shown in the task details and list.
5. **Given** a task is Pending, **When** the user chooses Mark as done, **Then** its status changes to Done; when it is Done and the user chooses Mark as not done, **Then** it changes to Pending.
6. **Given** the user chooses Delete, **When** the confirmation is displayed, **Then** the task is removed only after confirmation and remains if deletion is cancelled.

---

### User Story 3 - Return to tasks with a usable, consistent interface (Priority: P3)

As a user, I want task data and the interface to remain dependable across sessions and device sizes so that I can use the list wherever I open it.

**Why this priority**: Preserving task data and maintaining an accessible layout make the core task workflow reliable beyond a single visit.

**Independent Test**: Create a task, close and reopen the application, and verify the task remains; repeat the main list and detail actions at mobile and desktop viewport widths.

**Acceptance Scenarios**:

1. **Given** a task has been saved, **When** the user closes and reopens the application, **Then** the task and its latest saved title, description, and completion status are still present.
2. **Given** the application is opened in a mobile or desktop browser, **When** the user views the list, detail, and task form, **Then** the content remains usable without clipped primary actions or horizontal overflow.
3. **Given** the user views either screen, **When** they interact with primary controls, **Then** each touch or click target is at least 44 by 44 pixels and text meets WCAG AA contrast ratios of at least 4.5:1 for normal text and 3:1 for large text.

### Edge Cases

- A title containing only whitespace is treated as empty and cannot be saved.
- An optional description may be blank; the detail screen displays “No description” in a muted style.
- A filter with zero matching tasks displays a friendly empty state rather than a blank list.
- Cancelling deletion leaves the task and its data unchanged.
- Cancelling an edit discards unsaved changes and retains the last saved task values.
- Changing a task’s status updates its presentation and membership in the currently selected filter.
- Long titles or descriptions remain readable and do not make list or detail actions inaccessible at mobile and desktop widths.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The application MUST use “Curso-PSWE-07” as the application/window title and as the header on the To-Do List screen.
- **FR-002**: The To-Do List screen MUST show tasks in creation order, oldest first, with each task’s status indicator and title, and MUST provide All, Pending, and Done filters.
- **FR-003**: Selecting a filter MUST show exactly the tasks matching that filter and visibly highlight the active filter.
- **FR-004**: The To-Do List screen MUST provide a clearly visible Add task action that opens a form with title and optional description fields.
- **FR-005**: A task MUST have a required title, an optional description, and a completion status of Done or Pending; a newly created task MUST be Pending.
- **FR-006**: The application MUST reject a blank or whitespace-only title with a visible validation message and MUST NOT save the invalid task.
- **FR-007**: The task list MUST open the selected task’s To-Do Detail screen when the user activates its row.
- **FR-008**: The To-Do Detail screen MUST provide a back control, the task title, its description or muted “No description” text, its visible Done or Pending status, and actions to Edit, change status, and Delete.
- **FR-009**: The status action MUST be labeled “Mark as done” for Pending tasks and “Mark as not done” for Done tasks; activating it MUST switch the status.
- **FR-010**: Edit mode MUST reuse the title and description form, prefill the saved values, and provide Save and Cancel actions. Save MUST validate the title; Cancel MUST discard unsaved edits.
- **FR-011**: Delete MUST use a distinct warning color and require explicit confirmation before removing a task. Cancelling confirmation MUST preserve the task.
- **FR-012**: The list MUST style Done tasks with a strikethrough title and muted color. Empty lists and filters with no matches MUST show a short, friendly empty state.
- **FR-013**: Saved task titles, descriptions, and completion statuses MUST remain available after the application is closed and reopened.
- **FR-014**: The interface MUST adapt to mobile and desktop screen sizes, use one sans-serif font family, a light background with generous white space, and a single accent color for primary actions and the active filter.
- **FR-015**: Text MUST meet WCAG AA contrast ratios of at least 4.5:1 for normal text and 3:1 for large text, and each touch or click target MUST be at least 44 by 44 pixels.
- **FR-016**: The application MUST NOT include accounts, categories, due dates, priorities, search, or synchronization.
- **FR-017**: The application MUST run as a responsive web application in current mobile and desktop browsers; native mobile and desktop applications are out of scope.

### Key Entities

- **Task**: A user-created item with a required title, optional description, and a completion status that is either Pending or Done. Its saved values persist across application restarts.
- **Completion filter**: The selected list view, one of All, Pending, or Done, which determines which tasks are displayed.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: In usability testing, at least 90% of users can create a titled task and find it in the list within 30 seconds without assistance.
- **SC-002**: In usability testing, at least 90% of users can filter tasks, open a task, change its status, and return to the list within 30 seconds.
- **SC-003**: In 100% of persistence checks, every saved task retains its latest title, description, and completion status after the application is closed and reopened.
- **SC-004**: At mobile and desktop viewport sizes, all primary screen actions remain visible and usable, with no horizontal overflow and no touch or click target smaller than 44 by 44 pixels.
- **SC-005**: In validation checks, every blank or whitespace-only title is rejected with a visible message, and every valid title can be saved.

## Assumptions

- The application is used by one person on the device where it is opened; accounts, multi-user ownership, and cross-device synchronization are outside the requested scope.
- The supported platform is a responsive web application accessed through current mobile and desktop browsers, not a native installed application.
- Persistence is required across closing and reopening the same application on the same device; behavior after clearing application data or moving to another device is not specified.
- A task’s default completion status is Pending.
- “No description” is the detail-screen placeholder for an empty description; the list may omit descriptions.
- The requested clean visual design, minimum target size, text contrast, and responsive behavior apply to both screens and the task form.
