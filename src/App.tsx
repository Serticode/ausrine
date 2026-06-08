import { useCallback } from 'react';
import { AppHeader } from '@/presentation/components/AppHeader.tsx';
import { EndlessCanvas } from '@/presentation/components/EndlessCanvas.tsx';
import { CanvasItem } from '@/presentation/components/CanvasItem.tsx';
import { SerticodeBadge } from '@/presentation/components/SerticodeBadge.tsx';
import { usePhraseCycle } from '@/presentation/core/usePhraseCycle.ts';
import { useNotes } from '@/presentation/core/useNotes.ts';

const STAGGER_ENTER = 25;
const STAGGER_EXIT = 25.5;

export function App() {
  const { phraseIndex, phase, words } = usePhraseCycle();
  const { notes, addNote, moveNote } = useNotes();

  const handleCanvasDoubleClick = useCallback(
    (worldX: number, worldY: number) => {
      addNote(worldX, worldY, words.join(' '));
    },
    [addNote, words],
  );

  return (
    <div className="relative min-h-dvh bg-paper text-gold-900">
      <EndlessCanvas onDoubleClick={handleCanvasDoubleClick}>
        {notes.map((note) => (
          <CanvasItem key={note.id} x={note.x} y={note.y} onMove={(nx, ny) => moveNote(note.id, nx, ny)}>
            <div className="glass-panel min-w-[140px] max-w-[220px] px-4 py-3" style={{ backgroundColor: note.tint }}>
              <p className="text-[14px] leading-snug tracking-[-0.01em] text-gold-900">{note.text}</p>
            </div>
          </CanvasItem>
        ))}
      </EndlessCanvas>

      {/* Greeting — fixed center overlay while canvas pans underneath */}
      <div className="pointer-events-none absolute inset-0 z-0 flex items-center justify-center">
        <div className="flex flex-col items-center text-center">
          <h1 className="font-heading text-[24px] font-normal tracking-[-0.015em]">Aušrinė</h1>
          <p className="mt-2 flex flex-wrap justify-center gap-x-[0.25em] text-[18px] tracking-[-0.013em] text-gold-400">
            {words.map((word, i) => {
              const delay = phase === 'exiting' ? (words.length - 1 - i) * STAGGER_EXIT : i * STAGGER_ENTER;
              return (
                <span
                  key={`${phraseIndex}-${i}`}
                  className={`ink-word ${phase === 'exiting' ? 'ink-word--exit' : ''}`}
                  style={{ transitionDelay: `${delay}ms` }}
                >
                  {word}
                  {i < words.length - 1 ? ' ' : ''}
                </span>
              );
            })}
          </p>
        </div>
      </div>

      <AppHeader taskCount={notes.length} />
      <SerticodeBadge />
    </div>
  );
}
