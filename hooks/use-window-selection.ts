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
  // const boundaryRoot = typeof window !== 'undefined' ? document.querySelector(boundarySelector) : null;
  const clearSelection = () => {
    setSelectionSnapshot(null);
  };


  useEffect(() => {
    const mouseUpHandler = () => {
      const sel = window.getSelection();
      if (!sel || sel.isCollapsed || sel.rangeCount === 0) return;

      const range = sel.getRangeAt(0);

      const boundaryRoot = document.querySelector(boundarySelector);
      if (boundaryRoot) {
        const fullyInside = boundaryRoot.contains(range.startContainer) && boundaryRoot.contains(range.endContainer);
        if (!fullyInside) return;
      }

      setSelectionSnapshot({ text: sel.toString(), range: range.cloneRange() });
    };

    document.addEventListener('pointerup', mouseUpHandler);

    return () => {
      document.removeEventListener('pointerup', mouseUpHandler);
      clearSelection();
    };
  }, [boundarySelector]);

  return { selection: selectionSnapshot, clearSelection };
}
