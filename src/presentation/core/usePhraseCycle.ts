import { useState, useEffect, useRef } from 'react';

const PHRASES = ['Tasks in little chunks.', 'Quiet focus.', 'One thing at a time.', 'Less, but better.'];

const VISIBLE_MS = 3600;
const ENTER_MS = 550;
const EXIT_MS = 400;

type Phase = 'entering' | 'visible' | 'exiting';

function delay(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}

export function usePhraseCycle() {
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [phase, setPhase] = useState<Phase>('entering');
  const cancelledRef = useRef(false);

  useEffect(() => {
    cancelledRef.current = false;

    async function cycle() {
      while (!cancelledRef.current) {
        setPhase('entering');
        await delay(ENTER_MS);
        if (cancelledRef.current) return;

        setPhase('visible');
        await delay(VISIBLE_MS);
        if (cancelledRef.current) return;

        setPhase('exiting');
        await delay(EXIT_MS);
        if (cancelledRef.current) return;

        setPhraseIndex((i) => (i + 1) % PHRASES.length);
      }
    }

    cycle();

    return () => {
      cancelledRef.current = true;
    };
  }, []);

  const words = PHRASES[phraseIndex].split(' ');

  return { phraseIndex, phase, words } as const;
}
