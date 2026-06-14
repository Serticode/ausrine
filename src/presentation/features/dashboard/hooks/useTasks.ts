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

const BOARDS_KEY = 'ausrine-boards';
const ACTIVE_BOARD_KEY = 'ausrine-active-board';

interface StoredBoard {
  readonly id: string;
  readonly name: string;
}

function loadBoards(): StoredBoard[] {
  try {
    const raw = localStorage.getItem(BOARDS_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    /* noop */
  }
  return [];
}

function saveBoards(boards: readonly StoredBoard[]) {
  try {
    localStorage.setItem(BOARDS_KEY, JSON.stringify(boards));
  } catch {
    /* noop */
  }
}

function getActiveBoardId(): string {
  try {
    const stored = localStorage.getItem(ACTIVE_BOARD_KEY);
    if (stored) return stored;
  } catch {
    /* noop */
  }
  const boards = loadBoards();
  if (boards.length > 0) return boards[0].id;
  // Create default board
  const id = crypto.randomUUID();
  saveBoards([{ id, name: 'Main' }]);
  localStorage.setItem(ACTIVE_BOARD_KEY, id);
  return id;
}

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
}

const INITIAL_LAYOUT = {
  focusX: 80,
  focusY: 80,
  peekOffsetX: 310,
  peekOffsetY: 0,
  peekSpacing: 80,
};

export function useTasks({ createTask, getActiveTasks, completeTask, saveTask }: UseTasksDeps) {
  const [state, setState] = useState<TasksState>({ status: 'idle' });
  const tasksRef = useRef<readonly Task[]>([]);
  const activeTasksRef = useRef<ActiveTasks | null>(null);
  const lastDeletedRef = useRef<Task | null>(null);

  const [boards, setBoards] = useState<readonly StoredBoard[]>(loadBoards);
  const [activeBoardId, setActiveBoardId] = useState(getActiveBoardId);

  const activeBoard = useMemo(() => boards.find((b) => b.id === activeBoardId) ?? boards[0], [boards, activeBoardId]);

  const setTasks = useCallback((tasks: readonly Task[], active: ActiveTasks) => {
    tasksRef.current = tasks;
    activeTasksRef.current = active;
    setState({ status: 'success', tasks, active });
  }, []);

  const load = useCallback(async () => {
    setState({ status: 'loading' });
    const result = await getActiveTasks(activeBoardId);
    if (result.ok) {
      const { today, carryOver, priority } = result.value;
      // Auto-position tasks that don't have canvas positions
      let nextX = INITIAL_LAYOUT.focusX;
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
      // Place carry-overs to the right
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
  }, [getActiveTasks, activeBoardId]);

  useEffect(() => {
    load();
  }, [load]);

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
    },
    [setTasks],
  );

  const undoRemoveTask = useCallback(() => {
    const deleted = lastDeletedRef.current;
    if (!deleted) return;
    lastDeletedRef.current = null;
    const updated = [...tasksRef.current];
    const insertAt = Math.min(deleted.position, updated.length);
    updated.splice(insertAt, 0, deleted);
    const active = activeTasksRef.current;
    if (active) setTasks(updated, active);
  }, [setTasks]);

  // Board management
  const addBoard = useCallback(
    (name: string) => {
      const id = crypto.randomUUID();
      const next = [...boards, { id, name }];
      setBoards(next);
      saveBoards(next);
      setActiveBoardId(id);
      localStorage.setItem(ACTIVE_BOARD_KEY, id);
    },
    [boards],
  );

  const switchBoard = useCallback((id: string) => {
    setActiveBoardId(id);
    localStorage.setItem(ACTIVE_BOARD_KEY, id);
  }, []);

  const archivedTasks = useMemo(() => {
    const active = activeTasksRef.current;
    return active?.archived ?? [];
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
    reload: load,
    tasks: tasksRef,
    boards,
    activeBoardId,
    activeBoard,
    addBoard,
    switchBoard,
    archivedTasks,
  };
}
