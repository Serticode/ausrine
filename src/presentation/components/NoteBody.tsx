import { useContentEditable } from '@/presentation/core/useContentEditable.ts';

interface NoteBodyProps {
  readonly html: string;
  readonly onSave: (html: string) => void;
  readonly placeholder?: string;
}

export function NoteBody({ html, onSave, placeholder }: NoteBodyProps) {
  const { ref, handleBlur, handleInput, handleKeyDown, handlePaste } = useContentEditable({
    initialHtml: html,
    onSave,
    placeholder,
  });

  return (
    <div
      ref={ref}
      contentEditable
      suppressContentEditableWarning
      data-placeholder={placeholder ?? 'Empty note'}
      onBlur={handleBlur}
      onInput={handleInput}
      onKeyDown={handleKeyDown}
      onPaste={handlePaste}
      className="rich-body outline-none min-h-[1.5em] text-[14px] leading-snug tracking-[-0.01em] text-gold-900 caret-gold-900 cursor-text"
    />
  );
}
