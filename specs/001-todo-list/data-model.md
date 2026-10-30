# Data Model: Curso-PSWE-07 To-Do List

## Task

Represents one user-created to-do item.

| Field | Meaning | Constraints |
|---|---|---|
| `id` | Stable internal identifier for selecting, editing, and deleting a task | Unique among saved tasks; not shown as user-facing content |
| `title` | Task's required display name | Must contain a non-whitespace character |
| `description` | Optional task details | May be empty |
| `status` | Completion state | Exactly `Pending` or `Done`; new tasks start as `Pending` |

### Lifecycle

- Create: a valid title creates a Pending task; description may be empty.
- Edit: save a valid title and the edited description; retain the task's identifier and status.
- Complete: Pending transitions to Done.
- Reopen: Done transitions to Pending.
- Delete: remove the selected task after the user confirms.

### Ordering and persistence

Tasks are stored in creation order. New tasks are appended; filtering preserves that order.
The selected filter is view state, not task data, and is not required to persist across sessions.
Persist the task collection through the repository interface so saved task fields and ordering
survive closing and reopening the application.

## Completion filter

A view selection, not a task entity. Its value is one of `All`, `Pending`, or `Done`. `All`
includes every task; `Pending` and `Done` include only tasks in the matching status.
