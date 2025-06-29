import ReactTable from '@/components/react-table';
import columns from './table-columns';
import { queryNoteList } from '@/actions/notes';
import { Note, QueryNote } from '@/actions/notes/types';
import Link from 'next/link';

interface NoteTableProps {
  queryRequest: QueryNote;
}

const NoteTable = async ({ queryRequest }: NoteTableProps) => {
  
  const { data, totalCount } = await queryNoteList({ ...queryRequest });
  return (
    <div>
      <h1 className="text-2xl font-bold">筆記列表</h1>
      <ReactTable data={data} columns={columns} totalElements={totalCount} manualPagination />
    </div>
  );
};

export default NoteTable;
