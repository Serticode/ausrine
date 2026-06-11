import { useState } from 'react';
import { NOTE_COLORS, NOTE_COLOR_HEX, type NoteColor } from '@/domain/models/NoteColor.ts';

interface TaskInputProps {
  readonly onSubmit: (title: string, color: NoteColor) => void;
  readonly onCancel?: () => void;
}

export function TaskInput({ onSubmit, onCancel }: TaskInputProps) {
  const [title, setTitle] = useState('');
  const [color, setColor] = useState<NoteColor>('cream');

  const handleSubmit = () => {
    const trimmed = title.trim();
    if (!trimmed) return;
    onSubmit(trimmed, color);
    setTitle('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
    if (e.key === 'Escape') {
      onCancel?.();
    }
  };

  return (
    <div className="glass-panel p-3 min-w-[280px]">
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="A small thing to do… (2–5 min)"
        autoFocus
        className="w-full bg-transparent text-[15px] tracking-[-0.01em] text-gold-900 placeholder:text-gold-400 outline-none"
      />
      <div className="mt-3 flex items-center justify-between">
        <div className="flex gap-1">
          {NOTE_COLORS.slice(0, 6).map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setColor(c)}
              className="w-5 h-5 rounded-full transition-all cursor-pointer"
              style={{
                backgroundColor: NOTE_COLOR_HEX[c],
                outline: c === color ? `2px solid ${NOTE_COLOR_HEX[c]}` : 'none',
                outlineOffset: c === color ? '1px' : '0',
              }}
              aria-label={`Color: ${c}`}
            />
          ))}
        </div>
        <div className="flex gap-2">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="text-[12px] text-gold-400 hover:text-gold-600 transition-colors cursor-pointer"
            >
              Cancel
            </button>
          )}
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!title.trim()}
            className="glass-btn px-3 py-1 text-[12px] font-medium text-gold-800 cursor-pointer disabled:opacity-40 disabled:pointer-events-none"
          >
            Add
          </button>
        </div>
      </div>
    </div>
  );
}
