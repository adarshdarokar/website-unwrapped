import { useEffect, useCallback } from 'react';

interface ShortcutHandlers {
  onAnalyze?: () => void;
  onHistory?: () => void;
  onCompare?: () => void;
  onExport?: () => void;
  onToggleTheme?: () => void;
  onSearch?: () => void;
  onEscape?: () => void;
}

export function useKeyboardShortcuts(handlers: ShortcutHandlers) {
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    // Don't trigger shortcuts when typing in input fields
    const target = event.target as HTMLElement;
    if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) {
      // Only handle Escape in inputs
      if (event.key === 'Escape' && handlers.onEscape) {
        handlers.onEscape();
      }
      return;
    }

    const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
    const modifier = isMac ? event.metaKey : event.ctrlKey;

    // Ctrl/Cmd + K - Open search/command palette
    if (modifier && (event.key === 'k' || event.key === 'K')) {
      event.preventDefault();
      handlers.onSearch?.();
      return;
    }

    // Ctrl/Cmd + Enter - Analyze
    if (modifier && event.key === 'Enter') {
      event.preventDefault();
      handlers.onAnalyze?.();
      return;
    }

    // Single key shortcuts (no modifier needed) - handle both upper and lowercase
    const key = event.key.toLowerCase();
    switch (key) {
      case 'h':
        event.preventDefault();
        handlers.onHistory?.();
        break;
      case 'c':
        event.preventDefault();
        handlers.onCompare?.();
        break;
      case 'e':
        event.preventDefault();
        handlers.onExport?.();
        break;
      case 't':
        event.preventDefault();
        handlers.onToggleTheme?.();
        break;
      case 'k':
        // Also allow standalone K to open command palette
        event.preventDefault();
        handlers.onSearch?.();
        break;
      case 'escape':
        handlers.onEscape?.();
        break;
    }
  }, [handlers]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);
}

export const shortcuts = [
  { key: '⌘K', description: 'Open command palette' },
  { key: 'H', description: 'Go to history' },
  { key: 'C', description: 'Compare websites' },
  { key: 'E', description: 'Export analysis' },
  { key: 'T', description: 'Toggle dark mode' },
  { key: 'Esc', description: 'Close dialogs' },
];
