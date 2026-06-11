import type { ReactNode } from 'react';

interface GlassButtonProps {
  readonly children: ReactNode;
  readonly onClick?: () => void;
  readonly variant?: 'primary' | 'accent' | 'ghost';
  readonly className?: string;
  readonly disabled?: boolean;
  readonly title?: string;
}

export function GlassButton({
  children,
  onClick,
  variant = 'primary',
  className = '',
  disabled,
  title,
}: GlassButtonProps) {
  const base =
    'inline-flex items-center justify-center gap-1.5 px-4 py-2 text-xs font-medium tracking-[-0.01em] transition-transform duration-150 ease-out active:scale-[0.97] select-none';
  const variants = {
    primary: 'glass-btn text-gold-800',
    accent: 'glass-btn text-dawn-500',
    ghost: 'bg-transparent text-gold-500 hover:text-gold-700 hover:bg-black/5',
  };

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={`${base} ${variants[variant]} ${disabled ? 'opacity-40 pointer-events-none' : 'cursor-pointer'} ${className}`}
    >
      {children}
    </button>
  );
}
