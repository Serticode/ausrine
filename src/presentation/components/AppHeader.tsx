interface AppHeaderProps {
  readonly taskCount: number;
}

export function AppHeader({ taskCount }: AppHeaderProps) {
  return (
    <header className="sticky top-0 z-10 flex items-center justify-between px-5 py-3 backdrop-blur-xl bg-white/60 border-b border-ink-200/50">
      <div className="flex items-center gap-2.5">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          className="h-7 w-7 flex-shrink-0"
          aria-hidden="true"
        >
          <rect width="24" height="24" rx="6" fill="#171717" />
          <path
            d="M16 5 Q 21 12 27 16 Q 21 20 16 27 Q 11 20 5 16 Q 11 12 16 5 Z"
            fill="#c8a96e"
            stroke="#b3975e"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
          <path d="M16 10 Q 19 13 22 16 Q 19 19 16 22 Q 13 19 10 16 Q 13 13 16 10 Z" fill="#d9c07f" opacity="0.7" />
        </svg>
        <span className="font-heading text-[18px] font-medium tracking-[-0.02em] text-ink-900">Aušrinė</span>
      </div>

      <span className="text-[13px] tracking-[-0.01em] text-ink-500 tabular-nums">
        {taskCount} {taskCount === 1 ? 'task' : 'tasks'}
      </span>
    </header>
  );
}
