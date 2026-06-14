import type { Task } from '@/domain/models/Task.ts';

interface ArchiveDrawerProps {
  readonly tasks: readonly Task[];
  readonly isOpen: boolean;
  readonly onToggle: () => void;
}

export function ArchiveDrawer({ tasks, isOpen, onToggle }: ArchiveDrawerProps) {
  return (
    <>
      {/* Toggle button */}
      <button
        type="button"
        onClick={onToggle}
        className="fixed right-5 top-5 z-40 glass-btn px-3 py-1.5 text-[11px] tracking-[0.04em] uppercase text-gold-600 hover:text-gold-800 cursor-pointer"
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
                <div key={task.id} className="p-2 rounded-[10px] bg-black/[0.04]">
                  <p className="text-[12px] leading-snug text-gold-700 line-through opacity-60">{task.title}</p>
                  <p className="text-[10px] text-gold-400 mt-0.5">{task.completedAt?.toLocaleDateString()}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </>
  );
}
