import type { Task } from '@/domain/models/Task.ts';
import { TaskCard } from './TaskCard.tsx';
import { EmptyState } from './EmptyState.tsx';

interface DailyTasksPanelProps {
  readonly tasks: readonly Task[];
  readonly onComplete: (task: Task) => void;
  readonly onDelete?: (task: Task) => void;
}

export function DailyTasksPanel({ tasks, onComplete, onDelete }: DailyTasksPanelProps) {
  if (tasks.length === 0) {
    return <EmptyState />;
  }

  const current = tasks[0];
  const peek = tasks.slice(1, 5);
  const hidden = tasks.length - 5;

  return (
    <div className="flex flex-col items-center gap-6">
      {/* Current focus task */}
      <div className="animate-fade-in-up">
        <p className="mb-2 text-[11px] font-medium tracking-[0.08em] uppercase text-gold-400 text-center">
          Focus on one thing
        </p>
        <TaskCard
          title={current.title}
          color={current.color}
          body={current.body}
          onComplete={() => onComplete(current)}
          onDelete={onDelete ? () => onDelete(current) : undefined}
        />
      </div>

      {/* Peek at remaining tasks */}
      {peek.length > 0 && (
        <div className="flex flex-col items-center gap-2">
          <p className="text-[11px] tracking-[0.04em] text-gold-400 uppercase">{tasks.length - 1} more today</p>
          {peek.map((task, i) => (
            <div
              key={task.id}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl transition-colors duration-150 hover:bg-black/5 cursor-pointer active:scale-[0.97]"
              onClick={() => onComplete(task)}
              style={{ animation: `fade-in-up 0.3s var(--ease-out-expo) both ${i * 60}ms` }}
            >
              <div
                className="w-2 h-2 rounded-full flex-shrink-0"
                style={{ backgroundColor: `var(--color-note-${task.color})` }}
              />
              <span className="text-xs tracking-[-0.01em] text-gold-600 line-clamp-1">{task.title}</span>
            </div>
          ))}
          {hidden > 0 && <p className="text-[11px] tracking-[0.04em] text-gold-400">+{hidden} more</p>}
        </div>
      )}
    </div>
  );
}
