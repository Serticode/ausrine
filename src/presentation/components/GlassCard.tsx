import type { ReactNode } from 'react';
import { GlassPanel } from '@/presentation/components/GlassPanel.tsx';

interface GlassCardProps {
  readonly children: ReactNode;
  readonly onClick?: () => void;
  readonly className?: string;
  readonly style?: React.CSSProperties;
}

export function GlassCard({ children, onClick, className = '', style }: GlassCardProps) {
  return (
    <GlassPanel
      className={`${onClick ? 'cursor-pointer hover:shadow-lift transition-shadow duration-200' : ''} ${className}`}
      style={style}
      onClick={onClick}
    >
      {children}
    </GlassPanel>
  );
}
