import type { Result } from '@/domain/models/Result.ts';
import type { Task } from '@/domain/models/Task.ts';
import type { NoteColor } from '@/domain/models/NoteColor.ts';
import type { TaskRepository } from '@/domain/repositories/TaskRepository.ts';

interface CreateTaskInput {
  readonly title: string;
  readonly color: NoteColor;
  readonly boardId: string;
  readonly position: number;
  readonly canvasX?: number;
  readonly canvasY?: number;
  readonly body?: string | null;
  readonly parentTaskId?: string | null;
}

export function createTask(taskRepo: TaskRepository) {
  return async (input: CreateTaskInput): Promise<Result<Task>> => {
    const title = input.title.trim();
    if (!title) return { ok: false, error: 'Title is required' };

    const task: Task = {
      id: crypto.randomUUID(),
      title,
      color: input.color,
      boardId: input.boardId,
      createdAt: new Date(),
      isDone: false,
      position: input.position,
      canvasX: input.canvasX ?? 0,
      canvasY: input.canvasY ?? 0,
      body: input.body ?? null,
      completedAt: null,
      parentTaskId: input.parentTaskId ?? null,
    };

    const result = await taskRepo.save(task);
    if (!result.ok) return result;

    return { ok: true, value: task };
  };
}
