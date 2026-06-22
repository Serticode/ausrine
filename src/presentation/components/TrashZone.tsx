interface TrashZoneProps {
  readonly isActive: boolean;
  readonly isOver: boolean;
}

export function TrashZone({ isActive, isOver }: TrashZoneProps) {
  if (!isActive) return null;

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-50 flex items-center justify-center pb-6 pointer-events-none"
      aria-live="polite"
    >
      <div
        className={`pointer-events-auto px-5 py-2.5 rounded-2xl transition-all duration-200 ${
          isOver ? 'bg-dawn-500/90 text-white shadow-lift scale-105' : 'bg-ink-900/70 text-white/70 shadow-soft'
        }`}
      >
        <p className="text-[13px] tracking-[-0.01em] font-medium">{isOver ? 'Release to delete' : 'Drag to trash'}</p>
      </div>
    </div>
  );
}
