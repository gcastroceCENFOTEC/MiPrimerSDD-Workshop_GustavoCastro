import type { Task, TaskRepository, TaskStatus } from './task-repository';

export type TaskFilter = 'All' | TaskStatus;

export class TaskTitleValidationError extends Error {
  constructor() {
    super('Enter a task title.');
    this.name = 'TaskTitleValidationError';
  }
}

export class TaskNotFoundError extends Error {
  constructor(id: string) {
    super(`Task "${id}" was not found.`);
    this.name = 'TaskNotFoundError';
  }
}

export class Tasks {
  constructor(
    private readonly repository: TaskRepository,
    private readonly createId: () => string = () => crypto.randomUUID(),
  ) {}

  async list(filter: TaskFilter = 'All'): Promise<Task[]> {
    const tasks = await this.repository.getAll();
    return filter === 'All' ? tasks : tasks.filter((task) => task.status === filter);
  }

  async get(id: string): Promise<Task> {
    const task = (await this.repository.getAll()).find((candidate) => candidate.id === id);
    if (!task) {
      throw new TaskNotFoundError(id);
    }
    return task;
  }

  async create(title: string, description = ''): Promise<Task> {
    const task: Task = {
      id: this.createId(),
      title: this.validTitle(title),
      description,
      status: 'Pending',
    };
    const tasks = await this.repository.getAll();
    tasks.push(task);
    await this.repository.saveAll(tasks);
    return task;
  }

  async update(id: string, title: string, description: string): Promise<Task> {
    const tasks = await this.repository.getAll();
    const index = tasks.findIndex((task) => task.id === id);
    if (index < 0) {
      throw new TaskNotFoundError(id);
    }

    const task: Task = {
      ...tasks[index],
      title: this.validTitle(title),
      description,
    };
    tasks[index] = task;
    await this.repository.saveAll(tasks);
    return task;
  }

  async toggleStatus(id: string): Promise<Task> {
    const tasks = await this.repository.getAll();
    const index = tasks.findIndex((task) => task.id === id);
    if (index < 0) {
      throw new TaskNotFoundError(id);
    }

    const task: Task = {
      ...tasks[index],
      status: tasks[index].status === 'Pending' ? 'Done' : 'Pending',
    };
    tasks[index] = task;
    await this.repository.saveAll(tasks);
    return task;
  }

  async delete(id: string): Promise<void> {
    const tasks = await this.repository.getAll();
    const remainingTasks = tasks.filter((task) => task.id !== id);
    if (remainingTasks.length === tasks.length) {
      throw new TaskNotFoundError(id);
    }
    await this.repository.saveAll(remainingTasks);
  }

  private validTitle(title: string): string {
    const normalizedTitle = title.trim();
    if (!normalizedTitle) {
      throw new TaskTitleValidationError();
    }
    return normalizedTitle;
  }
}
