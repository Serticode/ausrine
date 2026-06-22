import type { NoteColor } from './NoteColor.ts';

export interface Task {
  readonly id: string;
  readonly title: string;
  readonly color: NoteColor;
  readonly boardId: string;
  readonly createdAt: Date;
  readonly isDone: boolean;
  readonly isTodo: boolean;
  readonly position: number;
  readonly canvasX: number;
  readonly canvasY: number;
  readonly noteWidth: number | null;
  readonly noteHeight: number | null;
  readonly body: string | null;
  readonly completedAt: Date | null;
  readonly parentTaskId: string | null;
}

export function taskToJSON(task: Task): TaskJSON {
  return {
    id: task.id,
    title: task.title,
    color: task.color,
    boardId: task.boardId,
    createdAt: task.createdAt.toISOString(),
    isDone: task.isDone,
    isTodo: task.isTodo,
    position: task.position,
    canvasX: task.canvasX,
    canvasY: task.canvasY,
    noteWidth: task.noteWidth,
    noteHeight: task.noteHeight,
    body: task.body,
    completedAt: task.completedAt?.toISOString() ?? null,
    parentTaskId: task.parentTaskId,
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
  readonly isTodo: boolean;
  readonly position: number;
  readonly canvasX: number;
  readonly canvasY: number;
  readonly noteWidth: number | null;
  readonly noteHeight: number | null;
  readonly body: string | null;
  readonly completedAt: string | null;
  readonly parentTaskId: string | null;
}
