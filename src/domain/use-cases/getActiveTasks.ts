import type { Result } from '@/domain/models/Result.ts';
import type { Task } from '@/domain/models/Task.ts';
import type { TaskRepository } from '@/domain/repositories/TaskRepository.ts';

export interface ActiveTasks {
  readonly today: readonly Task[];
  readonly carryOver: readonly Task[];
  readonly priority: readonly Task[]; // 3+ days old
  readonly archived: readonly Task[];
}

export function getActiveTasks(taskRepo: TaskRepository) {
  return async (boardId: string): Promise<Result<ActiveTasks>> => {
    const result = await taskRepo.getByBoard(boardId);
    if (!result.ok) return result;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const threeDaysAgo = new Date(today);
    threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);

    const all = result.value;

    const archived: Task[] = [];
    const todayTasks: Task[] = [];
    const carryOver: Task[] = [];
    const priority: Task[] = [];

    for (const t of all) {
      if (t.isDone) {
        archived.push(t);
        continue;
      }
      if (t.parentTaskId !== null) continue;

      if (t.createdAt >= today) {
        todayTasks.push(t);
      } else if (t.createdAt < threeDaysAgo) {
        priority.push(t);
      } else {
        carryOver.push(t);
      }
    }

    todayTasks.sort((a, b) => a.position - b.position);
    carryOver.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
    priority.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
    archived.sort((a, b) => (b.completedAt?.getTime() ?? 0) - (a.completedAt?.getTime() ?? 0));

    return { ok: true, value: { today: todayTasks, carryOver, priority, archived } };
  };
}
