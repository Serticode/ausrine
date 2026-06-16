interface ToolButtonProps {
  readonly icon: React.ReactNode;
  readonly label: string;
  readonly isActive?: boolean;
  readonly onClick?: () => void;
}

export function ToolButton({ icon, label, isActive, onClick }: ToolButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex items-center justify-center w-8 h-8 rounded-full transition-shadow transition-transform duration-150 ease-out active:scale-[0.92] cursor-pointer text-gold-900 dark:text-white ${
        isActive ? 'shadow-[0_0_0_2px_rgba(200,138,58,0.2)]' : 'hover:bg-black/5 dark:hover:bg-white/10'
      }`}
      title={label}
      aria-label={label}
    >
      {icon}
    </button>
  );
}
