import { queryNoteList } from '@/actions/notes';
import { QueryNote } from '@/actions/notes/types';
import FeatureCard from '@/components/feature-card';
import ServerPagination from '@/components/react-table/server-pagination';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { getOrigin } from '@/lib/router';
import { CircleChevronRightIcon, ForwardIcon } from 'lucide-react';
import Link from 'next/link';
import React from 'react';

interface NotesSectionProps {
  request: QueryNote;
  showPagination?: boolean;
}

export default async function NotesSection({ request, showPagination = false }: NotesSectionProps) {
  const { data, totalCount } = await queryNoteList(request);
  const origin = await getOrigin();

  const renderTags = (tags: string[]) => {
    return (
      <div className="flex flex-wrap gap-2">
        {tags.map(tag => (
          <Link href={`/tags?name=${tag}`} key={tag}>
            <Badge
              key={tag}
              variant="outline"
              className="cursor-pointer text-gray-500 hover:scale-105"
            >
              {tag}
            </Badge>
          </Link>
        ))}
      </div>
    );
  };

  return (
    <>
      <section className="mx-auto grid w-full max-w-5xl grid-cols-1 gap-6 gap-y-12 md:grid-cols-2 lg:grid-cols-3">
        {data.map(note => (
          <FeatureCard
            key={note.id}
            title={
              <>
                <h3>{note.title}</h3>
                <span className="text-gray-500">{note.category.replace(/_/g, ' ')}</span>
              </>
            }
            description={renderTags(note.tags)}
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
