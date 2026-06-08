import { useCallback, useEffect, useRef, type ReactNode } from 'react';

import { useCanvasCamera } from '@/presentation/core/useCanvasCamera.ts';

/**
 * EndlessCanvas — pan-only spatial canvas.
 *   Drag empty space → pan the camera
 *   Drag an item      → move the item (not the camera)
 *   Double click empty → create a new item at that spot
 *
 * Items carry data canvas item so we can tell them apart from empty space.
 */

interface EndlessCanvasProps {
  readonly children: ReactNode;
  readonly onDoubleClick?: (worldX: number, worldY: number) => void;
}

export function EndlessCanvas({ children, onDoubleClick }: EndlessCanvasProps) {
  const { offset, isPanning, startPan, updatePan, endPan, screenToWorld } = useCanvasCamera();

  // Non-passive wheel listener to block browser back/forward swipe navigation.
  // React's onWheel is passive — preventDefault() is silently ignored there.
  const canvasRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = canvasRef.current;
    if (!el) return;
    const blockWheel = (e: WheelEvent) => e.preventDefault();
    el.addEventListener('wheel', blockWheel, { passive: false });
    return () => el.removeEventListener('wheel', blockWheel);
  }, []);

  const handlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      if (e.button !== 0) return;
      const target = e.target as HTMLElement;
      const hitItem = target.closest('[data-canvas-item]');
      if (hitItem) return;

      e.preventDefault();
      (e.target as HTMLElement).setPointerCapture(e.pointerId);
      startPan(e.clientX, e.clientY);
    },
    [startPan],
  );

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!isPanning) return;
      e.preventDefault();
      updatePan(e.clientX, e.clientY);
    },
    [isPanning, updatePan],
  );

  const handlePointerUp = useCallback(
    (e: React.PointerEvent) => {
      if (!isPanning) return;
      (e.target as HTMLElement).releasePointerCapture(e.pointerId);
      endPan();
    },
    [isPanning, endPan],
  );

  const handlePointerCancel = useCallback(() => {
    endPan();
  }, [endPan]);

  const handleDoubleClick = useCallback(
    (e: React.MouseEvent) => {
      const target = e.target as HTMLElement;
      const hitItem = target.closest('[data-canvas-item]');
      if (hitItem) return;

      const world = screenToWorld(e.clientX, e.clientY);
      onDoubleClick?.(world.x, world.y);
    },
    [onDoubleClick, screenToWorld],
  );

  return (
    <div
      ref={canvasRef}
      className="absolute inset-0 overflow-hidden select-none"
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerCancel}
      onDoubleClick={handleDoubleClick}
      style={{
        cursor: isPanning ? 'grabbing' : 'grab',
        touchAction: 'none',
      }}
    >
      {/* Background dot grid */}
      <div
        aria-hidden="true"
        className="dot-grid absolute"
        style={{
          transform: `translate(${offset.x}px, ${offset.y}px)`,
          width: '10000px',
          height: '10000px',
          left: '-5000px',
          top: '-5000px',
        }}
      />

      {/* Content layer */}
      <div
        className="absolute"
        style={{
          transform: `translate(${offset.x}px, ${offset.y}px)`,
          transformOrigin: '0 0',
        }}
      >
        {children}
      </div>
    </div>
  );
}
