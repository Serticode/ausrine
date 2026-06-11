import type { Task } from '@/domain/models/Task.ts';
import type { TasksState } from '@/presentation/features/dashboard/hooks/useTasks.ts';
import { DailyTasksPanel } from './components/DailyTasksPanel.tsx';

interface DashboardScreenProps {
  readonly state: TasksState;
  readonly onComplete: (task: Task) => void;
  readonly onDelete?: (task: Task) => void;
  readonly onClose?: () => void;
}

export function DashboardScreen({ state, onComplete, onDelete, onClose }: DashboardScreenProps) {
  const content = () => {
    switch (state.status) {
      case 'idle':
      case 'loading':
        return <SkeletonState />;
      case 'error':
        return <ErrorState message={state.error} />;
      case 'success':
        return <DailyTasksPanel tasks={state.tasks} onComplete={onComplete} onDelete={onDelete} />;
    }
  };

  return (
    <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center">
      <div className="pointer-events-auto animate-scale-in">
        {content()}

        {onClose && (
          <div className="flex justify-center mt-4">
            <button
              type="button"
              onClick={onClose}
              className="text-[11px] tracking-[0.04em] uppercase text-gold-400 hover:text-gold-600 transition-colors duration-150 ease-out cursor-pointer active:scale-[0.97]"
            >
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function SkeletonState() {
  return (
    <div className="flex flex-col items-center gap-4 animate-pulse-skeleton">
      <div className="w-48 h-6 rounded-lg bg-gold-200" />
      <div className="w-72 h-32 rounded-2xl bg-gold-200" />
      <div className="w-40 h-4 rounded bg-gold-200" />
    </div>
  );
}

function ErrorState({ message }: { message: string }) {
  return (
    <div className="rounded-2xl bg-gold-50/60 px-6 py-4 text-center">
      <p className="text-sm text-dawn-500">Something went wrong</p>
      <p className="mt-1 text-xs text-gold-500">{message}</p>
      <p className="mt-3 text-[11px] tracking-[0.04em] text-gold-400">Try reloading the page</p>
    </div>
  );
}
