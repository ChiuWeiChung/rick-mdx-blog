import { queryNoteList } from '@/actions/notes';
import { Button } from '@/components/ui/button';
import NoteTable from '@/features/admin/notes/table';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import React from 'react';

interface NotePageProps {
  searchParams: {
    title?: string;
    visible?: boolean;
    category?: string;
    tags?: string[];
    createdAt?: number;
    updatedAt?: number;
  };
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const NotesPage = async (_props: NotePageProps) => {
  const data = await queryNoteList();

  return (
    <div className="relative mx-4 flex flex-col gap-4">
      <h1 className="text-3xl font-bold">筆記管理</h1>
      {/* Add Notes Section */}
      <Button type="button" className="absolute top-0 right-0">
        <Link href="/admin/notes/editor" className="flex items-center gap-2">
          <Plus /> 新增筆記
        </Link>
      </Button>

      {/* Search Notes Section */}
      <div>
        <h1 className="text-2xl font-bold">條件搜尋</h1>
      </div>

      {/* Notes Table Section */}
      {/* view size > 768 */}
      <NoteTable data={data} />
    </div>
  );
};

export default NotesPage;
