import { useCallback, useEffect, useState } from 'react';

interface UseWindowSelectionOptions {
  debounceMs?: number;
  boundarySelector?: string;
}

type TextSelectionSnapshot = {
  text: string;
  range: Range; // clone 後的 Range
};

export function useWindowSelection(options: UseWindowSelectionOptions) {
  const { debounceMs = 1000, boundarySelector } = options;
  const [selectionSnapshot, setSelectionSnapshot] = useState<TextSelectionSnapshot | null>(null);

  const clearSelection = () => {
    setSelectionSnapshot(null);
  }

  const captureSelection = useCallback(() => {
    const sel = window.getSelection();
    if (!sel || sel.isCollapsed || sel.rangeCount === 0) return;

    const range = sel.getRangeAt(0);
    let ancestorEl = range.commonAncestorContainer as HTMLElement;

    if (ancestorEl.nodeType === Node.TEXT_NODE) {
      ancestorEl = ancestorEl.parentElement ?? ancestorEl;
    }

    if (boundarySelector) {
      const boundaryRoot = document.querySelector(boundarySelector);
      if (boundaryRoot && !boundaryRoot.contains(ancestorEl)) {
        console.warn('超出範圍');
        return;
      }
    }

    setSelectionSnapshot({
      text: sel.toString(),
      range: range.cloneRange(),
    });
  }, [boundarySelector]);

  useEffect(() => {
    let debounceTimer: ReturnType<typeof setTimeout>;

    const onSelectionChangeDebounced = () => {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(captureSelection, debounceMs);
    };

    document.addEventListener('selectionchange', onSelectionChangeDebounced);
    return () => {
      document.removeEventListener('selectionchange', onSelectionChangeDebounced);
      clearTimeout(debounceTimer);
    };
  }, [captureSelection, debounceMs]);

  return { selection: selectionSnapshot, clearSelection };
}
