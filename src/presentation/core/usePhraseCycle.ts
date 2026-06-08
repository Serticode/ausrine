import { useState, useEffect, useRef } from 'react';

const PHRASES = ['Tasks in little chunks.', 'Quiet focus.', 'One thing at a time.', 'Less, but better.'];

const VISIBLE_MS = 3600;
const ENTER_MS = 550;
const EXIT_MS = 400;

type Phase = 'entering' | 'visible' | 'exiting';

export function usePhraseCycle() {
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [phase, setPhase] = useState<Phase>('entering');
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    let cancelled = false;
    function scheduleCycle() {
      timerRef.current = setTimeout(() => {
        if (cancelled) return;
        setPhase('visible');
        timerRef.current = setTimeout(() => {
          if (cancelled) return;
          setPhase('exiting');
          timerRef.current = setTimeout(() => {
            if (cancelled) return;
            setPhraseIndex((i) => (i + 1) % PHRASES.length);
            setPhase('entering');
            scheduleCycle();
          }, EXIT_MS);
        }, VISIBLE_MS);
      }, ENTER_MS);
    }
    scheduleCycle();
    return () => {
      cancelled = true;
      if (timerRef.current !== null) clearTimeout(timerRef.current);
    };
  }, []);

  const words = PHRASES[phraseIndex].split(' ');

  return { phraseIndex, phase, words } as const;
}
