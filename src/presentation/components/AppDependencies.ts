// Barrel file — all component and hook imports for App.tsx

export { AppHeader } from '@/presentation/components/AppHeader.tsx';
export { EndlessCanvas } from '@/presentation/components/EndlessCanvas.tsx';
export { CanvasNote } from '@/presentation/components/CanvasNote.tsx';
export { TrashZone } from '@/presentation/components/TrashZone.tsx';
export { CanvasSwitcher } from '@/presentation/components/CanvasSwitcher.tsx';
export { ArchiveDrawer } from '@/presentation/components/ArchiveDrawer.tsx';
export { TourOverlay } from '@/presentation/components/TourOverlay.tsx';
export { ShortcutsPanel } from '@/presentation/components/ShortcutsPanel.tsx';
export { SerticodeBadge } from '@/presentation/components/SerticodeBadge.tsx';
export { ToolBar } from '@/presentation/components/ToolBar.tsx';
export { TaskInput } from '@/presentation/features/dashboard/components/TaskInput.tsx';
export { BrainDump } from '@/presentation/features/dashboard/components/BrainDump.tsx';

export { usePhraseCycle } from '@/presentation/core/usePhraseCycle.ts';
export { useTheme } from '@/presentation/core/useTheme.ts';
export { useDatabase } from '@/presentation/core/useDatabase.ts';
export { useTour } from '@/presentation/core/useTour.ts';
export { useTasks } from '@/presentation/features/dashboard/hooks/useTasks.ts';
export { useBoards } from '@/presentation/features/dashboard/hooks/useBoards.ts';
export { useReward } from '@/presentation/features/dashboard/hooks/useReward.ts';

export { brainDump as parseBrainDump } from '@/domain/use-cases/brainDump.ts';
