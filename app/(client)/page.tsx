// import LandingBackground from '@/features/client/landing-background';
// import LandingDemoPage from '@/features/demo';
import TagsSection from '@/features/client/tags-section';
import { coerceQueryNoteSchema } from '@/actions/notes/types';
import NotesSection from '@/features/client/notes-section';
import { Suspense } from 'react';
import SpinnerLoader from '@/components/spinner-loader';
import { queryTagSchema } from '@/actions/tags/types';
import { getTagWithNoteCount } from '@/actions/tags';
import PageWrapper from '@/components/page-wrapper';

export default async function LandingPage() {
  const queryRequest = coerceQueryNoteSchema.parse({ limit: 6 }); // 預設只取前六筆資料
  const queryTagRequest = queryTagSchema.parse({ limit: 10000 });
  const { data: tags } = await getTagWithNoteCount(queryTagRequest);

  return (
    <PageWrapper>
      <section className="max-w-3xl text-center">
        <h1 className="mb-6 bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text pb-1 text-4xl font-bold text-transparent md:text-6xl">
          Stay Hungry, Stay Foolish
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300">
          開發路上，除了寫程式，也會踩坑、修正、學習
        </p>
      </section>

      <TagsSection tags={tags} />

      {/* 測試區，待刪除 */}
      {/* <LandingDemoPage /> */}

      {/* Feature Cards */}
      <Suspense fallback={<SpinnerLoader />}>
        <NotesSection request={queryRequest} />
      </Suspense>
    </PageWrapper>
  );
}
