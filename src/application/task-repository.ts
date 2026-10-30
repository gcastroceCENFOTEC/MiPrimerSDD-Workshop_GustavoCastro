export type TaskStatus = 'Pending' | 'Done';

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
}

export interface TaskRepository {
  getAll(): Promise<Task[]>;
  saveAll(tasks: Task[]): Promise<void>;
}
