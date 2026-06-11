import type { ReactNode } from 'react';

interface GlassCardProps {
  readonly children: ReactNode;
  readonly onClick?: () => void;
  readonly className?: string;
  readonly style?: React.CSSProperties;
}

export function GlassCard({ children, onClick, className = '', style }: GlassCardProps) {
  return (
    <div
      className={`glass-panel ${onClick ? 'cursor-pointer hover:shadow-lift transition-shadow duration-200' : ''} ${className}`}
      onClick={onClick}
      style={style}
    >
      {children}
    </div>
  );
}
