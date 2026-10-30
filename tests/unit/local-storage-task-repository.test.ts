import { describe, expect, it } from 'vitest';
import { LocalStorageTaskRepository } from '../../src/persistence/local-storage-task-repository';
import type { Task } from '../../src/application/task-repository';

class MemoryStorage implements Storage {
  private values = new Map<string, string>();

  get length(): number {
    return this.values.size;
  }

  clear(): void {
    this.values.clear();
  }

  getItem(key: string): string | null {
    return this.values.get(key) ?? null;
  }

  key(index: number): string | null {
    return [...this.values.keys()][index] ?? null;
  }

  removeItem(key: string): void {
    this.values.delete(key);
  }

  setItem(key: string, value: string): void {
    this.values.set(key, value);
  }
}

describe('LocalStorageTaskRepository', () => {
  it('loads an empty task collection when storage has no saved tasks', async () => {
    const repository = new LocalStorageTaskRepository(new MemoryStorage());

    await expect(repository.getAll()).resolves.toEqual([]);
  });

  it('round-trips task fields in their original creation order', async () => {
    const storage = new MemoryStorage();
    const repository = new LocalStorageTaskRepository(storage);
    const tasks: Task[] = [
      { id: 'first', title: 'First task', description: '', status: 'Pending' },
      { id: 'second', title: 'Second task', description: 'Details', status: 'Done' },
    ];

    await repository.saveAll(tasks);

    const reopenedRepository = new LocalStorageTaskRepository(storage);
    await expect(reopenedRepository.getAll()).resolves.toEqual(tasks);
  });

  it('reports malformed stored task data instead of silently replacing it', async () => {
    const storage = new MemoryStorage();
    storage.setItem('curso-pswe-07.tasks', '{invalid');
    const repository = new LocalStorageTaskRepository(storage);

    await expect(repository.getAll()).rejects.toThrow();
  });
});
