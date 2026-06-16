import { useState, useCallback } from 'react';

interface BoardInfo {
  readonly id: string;
  readonly name: string;
}

interface CanvasSwitcherProps {
  readonly boards: readonly BoardInfo[];
  readonly activeBoardId: string;
  readonly activeBoardName?: string;
  readonly onSwitch: (id: string) => void;
  readonly onAdd: (name: string) => void;
  readonly onRemove?: (id: string) => void;
}

export function CanvasSwitcher({
  boards,
  activeBoardId,
  activeBoardName,
  onSwitch,
  onAdd,
  onRemove,
}: CanvasSwitcherProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [newName, setNewName] = useState('');

  const handleAdd = useCallback(() => {
    const name = newName.trim();
    if (!name) return;
    onAdd(name);
    setNewName('');
    setIsOpen(false);
  }, [newName, onAdd]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter') handleAdd();
      if (e.key === 'Escape') setIsOpen(false);
    },
    [handleAdd],
  );

  return (
    <div className="fixed top-5 left-1/2 -translate-x-1/2 z-40">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="toolbar-pill flex items-center gap-2 text-[12px] tracking-[-0.01em] text-gold-700 cursor-pointer"
        style={{ padding: '8px 16px', borderRadius: '9999px' }}
      >
        <span>{activeBoardName ?? 'Main'}</span>
        <svg
          width="10"
          height="10"
          viewBox="0 0 10 10"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          style={{
            transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 0.2s var(--ease-out-expo)',
          }}
        >
          <path d="M2.5 3.5L5 6L7.5 3.5" />
        </svg>
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-30" onClick={() => setIsOpen(false)} />
          <div
            className="absolute top-full mt-2 left-1/2 -translate-x-1/2 z-30 min-w-[180px]"
            style={{
              animation: 'scale-in 0.2s var(--ease-out-expo) both',
            }}
          >
            <div className="glass-popover p-2">
              <div className="space-y-1">
                {boards.map((b) => (
                  <div key={b.id} className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => {
                        onSwitch(b.id);
                        setIsOpen(false);
                      }}
                      className={`flex-1 text-left px-3 py-1.5 rounded-[8px] text-[13px] tracking-[-0.01em] transition-colors cursor-pointer ${
                        b.id === activeBoardId
                          ? 'bg-black/[0.06] text-gold-900 font-medium'
                          : 'text-gold-600 hover:bg-black/[0.04]'
                      }`}
                    >
                      {b.name}
                    </button>
                    {boards.length > 1 && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onRemove?.(b.id);
                        }}
                        className="flex-shrink-0 w-6 h-6 flex items-center justify-center rounded-full text-gold-400 hover:text-dawn-500 hover:bg-dawn-500/10 transition-colors cursor-pointer"
                        aria-label={`Delete ${b.name}`}
                      >
                        <svg
                          width="10"
                          height="10"
                          viewBox="0 0 10 10"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                        >
                          <path d="M2.5 2.5L7.5 7.5M7.5 2.5L2.5 7.5" />
                        </svg>
                      </button>
                    )}
                  </div>
                ))}
              </div>
              <div className="mt-2 pt-2 border-t border-black/[0.06] dark:border-white/[0.06] flex gap-1">
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="New canvas..."
                  className="flex-1 bg-transparent text-[12px] tracking-[-0.01em] text-gold-900 placeholder:text-gold-400 outline-none px-1"
                />
                <button
                  type="button"
                  onClick={handleAdd}
                  disabled={!newName.trim()}
                  className="text-[11px] font-medium text-gold-600 hover:text-gold-800 disabled:opacity-30 cursor-pointer"
                >
                  Add
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
