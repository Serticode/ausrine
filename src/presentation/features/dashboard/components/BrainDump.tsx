import { useState, useCallback } from 'react';
import { brainDump, type BrainDumpCandidate } from '@/domain/use-cases/brainDump.ts';

interface BrainDumpProps {
  readonly onSubmit?: (candidates: BrainDumpCandidate[]) => void;
  readonly onClose?: () => void;
}

export function BrainDump({ onSubmit, onClose }: BrainDumpProps) {
  const [text, setText] = useState('');

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose?.();
      }
      if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        const candidates = brainDump(text);
        if (candidates.length > 0) {
          onSubmit?.(candidates);
        }
      }
    },
    [text, onSubmit, onClose],
  );

  const handleSubmit = useCallback(() => {
    const candidates = brainDump(text);
    if (candidates.length > 0) {
      onSubmit?.(candidates);
    }
  }, [text, onSubmit]);

  return (
    <div className="glass-popover p-5 min-w-[400px] max-w-[520px]">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-[15px] font-medium tracking-[-0.01em] text-gold-900">Brain Dump</h2>
        <button
          type="button"
          onClick={onClose}
          className="text-gold-400 hover:text-gold-600 transition-colors cursor-pointer"
          aria-label="Close"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          >
            <path d="M4 4L12 12M12 4L4 12" />
          </svg>
        </button>
      </div>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Pour everything out. Each line becomes a task candidate."
        className="w-full h-40 bg-transparent text-[14px] leading-relaxed tracking-[-0.01em] text-gold-900 placeholder:text-gold-400 outline-none resize-none"
        autoFocus
      />
      <div className="mt-3 flex items-center justify-between">
        <p className="text-[11px] tracking-[0.02em] text-gold-400">
          {text.trim() ? `${brainDump(text).length} tasks` : 'Start typing...'}
        </p>
        <button
          type="button"
          onClick={handleSubmit}
          disabled={!text.trim()}
          className="glass-btn px-4 py-1.5 text-[12px] font-medium text-gold-800 cursor-pointer disabled:opacity-40 disabled:pointer-events-none"
        >
          Parse & Add
        </button>
      </div>
      <p className="mt-2 text-[10px] tracking-[0.03em] text-gold-400">
        Lines longer than 80 characters will be flagged for breakdown. Press ⌘⏎ to submit.
      </p>
    </div>
  );
}
