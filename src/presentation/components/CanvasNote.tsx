import { useState, useCallback, useRef } from 'react';
import type { Task } from '@/domain/models/Task.ts';
import { NoteBody } from '@/presentation/components/NoteBody.tsx';

interface CanvasNoteProps {
  readonly task: Task;
  readonly daysOld?: number;
  readonly onMove?: (id: string, x: number, y: number) => void;
  readonly onResize?: (id: string, width: number, height: number) => void;
  readonly onSave?: (task: Task) => void;
  readonly onComplete?: (task: Task) => void;
  readonly onDelete?: (task: Task) => void;
  readonly onToggleTodo?: (task: Task) => void;
  readonly onDragStart?: (id: string) => void;
  readonly onDragEnd?: (id: string) => void;
  readonly onDragOver?: (clientY: number) => void;
}

export function CanvasNote({
  task,
  daysOld = 0,
  onMove,
  onResize,
  onSave,
  onComplete,
  onDelete,
  onToggleTodo,
  onDragStart,
  onDragEnd,
  onDragOver,
}: CanvasNoteProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number } | null>(null);
  const dragStart = useRef({ x: 0, y: 0, itemX: 0, itemY: 0 });
  const resizeStart = useRef({ x: 0, y: 0, w: 0, h: 0 });

  const width = task.noteWidth ?? 220;
  const noteHeight = task.noteHeight ?? null;

  // ── Drag ──
  const handlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      if (e.button !== 0) return;
      const target = e.target as HTMLElement;
      if (target.closest('[data-resize-handle]')) return;
      if (target.closest('[contenteditable]')) return;

      e.stopPropagation();
      e.preventDefault();
      (e.target as HTMLElement).setPointerCapture(e.pointerId);

      dragStart.current = {
        x: e.clientX,
        y: e.clientY,
        itemX: task.canvasX,
        itemY: task.canvasY,
      };
      setIsDragging(true);
      setContextMenu(null);
      onDragStart?.(task.id);
    },
    [task.canvasX, task.canvasY, task.id, onDragStart],
  );

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (isResizing) {
        const dx = e.clientX - resizeStart.current.x;
        const dy = e.clientY - resizeStart.current.y;
        const newW = Math.max(140, resizeStart.current.w + dx);
        const newH = Math.max(80, resizeStart.current.h + dy);
        onResize?.(task.id, newW, newH);
        return;
      }
      if (!isDragging) return;
      e.preventDefault();
      const dx = e.clientX - dragStart.current.x;
      const dy = e.clientY - dragStart.current.y;
      onMove?.(task.id, dragStart.current.itemX + dx, dragStart.current.itemY + dy);
      onDragOver?.(e.clientY);
    },
    [isDragging, isResizing, onMove, onResize, task.id, onDragOver],
  );

  const handlePointerUp = useCallback(
    (e: React.PointerEvent) => {
      (e.target as HTMLElement).releasePointerCapture(e.pointerId);
      if (isDragging) {
        setIsDragging(false);
        onDragEnd?.(task.id);
      }
      if (isResizing) {
        setIsResizing(false);
      }
    },
    [isDragging, isResizing, onDragEnd, task.id],
  );

  const handlePointerCancel = useCallback(() => {
    setIsDragging(false);
    setIsResizing(false);
  }, []);

  // ── Resize ──
  const handleResizeDown = useCallback(
    (e: React.PointerEvent) => {
      e.stopPropagation();
      e.preventDefault();
      (e.target as HTMLElement).setPointerCapture(e.pointerId);
      resizeStart.current = {
        x: e.clientX,
        y: e.clientY,
        w: width,
        h: noteHeight ?? 96,
      };
      setIsResizing(true);
    },
    [width, noteHeight],
  );

  // ── Context menu ──
  const handleContextMenu = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setContextMenu({ x: e.clientX, y: e.clientY });
  }, []);

  const closeContextMenu = useCallback(() => setContextMenu(null), []);

  const handleToggleTodo = useCallback(() => {
    onToggleTodo?.({ ...task, isTodo: !task.isTodo });
    setContextMenu(null);
  }, [onToggleTodo, task]);

  // ── Complete ──
  const handleComplete = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      onComplete?.(task);
    },
    [onComplete, task],
  );

  // ── Delete ──
  const handleDelete = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      onDelete?.(task);
      setContextMenu(null);
    },
    [onDelete, task],
  );

  const handleSaveBody = useCallback(
    (html: string) => {
      const stripped = html.replace(/<[^>]*>/g, '').trim();
      const title = stripped || task.title;
      onSave?.({ ...task, title, body: html });
    },
    [onSave, task],
  );

  const isPriority = daysOld >= 3;

  return (
    <>
      <div
        data-canvas-item
        data-note-id={task.id}
        className="absolute"
        style={{
          left: task.canvasX,
          top: task.canvasY,
          width,
          ...(noteHeight ? { height: noteHeight } : {}),
          cursor: isDragging ? 'grabbing' : undefined,
        }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerCancel}
        onContextMenu={handleContextMenu}
      >
        <div
          className={`glass-panel flex flex-col p-3 h-full cursor-default ${isPriority ? 'ring-2' : ''}`}
          style={{
            backgroundColor: `color-mix(in oklab, var(--color-note-${task.color}) 20%, transparent)`,
            ...(isPriority ? { boxShadow: '0 0 0 2px var(--color-ausrine-accent)' } : {}),
          }}
        >
          {/* Body — contentEditable */}
          <div className="flex-1 min-w-0">
            <NoteBody html={task.body ?? task.title} onSave={handleSaveBody} placeholder="Empty note" />
          </div>

          {/* Footer row */}
          <div className="flex items-center gap-2 mt-2 pt-2 border-t border-black/[0.06] dark:border-white/[0.06]">
            <button
              type="button"
              onClick={handleComplete}
              className="flex-shrink-0 w-5 h-5 rounded-full border transition-colors duration-150 flex items-center justify-center cursor-pointer hover:border-gold-600 active:scale-90"
              style={{ borderColor: 'currentColor' }}
              aria-label="Mark done"
            >
              <svg
                width="11"
                height="11"
                viewBox="0 0 11 11"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M2 5.5L4.5 8L9 3" />
              </svg>
            </button>

            {task.isTodo ? (
              <span className="text-[9.5px] tracking-[0.04em] uppercase text-gold-400">Todo</span>
            ) : (
              <span className="text-[9.5px] tracking-[0.04em] uppercase text-gold-400/60">Note</span>
            )}

            {daysOld > 0 && (
              <span
                className={`text-[9.5px] tracking-[0.04em] uppercase ${isPriority ? 'text-ausrine-accent font-medium' : 'text-gold-400'}`}
              >
                {daysOld}d
              </span>
            )}

            <button
              type="button"
              onClick={handleDelete}
              className="ml-auto text-[10px] tracking-[0.04em] uppercase text-gold-400 hover:text-dawn-500 transition-colors duration-150 cursor-pointer active:scale-[0.97]"
            >
              Delete
            </button>
          </div>
        </div>

        {/* Resize handle */}
        <div
          data-resize-handle
          className="absolute right-0 bottom-0 w-4 h-4 cursor-nwse-resize"
          onPointerDown={handleResizeDown}
          aria-label="Resize note"
        />
      </div>

      {/* Context menu */}
      {contextMenu && (
        <>
          <div className="fixed inset-0 z-50" onClick={closeContextMenu} />
          <div
            className="fixed z-50 glass-popover py-1 px-1 min-w-[160px]"
            style={{ left: contextMenu.x, top: contextMenu.y }}
          >
            <button
              type="button"
              onClick={handleToggleTodo}
              className="block w-full text-left px-3 py-1.5 rounded-[6px] text-[12px] tracking-[-0.01em] text-gold-700 hover:bg-black/[0.05] transition-colors cursor-pointer"
            >
              {task.isTodo ? 'Convert to note' : 'Convert to todo'}
            </button>
            <button
              type="button"
              onClick={handleDelete}
              className="block w-full text-left px-3 py-1.5 rounded-[6px] text-[12px] tracking-[-0.01em] text-dawn-500 hover:bg-black/[0.05] transition-colors cursor-pointer"
            >
              Delete note
            </button>
          </div>
        </>
      )}
    </>
  );
}
