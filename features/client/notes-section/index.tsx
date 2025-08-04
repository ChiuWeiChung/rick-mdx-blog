import { queryNoteList } from '@/actions/notes';
import { Note, QueryNote } from '@/actions/notes/types';
import FeatureCard from '@/components/feature-card';
import ServerPagination from '@/components/react-table/server-pagination';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { getOrigin } from '@/lib/router';
import { format } from 'date-fns';
import { CalendarIcon, CircleChevronRightIcon, FileIcon, ForwardIcon, TagIcon } from 'lucide-react';
import Link from 'next/link';
import React from 'react';

interface NotesSectionProps {
  request: QueryNote;
  showPagination?: boolean;
}

export default async function NotesSection({ request, showPagination = false }: NotesSectionProps) {
  const { data, totalCount } = await queryNoteList(request);
  const origin = await getOrigin();

  const renderMeta = (note: Note) => {
    return (
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2 text-sm">
          <CalendarIcon className="h-4 w-4" />
          {format(note.createdAt, 'yyyy-MM-dd')}
        </div>
        <div className="flex items-center gap-2 text-sm">
          <FileIcon className="h-4 w-4" />
          {note.category.replace(/_/g, ' ')}
        </div>
        <div className="flex gap-2">
          <TagIcon className="h-4 w-4 mt-1" />
          <div className="flex flex-wrap gap-2">
            {note.tags.map(tag => (
              <Link href={`/tags?name=${tag}`} key={tag}>
                <Badge variant="outline" className="cursor-pointer hover:scale-105">
                  {tag}
                </Badge>
              </Link>
            ))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <section className="mx-auto grid w-full max-w-5xl grid-cols-1 gap-6 gap-y-12 md:grid-cols-2 lg:grid-cols-3">
        {data.map(note => (
          <FeatureCard
            key={note.id}
            title={note.title}
            description={renderMeta(note)}
            content={note.description ?? ''}
            footer={
              <Link href={`/notes/${note.id}`} className="w-full">
                <Button variant="outline" className="w-full">
                  <ForwardIcon />
                  瞭解詳情
                </Button>
              </Link>
            }
            imageUrl={`${origin}/api/image?key=categories/${note.category}/cover.png`}
          />
        ))}
      </section>

      {showPagination ? (
        <div className="center">
          <ServerPagination totalElements={totalCount} />
        </div>
      ) : (
        <Link href="/notes">
          <Button variant="outline" className="h-12 w-[200px]">
            <CircleChevronRightIcon />
            查看更多
          </Button>
        </Link>
      )}
    </>
  );
}
