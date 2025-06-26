'use client';
import ReactTable from '@/components/react-table';
import columns from './table-columns';
import { Note } from '@/actions/notes/types';


const NoteTable = ({ data }: { data: Note[] }) => {
  return (
    <ReactTable
      columns={columns}
      data={data}
      totalElements={data.length}
      meta={
        {
          //   onDataEdit:
          // onDataDelete,
          // onModalOpen,
        }
      }
    />
  );
};

export default NoteTable;
