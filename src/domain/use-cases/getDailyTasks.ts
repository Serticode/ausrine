import type { Result } from '@/domain/models/Result.ts';
import type { Task } from '@/domain/models/Task.ts';
import type { TaskRepository } from '@/domain/repositories/TaskRepository.ts';

export function getDailyTasks(taskRepo: TaskRepository) {
  return async (boardId: string): Promise<Result<readonly Task[]>> => {
    const result = await taskRepo.getByBoard(boardId);
    if (!result.ok) return result;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const daily = result.value.filter((t) => {
      if (t.isDone) return false;
      if (t.parentTaskId !== null) return false;
      return t.createdAt >= today;
    });

    daily.sort((a, b) => a.position - b.position);

    return { ok: true, value: daily };
  };
}
