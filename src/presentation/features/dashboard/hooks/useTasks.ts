import { useState, useEffect, useCallback, useRef } from 'react';

import type { Task } from '@/domain/models/Task.ts';
import type { NoteColor } from '@/domain/models/NoteColor.ts';
import type { Result } from '@/domain/models/Result.ts';

export type TasksState =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; tasks: readonly Task[] }
  | { status: 'error'; error: string };

const DEFAULT_BOARD_ID_KEY = 'ausrine-default-board-id';

function getDefaultBoardId(): string {
  try {
    const stored = localStorage.getItem(DEFAULT_BOARD_ID_KEY);
    if (stored) return stored;
  } catch {
    /* localStorage unavailable */
  }
  const id = crypto.randomUUID();
  try {
    localStorage.setItem(DEFAULT_BOARD_ID_KEY, id);
  } catch {
    /* localStorage unavailable */
  }
  return id;
}

const DEFAULT_BOARD_ID = getDefaultBoardId();

interface UseTasksDeps {
  readonly createTask: (input: {
    readonly title: string;
    readonly color: NoteColor;
    readonly boardId: string;
    readonly position: number;
  }) => Promise<Result<Task>>;
  readonly getDailyTasks: (boardId: string) => Promise<Result<readonly Task[]>>;
  readonly completeTask: (task: Task) => Promise<Result<Task>>;
}

export function useTasks({ createTask, getDailyTasks, completeTask }: UseTasksDeps) {
  const [state, setState] = useState<TasksState>({ status: 'idle' });
  const tasksRef = useRef<readonly Task[]>([]);

  const load = useCallback(async () => {
    setState({ status: 'loading' });
    const result = await getDailyTasks(DEFAULT_BOARD_ID);
    if (result.ok) {
      tasksRef.current = result.value;
      setState({ status: 'success', tasks: result.value });
    } else {
      setState({ status: 'error', error: result.error });
    }
  }, [getDailyTasks]);

  const addTask = useCallback(
    async (title: string, color: NoteColor) => {
      const result = await createTask({
        title,
        color,
        boardId: DEFAULT_BOARD_ID,
        position: tasksRef.current.length,
      });
      if (result.ok) {
        await load();
      }
      return result;
    },
    [createTask, load],
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

  useEffect(() => {
    load();
  }, [load]);

  return {
    state,
    addTask,
    finishTask,
    reload: load,
  };
}
