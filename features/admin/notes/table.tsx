'use client';
import ReactTable from '@/components/react-table';
import columns from './table-columns';
import { Note } from '@/actions/notes/types';

const mockNotes: Note[] = [
  {
    id: 1,
    title: 'JavaScript 基礎語法',
    filePath: '/notes/javascript-basics.md',
    coverPath: '/covers/javascript.jpg',
    author: 'Admin',
    category: 'JavaScript',
    visible: true,
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15'),
    tags: ['JavaScript', '基礎語法'],
  },
  {
    id: 2,
    title: 'React Hooks 使用指南',
    filePath: '/notes/react-hooks.md',
    coverPath: '/covers/react.jpg',
    author: 'Admin',
    category: 'React',
    visible: false,
    createdAt: new Date('2024-01-20'),
    updatedAt: new Date('2024-01-25'),
    tags: ['React', 'Hooks'],
  },
  {
    id: 3,
    title: 'TypeScript 型別系統',
    filePath: '/notes/typescript-types.md',
    coverPath: '/covers/typescript.jpg',
    author: 'Admin',
    category: 'TypeScript',
    visible: true,
    createdAt: new Date('2024-02-01'),
    updatedAt: new Date('2024-02-01'),
    tags: ['TypeScript', '型別系統'],
  },
  {
    id: 4,
    title: 'Next.js 路由系統',
    filePath: '/notes/nextjs-routing.md',
    coverPath: '/covers/nextjs.jpg',
    author: 'Admin',
    category: 'Next.js',
    visible: true,
    createdAt: new Date('2024-02-10'),
    updatedAt: new Date('2024-02-12'),
    tags: ['Next.js', '路由系統', 'React', 'Cache'],
  },
  {
    id: 5,
    title: 'Tailwind CSS 實用技巧',
    filePath: '/notes/tailwind-css-tips.md',
    coverPath: '/covers/tailwind-css.jpg',
    author: 'Admin',
    category: 'CSS',
    visible: false,
    createdAt: new Date('2024-02-15'),
    updatedAt: new Date('2024-02-15'),
    tags: ['Tailwind CSS', '實用技巧', 'CSS'],
  },
];

const NoteTable = () => {
  return (
    <ReactTable
      columns={columns}
      data={mockNotes}
      totalElements={mockNotes.length}
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
