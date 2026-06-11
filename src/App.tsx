import { useCallback, useState, useEffect } from 'react';

import { AppHeader } from '@/presentation/components/AppHeader.tsx';
import { EndlessCanvas } from '@/presentation/components/EndlessCanvas.tsx';
import { CanvasItem } from '@/presentation/components/CanvasItem.tsx';
import { SerticodeBadge } from '@/presentation/components/SerticodeBadge.tsx';
import { ToolBar } from '@/presentation/components/ToolBar.tsx';
import { usePhraseCycle } from '@/presentation/core/usePhraseCycle.ts';
import { useNotes } from '@/presentation/core/useNotes.ts';
import { useTheme } from '@/presentation/core/useTheme.ts';
import { useTasks } from '@/presentation/features/dashboard/hooks/useTasks.ts';
import { useReward } from '@/presentation/features/dashboard/hooks/useReward.ts';
import { DashboardScreen } from '@/presentation/features/dashboard/DashboardScreen.tsx';
import { TaskInput } from '@/presentation/features/dashboard/components/TaskInput.tsx';
import { BrainDump } from '@/presentation/features/dashboard/components/BrainDump.tsx';
import { dbStore } from '@/data/storage/indexedDbStore.ts';
import { brainDump as parseBrainDump } from '@/domain/use-cases/brainDump.ts';
import type { NoteColor } from '@/domain/models/NoteColor.ts';

const STAGGER_ENTER = 25;
const STAGGER_EXIT = 25.5;

type ActiveTool = 'add' | 'braindump' | 'dashboard' | null;

export function App() {
  const { phraseIndex, phase, words } = usePhraseCycle();
  const { notes, addNote, moveNote } = useNotes();
  const { isDark, toggleTheme } = useTheme();
  const { state, addTask, finishTask } = useTasks();
  const { message: rewardMessage, trigger: triggerReward, dismiss: dismissReward } = useReward();

  const [dbReady, setDbReady] = useState(false);
  const [activeTool, setActiveTool] = useState<ActiveTool>('add');

  useEffect(() => {
    dbStore.open().then((result) => {
      if (result.ok) setDbReady(true);
    });
  }, []);

  const handleCanvasDoubleClick = useCallback(
    (worldX: number, worldY: number) => {
      addNote(worldX, worldY, words.join(' '));
    },
    [addNote, words],
  );

  const handleAddTask = useCallback(
    async (title: string, color: NoteColor) => {
      const result = await addTask(title, color);
      if (result.ok) {
        setActiveTool(null);
      }
    },
    [addTask],
  );

  const handleComplete = useCallback(
    async (task: Parameters<typeof finishTask>[0]) => {
      await finishTask(task);
      triggerReward();
    },
    [finishTask, triggerReward],
  );

  const handleBrainDumpSubmit = useCallback(
    async (candidates: ReturnType<typeof parseBrainDump>) => {
      for (const c of candidates) {
        await addTask(c.text, 'cream');
      }
      setActiveTool(null);
    },
    [addTask],
  );

  const tasks = state.status === 'success' ? state.tasks : [];

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

      {/* Phrase cycle — centered overlay (hidden when dashboard is active) */}
      {activeTool !== 'dashboard' && (
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
      )}

      {/* Dashboard overlay */}
      {activeTool === 'dashboard' && dbReady && (
        <DashboardScreen state={state} onComplete={handleComplete} onClose={() => setActiveTool(null)} />
      )}

      {/* Reward message */}
      {rewardMessage && (
        <div className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center">
          <div className="pointer-events-auto animate-scale-up-bounce glass-popover px-6 py-3" onClick={dismissReward}>
            <p className="text-[16px] font-medium tracking-[-0.01em] text-gold-800">{rewardMessage}</p>
          </div>
        </div>
      )}

      {/* Quick add panel */}
      {activeTool === 'add' && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-20 animate-fade-in-up">
          <TaskInput onSubmit={handleAddTask} onCancel={() => setActiveTool(null)} />
        </div>
      )}

      {/* Brain dump panel */}
      {activeTool === 'braindump' && (
        <div className="fixed inset-0 z-20 flex items-center justify-center bg-black/10 animate-fade-in">
          <BrainDump onSubmit={handleBrainDumpSubmit} onClose={() => setActiveTool(null)} />
        </div>
      )}

      <AppHeader taskCount={notes.length + tasks.length} />

      <ToolBar>
        {/* Quick add */}
        <ToolButton
          icon={
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            >
              <path d="M8 3V13M3 8H13" />
            </svg>
          }
          label="Add task"
          isActive={activeTool === 'add'}
          onClick={() => setActiveTool(activeTool === 'add' ? null : 'add')}
        />

        {/* Brain dump */}
        <ToolButton
          icon={
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.3"
              strokeLinecap="round"
            >
              <path d="M3 4H13M3 8H10M3 12H7" />
            </svg>
          }
          label="Brain dump"
          isActive={activeTool === 'braindump'}
          onClick={() => setActiveTool(activeTool === 'braindump' ? null : 'braindump')}
        />

        {/* Dashboard */}
        <ToolButton
          icon={
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.3"
              strokeLinecap="round"
            >
              <rect x="2" y="3" width="12" height="10" rx="1.5" />
              <path d="M2 8H14" />
            </svg>
          }
          label="Dashboard"
          isActive={activeTool === 'dashboard'}
          onClick={() => setActiveTool(activeTool === 'dashboard' ? null : 'dashboard')}
        />

        {/* Dark mode */}
        <ToolButton
          icon={
            isDark ? (
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.3"
                strokeLinecap="round"
              >
                <circle cx="8" cy="8" r="3" />
                <path d="M8 2V3M8 13V14M2 8H3M13 8H14M4.05 4.05L4.76 4.76M11.24 11.24L11.95 11.95M4.05 11.95L4.76 11.24M11.24 4.76L11.95 4.05" />
              </svg>
            ) : (
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.3"
                strokeLinecap="round"
              >
                <path d="M13.5 10.5A6 6 0 015.5 2.5 6 6 0 1013.5 10.5z" />
              </svg>
            )
          }
          label={isDark ? 'Light mode' : 'Dark mode'}
          onClick={toggleTheme}
        />

        {/* Mute (placeholder) */}
        <ToolButton
          icon={
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.3"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M6 6L2 9H6V14L10 10" />
              <path d="M11 5C12.1 6.1 12.7 7.5 12.7 9" />
              <path d="M13 3C14.8 4.8 15.7 7 15.7 9" />
            </svg>
          }
          label="Mute"
          onClick={() => {}}
        />
      </ToolBar>

      <SerticodeBadge />
    </div>
  );
}

interface ToolButtonProps {
  readonly icon: React.ReactNode;
  readonly label: string;
  readonly isActive?: boolean;
  readonly onClick?: () => void;
}

function ToolButton({ icon, label, isActive, onClick }: ToolButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex items-center justify-center w-8 h-8 rounded-full transition-shadow transition-transform duration-150 ease-out active:scale-[0.92] cursor-pointer text-gold-900 dark:text-white ${
        isActive ? 'shadow-[0_0_0_2px_rgba(200,138,58,0.2)]' : 'hover:bg-black/5 dark:hover:bg-white/10'
      }`}
      title={label}
      aria-label={label}
    >
      {icon}
    </button>
  );
}
