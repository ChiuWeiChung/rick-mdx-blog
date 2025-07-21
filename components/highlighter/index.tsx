'use client';
import { HighlightData, useHighlights } from '@/hooks/use-highlights';

export default function Highlighter({ highlights }: { highlights: HighlightData[] }) {
  useHighlights(highlights, () => {
    console.log('highlights');
  });


  return null;
}
