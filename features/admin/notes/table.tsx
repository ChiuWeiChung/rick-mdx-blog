'use client';
import ReactTable from '@/components/react-table';
import columns from './table-columns';
import {  Note, NoteKeys } from '@/actions/notes/types';
import { TableId } from '@/enums/table';
import { FC } from 'react';

interface NoteTableProps {
  data: Note[];
  totalCount: number;
}

const NoteTable:FC<NoteTableProps> = ({ data, totalCount }) => {
  

  return (
    <div>
      <h1 className="mb-1 text-2xl font-bold">筆記列表</h1>
      <ReactTable
        data={data}
        columns={columns}
        totalElements={totalCount}
        manualPagination
        manualSorting
        pinningColumns={[TableId.Number, TableId.Editor, NoteKeys.title]}
        // meta={{
        //   onDataEdit: (data) => {
        //     console.log('data', data);
        //   },
        //   onDataDelete: (data) => {
        //     console.log('data', data);
        //   },
        // }}
      />
    </div>
  );
};

export default NoteTable;
