interface TaskFormOptions {
  title: string;
  description: string;
  isEditing: boolean;
  onCancel(): void;
  onSubmit(title: string, description: string): Promise<void>;
}

export function renderTaskForm(container: HTMLElement, options: TaskFormOptions): void {
  const actionLabel = options.isEditing ? 'Save' : 'Add task';
  container.innerHTML = `
    <section class="form-screen" aria-labelledby="form-title">
      <button class="back-button" type="button" aria-label="Back to tasks">← <span>Back</span></button>
      <form class="task-form">
        <p class="eyebrow">${options.isEditing ? 'Update your task' : 'Make a little progress'}</p>
        <h1 id="form-title">${options.isEditing ? 'Edit task' : 'Add task'}</h1>
        <label for="task-title">Title</label>
        <input id="task-title" name="title" type="text" required autocomplete="off" value="${escapeAttribute(options.title)}" />
        <p class="validation-message" role="alert" hidden></p>
        <label for="task-description">Description <span class="optional-label">(optional)</span></label>
        <textarea id="task-description" name="description" rows="5">${escapeHtml(options.description)}</textarea>
        <div class="form-actions">
          <button class="button button-primary" type="submit">${actionLabel}</button>
          <button class="button button-secondary cancel-button" type="button">Cancel</button>
        </div>
      </form>
    </section>
  `;

  container.querySelector('.back-button')?.addEventListener('click', options.onCancel);
  container.querySelector('.cancel-button')?.addEventListener('click', options.onCancel);
  container.querySelector<HTMLFormElement>('.task-form')?.addEventListener('submit', (event) => {
    event.preventDefault();
    const form = event.currentTarget as HTMLFormElement;
    const formData = new FormData(form);
    const title = String(formData.get('title') ?? '');
    const description = String(formData.get('description') ?? '');
    const validationMessage = form.querySelector<HTMLElement>('.validation-message');
    if (!title.trim()) {
      if (validationMessage) {
        validationMessage.textContent = 'Enter a task title.';
        validationMessage.hidden = false;
      }
      form.querySelector<HTMLInputElement>('#task-title')?.focus();
      return;
    }
    if (validationMessage) {
      validationMessage.hidden = true;
    }
    void options.onSubmit(title, description).catch((error: unknown) => {
      if (error instanceof Error && error.name === 'TaskTitleValidationError') {
        if (validationMessage) {
          validationMessage.textContent = error.message;
          validationMessage.hidden = false;
        }
        return;
      }
      throw error;
    });
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
