import type { Result } from '@/domain/models/Result.ts';
import type { Task } from '@/domain/models/Task.ts';
import type { TaskRepository } from '@/domain/repositories/TaskRepository.ts';

export function completeTask(taskRepo: TaskRepository) {
  return async (task: Task): Promise<Result<Task>> => {
    const updated: Task = {
      ...task,
      isDone: true,
      completedAt: new Date(),
    };

    const result = await taskRepo.save(updated);
    if (!result.ok) return result;

    return { ok: true, value: updated };
  };
}
