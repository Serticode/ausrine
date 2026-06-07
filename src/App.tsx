import { useState, useEffect, useCallback } from 'react';

const PHRASES = ['Tasks in little chunks.', 'Quiet focus.', 'One thing at a time.', 'Less, but better.'];

const VISIBLE_MS = 3800;
const FADE_MS = 700;

export function App() {
  const [index, setIndex] = useState(0);
  const [hidden, setHidden] = useState(false);

  const cycle = useCallback(() => {
    setHidden(true);
    setTimeout(() => {
      setIndex((i) => (i + 1) % PHRASES.length);
      setHidden(false);
    }, FADE_MS);
  }, []);

  useEffect(() => {
    const interval = setInterval(cycle, VISIBLE_MS + FADE_MS);
    return () => clearInterval(interval);
  }, [cycle]);

  return (
    <main className="relative flex min-h-dvh flex-col items-center justify-center bg-paper text-ink-900">
      <div className="bg-grain pointer-events-none absolute inset-0 text-ink-900" aria-hidden="true" />
      <h1 className="font-heading text-[32px] font-normal tracking-[-0.035em]">Aušrinė</h1>
      <p
        className={`mt-2 text-[16px] tracking-[-0.013em] text-ink-400 ink-phrase ${hidden ? 'ink-phrase--hidden' : ''}`}
      >
        {PHRASES[index]}
      </p>
    </main>
  );
}
