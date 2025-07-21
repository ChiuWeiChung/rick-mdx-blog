'use client';

import { useState } from 'react';
import { HighlightData } from '@/hooks/use-highlights';
import Highlighter from '@/components/highlighter';

interface NoteHighlighterProps {
  defaultHighlights?: HighlightData[];
  noteId: string;
}

const NoteHighlighter = ({ defaultHighlights, noteId  }: NoteHighlighterProps) => {
  const [highlights, setHighlights] = useState<HighlightData[]>(defaultHighlights || []);

  console.log('highlights', highlights);
  console.log('noteId', noteId);

  const handleHighlightCreate = (data: Omit<HighlightData, 'id'>) => {
    const newHighlight: HighlightData = {
      ...data,
      id: `highlight-${Date.now()}`,
    };

    setHighlights(prev => [...prev, newHighlight]);
    console.log('新增了 highlight:', newHighlight);
  };

  const handleHighlightEdit = (id: string, note: string) => {
    console.log('✅ 更新註解:', { id, note });

    setHighlights(prev => {
      const updated = prev.map(highlight =>
        highlight.id === id ? { ...highlight, note } : highlight
      );
      return updated;
    });
  };

  const handleHighlightDelete = (id: string) => {
    setHighlights(prev => prev.filter(highlight => highlight.id !== id));
    console.log('刪除了 highlight:', id);
  };

  return (
    <Highlighter
      highlights={highlights}
      onHighlightCreate={handleHighlightCreate}
      onHighlightEdit={handleHighlightEdit}
      onHighlightDelete={handleHighlightDelete}
    />
  );
};

export default NoteHighlighter;
