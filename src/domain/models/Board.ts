export interface Board {
  readonly id: string;
  readonly name: string;
  readonly createdAt: Date;
}

export interface BoardJSON {
  readonly id: string;
  readonly name: string;
  readonly createdAt: string;
}

export function boardToJSON(board: Board): BoardJSON {
  return {
    id: board.id,
    name: board.name,
    createdAt: board.createdAt.toISOString(),
  };
}

export function boardFromJSON(json: BoardJSON): Board {
  return {
    ...json,
    createdAt: new Date(json.createdAt),
  };
}
