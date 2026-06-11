import type { Result } from '@/domain/models/Result.ts';
import type { Task } from '@/domain/models/Task.ts';

export interface TaskRepository {
  getAll(): Promise<Result<readonly Task[]>>;
  getByBoard(boardId: string): Promise<Result<readonly Task[]>>;
  getById(id: string): Promise<Result<Task>>;
  save(task: Task): Promise<Result<void>>;
  delete(id: string): Promise<Result<void>>;
}
