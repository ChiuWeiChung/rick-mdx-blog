import { queryNoteList } from '@/actions/notes';
import { QueryNote } from '@/actions/notes/types';
import FeatureCard from '@/components/feature-card';
import React from 'react';
import { headers } from 'next/headers';

interface NotesSectionProps {
  request: QueryNote;
}

export default async function NotesSection({ request }: NotesSectionProps) {
  const { data } = await queryNoteList(request);
  const headersList = await headers();
  const protocol = headersList.get('x-forwarded-proto') ?? 'http';

  const host = headersList.get('host');
  const origin = `${protocol}://${host}`;

  return (
    <section className="mb-4 grid w-full max-w-5xl grid-cols-1 gap-6 gap-y-12 md:grid-cols-2 lg:grid-cols-3">
      {data.map(note => (
        <FeatureCard
          key={note.id}
          title={note.category}
          description={note.title}
          content={''}
          buttonText="View"
          href={`/notes/${note.id}`}
          imageUrl={`${origin}/api/image?key=categories/${note.category}/cover.png`}
        />
      ))}
    </section>
  );
}
