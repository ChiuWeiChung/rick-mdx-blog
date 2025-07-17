import { getNoteInfoById } from '@/actions/notes';
import { getMarkdownContent, getMarkdownResource } from '@/actions/s3/markdown';
// import { coerceQueryNoteSchema } from '@/actions/notes/types';
import React, { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { EvaluateOptions, MDXRemote } from 'next-mdx-remote-client/rsc';
import { createMdxComponents } from '@/components/notes-mdx-component';
import remarkGfm from 'remark-gfm';
import GoBackButton from '@/components/go-back-button';

interface ClientNotesPageProps {
  params: Promise<{ noteId: string }>;
}

export default async function ClientNotesPage(props: ClientNotesPageProps) {
  const params = await props.params;

  //   const { noteId } = await searchParams;

  // 如果有 noteId ，則獲取筆記資訊，並且獲取筆記的 markdown 內容

  const note = await getNoteInfoById(params.noteId);

  if (!note) notFound();

  const resource = await getMarkdownResource(note.filePath);
  const content = await getMarkdownContent(resource);
//   const noteData = {
//     id: note.id,
//     title: note.title,
//     category: note.category,
//     visible: note.visible,
//     tags: note.tags,
//     content,
//     fileName: note.filePath.split('/').pop()?.replace('.md', '') ?? '',
//   };

  const options: EvaluateOptions = {
    mdxOptions: { remarkPlugins: [remarkGfm] },
    //  parseFrontmatter: true,
    // scope: {
    //   readingTime: calculateSomeHow(source),
    // },
    //  vfileDataIntoScope: 'toc',
  };

  //   const { data } = await getNoteById(noteId);
  return (
    <div>
        {/* router back button */}
        <GoBackButton> 
            回筆記列表
        </GoBackButton>
      {/* <h1>{data.title}</h1> */}
      <Suspense fallback={<div className="p-4 text-center">Loading content...</div>}>
        <article className="prose prose-sm sm:prose-base md:prose-lg max-w-none">
          <MDXRemote source={content} components={createMdxComponents()} options={options} />
        </article>
      </Suspense>
    </div>
  );
}
