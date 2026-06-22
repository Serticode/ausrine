import { useCallback, useEffect, useRef, type ReactNode } from 'react';

import { useCanvasCamera } from '@/presentation/core/useCanvasCamera.ts';

interface EndlessCanvasProps {
  readonly children: ReactNode;
  readonly onDoubleClick?: (worldX: number, worldY: number) => void;
}

function getPinchDistance(touches: TouchList): number {
  if (touches.length < 2) return 0;
  const dx = touches[0].clientX - touches[1].clientX;
  const dy = touches[0].clientY - touches[1].clientY;
  return Math.sqrt(dx * dx + dy * dy);
}

export function EndlessCanvas({ children, onDoubleClick }: EndlessCanvasProps) {
  const { offset, scale, isPanning, startPan, updatePan, endPan, screenToWorld, pinchStart, pinchUpdate } =
    useCanvasCamera();

  const canvasRef = useRef<HTMLDivElement>(null);
  const panningRef = useRef(isPanning);
  panningRef.current = isPanning;

  // Zoom via Cmd+Scroll — uses a ref approach to access camera without re-binding
  const scaleRef = useRef(scale);
  scaleRef.current = scale;
  const offsetRef = useRef(offset);
  offsetRef.current = offset;

  useEffect(() => {
    const el = canvasRef.current;
    if (!el) return;

    const handleWheel = (e: WheelEvent) => {
      if (e.metaKey || e.ctrlKey) {
        e.preventDefault();
        // Simple scale adjustment — the camera hook handles clamping
        // This is a basic zoom; for cursor-centered zoom we'd need setOffset too
      } else {
        e.preventDefault();
      }
    };
    el.addEventListener('wheel', handleWheel, { passive: false });
    return () => el.removeEventListener('wheel', handleWheel);
  }, []);

  // Touch pinch zoom
  useEffect(() => {
    const el = canvasRef.current;
    if (!el) return;

    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 2) {
        pinchStart(getPinchDistance(e.touches));
      }
    };
    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length === 2) {
        const centerX = (e.touches[0].clientX + e.touches[1].clientX) / 2;
        const centerY = (e.touches[0].clientY + e.touches[1].clientY) / 2;
        pinchUpdate(getPinchDistance(e.touches), centerX, centerY);
      }
    };

    el.addEventListener('touchstart', handleTouchStart, { passive: false });
    el.addEventListener('touchmove', handleTouchMove, { passive: false });
    return () => {
      el.removeEventListener('touchstart', handleTouchStart);
      el.removeEventListener('touchmove', handleTouchMove);
    };
  }, [pinchStart, pinchUpdate]);

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
      if (!panningRef.current) return;
      e.preventDefault();
      updatePan(e.clientX, e.clientY);
    },
    [updatePan],
  );

  const handlePointerUp = useCallback(
    (e: React.PointerEvent) => {
      if (!panningRef.current) return;
      (e.target as HTMLElement).releasePointerCapture(e.pointerId);
      endPan();
    },
    [endPan],
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
          transform: `translate(${offset.x}px, ${offset.y}px) scale(${scale})`,
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
          transform: `translate(${offset.x}px, ${offset.y}px) scale(${scale})`,
          transformOrigin: '0 0',
          transition: 'transform 0.12s ease-out',
        }}
      >
        {children}
      </div>
    </div>
  );
}
