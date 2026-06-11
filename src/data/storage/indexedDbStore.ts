import { ok, fail, type Result } from '@/domain/models/Result.ts';

const DB_NAME = 'ausrine';
const DB_VERSION = 1;

export type StoreSchema = Record<string, string[]>;

const SCHEMA: StoreSchema = {
  tasks: ['boardId', 'isDone', 'createdAt'],
  boards: ['isArchived'],
  config: [],
};

export class IndexedDbStore {
  private db: IDBDatabase | null = null;
  private openPromise: Promise<Result<void>> | null = null;

  async open(): Promise<Result<void>> {
    if (this.db) return ok(undefined);
    if (this.openPromise) return this.openPromise;

    this.openPromise = new Promise<Result<void>>((resolve) => {
      try {
        const req = indexedDB.open(DB_NAME, DB_VERSION);
        req.onupgradeneeded = () => {
          const db = req.result;
          for (const [storeName, indexes] of Object.entries(SCHEMA)) {
            if (!db.objectStoreNames.contains(storeName)) {
              const store = db.createObjectStore(storeName, { keyPath: 'id' });
              for (const index of indexes) {
                store.createIndex(index, index, { unique: false });
              }
            }
          }
        };
        req.onsuccess = () => {
          this.db = req.result;
          resolve(ok(undefined));
        };
        req.onerror = () => {
          resolve(fail(req.error?.message ?? 'Failed to open IndexedDB'));
        };
      } catch (err) {
        resolve(fail(err instanceof Error ? err.message : 'Failed to open IndexedDB'));
      }
    });

    return this.openPromise;
  }

  private ensureStore(storeName: string, mode: IDBTransactionMode = 'readonly'): Promise<IDBObjectStore> {
    return this.open().then((result) => {
      if (!result.ok || !this.db) throw new Error('IndexedDB not available');
      const tx = this.db.transaction(storeName, mode);
      return tx.objectStore(storeName);
    });
  }

  async put<T extends { id: string }>(storeName: string, value: T): Promise<Result<void>> {
    try {
      const store = await this.ensureStore(storeName, 'readwrite');
      return new Promise((resolve) => {
        const req = store.put(value);
        req.onsuccess = () => resolve(ok(undefined));
        req.onerror = () => resolve(fail(req.error?.message ?? 'Failed to put'));
      });
    } catch (err) {
      return fail(err instanceof Error ? err.message : 'Failed to put');
    }
  }

  async get<T>(storeName: string, id: string): Promise<Result<T | null>> {
    try {
      const store = await this.ensureStore(storeName);
      return new Promise((resolve) => {
        const req = store.get(id);
        req.onsuccess = () => resolve(ok((req.result as T | undefined) ?? null));
        req.onerror = () => resolve(fail(req.error?.message ?? 'Failed to get'));
      });
    } catch (err) {
      return fail(err instanceof Error ? err.message : 'Failed to get');
    }
  }

  async getAll<T>(storeName: string): Promise<Result<readonly T[]>> {
    try {
      const store = await this.ensureStore(storeName);
      return new Promise((resolve) => {
        const req = store.getAll();
        req.onsuccess = () => resolve(ok(req.result as T[]));
        req.onerror = () => resolve(fail(req.error?.message ?? 'Failed to getAll'));
      });
    } catch (err) {
      return fail(err instanceof Error ? err.message : 'Failed to getAll');
    }
  }

  async getByIndex<T>(storeName: string, indexName: string, value: IDBValidKey): Promise<Result<readonly T[]>> {
    try {
      const store = await this.ensureStore(storeName);
      return new Promise((resolve) => {
        const req = store.index(indexName).getAll(value);
        req.onsuccess = () => resolve(ok(req.result as T[]));
        req.onerror = () => resolve(fail(req.error?.message ?? 'Failed to getByIndex'));
      });
    } catch (err) {
      return fail(err instanceof Error ? err.message : 'Failed to getByIndex');
    }
  }

  async delete(storeName: string, id: string): Promise<Result<void>> {
    try {
      const store = await this.ensureStore(storeName, 'readwrite');
      return new Promise((resolve) => {
        const req = store.delete(id);
        req.onsuccess = () => resolve(ok(undefined));
        req.onerror = () => resolve(fail(req.error?.message ?? 'Failed to delete'));
      });
    } catch (err) {
      return fail(err instanceof Error ? err.message : 'Failed to delete');
    }
  }
}

export const dbStore = new IndexedDbStore();
