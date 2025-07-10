import { getCategoryById } from '@/actions/categories';
import { Category } from '@/actions/categories/types';
import DialogContainer from '@/components/dialog-container';
import CategoryEditor from '@/features/admin/categories/category-editor';

interface CategoryEditorModalPageProps {
  searchParams: Promise<{
    categoryId?: string;
  }>;
}

export default async function CategoryEditorModalPage({
  searchParams,
}: CategoryEditorModalPageProps) {
  const { categoryId } = await searchParams;
  // 如果有 categoryId ，則獲取筆記資訊，並且獲取筆記的 markdown 內容
  let category: Category | null | undefined = undefined;
  if (categoryId) {
    category = await getCategoryById(Number(categoryId));
    if (!category) throw new Error('Category not found');
  }
  return (
    <DialogContainer title={category ? '編輯類別' : '新增類別'} description="" open={true}>
      <CategoryEditor category={category} />
    </DialogContainer>
  );
}
