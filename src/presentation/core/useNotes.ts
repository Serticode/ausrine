import { useState, useCallback } from 'react';

const TINTS = ['#ffdf5c', '#ffba7a', '#ff9b80', '#c0a8ff', '#8ec9ff', '#8de0a6'];

interface Note {
  readonly id: string;
  readonly x: number;
  readonly y: number;
  readonly text: string;
  readonly tint: string;
}

export function useNotes() {
  const [notes, setNotes] = useState<readonly Note[]>([]);

  const addNote = useCallback((x: number, y: number, text: string) => {
    const id = crypto.randomUUID();
    const tint = TINTS[Math.floor(Math.random() * TINTS.length)];
    setNotes((prev) => [...prev, { id, x, y, text, tint }]);
  }, []);

  const moveNote = useCallback((id: string, x: number, y: number) => {
    setNotes((prev) => prev.map((n) => (n.id === id ? { ...n, x, y } : n)));
  }, []);

  return { notes, addNote, moveNote } as const;
}
