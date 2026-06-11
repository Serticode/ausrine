import type { ReactNode } from 'react';

interface GlassPanelProps {
  readonly children: ReactNode;
  readonly className?: string;
  readonly style?: React.CSSProperties;
}

export function GlassPanel({ children, className = '', style }: GlassPanelProps) {
  return (
    <div className={`glass-panel ${className}`} style={style}>
      {children}
    </div>
  );
}
