import React from 'react';
import { CreateCategoryRequest } from '@/actions/categories/types';
import CategoryEditor from '@/features/admin/categories/category-editor';

interface CategoryEditorPageProps {
  searchParams: Promise<{
    categoryId?: string;
  }>;
}

const CategoryEditorPage = async ({ searchParams }: CategoryEditorPageProps) => {
  const { categoryId } = await searchParams;

  // 如果有 categoryId ，則獲取筆記資訊，並且獲取筆記的 markdown 內容
  let existingCategory: (Partial<CreateCategoryRequest> & { id: number }) | undefined;
  if (categoryId) {
    // const category = await getCategoryById(categoryId);
    // if (category) {
    // }
  }

  return <CategoryEditor existingCategory={existingCategory} />;
};

export default CategoryEditorPage;
