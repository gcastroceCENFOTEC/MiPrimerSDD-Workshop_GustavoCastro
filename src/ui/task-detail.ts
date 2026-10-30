import type { Task } from '../application/task-repository';

interface TaskDetailOptions {
  task: Task;
  confirmDelete: boolean;
  onBack(): void;
  onEdit(): void;
  onToggle(): void;
  onDeleteRequest(): void;
  onDeleteConfirm(): void;
  onDeleteCancel(): void;
}

export function renderTaskDetail(container: HTMLElement, options: TaskDetailOptions): void {
  const { task } = options;
  container.innerHTML = `
    <section class="detail-screen" aria-labelledby="detail-title">
      <button class="back-button" type="button" aria-label="Back to tasks">← <span>Back</span></button>
      <article class="task-detail">
        <p class="eyebrow">Task details</p>
        <h1 id="detail-title">${escapeHtml(task.title)}</h1>
        <p class="detail-description${task.description ? '' : ' is-muted'}">${escapeHtml(task.description || 'No description')}</p>
        <p class="detail-status"><span class="status-indicator${task.status === 'Done' ? ' is-done' : ''}" aria-hidden="true">${task.status === 'Done' ? '✓' : ''}</span><span>${task.status}</span></p>
        <div class="detail-actions">
          <button class="button button-primary edit-button" type="button">Edit</button>
          <button class="button button-secondary toggle-button" type="button">Mark as ${task.status === 'Pending' ? 'done' : 'not done'}</button>
          <button class="button button-danger delete-button" type="button">Delete</button>
        </div>
      </article>
      ${
        options.confirmDelete
          ? `<dialog class="delete-dialog" open aria-labelledby="delete-title">
              <h2 id="delete-title">Delete this task?</h2>
              <p>This action cannot be undone.</p>
              <div class="dialog-actions">
                <button class="button button-secondary cancel-delete" type="button">Cancel</button>
                <button class="button button-danger confirm-delete" type="button">Delete task</button>
              </div>
            </dialog>`
          : ''
      }
    </section>
  `;

  container.querySelector('.back-button')?.addEventListener('click', options.onBack);
  container.querySelector('.edit-button')?.addEventListener('click', options.onEdit);
  container.querySelector('.toggle-button')?.addEventListener('click', options.onToggle);
  container.querySelector('.delete-button')?.addEventListener('click', options.onDeleteRequest);
  container.querySelector('.cancel-delete')?.addEventListener('click', options.onDeleteCancel);
  container.querySelector('.confirm-delete')?.addEventListener('click', options.onDeleteConfirm);
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
