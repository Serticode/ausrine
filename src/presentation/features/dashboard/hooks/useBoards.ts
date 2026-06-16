import { useState, useMemo, useCallback } from 'react';

const BOARDS_KEY = 'ausrine-boards';
const ACTIVE_BOARD_KEY = 'ausrine-active-board';

export interface StoredBoard {
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
  const id = crypto.randomUUID();
  saveBoards([{ id, name: 'Main' }]);
  localStorage.setItem(ACTIVE_BOARD_KEY, id);
  return id;
}

export function useBoards() {
  const [boards, setBoards] = useState<readonly StoredBoard[]>(loadBoards);
  const [activeBoardId, setActiveBoardId] = useState(getActiveBoardId);

  const activeBoard = useMemo(() => boards.find((b) => b.id === activeBoardId) ?? boards[0], [boards, activeBoardId]);

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

  const removeBoard = useCallback(
    (id: string) => {
      const next = boards.filter((b) => b.id !== id);
      if (next.length === 0) {
        const newId = crypto.randomUUID();
        const fallback = [{ id: newId, name: 'Main' }];
        setBoards(fallback);
        saveBoards(fallback);
        setActiveBoardId(newId);
        localStorage.setItem(ACTIVE_BOARD_KEY, newId);
      } else {
        setBoards(next);
        saveBoards(next);
        if (activeBoardId === id) {
          const newActive = next[0].id;
          setActiveBoardId(newActive);
          localStorage.setItem(ACTIVE_BOARD_KEY, newActive);
        }
      }
    },
    [boards, activeBoardId],
  );

  const switchBoard = useCallback((id: string) => {
    setActiveBoardId(id);
    localStorage.setItem(ACTIVE_BOARD_KEY, id);
  }, []);

  return { boards, activeBoardId, activeBoard, addBoard, removeBoard, switchBoard };
}
