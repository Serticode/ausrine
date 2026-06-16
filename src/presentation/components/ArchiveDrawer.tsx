import type { Task } from '@/domain/models/Task.ts';

interface ArchiveDrawerProps {
  readonly tasks: readonly Task[];
  readonly isOpen: boolean;
  readonly onToggle: () => void;
  readonly onDelete?: (taskId: string) => void;
}

export function ArchiveDrawer({ tasks, isOpen, onToggle, onDelete }: ArchiveDrawerProps) {
  return (
    <>
      {/* Toggle button */}
      <button
        type="button"
        onClick={onToggle}
        className="fixed right-5 top-5 z-40 toolbar-pill text-[11px] tracking-[0.04em] uppercase text-gold-700 hover:text-gold-900 cursor-pointer"
        style={{ padding: '8px 16px', borderRadius: '9999px' }}
      >
        {isOpen ? 'Close archive' : `Archive (${tasks.length})`}
      </button>

      {/* Drawer */}
      {isOpen && (
        <div className="fixed right-0 top-0 bottom-0 w-72 z-30 glass-panel rounded-l-2xl rounded-r-none p-4 overflow-y-auto animate-fade-in">
          <h3 className="text-[13px] font-medium tracking-[-0.01em] text-gold-900 mb-3">Archived</h3>
          {tasks.length === 0 ? (
            <p className="text-[12px] text-gold-400">No completed tasks yet.</p>
          ) : (
            <div className="space-y-2">
              {tasks.map((task) => (
                <div
                  key={task.id}
                  className="p-2 rounded-[10px] bg-black/[0.04] flex items-start justify-between gap-2"
                >
                  <div className="min-w-0">
                    <p className="text-[12px] leading-snug text-gold-700 line-through opacity-60 truncate">
                      {task.title}
                    </p>
                    <p className="text-[10px] text-gold-400 mt-0.5">{task.completedAt?.toLocaleDateString()}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => onDelete?.(task.id)}
                    className="flex-shrink-0 text-[10px] tracking-[0.04em] uppercase text-gold-400 hover:text-dawn-500 transition-colors duration-150 cursor-pointer active:scale-[0.97]"
                    aria-label="Delete archived task"
                  >
                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 12 12"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.3"
                      strokeLinecap="round"
                    >
                      <path d="M3 3L9 9M9 3L3 9" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </>
  );
}
