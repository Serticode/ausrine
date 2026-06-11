import type { NoteColor } from './NoteColor.ts';

export interface Board {
  readonly id: string;
  readonly name: string;
  readonly createdAt: Date;
  readonly isDefault: boolean;
  readonly isArchived: boolean;
  readonly accentColor: NoteColor | null;
}

export function boardToJSON(board: Board): BoardJSON {
  return {
    id: board.id,
    name: board.name,
    createdAt: board.createdAt.toISOString(),
    isDefault: board.isDefault,
    isArchived: board.isArchived,
    accentColor: board.accentColor,
  };
}

export function boardFromJSON(json: BoardJSON): Board {
  return {
    ...json,
    createdAt: new Date(json.createdAt),
  };
}

export interface BoardJSON {
  readonly id: string;
  readonly name: string;
  readonly createdAt: string;
  readonly isDefault: boolean;
  readonly isArchived: boolean;
  readonly accentColor: NoteColor | null;
}
