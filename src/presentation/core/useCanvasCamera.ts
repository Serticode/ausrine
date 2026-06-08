import { useCallback, useRef, useState } from 'react';

/**
 * Manages the camera state for the endless canvas — pan only, no zoom.
 *   offset — where the camera is looking (pan position, in screen pixels)
 *
 * Applied as a CSS transform on the content layer:
 *   transform: translate(offset.x px, offset.y px)
 */

export function useCanvasCamera() {
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  const [isPanning, setIsPanning] = useState(false);
  const lastPointer = useRef({ x: 0, y: 0 });

  const startPan = useCallback((clientX: number, clientY: number) => {
    lastPointer.current = { x: clientX, y: clientY };
    setIsPanning(true);
  }, []);

  const updatePan = useCallback((clientX: number, clientY: number) => {
    const dx = clientX - lastPointer.current.x;
    const dy = clientY - lastPointer.current.y;
    lastPointer.current = { x: clientX, y: clientY };
    setOffset((prev) => ({ x: prev.x + dx, y: prev.y + dy }));
  }, []);

  const endPan = useCallback(() => {
    setIsPanning(false);
  }, []);

  const screenToWorld = useCallback(
    (screenX: number, screenY: number) => ({
      x: screenX - offset.x,
      y: screenY - offset.y,
    }),
    [offset.x, offset.y],
  );

  return {
    offset,
    isPanning,
    startPan,
    updatePan,
    endPan,
    screenToWorld,
  } as const;
}
