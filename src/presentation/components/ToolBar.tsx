import { useCallback, useRef, type ReactNode } from 'react';

import {
  useToolbarPosition,
  type ToolbarEdge,
  getSlideTransform,
  getDirectionIcon,
} from '@/presentation/core/useToolbarPosition.ts';

interface ToolBarProps {
  readonly children?: ReactNode;
}

export function ToolBar({ children }: ToolBarProps) {
  const { edge, phase, startDrag, updateDrag, endDrag, toggleCollapse } = useToolbarPosition('bottom');
  const barRef = useRef<HTMLDivElement>(null);

  const handlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      if (e.button !== 0) return;
      e.preventDefault();
      (e.target as HTMLElement).setPointerCapture(e.pointerId);
      startDrag();
    },
    [startDrag],
  );

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      updateDrag(e.clientX, e.clientY, window.innerWidth, window.innerHeight);
    },
    [updateDrag],
  );

  const handlePointerUp = useCallback(
    (e: React.PointerEvent) => {
      (e.target as HTMLElement).releasePointerCapture(e.pointerId);
      endDrag();
    },
    [endDrag],
  );

  const hideToolbar = phase === 'hiding' || phase === 'hidden';
  const isHorizontal = edge === 'top' || edge === 'bottom';

  return (
    <div className="fixed z-100 select-none" style={containerBaseStyle(edge)}>
      {/* Expanded toolbar */}
      <div
        ref={barRef}
        className="toolbar-pill"
        style={{
          transform: hideToolbar ? getSlideTransform(edge, 'out') : 'translate(0,0)',
          opacity: hideToolbar ? 0 : 1,
          pointerEvents: hideToolbar ? 'none' : 'auto',
          transition: 'transform 200ms var(--ease-out-expo), opacity 200ms ease',
          display: 'flex',
          flexDirection: isHorizontal ? 'row' : 'column',
          alignItems: 'center',
          gap: isHorizontal ? undefined : undefined,
          padding: isHorizontal ? '8px 20px' : '20px 10px',
          minWidth: isHorizontal ? '360px' : undefined,
          minHeight: isHorizontal ? undefined : '120px',
        }}
      >
        {/* Tools */}
        <div className={isHorizontal ? 'flex items-center gap-1' : 'flex flex-col items-center gap-1'}>{children}</div>

        {/* Separator */}
        {isHorizontal ? <div className="w-px h-6 mx-2 bg-gold-300" /> : <div className="h-px w-6 my-2 bg-gold-300" />}

        {/* Collapse + drag handle */}
        <div className={isHorizontal ? 'flex items-center gap-1' : 'flex flex-col items-center gap-1'}>
          <button
            type="button"
            onClick={toggleCollapse}
            className="flex items-center justify-center w-7 h-7 rounded-full transition-colors duration-150 ease-out hover:bg-black/5 dark:hover:bg-white/10 active:scale-[0.97] cursor-pointer text-gold-900 dark:text-white"
            aria-label="Collapse toolbar"
          >
            <DirectionalIcon edge={edge} collapsed={false} />
          </button>

          <div
            className="flex items-center justify-center w-7 h-7 rounded-full cursor-grab active:cursor-grabbing hover:bg-black/5 dark:hover:bg-white/10 touch-none active:scale-[0.97] transition-colors duration-150 ease-out text-gold-900 dark:text-white"
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
            aria-label="Drag to reposition"
          >
            <GripIcon />
          </div>
        </div>
      </div>

      {/* Collapsed tab — always at container position, fades in/out */}
      <button
        type="button"
        onClick={toggleCollapse}
        className="flex items-center justify-center cursor-pointer touch-none"
        style={{
          opacity: hideToolbar ? 1 : 0,
          pointerEvents: hideToolbar ? 'auto' : 'none',
          transition: 'opacity 200ms ease, transform 200ms var(--ease-out-expo)',
          transform: 'translate(0,0)',
          background: 'var(--color-glass-white)',
          backdropFilter: 'var(--glass-blur)',
          WebkitBackdropFilter: 'var(--glass-blur)',
          boxShadow: 'var(--glass-shadow)',
          borderRadius: '9999px',
          width: isHorizontal ? '48px' : '40px',
          height: isHorizontal ? '40px' : '48px',
          color: 'var(--color-gold-900)',
        }}
        aria-label="Expand toolbar"
      >
        <DirectionalIcon edge={edge} collapsed={true} />
      </button>
    </div>
  );
}

function DirectionalIcon({ edge, collapsed }: { edge: ToolbarEdge; collapsed: boolean }) {
  const dir = getDirectionIcon(edge, collapsed);
  switch (dir) {
    case 'down':
      return (
        <svg
          width="14"
          height="14"
          viewBox="0 0 14 14"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M3.5 5.25L7 8.75L10.5 5.25" />
        </svg>
      );
    case 'up':
      return (
        <svg
          width="14"
          height="14"
          viewBox="0 0 14 14"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M10.5 8.75L7 5.25L3.5 8.75" />
        </svg>
      );
    case 'left':
      return (
        <svg
          width="14"
          height="14"
          viewBox="0 0 14 14"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M8.75 10.5L5.25 7L8.75 3.5" />
        </svg>
      );
    case 'right':
      return (
        <svg
          width="14"
          height="14"
          viewBox="0 0 14 14"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M5.25 3.5L8.75 7L5.25 10.5" />
        </svg>
      );
  }
}

function GripIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor">
      <circle cx="4" cy="3" r="1.2" />
      <circle cx="10" cy="3" r="1.2" />
      <circle cx="4" cy="7" r="1.2" />
      <circle cx="10" cy="7" r="1.2" />
      <circle cx="4" cy="11" r="1.2" />
      <circle cx="10" cy="11" r="1.2" />
    </svg>
  );
}

function containerBaseStyle(edge: ToolbarEdge): React.CSSProperties {
  const offset = 24;
  switch (edge) {
    case 'bottom':
      return { bottom: offset, left: '50%', transform: 'translateX(-50%)' };
    case 'top':
      return { top: offset, left: '50%', transform: 'translateX(-50%)' };
    case 'left':
      return { left: offset, top: '50%', transform: 'translateY(-50%)' };
    case 'right':
      return { right: offset, top: '50%', transform: 'translateY(-50%)' };
  }
}
