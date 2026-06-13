import { useState, useEffect, useMemo } from 'react';
import { dbStore } from '@/data/storage/indexedDbStore.ts';
import { IndexedDbTaskRepository } from '@/data/repositories/IndexedDbTaskRepository.ts';
import { createTask as makeCreateTask } from '@/domain/use-cases/createTask.ts';
import { getDailyTasks as makeGetDailyTasks } from '@/domain/use-cases/getDailyTasks.ts';
import { completeTask as makeCompleteTask } from '@/domain/use-cases/completeTask.ts';

export function useDatabase() {
  const [dbReady, setDbReady] = useState(false);

  useEffect(() => {
    dbStore.open().then((result) => {
      if (result.ok) setDbReady(true);
    });
  }, []);

  const taskRepo = useMemo(() => new IndexedDbTaskRepository(), []);

  const createTaskUseCase = useMemo(() => makeCreateTask(taskRepo), [taskRepo]);
  const getDailyTasksUseCase = useMemo(() => makeGetDailyTasks(taskRepo), [taskRepo]);
  const completeTaskUseCase = useMemo(() => makeCompleteTask(taskRepo), [taskRepo]);

  return { dbReady, createTaskUseCase, getDailyTasksUseCase, completeTaskUseCase };
}
