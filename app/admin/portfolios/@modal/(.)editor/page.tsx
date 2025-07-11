import { getTagById } from '@/actions/tags';
import DialogContainer from '@/components/dialog-container';
import TagEditor from '@/features/admin/tags/tag-editor';

interface TagEditorModalPageProps {
  searchParams: Promise<{
    tagId: string;
  }>;
}

export default async function TagEditorModalPage({ searchParams }: TagEditorModalPageProps) {
  const { tagId } = await searchParams;
  const tag = await getTagById(Number(tagId));
  if (!tag) throw new Error('Tag not found');
  return (
    <DialogContainer title={tag ? '編輯標籤' : '新增標籤'} description="" open={true}>
      <TagEditor tag={tag} />
    </DialogContainer>
  );
}
