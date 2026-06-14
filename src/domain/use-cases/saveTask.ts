import type { Result } from '@/domain/models/Result.ts';
import type { Task } from '@/domain/models/Task.ts';
import type { TaskRepository } from '@/domain/repositories/TaskRepository.ts';

export function saveTask(taskRepo: TaskRepository) {
  return async (task: Task): Promise<Result<Task>> => {
    const result = await taskRepo.save(task);
    if (!result.ok) return result;
    return { ok: true, value: task };
  };
}
