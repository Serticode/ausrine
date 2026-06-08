interface AppHeaderProps {
  readonly taskCount: number;
}

export function AppHeader({ taskCount }: AppHeaderProps) {
  return (
    <header className="absolute top-0 left-0 right-0 z-10 flex items-center gap-2 px-5 py-4">
      <img src="/favicon.svg" alt="" className="h-5 w-5 flex-shrink-0" />

      <div className="flex flex-col leading-none">
        <span className="font-heading text-[12px] font-medium tracking-[-0.02em] text-gold-900">Aušrinė</span>
        <span className="text-[11px] tracking-[-0.01em] text-gold-500">/ɒʊˈʃʲrʲɪnʲeː/</span>
      </div>

      <span className="ml-3 text-[10px] tracking-[-0.01em] text-gold-400 tabular-nums">
        {taskCount} {taskCount === 1 ? 'task' : 'tasks'}
      </span>
    </header>
  );
}
