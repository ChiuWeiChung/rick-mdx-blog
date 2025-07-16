import { queryNoteList } from '@/actions/notes';
import { QueryNote } from '@/actions/notes/types';
import FeatureCard from '@/components/feature-card';
import { Button } from '@/components/ui/button';
import { getOrigin } from '@/lib/router';
import { CircleChevronRightIcon } from 'lucide-react';
import Link from 'next/link';
import React from 'react';

interface NotesSectionProps {
  request: QueryNote;
  showPagination?: boolean;
}

export default async function NotesSection({ request, showPagination = false }: NotesSectionProps) {
  const { data } = await queryNoteList(request);
  const origin = await getOrigin();

  return (
    <>
      {showPagination && (
        <section className="mb-4">selected Tags (TODO) Tags can be removed</section>
      )}

      <section className="mb-4 grid w-full max-w-5xl grid-cols-1 gap-6 gap-y-12 md:grid-cols-2 lg:grid-cols-3">
        {data.map(note => (
          <FeatureCard
            key={note.id}
            title={
              <>
                <h3>{note.category}</h3>
                <span className="text-gray-500">{note.title}</span>
              </>
            }
            description={note.title}
            content={''}
            buttonText="View"
            href={`/notes/${note.id}`}
            imageUrl={`${origin}/api/image?key=categories/${note.category}/cover.png`}
          />
        ))}
      </section>

      
      {showPagination ? (
        <div className="center">pagination todo</div>
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
