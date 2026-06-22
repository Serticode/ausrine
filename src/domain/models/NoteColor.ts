export type NoteColor =
  | 'cream'
  | 'banana'
  | 'sand'
  | 'coral'
  | 'rose'
  | 'blush'
  | 'lilac'
  | 'sky'
  | 'aqua'
  | 'mint'
  | 'sage'
  | 'slate';

export const NOTE_COLOR_HEX: Record<NoteColor, string> = {
  cream: '#FFDF5C',
  banana: '#FFF09A',
  sand: '#FFBA7A',
  coral: '#FF9B80',
  rose: '#FFA8B8',
  blush: '#FFCEDD',
  lilac: '#C0A8FF',
  sky: '#8EC9FF',
  aqua: '#95DFDC',
  mint: '#8DE0A6',
  sage: '#C0D8A8',
  slate: '#CDD2DC',
};

export const NOTE_COLORS: readonly NoteColor[] = [
  'cream',
  'banana',
  'sand',
  'coral',
  'rose',
  'blush',
  'lilac',
  'sky',
  'aqua',
  'mint',
  'sage',
  'slate',
];
