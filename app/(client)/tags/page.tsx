import { getTagWithNoteCount } from '@/actions/tags';
import { QueryTag, queryTagSchema } from '@/actions/tags/types';
import TagsSection from '@/features/client/tags-section';
import { redirect } from 'next/navigation';
import PageWrapper from '@/components/page-wrapper';

interface ClientTagsPageProps {
  searchParams: Promise<QueryTag>;
}

export default async function ClientTagsPage(props: ClientTagsPageProps) {
  const searchParams = await props.searchParams;
  const queryRequest = queryTagSchema.parse({ ...searchParams, limit: 10000 });
  const { data,totalCount } = await getTagWithNoteCount(queryRequest);

  // 如果只有一個標籤，則重向到該標籤的頁面
  if (searchParams && data.length === 1) redirect(`/tags/${data[0].id}`);
  
  return (
    <PageWrapper>
      <h1 className="mb-4 text-4xl font-bold">標籤清單</h1>
      <TagsSection tags={data} totalCount={totalCount} />
    </PageWrapper>
  );
}
