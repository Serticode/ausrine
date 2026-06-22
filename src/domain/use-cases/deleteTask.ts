import type { Result } from '@/domain/models/Result.ts';
import type { TaskRepository } from '@/domain/repositories/TaskRepository.ts';

export function deleteTask(taskRepo: TaskRepository) {
  return async (id: string): Promise<Result<void>> => {
    return taskRepo.delete(id);
  };
}
