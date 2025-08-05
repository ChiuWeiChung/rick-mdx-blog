import { getNoteInfoById } from '@/actions/notes';
import { getMarkdownContent, getMarkdownResource } from '@/actions/s3/markdown';
import { notFound } from 'next/navigation';
import { evaluate, EvaluateOptions } from 'next-mdx-remote-client/rsc';
import { createMdxComponents } from '@/components/mdx-component/note-module';
import remarkGfm from 'remark-gfm';
import GoBackButton from '@/components/go-back-button';
import NoteHighlighter from '@/components/note-highlighter';
import { auth } from '@/auth';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { getNoteMemoByPostId } from '@/actions/note-memos';
import { Metadata } from 'next';
import { EditIcon } from 'lucide-react';
import { Frontmatter } from '@/actions/notes/types';
import { getOrigin } from '@/lib/router';
import { Badge } from '@/components/ui/badge';
import { format, isSameDay } from 'date-fns';

interface ClientNotesPageProps {
  params: Promise<{ noteId: string }>;
}

export async function generateMetadata(props: ClientNotesPageProps): Promise<Metadata> {
  const params = await props.params;
  const note = await getNoteInfoById(params.noteId);
  const origin = await getOrigin();
  const metadataBase = new URL(origin);
  const metadata: Metadata = {
    title: 'Rick 的開發筆記',
    description: 'Rick 的開發筆記',
    metadataBase,
  };

  if (note) metadata.description = note.title;

  return metadata;
}

export default async function ClientNotesPage(props: ClientNotesPageProps) {
  const params = await props.params;
  const note = await getNoteInfoById(params.noteId);
  const session = await auth();

  if (!note) notFound();
  // 取得對應的 URL
  const resource = await getMarkdownResource(note.filePath);
  // 取得對應的 markdown 資源
  const content = await getMarkdownContent(resource);
  // 取得對應的筆記備註
  const memos = await getNoteMemoByPostId(params.noteId);

  const options: EvaluateOptions = {
    mdxOptions: { remarkPlugins: [remarkGfm] },
    parseFrontmatter: true,
    //  vfileDataIntoScope: 'toc', // TODO table of content (目錄的概念)
  };
  const evaluateResult = await evaluate<Frontmatter>({
    source: content,
    options,
    components: createMdxComponents(),
  });

  if (evaluateResult.error) throw new Error(evaluateResult.error.message);

  return (
    <div>
      {/* router back button */}
      <div className="mb-4 flex items-center gap-4 border-b pb-4">
        <GoBackButton>回上一頁</GoBackButton>

        {/* 標籤 */}
        <div className="flex items-center gap-2">
          {note.tags.map(tag => (
            <Link href={`/tags?name=${tag.name}`} key={tag.name}>
              <Badge variant="outline" className="cursor-pointer hover:scale-105">
                # {tag.name}
              </Badge>
            </Link>
          ))}
        </div>

        <div className="ml-auto flex text-sm text-gray-500 divide-x-2 divide-gray-200">
          {/* 最新更新時間 (如果是同一天，則不顯示) */}
          {!isSameDay(note.createdAt, note.updatedAt) && (
            <p className="px-2">更新時間：{format(note.updatedAt, 'yyyy/MM/dd')}</p>
          )}

          <p className="px-2">建立時間：{format(note.createdAt, 'yyyy/MM/dd')}</p>
        </div>

        {!!session && (
          <Link href={`/admin/notes/editor?noteId=${params.noteId}`}>
            <Button variant="outline">
              編輯
              <EditIcon />
            </Button>
          </Link>
        )}
      </div>

      {evaluateResult.content}

      {!!session && <NoteHighlighter defaultHighlights={memos} noteId={params.noteId} />}
    </div>
  );
}
