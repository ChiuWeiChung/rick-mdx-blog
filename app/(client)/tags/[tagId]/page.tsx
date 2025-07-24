import { getNoteIdsByTagId } from '@/actions/note-tags';
import { coerceQueryNoteSchema } from '@/actions/notes/types';
import NotesSection from '@/features/client/notes-section';
import { Badge } from '@/components/ui/badge';
import React from 'react';
import { notFound } from 'next/navigation';
import PageWrapper from '@/components/page-wrapper';

interface ClientTagsPageProps {
  params: Promise<{ tagId: string }>;
}

export default async function ClientTagsPage(props: ClientTagsPageProps) {
  const { tagId } = await props.params;
  const result = await getNoteIdsByTagId(Number(tagId));
  if (!result.length) notFound();
  const [target] = result;
  const queryRequest = coerceQueryNoteSchema.parse({ tags: [target.tagId] }); // 解析查詢參數

  return (
    <PageWrapper>
      <div className="flex items-center gap-2">
        <Badge variant="outline" className="px-4 py-2 text-3xl font-bold">
          # {target.tagName}
        </Badge>
      </div>
      <NotesSection request={queryRequest} showPagination />
    </PageWrapper>
  );
}
