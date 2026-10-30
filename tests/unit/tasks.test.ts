import { describe, expect, it } from 'vitest';
import type { Task, TaskRepository } from '../../src/application/task-repository';
import { TaskTitleValidationError, Tasks } from '../../src/application/tasks';

class FakeTaskRepository implements TaskRepository {
  constructor(public tasks: Task[] = []) {}

  async getAll(): Promise<Task[]> {
    return [...this.tasks];
  }

  async saveAll(tasks: Task[]): Promise<void> {
    this.tasks = [...tasks];
  }
}

describe('Tasks', () => {
  it('creates Pending tasks with optional descriptions and appends them in creation order', async () => {
    const repository = new FakeTaskRepository();
    const tasks = new Tasks(repository, () => 'task-1');

    const created = await tasks.create('First task');

    expect(created).toEqual({
      id: 'task-1',
      title: 'First task',
      description: '',
      status: 'Pending',
    });
    await tasks.create('Second task', 'Details');
    await expect(tasks.list('All')).resolves.toMatchObject([
      { title: 'First task' },
      { title: 'Second task', description: 'Details' },
    ]);
  });

  it.each(['', '   ', '\t\n'])('rejects blank title %j', async (title) => {
    const tasks = new Tasks(new FakeTaskRepository());

    await expect(tasks.create(title)).rejects.toBeInstanceOf(TaskTitleValidationError);
  });

  it('filters tasks by completion status while preserving creation order', async () => {
    const repository = new FakeTaskRepository([
      { id: 'one', title: 'First', description: '', status: 'Pending' },
      { id: 'two', title: 'Second', description: '', status: 'Done' },
      { id: 'three', title: 'Third', description: '', status: 'Pending' },
    ]);
    const tasks = new Tasks(repository);

    await expect(tasks.list('All')).resolves.toEqual(repository.tasks);
    await expect(tasks.list('Pending')).resolves.toEqual([repository.tasks[0], repository.tasks[2]]);
    await expect(tasks.list('Done')).resolves.toEqual([repository.tasks[1]]);
  });

  it('edits task details while preserving its ID and status', async () => {
    const repository = new FakeTaskRepository([
      { id: 'task-1', title: 'Before', description: 'Old', status: 'Done' },
    ]);
    const tasks = new Tasks(repository);

    await expect(tasks.update('task-1', 'After', 'New')).resolves.toEqual({
      id: 'task-1',
      title: 'After',
      description: 'New',
      status: 'Done',
    });
  });

  it('toggles status in both directions', async () => {
    const repository = new FakeTaskRepository([
      { id: 'task-1', title: 'First', description: '', status: 'Pending' },
    ]);
    const tasks = new Tasks(repository);

    await expect(tasks.toggleStatus('task-1')).resolves.toMatchObject({ status: 'Done' });
    await expect(tasks.toggleStatus('task-1')).resolves.toMatchObject({ status: 'Pending' });
  });

  it('deletes only the selected task', async () => {
    const repository = new FakeTaskRepository([
      { id: 'one', title: 'First', description: '', status: 'Pending' },
      { id: 'two', title: 'Second', description: '', status: 'Done' },
    ]);
    const tasks = new Tasks(repository);

    await tasks.delete('one');

    expect(repository.tasks).toEqual([repository.tasks[0]]);
    expect(repository.tasks[0].id).toBe('two');
  });
});
