import type { Task } from '../application/task-repository';
import type { TaskFilter } from '../application/tasks';

interface TaskListOptions {
  filter: TaskFilter;
  onAdd(): void;
  onFilter(filter: TaskFilter): void;
  onOpen(id: string): void;
}

export function renderTaskList(
  container: HTMLElement,
  tasks: Task[],
  options: TaskListOptions,
): void {
  const emptyMessage =
    options.filter === 'All' ? 'No tasks yet. Add one to get started.' : 'No tasks match this filter.';
  container.innerHTML = `
    <section class="task-list-screen" aria-labelledby="app-title">
      <header class="list-header">
        <div>
          <p class="eyebrow">Your daily list</p>
          <h1 id="app-title">Curso-PSWE-07</h1>
        </div>
        <button class="button button-primary add-task-button" type="button">Add task</button>
      </header>
      <nav class="filters" aria-label="Filter tasks">
        ${(['All', 'Pending', 'Done'] as const)
          .map(
            (filter) => `
              <button class="filter-button" type="button" data-filter="${filter}" aria-pressed="${options.filter === filter}">
                ${filter}
              </button>
            `,
          )
          .join('')}
      </nav>
      ${
        tasks.length
          ? `<ul class="task-list">
              ${tasks
                .map(
                  (task) => `
                    <li>
                      <button class="task-row${task.status === 'Done' ? ' is-done' : ''}" type="button" data-task-id="${escapeAttribute(task.id)}" aria-label="${escapeAttribute(`${task.status}: ${task.title}`)}">
                        <span class="status-indicator" aria-hidden="true">${task.status === 'Done' ? '✓' : ''}</span>
                        <span class="task-title">${escapeHtml(task.title)}</span>
                        <span class="task-status">${task.status}</span>
                        <span class="row-chevron" aria-hidden="true">›</span>
                      </button>
                    </li>
                  `,
                )
                .join('')}
            </ul>`
          : `<p class="empty-state">${emptyMessage}</p>`
      }
    </section>
  `;

  container.querySelector('.add-task-button')?.addEventListener('click', options.onAdd);
  container.querySelectorAll<HTMLButtonElement>('[data-filter]').forEach((button) => {
    button.addEventListener('click', () => options.onFilter(button.dataset.filter as TaskFilter));
  });
  container.querySelectorAll<HTMLButtonElement>('[data-task-id]').forEach((button) => {
    button.addEventListener('click', () => options.onOpen(button.dataset.taskId ?? ''));
  });
}

function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (character) => {
    const entities: Record<string, string> = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;',
    };
    return entities[character];
  });
}

function escapeAttribute(value: string): string {
  return escapeHtml(value);
}
