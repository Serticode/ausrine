import type { NoteColor } from './NoteColor.ts';

export interface Task {
  readonly id: string;
  readonly title: string;
  readonly color: NoteColor;
  readonly boardId: string;
  readonly createdAt: Date;
  readonly isDone: boolean;
  readonly position: number;
  readonly canvasX: number;
  readonly canvasY: number;
  readonly body: string | null;
  readonly completedAt: Date | null;
  readonly estimatedMinutes: number | null;
  readonly parentTaskId: string | null;
  readonly tags: readonly string[] | null;
}

export function taskToJSON(task: Task): TaskJSON {
  return {
    id: task.id,
    title: task.title,
    color: task.color,
    boardId: task.boardId,
    createdAt: task.createdAt.toISOString(),
    isDone: task.isDone,
    position: task.position,
    canvasX: task.canvasX,
    canvasY: task.canvasY,
    body: task.body,
    completedAt: task.completedAt?.toISOString() ?? null,
    estimatedMinutes: task.estimatedMinutes,
    parentTaskId: task.parentTaskId,
    tags: task.tags,
  };
}

export function taskFromJSON(json: TaskJSON): Task {
  return {
    ...json,
    createdAt: new Date(json.createdAt),
    completedAt: json.completedAt ? new Date(json.completedAt) : null,
  };
}

export interface TaskJSON {
  readonly id: string;
  readonly title: string;
  readonly color: NoteColor;
  readonly boardId: string;
  readonly createdAt: string;
  readonly isDone: boolean;
  readonly position: number;
  readonly canvasX: number;
  readonly canvasY: number;
  readonly body: string | null;
  readonly completedAt: string | null;
  readonly estimatedMinutes: number | null;
  readonly parentTaskId: string | null;
  readonly tags: readonly string[] | null;
}
