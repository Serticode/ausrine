import { useState, useCallback, useRef } from 'react';

const MESSAGES = [
  'You did it.',
  "That's one down.",
  'Nice. One more?',
  'Small win. Big deal.',
  "Done. You're on a roll.",
];

export function useReward() {
  const [message, setMessage] = useState<string | null>(null);
  const bagRef = useRef<number[]>([]);

  const trigger = useCallback(() => {
    let bag = bagRef.current;
    if (bag.length === 0) {
      bag = MESSAGES.map((_, i) => i).sort(() => Math.random() - 0.5);
    }
    const index = bag.pop();
    if (index === undefined) return;
    bagRef.current = bag;
    setMessage(MESSAGES[index]);
  }, []);

  const dismiss = useCallback(() => {
    setMessage(null);
  }, []);

  return { message, trigger, dismiss } as const;
}
