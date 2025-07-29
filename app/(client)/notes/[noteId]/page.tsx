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

interface ClientNotesPageProps {
  params: Promise<{ noteId: string }>;
}

export async function generateMetadata(props: ClientNotesPageProps): Promise<Metadata> {
  const params = await props.params;
  const note = await getNoteInfoById(params.noteId);
  const metadata: Metadata = {
    title: 'Rick 的開發筆記',
    description: 'Rick 的開發筆記',
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
        <GoBackButton>回筆記列表</GoBackButton>
        <p className="ml-auto text-sm text-gray-500">
          更新時間：{note.updatedAt.toLocaleDateString()}
        </p>
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
