import { getNoteInfoById } from '@/actions/notes';
import { getMarkdownContent, getMarkdownResource } from '@/actions/s3/markdown';
// import { coerceQueryNoteSchema } from '@/actions/notes/types';
import React, { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { EvaluateOptions, MDXRemote } from 'next-mdx-remote-client/rsc';
import { createMdxComponents } from '@/components/notes-mdx-component';
import remarkGfm from 'remark-gfm';
import GoBackButton from '@/components/go-back-button';
import NoteHighlighter from '@/components/note-highlighter';
import { auth } from '@/auth';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
// import Highlighter from '@/components/highlighter';

interface ClientNotesPageProps {
  params: Promise<{ noteId: string }>;
}

// type Frontmatter = {
//   title:string;
//   updatedAt:string;
// }

export default async function ClientNotesPage(props: ClientNotesPageProps) {
  const params = await props.params;
  const note = await getNoteInfoById(params.noteId);
  const session = await auth();

  if (!note) notFound();
  // 取得對應的 URL
  const resource = await getMarkdownResource(note.filePath);
  // 取得對應的 markdown 資源
  const content = await getMarkdownContent(resource);

  const options: EvaluateOptions = {
    mdxOptions: { remarkPlugins: [remarkGfm] },
    //  parseFrontmatter: true, // TODO 標題/時間可以從這邊取得 (目前是從資料庫)
    //  vfileDataIntoScope: 'toc', // TODO table of content (目錄的概念)
  };

  // const { content, frontmatter, scope, error } = await evaluate<Frontmatter>({
  //   source:content,
  //   options,
  //   components: createMdxComponents(),
  // });

  return (
    <div>
      {/* router back button */}
      <div className="mb-4 flex items-center justify-between border-b pb-4">
        <GoBackButton>回筆記列表</GoBackButton>
        <p className="text-sm text-gray-500">更新時間：{note.updatedAt.toLocaleDateString()}</p>
        {!!session && (
          <Link href={`/admin/notes/editor?noteId=${params.noteId}`}>
            <Button variant="outline">編輯</Button>
          </Link>
        )}
      </div>
      <Suspense fallback={<div className="p-4 text-center">Loading content...</div>}>
        <MDXRemote source={content} components={createMdxComponents()} options={options} />
      </Suspense>

      {!!session && <NoteHighlighter noteId={params.noteId} />}
    </div>
  );
}
