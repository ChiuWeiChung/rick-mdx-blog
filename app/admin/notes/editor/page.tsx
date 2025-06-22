import NoteEditorForm from '@/features/admin/notes/editor-form';
import React from 'react';

interface NoteEditorPageProps {
  searchParams: Promise<{
    id?: string;
  }>;
}

const NoteEditorPage = async ({ searchParams }: NoteEditorPageProps) => {
  const { id } = await searchParams;
  console.log('id', id);
  return <NoteEditorForm id={id} />;
};

export default NoteEditorPage;
