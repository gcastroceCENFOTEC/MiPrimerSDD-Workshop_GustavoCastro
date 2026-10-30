import './styles/app.css';
import { TaskNotFoundError, Tasks, TaskTitleValidationError, type TaskFilter } from './application/tasks';
import { LocalStorageTaskRepository } from './persistence/local-storage-task-repository';
import { renderTaskDetail } from './ui/task-detail';
import { renderTaskForm } from './ui/task-form';
import { renderTaskList } from './ui/task-list';

const root = document.querySelector<HTMLElement>('#app');
if (!root) {
  throw new Error('Application root element was not found.');
}

const tasks = new Tasks(new LocalStorageTaskRepository(window.localStorage));
let currentScreen: 'list' | 'detail' | 'add' | 'edit' = 'list';
let currentFilter: TaskFilter = 'All';
let selectedTaskId = '';
let confirmDelete = false;

root.innerHTML = '<div class="app-shell"><div id="screen"></div></div>';
const screen = root.querySelector<HTMLElement>('#screen');
if (!screen) {
  throw new Error('Application screen element was not found.');
}
const screenElement = screen;

async function render(): Promise<void> {
  const errorElement = root?.querySelector('.app-error');
  errorElement?.remove();

  if (currentScreen === 'list') {
    const taskList = await tasks.list(currentFilter);
    renderTaskList(screenElement, taskList, {
      filter: currentFilter,
      onAdd: () => {
        currentScreen = 'add';
        void run(render);
      },
      onFilter: (filter) => {
        currentFilter = filter;
        void run(render);
      },
      onOpen: (id) => {
        selectedTaskId = id;
        currentScreen = 'detail';
        void run(render);
      },
    });
    return;
  }

  if (currentScreen === 'add' || currentScreen === 'edit') {
    const isEditing = currentScreen === 'edit';
    const task = isEditing ? await tasks.get(selectedTaskId) : undefined;
    renderTaskForm(screenElement, {
      title: task?.title ?? '',
      description: task?.description ?? '',
      isEditing,
      onCancel: () => {
        currentScreen = isEditing ? 'detail' : 'list';
        void run(render);
      },
      onSubmit: async (title, description) => {
        if (isEditing) {
          await tasks.update(selectedTaskId, title, description);
          currentScreen = 'detail';
        } else {
          await tasks.create(title, description);
          currentScreen = 'list';
        }
        await run(render);
      },
    });
    return;
  }

  const task = await tasks.get(selectedTaskId);
  renderTaskDetail(screenElement, {
    task,
    confirmDelete,
    onBack: () => {
      confirmDelete = false;
      currentScreen = 'list';
      void run(render);
    },
    onEdit: () => {
      currentScreen = 'edit';
      void run(render);
    },
    onToggle: () => {
      void run(async () => {
        await tasks.toggleStatus(selectedTaskId);
        await render();
      });
    },
    onDeleteRequest: () => {
      confirmDelete = true;
      void run(render);
    },
    onDeleteConfirm: () => {
      void run(async () => {
        await tasks.delete(selectedTaskId);
        confirmDelete = false;
        currentScreen = 'list';
        await render();
      });
    },
    onDeleteCancel: () => {
      confirmDelete = false;
      void run(render);
    },
  });
}

async function run(action: () => Promise<void>): Promise<void> {
  try {
    await action();
  } catch (error) {
    if (error instanceof TaskTitleValidationError || error instanceof TaskNotFoundError) {
      throw error;
    }
    const message = error instanceof Error ? error.message : 'An unexpected error occurred.';
    const alert = document.createElement('p');
    alert.className = 'app-error';
    alert.setAttribute('role', 'alert');
    alert.textContent = `Unable to complete the task action: ${message}`;
    root?.prepend(alert);
  }
}

void run(render);
