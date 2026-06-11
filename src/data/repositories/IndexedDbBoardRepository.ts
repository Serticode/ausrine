import type { BoardRepository } from '@/domain/repositories/BoardRepository.ts';
import type { Board } from '@/domain/models/Board.ts';
import { boardToJSON, boardFromJSON } from '@/domain/models/Board.ts';
import type { Result } from '@/domain/models/Result.ts';
import { ok, fail } from '@/domain/models/Result.ts';
import { dbStore } from '@/data/storage/indexedDbStore.ts';

const STORE = 'boards';

export class IndexedDbBoardRepository implements BoardRepository {
  async getAll(): Promise<Result<readonly Board[]>> {
    const result = await dbStore.getAll<ReturnType<typeof boardToJSON>>(STORE);
    if (!result.ok) return result;
    return ok(result.value.map(boardFromJSON));
  }

  async getById(id: string): Promise<Result<Board>> {
    const result = await dbStore.get<ReturnType<typeof boardToJSON>>(STORE, id);
    if (!result.ok) return result;
    if (!result.value) return fail('Board not found');
    return ok(boardFromJSON(result.value));
  }

  async save(board: Board): Promise<Result<void>> {
    return dbStore.put(STORE, boardToJSON(board));
  }
}
