'use client';

import { useState } from 'react';
import { HighlightData } from '@/hooks/use-highlights';
import Highlighter from '@/components/highlighter';
import { mutationHandler } from '@/utils/react-query-handler';
import { useMutation } from '@tanstack/react-query';
import { createNoteMemo, deleteNoteMemo, updateNoteMemo } from '@/actions/note-memos';

interface NoteHighlighterProps {
  defaultHighlights?: HighlightData[];
  noteId: string;
}

const NoteHighlighter = ({ defaultHighlights, noteId }: NoteHighlighterProps) => {
  const [highlights, setHighlights] = useState<HighlightData[]>(defaultHighlights || []);
  console.log('highlights', highlights);
  // 新增筆記備註
  const createMutation = useMutation({
    mutationFn: mutationHandler(createNoteMemo),
    meta: { successMessage: { title: '新增筆記備註成功' } },
  });

  // 更新筆記備註
  const updateMutation = useMutation({
    mutationFn: mutationHandler(updateNoteMemo),
    meta: { successMessage: { title: '更新筆記備註成功' } },
  });

  // 刪除筆記備註
  const deleteMutation = useMutation({
    mutationFn: mutationHandler(deleteNoteMemo),
    meta: { successMessage: { title: '刪除筆記備註成功' } },
  });

  const handleHighlightCreate = (data: Omit<HighlightData, 'id'>) => {
    const newHighlight: HighlightData = {
      ...data,
      id: `highlight-${Date.now()}`,
    };

    setHighlights(prev => [...prev, newHighlight]);

    createMutation.mutate({
      postId: Number(noteId),
      blockId: data.blockId,
      startOffset: data.startOffset,
      endOffset: data.endOffset,
      content: data.content || '',
      selectedContent: data.selectedContent || '',
    });
  };

  const handleHighlightEdit = (id: string, content: string) => {
    const target = highlights.find(highlight => highlight.id === id);
    if (target) {
      setHighlights(prev => {
        const updated = prev.map(highlight =>
          highlight.id === id ? { ...highlight, content } : highlight
        );
        return updated;
      });
      updateMutation.mutate({
        id: Number(id),
        postId: Number(noteId),
        blockId: target.blockId,
        startOffset: target.startOffset,
        endOffset: target.endOffset,
        content,
      });

    }

  };

  const handleHighlightDelete = (id: string) => {
    setHighlights(prev => prev.filter(highlight => highlight.id !== id));
    deleteMutation.mutate(Number(id));
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
