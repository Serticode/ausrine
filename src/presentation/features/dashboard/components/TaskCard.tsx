import { GlassCard } from '@/presentation/components/GlassCard.tsx';
import { NOTE_COLOR_HEX, type NoteColor } from '@/domain/models/NoteColor.ts';

interface TaskCardProps {
  readonly title: string;
  readonly color: NoteColor;
  readonly body: string | null;
  readonly onComplete: () => void;
  readonly onDelete?: () => void;
}

export function TaskCard({ title, color, body, onComplete, onDelete }: TaskCardProps) {
  const hex = NOTE_COLOR_HEX[color];

  return (
    <GlassCard className="min-w-[260px] max-w-[360px] p-4" style={{ backgroundColor: `${hex}20` }}>
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-sm font-medium leading-snug tracking-[-0.01em] text-gold-900">{title}</h3>
        <button
          type="button"
          onClick={onComplete}
          className="flex-shrink-0 w-7 h-7 rounded-full border-2 border-gold-300 hover:border-gold-500 transition-transform duration-150 ease-out active:scale-[0.97] cursor-pointer flex items-center justify-center"
          aria-label="Complete task"
        >
          <svg
            width="12"
            height="12"
            viewBox="0 0 12 12"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-gold-500"
          >
            <path d="M2.5 6L5 8.5L9.5 3.5" />
          </svg>
        </button>
      </div>
      {body && <p className="mt-2 text-xs leading-relaxed tracking-[-0.01em] text-gold-600">{body}</p>}
      {onDelete && (
        <button
          type="button"
          onClick={onDelete}
          className="mt-3 text-[11px] tracking-[0.04em] text-gold-400 hover:text-dawn-500 transition-colors duration-150 ease-out cursor-pointer uppercase active:scale-[0.97]"
        >
          Delete
        </button>
      )}
    </GlassCard>
  );
}
