import { getCategories } from '@/actions/categories';
import { getTags } from '@/actions/tags';
import { Option } from '@/types/global';
import NoteEditorForm from '@/features/admin/notes/editor-form';
import React from 'react';
import { getNoteInfoById } from '@/actions/notes';
import { getMarkdownContent, getMarkdownResource } from '@/actions/s3/markdown';
import { CreateNoteRequest } from '@/actions/notes/types';

interface NoteEditorPageProps {
  searchParams: Promise<{
    noteId?: string;
  }>;
}

const NoteEditorPage = async ({ searchParams }: NoteEditorPageProps) => {
  const { noteId } = await searchParams;

  // 如果有 noteId ，則獲取筆記資訊，並且獲取筆記的 markdown 內容
  let existingNote: Partial<CreateNoteRequest> & { id: number } | undefined;
  if (noteId) {
    const note = await getNoteInfoById(noteId);
    if (note) {
      const resource = await getMarkdownResource(note.filePath);
      const content = await getMarkdownContent(resource);
      existingNote = {
        id: note.id,
        title: note.title,
        category: note.category,
        visible: note.visible,
        tags: note.tags,
        content,
        fileName: note.filePath.split('/').pop()?.replace('.md', '') ?? '',
      };
    }
  }
  const categories = await getCategories();
  const tags = await getTags();

  const categoryOptions: Option<string>[] = categories.map(({ name }) => ({
    label: name,
    value: name,
  }));
  const tagOptions: Option<string>[] = tags.map(({ name }) => ({
    label: name,
    value: name,
  }));

  return (
    <NoteEditorForm
      existingNote={existingNote}
      categoryOptions={categoryOptions}
      tagOptions={tagOptions}
    />
  );
};

export default NoteEditorPage;
