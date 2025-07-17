import { getNoteIdsByTagId } from '@/actions/note-tags';
import { coerceQueryNoteSchema } from '@/actions/notes/types';
import NotesSection from '@/features/client/notes-section';
import { Badge } from '@/components/ui/badge';
import React from 'react';
import { notFound } from 'next/navigation';

interface ClientTagsPageProps {
  params: Promise<{ tagId: string }>;
}

export default async function ClientTagsPage(props: ClientTagsPageProps) {
  const { tagId } = await props.params;
  const result = await getNoteIdsByTagId(Number(tagId));
  const tagIds = result.map(item => item.tagId);
  const tagName = result[0]?.tagName;
  const queryRequest = coerceQueryNoteSchema.parse({tag:tagIds}); // 解析查詢參數

  if (!tagName) notFound()

  return (
    <div className='flex flex-col items-center m-4 min-h-screen gap-4'>
      <div className="flex items-center gap-2">
        <Badge variant="outline" className='text-3xl font-bold px-4 py-2'>
            # {tagName}
          </Badge>
      </div>
      <NotesSection request={queryRequest}  showPagination/>
    </div>
  );
}
