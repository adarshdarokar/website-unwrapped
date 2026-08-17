import { useEffect, useRef } from 'react';

interface ShortcutHandlers {
  onAnalyze?: () => void;
  onHistory?: () => void;
  onCompare?: () => void;
  onExport?: () => void;
  onToggleTheme?: () => void;
  onSearch?: () => void;
  onEscape?: () => void;
}

function isTypingTarget(target: EventTarget | null) {
  const el = target as HTMLElement | null;
  if (!el || !el.tagName) return false;
  return (
    el.tagName === 'INPUT' ||
    el.tagName === 'TEXTAREA' ||
    el.tagName === 'SELECT' ||
    el.isContentEditable ||
    !!el.closest?.('[contenteditable="true"]')
  );
}

export function useKeyboardShortcuts(handlers: ShortcutHandlers) {
  // Keep handlers in a ref so the listener is attached only once.
  const ref = useRef(handlers);
  ref.current = handlers;

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const h = ref.current;

      if (event.key === 'Escape') {
        h.onEscape?.();
        return;
      }

      // Never hijack typing.
      if (isTypingTarget(event.target)) return;

      const key = event.key.toLowerCase();
      const modifier = event.metaKey || event.ctrlKey;

      if (modifier) {
        // Only claim the two combos we own; leave copy/paste/etc. alone.
        if (key === 'k' && h.onSearch) {
          event.preventDefault();
          h.onSearch();
        } else if (event.key === 'Enter' && h.onAnalyze) {
          event.preventDefault();
          h.onAnalyze();
        }
        return;
      }

      if (event.altKey || event.shiftKey) return;

      // Don't fire single-key shortcuts while a dialog/menu is open.
      if (document.querySelector('[data-state="open"][role="dialog"], [role="menu"]')) return;

      const single: Record<string, (() => void) | undefined> = {
        h: h.onHistory,
        c: h.onCompare,
        e: h.onExport,
        t: h.onToggleTheme,
        k: h.onSearch,
      };

      const fn = single[key];
      if (fn) {
        event.preventDefault();
        fn();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);
}

export const shortcuts = [
  { key: '⌘K', description: 'Open command palette' },
  { key: 'H', description: 'Go to history' },
  { key: 'C', description: 'Compare websites' },
  { key: 'E', description: 'Export analysis' },
  { key: 'T', description: 'Toggle dark mode' },
  { key: 'Esc', description: 'Close dialogs' },
];
