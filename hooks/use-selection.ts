'use client';
import { useEffect, useState } from 'react';

interface UseWindowSelectionOptions {
  boundarySelector: string;
}

type TextSelectionSnapshot = {
  text: string;
  range: Range; // clone 後的 Range
};

export function useWindowSelection({ boundarySelector }: UseWindowSelectionOptions) {
  const [selectionSnapshot, setSelectionSnapshot] = useState<TextSelectionSnapshot | null>(null);
  const boundaryRoot = typeof window !== 'undefined' ? document.querySelector(boundarySelector) : null;
  const clearSelection = () => {
    setSelectionSnapshot(null);
  };


  useEffect(() => {
    const mouseUpHandler = () => {
      const sel = window.getSelection();
      if (!sel || sel.isCollapsed || sel.rangeCount === 0) return;

      const range = sel.getRangeAt(0);
      let ancestorEl = range.commonAncestorContainer as HTMLElement;

      if (ancestorEl.nodeType === Node.TEXT_NODE) {
        ancestorEl = ancestorEl.parentElement ?? ancestorEl;
      }
      setSelectionSnapshot({ text: sel.toString(), range: range.cloneRange() });
    };

    boundaryRoot?.addEventListener('mouseup', mouseUpHandler);

    return () => {
      boundaryRoot?.removeEventListener('mouseup', mouseUpHandler);
      clearSelection();
    };
  }, [boundaryRoot]);

  return { selection: selectionSnapshot, clearSelection };
}
