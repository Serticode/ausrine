import '@testing-library/jest-dom/vitest';
import 'fake-indexeddb/auto';

import { vi } from 'vitest';

const store = new Map<string, string>();
Object.defineProperty(window, 'localStorage', {
  value: {
    getItem: vi.fn((key: string) => store.get(key) ?? null),
    setItem: vi.fn((key: string, value: string) => store.set(key, value)),
    removeItem: vi.fn((key: string) => store.delete(key)),
    clear: vi.fn(() => store.clear()),
    get length() {
      return store.size;
    },
    key: vi.fn((index: number) => [...store.keys()][index] ?? null),
  },
  writable: true,
});
