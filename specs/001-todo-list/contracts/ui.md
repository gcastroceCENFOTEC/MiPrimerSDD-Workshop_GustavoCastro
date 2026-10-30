# User Interface Contract

This is a user-facing browser application with no external API or account contract. The screens
and interactions below are derived from the feature specification.

## To-Do List

- Set the browser document title and visible header to `Curso-PSWE-07`.
- Show All, Pending, and Done filters; visibly identify the active choice.
- Show tasks in creation order, oldest first. Each row presents a status indicator and title.
- Show completed titles with strikethrough and muted color.
- Activating a task row opens its detail view. The Add task action opens the task form.
- Show a friendly empty state when the list or active filter has no tasks.

## To-Do Detail

- Provide a back control, prominent task title, description or muted `No description`, and visible
  Done or Pending status.
- Provide Edit, status toggle, and Delete actions.
- Label the toggle `Mark as done` for Pending and `Mark as not done` for Done.
- Use a distinct warning color for Delete and require confirmation before removal.

## Add and edit form

- Provide title and optional description fields.
- Add mode offers the Add task action; edit mode pre-fills saved values and offers Save and Cancel.
- Reject an empty or whitespace-only title with a visible validation message.

## Shared interaction and accessibility requirements

- Use responsive layouts at mobile and desktop widths, sufficient contrast, and touch/click targets
  of at least 44 by 44 px.
- Text contrast meets WCAG AA: at least 4.5:1 for normal text and 3:1 for large text.
- Do not expose accounts, categories, due dates, priorities, search, or synchronization.
