import { CreateCategoryRequest } from '@/actions/categories/types';
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
  let existingCategory: (Partial<CreateCategoryRequest> & { id: number }) | undefined;
  if (categoryId) {
    // TODO 獲取類別資訊 by categoryId
    // 1. 先獲取類別資訊
    // 2. 獲取類別中 cover_path 和 icon_path 的所對應的圖片資源
    // const category = await getCategoryById(categoryId);
    // if (category) {
    // }
  }
  return (
    <DialogContainer
      title={categoryId ? '編輯類別' : '新增類別'}
      description=""
      open={true}
    >
      <CategoryEditor existingCategory={existingCategory} />
    </DialogContainer>
  );
}
