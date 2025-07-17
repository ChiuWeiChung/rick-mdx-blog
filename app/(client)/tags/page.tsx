import { getTagWithNoteCount } from '@/actions/tags';
import { QueryTag, queryTagSchema } from '@/actions/tags/types';
import TagsSection from '@/features/client/tags-section';
import { redirect } from 'next/navigation';

interface ClientTagsPageProps {
  searchParams: Promise<QueryTag>;
}

export default async function ClientTagsPage(props: ClientTagsPageProps) {
  const searchParams = await props.searchParams;
  const queryRequest = queryTagSchema.parse({ ...searchParams, limit: 10000 });
  const { data } = await getTagWithNoteCount(queryRequest);

  // 如果只有一個標籤，則重向到該標籤的頁面
  if (searchParams && data.length === 1) redirect(`/tags/${data[0].id}`);
  
  return (
    <div className="m-4 flex min-h-screen flex-col items-center justify-start">
      <h1 className="mb-4 text-4xl font-bold">標籤清單</h1>
      <div className="mx-auto gap-4">
        <TagsSection tags={data} />
      </div>
    </div>
  );
}
