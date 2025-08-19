import { queryNoteList } from '@/actions/notes';
import { Note, QueryNote } from '@/actions/notes/types';
import FeatureCard from '@/components/feature-card';
import ServerPagination from '@/components/react-table/server-pagination';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { getOrigin } from '@/lib/router';
import { format } from 'date-fns';
import {
  CalendarIcon,
  CircleChevronRightIcon,
  FileIcon,
  ForwardIcon,
  TagIcon,
  FileTextIcon,
} from 'lucide-react';
import Link from 'next/link';
import React from 'react';

interface NotesSectionProps {
  request: QueryNote;
  showPagination?: boolean;
}

export default async function NotesSection({ request, showPagination = false }: NotesSectionProps) {
  const { data, totalCount } = await queryNoteList(request);
  const origin = await getOrigin();

  const renderCategory = () => {
    if(data.length === 0) return null;
    const category = data[0].category;
    const categoryName = category.replace(/_/g, ' ');
    return (
      <h2 className="text-3xl font-bold text-center mb-8">{request.category ? categoryName : '全部'}</h2>
    );
  };

  const renderNoteMeta = (note: Note) => {
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
          <TagIcon className="mt-1 h-4 w-4" />
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

  const renderEmptyState = () => (
    <div className="col-span-full flex flex-col items-center justify-center px-4 py-16">
      <div className="flex flex-col items-center gap-4 text-center">
        <div className="rounded-full bg-gray-100 p-4 dark:bg-gray-800">
          <FileTextIcon className="h-8 w-8 text-gray-400" />
        </div>
        <div className="space-y-2">
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">暫無筆記</h3>
          <p className="max-w-sm text-sm text-gray-500 dark:text-gray-400">
            Oops! 目前還沒有任何筆記。
          </p>
        </div>
      </div>
    </div>
  );

  const renderNoteCards = () =>
    data.map(note => (
      <FeatureCard
        key={note.id}
        title={note.title}
        description={renderNoteMeta(note)}
        content={note.description ?? ''}
        footer={
          <Link href={`/notes/${note.id}`} className="w-full">
            <Button variant="outline" className="group w-full">
              <ForwardIcon className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              瞭解詳情
            </Button>
          </Link>
        }
        imageUrl={`${origin}/api/image?key=categories/${note.category}/cover.png`}
      />
    ));

  return (
    <>
      {/* 類別標題 */}
      {renderCategory()}

      {/* 筆記卡片列表 */}
      <section className="mx-auto grid w-full max-w-5xl grid-cols-1 gap-6 gap-y-12 md:grid-cols-2 lg:grid-cols-3">
        {data.length === 0 ? renderEmptyState() : renderNoteCards()}
      </section>

      {/* 分頁 */}
      {data.length > 0 &&
        (showPagination ? (
          <div className="mt-8 flex justify-center">
            <ServerPagination totalElements={totalCount} scrollToTopOnPageChange />
          </div>
        ) : (
          <div className="mt-8 flex justify-center">
            <Link href="/notes">
              <Button variant="outline" className="group h-12 w-[200px]">
                <CircleChevronRightIcon className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                查看更多
              </Button>
            </Link>
          </div>
        ))}
    </>
  );
}
