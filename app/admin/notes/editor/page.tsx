import { getCategoryOptions } from '@/actions/categories';
import { getTagOptions } from '@/actions/tags';
import NoteEditorForm from '@/features/admin/notes/editor-form';
import React from 'react';
import { getNoteInfoById } from '@/actions/notes';
import { getMarkdownContent, getMarkdownResource } from '@/actions/s3/markdown';
import { CreateNoteRequest } from '@/actions/notes/types';
import { getNoteMemoByPostId } from '@/actions/note-memos';
import { NoteMemo } from '@/actions/note-memos/types';

interface NoteEditorPageProps {
  searchParams: Promise<{
    noteId?: string;
  }>;
}

const NoteEditorPage = async ({ searchParams }: NoteEditorPageProps) => {
  const { noteId } = await searchParams;

  // 如果有 noteId ，則獲取筆記資訊，並且獲取筆記的 markdown 內容
  let noteToEdit: Partial<CreateNoteRequest> & { id: number } | undefined;
  let memos: (NoteMemo & { id: string })[] | undefined;
  if (noteId) {
    const note = await getNoteInfoById(noteId);
    if (note) {
      const resource = await getMarkdownResource(note.filePath);
      const content = await getMarkdownContent(resource);
       memos = await getNoteMemoByPostId(noteId);

      noteToEdit = {
        id: note.id,
        title: note.title,
        category: note.category,
        visible: note.visible,
        tags: note.tags,
        createdAt: note.createdAt,
        content,
        fileName: note.filePath.split('/').pop()?.replace('.md', '') ?? '',
      };
    }
  }

  const categoryOptions = await getCategoryOptions();
  const tagOptions = await getTagOptions();

  return (
    <NoteEditorForm
      noteToEdit={noteToEdit}
      categoryOptions={categoryOptions}
      tagOptions={tagOptions}
      memos={memos}
    />
  );
};

export default NoteEditorPage;
