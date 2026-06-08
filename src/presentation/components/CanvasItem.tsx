import { useState, useCallback, useRef, type ReactNode } from 'react';

/**
 * CanvasItem — a draggable item at a fixed world position on the EndlessCanvas.
 *
 * Position is world-space (x, y). The canvas transform handles the conversion.
 * Since there's no zoom, screen-pixel deltas equal world-pixel deltas.
 */

interface CanvasItemProps {
  readonly x: number;
  readonly y: number;
  readonly onMove?: (x: number, y: number) => void;
  readonly children: ReactNode;
}

export function CanvasItem({ x, y, onMove, children }: CanvasItemProps) {
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef({ x: 0, y: 0, itemX: 0, itemY: 0 });

  const handlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      if (e.button !== 0) return;
      e.stopPropagation();
      e.preventDefault();
      (e.target as HTMLElement).setPointerCapture(e.pointerId);

      dragStart.current = {
        x: e.clientX,
        y: e.clientY,
        itemX: x,
        itemY: y,
      };
      setIsDragging(true);
    },
    [x, y],
  );

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!isDragging) return;
      e.preventDefault();
      const dx = e.clientX - dragStart.current.x;
      const dy = e.clientY - dragStart.current.y;
      onMove?.(dragStart.current.itemX + dx, dragStart.current.itemY + dy);
    },
    [isDragging, onMove],
  );

  const handlePointerUp = useCallback((e: React.PointerEvent) => {
    (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    setIsDragging(false);
  }, []);

  const handlePointerCancel = useCallback(() => {
    setIsDragging(false);
  }, []);

  return (
    <div
      data-canvas-item
      className="absolute"
      style={{
        left: x,
        top: y,
        cursor: isDragging ? 'grabbing' : 'grab',
      }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerCancel}
    >
      {children}
    </div>
  );
}
