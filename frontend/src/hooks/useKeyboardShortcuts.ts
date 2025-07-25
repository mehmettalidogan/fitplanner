import { useEffect } from 'react';

interface KeyboardShortcuts {
  [key: string]: () => void;
}

const useKeyboardShortcuts = (shortcuts: KeyboardShortcuts) => {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Cmd+K or Ctrl+K için global search
      if ((event.metaKey || event.ctrlKey) && event.key === 'k') {
        event.preventDefault();
        shortcuts['cmd+k']?.();
        return;
      }

      // ESC tuşu
      if (event.key === 'Escape') {
        shortcuts['escape']?.();
        return;
      }

      // Enter tuşu
      if (event.key === 'Enter') {
        shortcuts['enter']?.();
        return;
      }

      // Arrow keys
      if (event.key === 'ArrowUp') {
        event.preventDefault();
        shortcuts['arrowup']?.();
        return;
      }

      if (event.key === 'ArrowDown') {
        event.preventDefault();
        shortcuts['arrowdown']?.();
        return;
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [shortcuts]);
};

export default useKeyboardShortcuts; 