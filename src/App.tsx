import { useState, useEffect, useRef } from 'react';
import { AppHeader } from '@/presentation/components/AppHeader.tsx';

const PHRASES = ['Tasks in little chunks.', 'Quiet focus.', 'One thing at a time.', 'Less, but better.'];

const VISIBLE_MS = 3600;
const ENTER_MS = 550;
const EXIT_MS = 400;
const STAGGER_ENTER = 25;
const STAGGER_EXIT = 12.5;

type Phase = 'entering' | 'visible' | 'exiting';

export function App() {
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [phase, setPhase] = useState<Phase>('entering');
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    let cancelled = false;

    function scheduleCycle() {
      // Enter → Visible
      timerRef.current = setTimeout(() => {
        if (cancelled) return;
        setPhase('visible');

        // Visible → Exit
        timerRef.current = setTimeout(() => {
          if (cancelled) return;
          setPhase('exiting');

          // Exit → Next phrase
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

  return (
    <div className="relative min-h-dvh bg-paper text-ink-900">
      <div className="bg-grain pointer-events-none absolute inset-0 text-ink-900" aria-hidden="true" />
      <AppHeader taskCount={0} />
      <main className="flex flex-col items-center justify-center" style={{ minHeight: 'calc(100dvh - 48px)' }}>
        <h1 className="font-heading text-[32px] font-normal tracking-[-0.035em]">Aušrinė</h1>
        <p className="mt-2 flex flex-wrap justify-center gap-x-[0.25em] text-[16px] tracking-[-0.013em] text-ink-400">
          {words.map((word, i) => {
            const delay = phase === 'exiting' ? (words.length - 1 - i) * STAGGER_EXIT : i * STAGGER_ENTER;
            return (
              <span
                key={`${phraseIndex}-${i}`}
                className={`ink-word ${phase === 'exiting' ? 'ink-word--exit' : ''}`}
                style={{ transitionDelay: `${delay}ms` }}
              >
                {word}
                {i < words.length - 1 ? ' ' : ''}
              </span>
            );
          })}
        </p>
      </main>
    </div>
  );
}
