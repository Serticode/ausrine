import { useState, useEffect, useCallback, useRef, useMemo } from 'react';

import type { Task } from '@/domain/models/Task.ts';
import type { NoteColor } from '@/domain/models/NoteColor.ts';
import type { Result } from '@/domain/models/Result.ts';
import type { ActiveTasks } from '@/domain/use-cases/getActiveTasks.ts';

export type TasksState =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; tasks: readonly Task[]; active: ActiveTasks }
  | { status: 'error'; error: string };

interface UseTasksDeps {
  readonly createTask: (input: {
    readonly title: string;
    readonly color: NoteColor;
    readonly boardId: string;
    readonly position: number;
    readonly canvasX?: number;
    readonly canvasY?: number;
    readonly noteWidth?: number | null;
    readonly noteHeight?: number | null;
    readonly isTodo?: boolean;
  }) => Promise<Result<Task>>;
  readonly getActiveTasks: (boardId: string) => Promise<Result<ActiveTasks>>;
  readonly completeTask: (task: Task) => Promise<Result<Task>>;
  readonly saveTask: (task: Task) => Promise<Result<Task>>;
  readonly deleteTask: (id: string) => Promise<Result<void>>;
  readonly activeBoardId: string;
}

const INITIAL_LAYOUT = {
  focusX: 80,
  focusY: 80,
  peekOffsetX: 310,
  peekOffsetY: 0,
  peekSpacing: 80,
};

export function useTasks({
  createTask,
  getActiveTasks,
  completeTask,
  saveTask,
  deleteTask,
  activeBoardId,
}: UseTasksDeps) {
  const [state, setState] = useState<TasksState>({ status: 'loading' });
  const tasksRef = useRef<readonly Task[]>([]);
  const activeTasksRef = useRef<ActiveTasks | null>(null);
  const lastDeletedRef = useRef<Task | null>(null);

  const setTasks = useCallback((tasks: readonly Task[], active: ActiveTasks) => {
    tasksRef.current = tasks;
    activeTasksRef.current = active;
    setState({ status: 'success', tasks, active });
  }, []);

  const processResult = useCallback((result: Awaited<ReturnType<typeof getActiveTasks>>) => {
    if (result.ok) {
      const { today, carryOver, priority } = result.value;
      const nextX = INITIAL_LAYOUT.focusX;
      let nextY = INITIAL_LAYOUT.focusY;
      const all: Task[] = [];

      for (const t of today) {
        if (t.canvasX === 0 && t.canvasY === 0) {
          all.push({ ...t, canvasX: nextX, canvasY: nextY });
          nextY += INITIAL_LAYOUT.peekSpacing;
        } else {
          all.push(t);
        }
      }
      const carryX = INITIAL_LAYOUT.peekOffsetX;
      let carryY = INITIAL_LAYOUT.focusY;
      for (const t of carryOver) {
        if (t.canvasX === 0 && t.canvasY === 0) {
          all.push({ ...t, canvasX: carryX, canvasY: carryY });
          carryY += INITIAL_LAYOUT.peekSpacing;
        } else {
          all.push(t);
        }
      }
      for (const t of priority) {
        if (t.canvasX === 0 && t.canvasY === 0) {
          all.push({ ...t, canvasX: carryX, canvasY: carryY });
          carryY += INITIAL_LAYOUT.peekSpacing;
        } else {
          all.push(t);
        }
      }

      tasksRef.current = all;
      activeTasksRef.current = result.value;
      setState({ status: 'success', tasks: all, active: result.value });
    } else {
      setState({ status: 'error', error: result.error });
    }
  }, []);

  const fetchTasks = useCallback(() => {
    getActiveTasks(activeBoardId).then(processResult);
  }, [getActiveTasks, activeBoardId, processResult]);

  const load = useCallback(async () => {
    setState({ status: 'loading' });
    const result = await getActiveTasks(activeBoardId);
    processResult(result);
  }, [getActiveTasks, activeBoardId, processResult]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const addTask = useCallback(
    async (title: string, color: NoteColor, canvasX = 0, canvasY = 0) => {
      const result = await createTask({
        title: title || '‎',
        color,
        boardId: activeBoardId,
        position: tasksRef.current.length,
        canvasX,
        canvasY,
      });
      if (result.ok) {
        await load();
      }
      return result;
    },
    [createTask, activeBoardId, load],
  );

  const finishTask = useCallback(
    async (task: Task) => {
      const result = await completeTask(task);
      if (result.ok) {
        await load();
      }
      return result;
    },
    [completeTask, load],
  );

  const moveTask = useCallback(
    (id: string, x: number, y: number) => {
      const updated = tasksRef.current.map((t) => (t.id === id ? { ...t, canvasX: x, canvasY: y } : t));
      const active = activeTasksRef.current;
      if (active) setTasks(updated, active);
    },
    [setTasks],
  );

  const updateTaskSize = useCallback(
    (id: string, width: number, height: number) => {
      const updated = tasksRef.current.map((t) => (t.id === id ? { ...t, noteWidth: width, noteHeight: height } : t));
      const active = activeTasksRef.current;
      if (active) setTasks(updated, active);
    },
    [setTasks],
  );

  const updateTask = useCallback(
    async (updated: Task) => {
      const next = tasksRef.current.map((t) => (t.id === updated.id ? updated : t));
      const active = activeTasksRef.current;
      if (active) setTasks(next, active);
      await saveTask(updated);
    },
    [setTasks, saveTask],
  );

  const removeTask = useCallback(
    async (task: Task) => {
      lastDeletedRef.current = task;
      const next = tasksRef.current.filter((t) => t.id !== task.id);
      const active = activeTasksRef.current;
      if (active) setTasks(next, active);
      await deleteTask(task.id);
    },
    [setTasks, deleteTask],
  );

  const undoRemoveTask = useCallback(async () => {
    const deleted = lastDeletedRef.current;
    if (!deleted) return;
    lastDeletedRef.current = null;
    const result = await createTask({
      title: deleted.title,
      color: deleted.color,
      boardId: deleted.boardId,
      position: deleted.position,
      canvasX: deleted.canvasX,
      canvasY: deleted.canvasY,
      noteWidth: deleted.noteWidth,
      noteHeight: deleted.noteHeight,
      isTodo: deleted.isTodo,
    });
    if (result.ok) {
      await load();
    }
  }, [createTask, load]);

  const deleteArchivedTask = useCallback(
    async (id: string) => {
      await deleteTask(id);
      await load();
    },
    [deleteTask, load],
  );

  const archivedTasks = useMemo(() => {
    if (state.status === 'success') return state.active.archived;
    return [];
  }, [state]);

  return {
    state,
    addTask,
    finishTask,
    moveTask,
    updateTaskSize,
    updateTask,
    removeTask,
    undoRemoveTask,
    deleteArchivedTask,
    reload: load,
    tasks: tasksRef,
    archivedTasks,
  };
}
