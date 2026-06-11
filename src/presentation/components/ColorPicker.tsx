import { NOTE_COLORS, NOTE_COLOR_HEX, type NoteColor } from '@/domain/models/NoteColor.ts';

interface ColorPickerProps {
  readonly selected: NoteColor;
  readonly onSelect: (color: NoteColor) => void;
}

export function ColorPicker({ selected, onSelect }: ColorPickerProps) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {NOTE_COLORS.map((color) => {
        const hex = NOTE_COLOR_HEX[color];
        const isSelected = color === selected;
        return (
          <button
            key={color}
            type="button"
            onClick={() => onSelect(color)}
            className="w-6 h-6 rounded-full transition-transform duration-150 ease-out active:scale-[0.92] cursor-pointer"
            style={{
              backgroundColor: hex,
              outline: isSelected ? `2px solid ${hex}` : 'none',
              outlineOffset: isSelected ? '2px' : '0',
              boxShadow: isSelected ? `0 0 0 2px var(--color-gold-300)` : 'none',
            }}
            title={color}
            aria-label={`Select ${color}`}
          />
        );
      })}
    </div>
  );
}
