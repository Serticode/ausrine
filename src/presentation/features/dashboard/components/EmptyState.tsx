export function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-12 text-center animate-fade-in">
      <div className="w-12 h-12 rounded-full glass-panel flex items-center justify-center">
        <svg
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          className="text-gold-400"
        >
          <path d="M10 4V16M4 10H16" />
        </svg>
      </div>
      <p className="text-[14px] tracking-[-0.01em] text-gold-500">No tasks yet.</p>
      <p className="text-[12px] tracking-[-0.01em] text-gold-400 max-w-[200px]">
        Add one using the toolbar below, or double-click anywhere on the canvas.
      </p>
    </div>
  );
}
