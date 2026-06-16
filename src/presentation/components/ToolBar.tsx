import { type ReactNode } from 'react';

interface ToolBarProps {
  readonly children?: ReactNode;
}

export function ToolBar({ children }: ToolBarProps) {
  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-100 select-none">
      <div
        className="toolbar-pill flex items-center gap-1"
        style={{
          padding: '8px 16px',
        }}
      >
        {children}
      </div>
    </div>
  );
}
