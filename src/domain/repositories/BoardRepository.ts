import type { Result } from '@/domain/models/Result.ts';
import type { Board } from '@/domain/models/Board.ts';

export interface BoardRepository {
  getAll(): Promise<Result<readonly Board[]>>;
  getById(id: string): Promise<Result<Board>>;
  save(board: Board): Promise<Result<void>>;
}
