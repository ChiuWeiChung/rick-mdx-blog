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
  const { data: tags,totalCount } = await getTagWithNoteCount(queryTagRequest);

  return (
    <PageWrapper>
      <section className="max-w-4xl text-center space-y-8">
        <div className="space-y-6">
          <h1 className="bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-4xl font-bold text-transparent md:text-6xl lg:text-7xl leading-tight">
            Stay Hungry, Stay Foolish
          </h1>
          
          <h2 className="text-lg md:text-xl lg:text-2xl font-medium text-gray-700 dark:text-gray-200 max-w-2xl mx-auto leading-relaxed">
            開發路上，除了寫程式，也會踩坑、修正、學習
          </h2>
        </div>
        
        <div className="max-w-3xl mx-auto">
          <p className="text-base md:text-lg text-gray-600 dark:text-gray-300 leading-loose">
            在這裡紀錄開發中常用的小工具與學習心得。這些筆記一開始只寫給自己看，目前持續優化成人人都能理解的內容。雖然 AI 萬用，但對我來說，動手寫下理解的過程，也是檢視自我的方式。
          </p>
        </div>
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
