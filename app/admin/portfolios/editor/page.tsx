import React from 'react';
import TagEditor from '@/features/admin/tags/tag-editor';
import { getTagById } from '@/actions/tags';

interface TagEditorPageProps {
  searchParams: Promise<{
    tagId: string;
  }>;
}

const TagEditorPage = async ({ searchParams }: TagEditorPageProps) => {
  const { tagId } = await searchParams;
  const tag = await getTagById(Number(tagId));
  if (!tag) throw new Error('Tag not found');

  return <TagEditor tag={tag} />;
};

export default TagEditorPage;
