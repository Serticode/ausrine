import { useState, useEffect, useMemo } from 'react';
import { dbStore } from '@/data/storage/indexedDbStore.ts';
import { IndexedDbTaskRepository } from '@/data/repositories/IndexedDbTaskRepository.ts';
import { createTask as makeCreateTask } from '@/domain/use-cases/createTask.ts';

import { completeTask as makeCompleteTask } from '@/domain/use-cases/completeTask.ts';
import { saveTask as makeSaveTask } from '@/domain/use-cases/saveTask.ts';
import { getActiveTasks as makeGetActiveTasks } from '@/domain/use-cases/getActiveTasks.ts';
import { deleteTask as makeDeleteTask } from '@/domain/use-cases/deleteTask.ts';

export function useDatabase() {
  const [dbReady, setDbReady] = useState(false);

  useEffect(() => {
    dbStore.open().then((result) => {
      if (result.ok) setDbReady(true);
    });
  }, []);

  const taskRepo = useMemo(() => new IndexedDbTaskRepository(), []);

  const createTaskUseCase = useMemo(() => makeCreateTask(taskRepo), [taskRepo]);

  const completeTaskUseCase = useMemo(() => makeCompleteTask(taskRepo), [taskRepo]);
  const saveTaskUseCase = useMemo(() => makeSaveTask(taskRepo), [taskRepo]);
  const getActiveTasksUseCase = useMemo(() => makeGetActiveTasks(taskRepo), [taskRepo]);
  const deleteTaskUseCase = useMemo(() => makeDeleteTask(taskRepo), [taskRepo]);

  return {
    dbReady,
    createTaskUseCase,

    completeTaskUseCase,
    saveTaskUseCase,
    getActiveTasksUseCase,
    deleteTaskUseCase,
  };
}
