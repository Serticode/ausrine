import type { ReactNode } from 'react';

interface GlassButtonProps {
  readonly children: ReactNode;
  readonly onClick?: () => void;
  readonly className?: string;
  readonly disabled?: boolean;
  readonly title?: string;
}

export function GlassButton({ children, onClick, className = '', disabled, title }: GlassButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={`inline-flex items-center justify-center gap-1.5 px-4 py-2 text-xs font-medium tracking-[-0.01em] transition-transform duration-150 ease-out active:scale-[0.97] select-none glass-btn text-gold-800 ${disabled ? 'opacity-40 pointer-events-none' : 'cursor-pointer'} ${className}`}
    >
      {children}
    </button>
  );
}
