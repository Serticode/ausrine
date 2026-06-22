interface ShortcutsPanelProps {
  readonly isOpen: boolean;
  readonly onClose: () => void;
}

const SHORTCUTS = [
  { keys: 'Double-click canvas', action: 'New note' },
  { keys: 'Cmd+Enter', action: 'Submit brain dump' },
  { keys: 'Cmd+B', action: 'Bold' },
  { keys: 'Cmd+I', action: 'Italic' },
  { keys: 'Cmd+Shift+8', action: 'Bulleted list' },
  { keys: 'Cmd+Shift+7', action: 'Numbered list' },
  { keys: 'Cmd+Z / Undo toast', action: 'Undo delete' },
  { keys: 'Right-click note', action: 'Toggle note/todo' },
  { keys: '?', action: 'Show shortcuts' },
  { keys: 'Esc', action: 'Close panel / cancel' },
  { keys: 'Drag to bottom', action: 'Delete note' },
];

export function ShortcutsPanel({ isOpen, onClose }: ShortcutsPanelProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/10 animate-fade-in" onClick={onClose}>
      <div className="glass-popover p-5 max-w-[320px] animate-scale-in" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-[14px] font-medium tracking-[-0.01em] text-gold-900">Keyboard shortcuts</h3>
          <button
            type="button"
            onClick={onClose}
            className="text-gold-400 hover:text-gold-600 transition-colors cursor-pointer"
            aria-label="Close"
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 14 14"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            >
              <path d="M3.5 3.5L10.5 10.5M10.5 3.5L3.5 10.5" />
            </svg>
          </button>
        </div>

        <div className="space-y-1.5">
          {SHORTCUTS.map((s) => (
            <div key={s.action} className="flex items-center justify-between gap-3 text-[12px]">
              <kbd className="text-gold-500 tracking-[-0.01em] font-mono text-[11px]">{s.keys}</kbd>
              <span className="text-gold-700 tracking-[-0.01em]">{s.action}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
