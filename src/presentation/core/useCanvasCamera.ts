import { useCallback, useRef, useState } from 'react';

const MIN_SCALE = 0.25;
const MAX_SCALE = 2.0;
const ZOOM_STEP = 0.1;

/**
 * Manages the camera state for the endless canvas — pan + zoom.
 *   offset — where the camera is looking (pan position, in screen pixels)
 *   scale  — zoom level (1 = 100%)
 *
 * Applied as a CSS transform on the content layer:
 *   transform: translate(offset.x px, offset.y px) scale(scale)
 */

export function useCanvasCamera() {
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [scale, setScale] = useState(1);
  const [isPanning, setIsPanning] = useState(false);
  const lastPointer = useRef({ x: 0, y: 0 });
  const pinchStartRef = useRef({ distance: 0, scale: 1 });

  const clampScale = useCallback((s: number) => Math.min(MAX_SCALE, Math.max(MIN_SCALE, s)), []);

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
      x: (screenX - offset.x) / scale,
      y: (screenY - offset.y) / scale,
    }),
    [offset.x, offset.y, scale],
  );

  const zoomIn = useCallback(() => {
    setScale((prev) => clampScale(prev + ZOOM_STEP));
  }, [clampScale]);

  const zoomOut = useCallback(() => {
    setScale((prev) => clampScale(prev - ZOOM_STEP));
  }, [clampScale]);

  const zoomTo = useCallback(
    (newScale: number, originX: number, originY: number) => {
      const clamped = clampScale(newScale);
      const factor = clamped / scale;
      // Zoom toward cursor: adjust offset so the point under cursor stays fixed
      setOffset((prev) => ({
        x: originX - (originX - prev.x) * factor,
        y: originY - (originY - prev.y) * factor,
      }));
      setScale(clamped);
    },
    [scale, clampScale],
  );

  const pinchStart = useCallback(
    (distance: number) => {
      pinchStartRef.current = { distance, scale };
    },
    [scale],
  );

  const pinchUpdate = useCallback(
    (distance: number, centerX: number, centerY: number) => {
      const { distance: startDist, scale: startScale } = pinchStartRef.current;
      if (startDist === 0) return;
      const newScale = clampScale(startScale * (distance / startDist));
      const factor = newScale / scale;
      setOffset((prev) => ({
        x: centerX - (centerX - prev.x) * factor,
        y: centerY - (centerY - prev.y) * factor,
      }));
      setScale(newScale);
    },
    [scale, clampScale],
  );

  return {
    offset,
    scale,
    isPanning,
    startPan,
    updatePan,
    endPan,
    screenToWorld,
    zoomIn,
    zoomOut,
    zoomTo,
    pinchStart,
    pinchUpdate,
  } as const;
}
