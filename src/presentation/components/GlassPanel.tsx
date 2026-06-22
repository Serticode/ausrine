import type { ReactNode } from 'react';

interface GlassPanelProps {
  readonly children: ReactNode;
  readonly className?: string;
  readonly style?: React.CSSProperties;
  readonly onClick?: () => void;
}

export function GlassPanel({ children, className = '', style, onClick }: GlassPanelProps) {
  return (
    <div className={`glass-panel ${className}`} style={style} onClick={onClick}>
      {children}
    </div>
  );
}
