import { useState, useCallback } from 'react';

const TOUR_COMPLETED_KEY = 'ausrine-tour-completed';

export interface TourStep {
  readonly target: string; // CSS selector for the element to highlight
  readonly title: string;
  readonly body: string;
  readonly placement: 'top' | 'bottom' | 'left' | 'right';
}

const STEPS: readonly TourStep[] = [
  {
    target: 'body',
    title: 'Hey there',
    body: 'Ausrine is a quiet space for thinking. Drop notes anywhere, move them around.',
    placement: 'bottom',
  },
  {
    target: '[data-canvas-item]',
    title: 'Your notes',
    body: 'Double-click anywhere on the canvas to drop a note. Click it to start typing.',
    placement: 'bottom',
  },
  {
    target: 'body',
    title: 'Move it around',
    body: 'Drag notes to arrange your thoughts. Drag them to the bottom of the screen to delete.',
    placement: 'bottom',
  },
  {
    target: 'body',
    title: 'Daily focus',
    body: 'Notes marked as todos appear in your daily focus. Each day starts fresh — undone tasks carry over.',
    placement: 'bottom',
  },
  {
    target: 'body',
    title: 'Make it yours',
    body: 'Right-click a note to toggle between note and todo. Create multiple canvases for different projects.',
    placement: 'bottom',
  },
];

export function useTour() {
  const [isOpen, setIsOpen] = useState(() => {
    try {
      return localStorage.getItem(TOUR_COMPLETED_KEY) !== 'true';
    } catch {
      return true;
    }
  });
  const [step, setStep] = useState(0);

  const current = STEPS[step] ?? null;

  const next = useCallback(() => {
    if (step < STEPS.length - 1) {
      setStep(step + 1);
    } else {
      setIsOpen(false);
      try {
        localStorage.setItem(TOUR_COMPLETED_KEY, 'true');
      } catch {
        /* noop */
      }
    }
  }, [step]);

  const skip = useCallback(() => {
    setIsOpen(false);
    try {
      localStorage.setItem(TOUR_COMPLETED_KEY, 'true');
    } catch {
      /* noop */
    }
  }, []);

  const replay = useCallback(() => {
    setStep(0);
    setIsOpen(true);
  }, []);

  return { isOpen, step, current, next, skip, replay, total: STEPS.length };
}
