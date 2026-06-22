import type { TaskRepository } from '@/domain/repositories/TaskRepository.ts';
import type { Task } from '@/domain/models/Task.ts';
import { taskToJSON, taskFromJSON } from '@/domain/models/Task.ts';
import type { Result } from '@/domain/models/Result.ts';
import { ok, fail } from '@/domain/models/Result.ts';
import { dbStore } from '@/data/storage/indexedDbStore.ts';

const STORE = 'tasks';

export class IndexedDbTaskRepository implements TaskRepository {
  async getAll(): Promise<Result<readonly Task[]>> {
    const result = await dbStore.getAll<ReturnType<typeof taskToJSON>>(STORE);
    if (!result.ok) return result;
    return ok(result.value.map(taskFromJSON));
  }

  async getByBoard(boardId: string): Promise<Result<readonly Task[]>> {
    const result = await dbStore.getByIndex<ReturnType<typeof taskToJSON>>(STORE, 'boardId', boardId);
    if (!result.ok) return result;
    return ok(result.value.map(taskFromJSON));
  }

  async getById(id: string): Promise<Result<Task>> {
    const result = await dbStore.get<ReturnType<typeof taskToJSON>>(STORE, id);
    if (!result.ok) return result;
    if (!result.value) return fail('Task not found');
    return ok(taskFromJSON(result.value));
  }

  async save(task: Task): Promise<Result<void>> {
    return dbStore.put(STORE, taskToJSON(task));
  }

  async delete(id: string): Promise<Result<void>> {
    return dbStore.delete(STORE, id);
  }
}
