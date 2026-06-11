import { useState, useEffect, useCallback, useRef } from 'react';

import type { Task } from '@/domain/models/Task.ts';
import type { NoteColor } from '@/domain/models/NoteColor.ts';
import { createTask as makeCreateTask } from '@/domain/use-cases/createTask.ts';
import { getDailyTasks as makeGetDailyTasks } from '@/domain/use-cases/getDailyTasks.ts';
import { completeTask as makeCompleteTask } from '@/domain/use-cases/completeTask.ts';
import { IndexedDbTaskRepository } from '@/data/repositories/IndexedDbTaskRepository.ts';

export type TasksState =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; tasks: readonly Task[] }
  | { status: 'error'; error: string };

const taskRepo = new IndexedDbTaskRepository();
const createTaskUseCase = makeCreateTask(taskRepo);
const getDailyTasksUseCase = makeGetDailyTasks(taskRepo);
const completeTaskUseCase = makeCompleteTask(taskRepo);

const DEFAULT_BOARD_ID = crypto.randomUUID();

export function useTasks() {
  const [state, setState] = useState<TasksState>({ status: 'idle' });
  const tasksRef = useRef<readonly Task[]>([]);

  const load = useCallback(async () => {
    setState({ status: 'loading' });
    const result = await getDailyTasksUseCase(DEFAULT_BOARD_ID);
    if (result.ok) {
      tasksRef.current = result.value;
      setState({ status: 'success', tasks: result.value });
    } else {
      setState({ status: 'error', error: result.error });
    }
  }, []);

  const addTask = useCallback(
    async (title: string, color: NoteColor) => {
      const result = await createTaskUseCase({
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
    [load],
  );

  const finishTask = useCallback(
    async (task: Task) => {
      const result = await completeTaskUseCase(task);
      if (result.ok) {
        await load();
      }
      return result;
    },
    [load],
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
