import { getCategories } from '@/actions/categories';
import { getTags } from '@/actions/tags';
import { Option } from '@/types/global';
import NoteEditorForm from '@/features/admin/notes/editor-form';
import React from 'react';

interface NoteEditorPageProps {
  searchParams: Promise<{
    id?: string;
  }>;
}

const NoteEditorPage = async ({ searchParams }: NoteEditorPageProps) => {
  const { id } = await searchParams;
  const categories = await getCategories();
  const tags = await getTags();

  const categoryOptions: Option[] = categories.map(({ name }) => ({
    label: name,
    value: name,
  }));
  const tagOptions: Option[] = tags.map(({ name }) => ({
    label: name,
    value: name,
  }));

  // TODO: 應該使用 Modal 來包裝 Form，填寫完後再顯示 Markdown Editor
  return <NoteEditorForm id={id} categoryOptions={categoryOptions} tagOptions={tagOptions} />;
};

export default NoteEditorPage;
