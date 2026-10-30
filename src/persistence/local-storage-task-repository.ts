import type { Task, TaskRepository } from '../application/task-repository';

const STORAGE_KEY = 'curso-pswe-07.tasks';

export class LocalStorageTaskRepository implements TaskRepository {
  constructor(private readonly storage: Storage) {}

  async getAll(): Promise<Task[]> {
    const storedTasks = this.storage.getItem(STORAGE_KEY);
    if (storedTasks === null) {
      return [];
    }

    const storedValue: unknown = JSON.parse(storedTasks);
    if (!Array.isArray(storedValue) || !storedValue.every(isTask)) {
      throw new Error('Saved tasks contain invalid task data.');
    }

    return storedValue;
  }

  async saveAll(tasks: Task[]): Promise<void> {
    this.storage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  }
}

function isTask(value: unknown): value is Task {
  if (typeof value !== 'object' || value === null) {
    return false;
  }

  const task = value as Record<string, unknown>;
  return (
    typeof task.id === 'string' &&
    typeof task.title === 'string' &&
    typeof task.description === 'string' &&
    (task.status === 'Pending' || task.status === 'Done')
  );
}
