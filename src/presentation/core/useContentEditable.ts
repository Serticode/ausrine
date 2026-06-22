import { useRef, useCallback, useEffect } from 'react';

interface UseContentEditableOptions {
  readonly initialHtml: string;
  readonly onSave: (html: string) => void;
  readonly placeholder?: string;
  readonly debounceMs?: number;
}

export function useContentEditable({
  initialHtml,
  onSave,
  placeholder = 'Empty note',
  debounceMs = 500,
}: UseContentEditableOptions) {
  const ref = useRef<HTMLDivElement>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastSavedRef = useRef(initialHtml);

  const save = useCallback(
    (html: string) => {
      if (html === lastSavedRef.current) return;
      lastSavedRef.current = html;
      onSave(html);
    },
    [onSave],
  );

  const debouncedSave = useCallback(
    (html: string) => {
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => save(html), debounceMs);
    },
    [save, debounceMs],
  );

  const flushSave = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    const el = ref.current;
    if (el) {
      const html = el.innerHTML;
      save(html);
    }
  }, [save]);

  // Set initial content once
  useEffect(() => {
    const el = ref.current;
    if (el && initialHtml && el.innerHTML !== initialHtml) {
      el.innerHTML = initialHtml;
    }
  }, [initialHtml]);

  // Auto-save on blur
  const handleBlur = useCallback(() => {
    flushSave();
  }, [flushSave]);

  const handleInput = useCallback(() => {
    const el = ref.current;
    if (el) {
      debouncedSave(el.innerHTML);
    }
  }, [debouncedSave]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      // Bold: Cmd+B
      if ((e.metaKey || e.ctrlKey) && e.key === 'b') {
        e.preventDefault();
        document.execCommand('bold');
        handleInput();
        return;
      }
      // Italic: Cmd+I
      if ((e.metaKey || e.ctrlKey) && e.key === 'i') {
        e.preventDefault();
        document.execCommand('italic');
        handleInput();
        return;
      }
      // Bulleted list: Cmd+Shift+8
      if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key === '8') {
        e.preventDefault();
        document.execCommand('insertUnorderedList');
        handleInput();
        return;
      }
      // Numbered list: Cmd+Shift+7
      if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key === '7') {
        e.preventDefault();
        document.execCommand('insertOrderedList');
        handleInput();
        return;
      }
    },
    [handleInput],
  );

  // Strip formatting on paste
  const handlePaste = useCallback((e: React.ClipboardEvent) => {
    e.preventDefault();
    const text = e.clipboardData.getData('text/plain');
    document.execCommand('insertText', false, text);
  }, []);

  return {
    ref,
    placeholder,
    handleBlur,
    handleInput,
    handleKeyDown,
    handlePaste,
    flushSave,
  };
}
