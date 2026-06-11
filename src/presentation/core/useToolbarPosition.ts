import { useState, useCallback, useRef } from 'react';

export type ToolbarEdge = 'bottom' | 'top' | 'left' | 'right';
export type CollapsePhase = 'visible' | 'hiding' | 'hidden' | 'showing';

export function getNearestEdge(x: number, y: number, vw: number, vh: number): ToolbarEdge {
  const dist = {
    bottom: vh - y,
    top: y,
    left: x,
    right: vw - x,
  };
  return (Object.entries(dist) as [ToolbarEdge, number][]).sort((a, b) => a[1] - b[1])[0][0];
}

export function getSlideTransform(edge: ToolbarEdge, direction: 'out' | 'in'): string {
  const sign = direction === 'out' ? 1 : -1;
  switch (edge) {
    case 'bottom':
      return `translateY(${sign * 120}%)`;
    case 'top':
      return `translateY(${sign * -120}%)`;
    case 'left':
      return `translateX(${sign * -120}%)`;
    case 'right':
      return `translateX(${sign * 120}%)`;
  }
}

export function getDirectionIcon(edge: ToolbarEdge, collapsed: boolean): 'down' | 'up' | 'left' | 'right' {
  if (collapsed) {
    // Reveal — arrow points toward the center (opposite of the edge)
    switch (edge) {
      case 'bottom':
        return 'up';
      case 'top':
        return 'down';
      case 'left':
        return 'right';
      case 'right':
        return 'left';
    }
  } else {
    // Hide — arrow points outward (away from center, toward the edge)
    switch (edge) {
      case 'bottom':
        return 'down';
      case 'top':
        return 'up';
      case 'left':
        return 'left';
      case 'right':
        return 'right';
    }
  }
}

export function useToolbarPosition(initialEdge: ToolbarEdge = 'bottom') {
  const [edge, setEdge] = useState<ToolbarEdge>(initialEdge);
  const [phase, setPhase] = useState<CollapsePhase>('visible');
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const toggleCollapse = useCallback(() => {
    if (phase === 'visible') {
      setPhase('hiding');
      timerRef.current = setTimeout(() => setPhase('hidden'), 200);
    } else if (phase === 'hidden') {
      setPhase('showing');
      timerRef.current = setTimeout(() => setPhase('visible'), 200);
    }
  }, [phase]);

  const startDrag = useCallback(() => {}, []);

  const updateDrag = useCallback(
    (clientX: number, clientY: number, vw: number, vh: number) => {
      if (phase !== 'visible') return;
      setEdge(getNearestEdge(clientX, clientY, vw, vh));
    },
    [phase],
  );

  const endDrag = useCallback(() => {}, []);

  return {
    edge,
    phase,
    startDrag,
    updateDrag,
    endDrag,
    toggleCollapse,
  };
}
