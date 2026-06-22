import { useCallback, useState, useRef, useEffect } from 'react';

import {
  AppHeader,
  EndlessCanvas,
  CanvasNote,
  TrashZone,
  CanvasSwitcher,
  ArchiveDrawer,
  TourOverlay,
  ShortcutsPanel,
  SerticodeBadge,
  ToolBar,
  TaskInput,
  BrainDump,
  usePhraseCycle,
  useTheme,
  useDatabase,
  useTour,
  useTasks,
  useBoards,
  useReward,
  parseBrainDump,
} from '@/presentation/components/AppDependencies.ts';
import { ToolButton } from '@/presentation/components/ToolButton.tsx';

import type { NoteColor } from '@/domain/models/NoteColor.ts';
import type { Task } from '@/domain/models/Task.ts';

const STAGGER_ENTER = 25;
const STAGGER_EXIT = 25.5;
const UNDO_TIMEOUT_MS = 5000;
const EMPTY_TASKS: readonly Task[] = [];

type ActiveTool = 'add' | 'braindump' | null;

function daysSince(date: Date): number {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const then = new Date(date);
  then.setHours(0, 0, 0, 0);
  return Math.floor((now.getTime() - then.getTime()) / 86400000);
}

export function App() {
  const { phraseIndex, phase, words } = usePhraseCycle();
  const { isDark, toggleTheme } = useTheme();
  const { dbReady, createTaskUseCase, getActiveTasksUseCase, completeTaskUseCase, saveTaskUseCase, deleteTaskUseCase } =
    useDatabase();
  const { boards, activeBoardId, activeBoard, addBoard, removeBoard, switchBoard } = useBoards();
  const {
    state,
    addTask,
    finishTask,
    moveTask,
    updateTaskSize,
    updateTask,
    removeTask,
    undoRemoveTask,
    deleteArchivedTask,
    archivedTasks,
  } = useTasks({
    createTask: createTaskUseCase,
    getActiveTasks: getActiveTasksUseCase,
    completeTask: completeTaskUseCase,
    saveTask: saveTaskUseCase,
    deleteTask: deleteTaskUseCase,
    activeBoardId,
  });
  const { message: rewardMessage, trigger: triggerReward, dismiss: dismissReward } = useReward();

  const [activeTool, setActiveTool] = useState<ActiveTool>(null);

  // Drag-to-trash
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [isOverTrash, setIsOverTrash] = useState(false);

  // Undo toast
  const [undoTask, setUndoTask] = useState<Task | null>(null);
  const undoTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Archive drawer
  const [archiveOpen, setArchiveOpen] = useState(false);

  // Tour
  const tour = useTour();

  // Keyboard shortcuts
  const [shortcutsOpen, setShortcutsOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === '?' && !e.metaKey && !e.ctrlKey) {
        e.preventDefault();
        setShortcutsOpen((v) => !v);
      }
      if (e.key === 'Escape') {
        setShortcutsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    return () => {
      if (undoTimeoutRef.current) clearTimeout(undoTimeoutRef.current);
    };
  }, []);

  const tasks = state.status === 'success' ? state.tasks : EMPTY_TASKS;

  const handleCanvasDoubleClick = useCallback(
    async (worldX: number, worldY: number) => {
      await addTask('', 'cream', worldX, worldY);
    },
    [addTask],
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
    async (task: Task) => {
      await finishTask(task);
      triggerReward();
    },
    [finishTask, triggerReward],
  );

  const handleSaveNote = useCallback(
    async (task: Task) => {
      await updateTask(task);
    },
    [updateTask],
  );

  const handleToggleTodo = useCallback(
    async (task: Task) => {
      await updateTask(task);
    },
    [updateTask],
  );

  const handleDelete = useCallback(
    async (task: Task) => {
      await removeTask(task);
      setUndoTask(task);
      if (undoTimeoutRef.current) clearTimeout(undoTimeoutRef.current);
      undoTimeoutRef.current = setTimeout(() => setUndoTask(null), UNDO_TIMEOUT_MS);
    },
    [removeTask],
  );

  const handleUndo = useCallback(() => {
    if (undoTimeoutRef.current) clearTimeout(undoTimeoutRef.current);
    undoRemoveTask();
    setUndoTask(null);
  }, [undoRemoveTask]);

  const handleDragStart = useCallback((id: string) => {
    setDraggingId(id);
    setIsOverTrash(false);
  }, []);

  const handleDragEnd = useCallback(
    (id: string) => {
      setDraggingId(null);
      if (isOverTrash) {
        const task = tasks.find((t) => t.id === id);
        if (task) {
          handleDelete(task);
        }
      }
      setIsOverTrash(false);
    },
    [isOverTrash, tasks, handleDelete],
  );

  const handleDragOver = useCallback((clientY: number) => {
    setIsOverTrash(clientY > window.innerHeight - 80);
  }, []);

  const handleBrainDumpSubmit = useCallback(
    async (candidates: ReturnType<typeof parseBrainDump>) => {
      for (const c of candidates) {
        await addTask(c.text, 'cream');
      }
      setActiveTool(null);
    },
    [addTask],
  );

  return (
    <div className="relative min-h-dvh bg-paper text-gold-900">
      <EndlessCanvas onDoubleClick={handleCanvasDoubleClick}>
        {tasks.map((task) => (
          <CanvasNote
            key={task.id}
            task={task}
            daysOld={daysSince(task.createdAt)}
            onMove={moveTask}
            onResize={updateTaskSize}
            onSave={handleSaveNote}
            onComplete={handleComplete}
            onDelete={handleDelete}
            onToggleTodo={handleToggleTodo}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            onDragOver={handleDragOver}
          />
        ))}
      </EndlessCanvas>

      {/* Phrase cycle — centered overlay (hidden when canvas has content) */}
      {tasks.length === 0 && (
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

      {/* Trash zone */}
      <TrashZone isActive={draggingId !== null} isOver={isOverTrash} />

      {/* Undo toast */}
      {undoTask && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-30 animate-fade-in-up">
          <div className="glass-popover px-4 py-2 flex items-center gap-3">
            <p className="text-[13px] tracking-[-0.01em] text-gold-800">Note deleted</p>
            <button
              type="button"
              onClick={handleUndo}
              className="text-[12px] font-medium tracking-[0.02em] text-ausrine-accent hover:underline cursor-pointer"
            >
              Undo
            </button>
          </div>
        </div>
      )}

      {/* Canvas switcher */}
      <CanvasSwitcher
        boards={boards}
        activeBoardId={activeBoardId}
        activeBoardName={activeBoard?.name}
        onSwitch={switchBoard}
        onAdd={addBoard}
        onRemove={removeBoard}
      />

      {/* Archive drawer */}
      <ArchiveDrawer
        tasks={archivedTasks}
        isOpen={archiveOpen}
        onToggle={() => setArchiveOpen(!archiveOpen)}
        onDelete={deleteArchivedTask}
      />

      {dbReady && <AppHeader taskCount={tasks.length} />}

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

      {/* Onboarding tour */}
      {tour.isOpen && tour.current && (
        <TourOverlay
          step={tour.current}
          stepIndex={tour.step}
          total={tour.total}
          onNext={tour.next}
          onSkip={tour.skip}
        />
      )}

      {/* Keyboard shortcuts */}
      <ShortcutsPanel isOpen={shortcutsOpen} onClose={() => setShortcutsOpen(false)} />
    </div>
  );
}
