import TagsSection from '@/features/client/tags-section';
import { coerceQueryNoteSchema } from '@/actions/notes/types';
import NotesSection from '@/features/client/notes-section';
import { Suspense } from 'react';
import SpinnerLoader from '@/components/spinner-loader';
import { queryTagSchema } from '@/actions/tags/types';
import { getTagWithNoteCount } from '@/actions/tags';
import PageWrapper from '@/components/page-wrapper';
import { Metadata } from 'next';
import { getOrigin } from '@/lib/router';

export async function generateMetadata(): Promise<Metadata> {
  const origin = await getOrigin();
  const metadata: Metadata = {
    title: 'Rick 的開發筆記',
    description: '歡迎來到 Rick 的開發筆記，這裡記錄了我的學習筆記與作品集',
    metadataBase: new URL(origin),
    authors: [{ name: 'Rick Chiu' }],
    creator: 'Rick Chiu',
    publisher: 'Rick Chiu',
    generator: 'Next.js',
    keywords: ['Frontend', 'Development', 'Study', 'Blog', 'Note'],
    robots: 'index, follow',
  };

  return metadata;
}

export default async function LandingPage() {
  const queryRequest = coerceQueryNoteSchema.parse({ limit: 6, visible: true }); // 預設只取前六筆資料
  const queryTagRequest = queryTagSchema.parse({ limit: 10 });
  const { data: tags, totalCount } = await getTagWithNoteCount(queryTagRequest);

  return (
    <PageWrapper>
      <section className="max-w-4xl space-y-6 text-center">
        <h1 className="bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-4xl leading-tight font-bold text-transparent md:text-6xl lg:text-7xl">
          Stay Hungry, Stay Foolish
        </h1>
        <p className="text-base leading-loose text-gray-600 md:text-lg dark:text-gray-300">
          這裡隨手記下開發常用的小工具和學習心得。內容還在持續打磨中，目標是逐步修飾到大家都能一看就懂。
          <br />
          雖然 AI 查資料超快，但自己動筆整理，才能加強理解，讓成長更扎實。
        </p>
      </section>

      {/* 標籤區塊 */}
      <TagsSection tags={tags} totalCount={totalCount} />

      {/* 筆記區塊 */}
      <Suspense fallback={<SpinnerLoader />}>
        <NotesSection request={queryRequest} />
      </Suspense>
    </PageWrapper>
  );
}
